// src/app/explore/map/components/MapComponent.tsx
// This file contains the main MapComponent for the map view page in the explore section of the application

'use client';
import React, { useRef, useEffect } from 'react';
import { useMapState } from "@/contexts/MapStateContext";
import initialiseMap from '@/utils/map/initialiseMap';
import { addMapMarker, removeMapMarker } from '@/utils/map/markerUtils';
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';

export default function MapComponent() {
    const { map, setMap, visibleMunros, markerList, setMarkerList, setLoading, setError } = useMapState();
    const { userBaggedMunros } = useBaggedMunroContext();
    const mapRef = useRef<HTMLDivElement | null>(null);

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

        const newMarkerList = { ...markerList };
        const visibleIds = new Set(visibleMunros?.map(m => m.id));
        let changed = false;

        Object.entries(markerList).forEach(([idStr]) => {
            const id = Number(idStr);
            if (!visibleIds.has(id)) {
                removeMapMarker({ munro: { id } as any, markerList: newMarkerList });
                delete newMarkerList[id];
                changed = true;
            }
        });

        visibleMunros?.forEach(munro => {
            if (!markerList[munro.id]) {
                const isBagged = userBaggedMunros.includes(munro.id);
                const marker = addMapMarker({ map, munro, isBagged });
                newMarkerList[munro.id] = marker;
                changed = true;
            }
        });

        if (changed) {
            setMarkerList(newMarkerList);
        }

    }, [map, visibleMunros, markerList, userBaggedMunros]);

    return (
        <div ref={mapRef} className="w-full h-full"></div>
    );
}