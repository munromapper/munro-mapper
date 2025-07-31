// src/hooks/useGpxRoutes.ts
// This hook provides functions to fetch, convert, and manage GPX routes for Munros

import { useCallback, useRef } from "react";
import { useMapState } from "@/contexts/MapStateContext";
import { supabase } from "@/utils/auth/supabaseClient";
import toGeoJSON from "@mapbox/togeojson";
import type { FeatureCollection } from "geojson";

export default function useGpxRoutes() {
    const geoJsonCache = useRef<Map<number, FeatureCollection>>(new Map());

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

    const addRouteToMap = useCallback((
        map: mapboxgl.Map,
        geojson: FeatureCollection,
        id: string,
        style: { color: string; width: number; opacity: number }
    ) => {
        const layerId = id.toString();
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(layerId)) map.removeSource(layerId);

        map.addSource(layerId, {
            type: 'geojson',
            data: geojson
        });

        map.addLayer({
            id: layerId,
            type: 'line',
            source: layerId,
            paint: {
                'line-color': style.color,
                'line-width': style.width,
                'line-opacity': style.opacity,
            }
        });
    }, []);

    const removeRouteFromMap = useCallback((
        map: mapboxgl.Map,
        id: string,
    ) => {
        const layerId = id.toString();
        if (map.getLayer(layerId)) map.removeLayer(layerId);
        if (map.getSource(layerId)) map.removeSource(layerId);
    }, []);

    return {
        fetchAndCacheGeoJson,
        addRouteToMap,
        removeRouteFromMap,
    }
}