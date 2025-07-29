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

        // Clear existing markers
        Object.values(markerList).forEach(marker => removeMapMarker({ marker }));
        setMarkerList({});

        // Add new markers
        visibleMunros?.forEach(munro => {
            const isBagged = userBaggedMunros.includes(munro.id);
            const marker = addMapMarker({ map, munro, isBagged });
            setMarkerList((prev: { [id: number]: mapboxgl.Marker }) => ({ ...prev, [munro.id]: marker }));
        });

    }, [map, visibleMunros, userBaggedMunros]);

    return (
        <div ref={mapRef} className="w-full h-full"></div>
    );
}