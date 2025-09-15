// src/hooks/useGpxRoutes.ts
// This hook provides functions to fetch, convert, and manage GPX routes for Munros

import { useCallback, useRef } from "react";
import { useMapState } from "@/contexts/MapStateContext";
import { supabase } from "@/utils/auth/supabaseClient";
import toGeoJSON from "@mapbox/togeojson";
import type { FeatureCollection } from "geojson";

export default function useGpxRoutes() {
    const geoJsonCache = useRef<Map<number, FeatureCollection>>(new Map());
    const gradientCache = useRef<Map<number, FeatureCollection>>(new Map());
    const { routeStyleMode } = useMapState();

    const fetchAndCacheGeoJson = useCallback(async (routeId: number, gpxFile: string) => {
        if (geoJsonCache.current.has(routeId)) {
            return geoJsonCache.current.get(routeId)!;
        }
        const { data, error } = await supabase
            .storage
            .from('routes')
            .download(`standard/${gpxFile}`);
        if (error) throw error;
        const text = await data.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');
        const geojson = toGeoJSON.gpx(xml);
        geoJsonCache.current.set(routeId, geojson);
        return geojson;
    }, []);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lon2-lon1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distance in meters
    };

    const calculateGradients = (geojson: FeatureCollection): FeatureCollection => {
        // Create a new FeatureCollection
        const result: FeatureCollection = {
            type: "FeatureCollection",
            features: []
        };

        // Process each feature in the original collection
        geojson.features.forEach((feature: GeoJSON.Feature) => {
            if (feature.geometry.type === 'LineString') {
                const coordinates = feature.geometry.coordinates;
                
                // Skip features with too few coordinates
                if (coordinates.length < 2) {
                    // Add feature with default gradient to avoid errors
                    const safeFeature = { 
                        ...feature,
                        properties: { ...(feature.properties || {}), gradient: 0 }
                    };
                    result.features.push(safeFeature);
                    return;
                }
                
                // First calculate all gradients with noise filtering
                const gradients: number[] = [];
                
                for (let i = 1; i < coordinates.length; i++) {
                    const prev = coordinates[i-1];
                    const curr = coordinates[i];
                    
                    if (prev.length >= 3 && curr.length >= 3) {
                        const distance = calculateDistance(
                            prev[1], prev[0],
                            curr[1], curr[0]
                        );
                        
                        // Skip unreliable gradients from points that are too close together
                        if (distance < 5) {
                            gradients.push(gradients.length > 0 ? gradients[gradients.length - 1] : 0);
                            continue;
                        }
                        
                        const elevationChange = curr[2] - prev[2];
                        const gradient = Math.min(45, Math.abs((elevationChange / distance) * 100));
                        gradients.push(gradient);
                    } else {
                        gradients.push(0); // Default for missing elevation data
                    }
                }
                
                // Safety check - ensure we have gradients
                if (gradients.length === 0) {
                    gradients.push(0);
                }
                
                // Apply smoothing
                const smoothedGradients = smoothGradients(gradients, 5);
                
                // Create segments with smoothed gradient values
                for (let i = 1; i < coordinates.length; i++) {
                    const prev = coordinates[i-1];
                    const curr = coordinates[i];
                    
                    // Use a safe index to prevent out-of-bounds access
                    const gradientIndex = Math.min(i-1, smoothedGradients.length-1);
                    const safeGradient = gradientIndex >= 0 ? smoothedGradients[gradientIndex] : 0;
                    
                    const segmentFeature: GeoJSON.Feature = {
                        type: "Feature",
                        properties: {
                            ...(feature.properties || {}),
                            gradient: safeGradient,
                            originalId: feature.id
                        },
                        geometry: {
                            type: "LineString",
                            coordinates: [prev, curr]
                        }
                    };
                    
                    result.features.push(segmentFeature);
                }
            } else {
                // For non-LineString features, add a default gradient property
                const safeFeature = {
                    ...feature,
                    properties: { ...(feature.properties || {}), gradient: 0 }
                };
                result.features.push(safeFeature);
            }
        });
        
        return result;
    };

    // Add this helper function for better smoothing
    const smoothGradients = (gradients: number[], windowSize: number): number[] => {
        const result: number[] = [];
        
        for (let i = 0; i < gradients.length; i++) {
            let sum = 0;
            let count = 0;
            
            // Apply weighted smoothing - closer points have more influence
            for (let j = Math.max(0, i - windowSize); j <= Math.min(gradients.length - 1, i + windowSize); j++) {
                // Weight by distance from current point
                const weight = 1 / (1 + Math.abs(i - j));
                sum += gradients[j] * weight;
                count += weight;
            }
            
            result.push(sum / count);
        }
        
        return result;
    };

    const addRouteToMap = useCallback((
        map: mapboxgl.Map,
        geojson: FeatureCollection,
        id: string,
        style: { color: string; width: number; opacity: number }
    ) => {
        const layerId = id.toString();
        if (routeStyleMode === 'hidden') {
            if (map.getLayer(layerId)) {
                map.setLayoutProperty(layerId, 'visibility', 'none');
            }
            return;
        }

        // Only compute gradients when needed
        const sourceData = routeStyleMode === 'gradient' 
            ? calculateGradients(geojson)
            : geojson;

        // Create or update source
        const existingSource = map.getSource(layerId) as mapboxgl.GeoJSONSource | undefined;
        if (!existingSource) {
            map.addSource(layerId, {
                type: 'geojson',
                data: sourceData
            });
        } else {
            existingSource.setData(sourceData as any);
        }

        // Create or update layer paint/layout in-place
        if (!map.getLayer(layerId)) {
            map.addLayer({
                id: layerId,
                type: 'line',
                source: layerId,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                    'visibility': 'visible'
                },
                paint: routeStyleMode === 'gradient' ? {
                    'line-width': style.width,
                    'line-opacity': style.opacity,
                    'line-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'gradient'],
                        0, '#A6D7A2',
                        5, '#BFF073',
                        10, '#D9F45D',
                        15, '#FDE47F',
                        20, '#FBC252',
                        25, '#F7A072',
                        30, '#C94C4C'
                    ]
                } : {
                    'line-width': style.width,
                    'line-opacity': style.opacity,
                    'line-color': style.color || '#00ff00'
                }
            });
        } else {
            map.setLayoutProperty(layerId, 'visibility', 'visible');
            map.setPaintProperty(layerId, 'line-width', style.width);
            map.setPaintProperty(layerId, 'line-opacity', style.opacity);
            if (routeStyleMode === 'gradient') {
                map.setPaintProperty(layerId, 'line-color', [
                    'interpolate',
                    ['linear'],
                    ['get', 'gradient'],
                    0, '#A6D7A2',
                    5, '#BFF073',
                    10, '#D9F45D',
                    15, '#FDE47F',
                    20, '#FBC252',
                    25, '#F7A072',
                    30, '#C94C4C'
                ] as any);
            } else {
                map.setPaintProperty(layerId, 'line-color', style.color || '#00ff00');
            }
        }
    }, [routeStyleMode, calculateGradients]);

    const removeRouteFromMap = useCallback((
        map: mapboxgl.Map,
        id: string,
    ) => {
        if (map.getLayer(id)) {
            try {
                map.removeLayer(id);
            } catch (e) {
                console.warn(`Failed to remove layer ${id}`, e);
            }
        }
        if (map.getSource(id)) {
            try {
                map.removeSource(id);
            } catch (e) {
                console.warn(`Failed to remove source ${id}`, e);
            }
        }
    }, []);

    return {
        fetchAndCacheGeoJson,
        addRouteToMap,
        removeRouteFromMap,
    }
}