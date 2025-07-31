// src/app/explore/map/components/MapComponent.tsx
// This file contains the main MapComponent for the map view page in the explore section of the application

'use client';
import React, { useRef, useEffect } from 'react';
import { useMapState } from "@/contexts/MapStateContext";
import initialiseMap from '@/utils/map/initialiseMap';
import useMapMarkers from '@/hooks/useMapMarkers';
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import useGpxRoutes from '@/hooks/useGpxRoutes';
import useMapNavigation from '@/hooks/useMapNavigation';
import { RecenterButton } from './RecenterButton';

export default function MapComponent() {
    const { 
        map, 
        setMap,
        routeMunroLinks,
        routes, 
        filteredMunros, 
        markerList,
        hoveredMunro,
        setHoveredMunro,
        activeMunro,
        setActiveMunro,
        userAscentUnits, 
        setMarkerList, 
        setLoading, 
        setError 
    } = useMapState();
    const { userBaggedMunros } = useBaggedMunroContext();
    const { 
        addMapMarker, 
        removeMapMarker,
        setMarkerSelected 
    } = useMapMarkers({ userAscentUnits });
    const {
        fetchAndCacheGeoJson,
        addRouteToMap,
        removeRouteFromMap,
    } = useGpxRoutes();
    const mapRef = useRef<HTMLDivElement | null>(null);
    const latestHoveredId = useRef<number | null>(null);
    const { initialZoomDone, offCenter, recenter  } = useMapNavigation({
        map,
        activeMunro,
        zoom: 13,
        centerThreshold: 0.01,
        zoomThreshold: 0.5,
        animationDuration: 2000,
    });

    useEffect(() => {
        if (mapRef.current) {
            const map = initialiseMap({
                mapContainer: mapRef.current,
                setLoading,
                setError
            })
            if (map) {
                setMap(map);
            } else {
                setError("Failed to initialize map");
            }
        }
    }, [mapRef, setMap, setError, setLoading]);

    useEffect(() => {
        if (!map) return;

        Object.values(markerList).forEach(marker => removeMapMarker({ marker }));
        setMarkerList({});

        const newMarkers: { [id: number]: mapboxgl.Marker } = {};
        filteredMunros?.forEach(munro => {
            const isBagged = userBaggedMunros.includes(munro.id);
            const marker = addMapMarker({ map, munro, isBagged, setHoveredMunro, setActiveMunro });
            newMarkers[munro.id] = marker;
        });
        setMarkerList(newMarkers);

        }, [map, filteredMunros, userBaggedMunros]);

    useEffect(() => {
        if (!map || !hoveredMunro) return;
        if (activeMunro && hoveredMunro.id === activeMunro.id) return;

        let cancelled = false;
        latestHoveredId.current = hoveredMunro.id;

        const links = routeMunroLinks.filter(link => link.munroId === hoveredMunro.id);

        (async () => {
            for (const link of links) {
                const route = routes.find(r => r.id === link.routeId);
                if (route && route.gpxFile) {
                    const geojson = await fetchAndCacheGeoJson(route.id, route.gpxFile);
                    if (!cancelled && latestHoveredId.current === hoveredMunro.id) {
                        addRouteToMap(map, geojson, `${route.id}-hovered`, { color: "#686F68", width: 2, opacity: 0.7 });
                    }
                }
            }
        })();

        return () => {
            cancelled = true;
            links.forEach(link => removeRouteFromMap(map, `${link.routeId}-hovered`));
        };
    }, [hoveredMunro, map, routeMunroLinks, routes]);

    useEffect(() => {
        if (!map) return;
        if (!activeMunro) return;

        const links = routeMunroLinks.filter(link => link.munroId === activeMunro.id);
        links.forEach(async link => {
            const route = routes.find(r => r.id === link.routeId);
            if (route && route.gpxFile) {
                const geojson = await fetchAndCacheGeoJson(route.id, route.gpxFile);
                addRouteToMap(map, geojson, `${route.id}-selected`, { color: "#E1FF9E", width: 4, opacity: 1 });
            }
        });

        return () => {
            links.forEach(link => removeRouteFromMap(map, `${link.routeId}-selected`));
        };
    }, [activeMunro, map, routeMunroLinks, routes]);

    useEffect(() => {
        Object.values(markerList).forEach(marker => setMarkerSelected(marker, false));
        if (activeMunro && markerList[activeMunro.id]) {
            setMarkerSelected(markerList[activeMunro.id], true);
        }
    }, [activeMunro, markerList, setMarkerSelected]);

    return (
        <div ref={mapRef} className="w-full h-full">
            {offCenter && activeMunro && (
                <RecenterButton 
                    selectedMunro={activeMunro}
                    initialZoomDone={initialZoomDone}
                    offCenter={offCenter}
                    onRecenter={recenter}
                />
            )}
        </div>
        
    );
}