// src/app/explore/map/components/MapComponent.tsx
// This file contains the main MapComponent for the map view page in the explore section of the application

'use client';
import React, { useRef, useEffect } from 'react';
import { useMapState } from "@/contexts/MapStateContext";
import initialiseMap from '@/utils/map/initialiseMap';
import useMapMarkers from '@/hooks/useMapMarkers';
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';

export default function MapComponent() {
    const { map, setMap, filteredMunros, markerList, userAscentUnits, setMarkerList, setLoading, setError } = useMapState();
    const { userBaggedMunros } = useBaggedMunroContext();
    const { addMapMarker, removeMapMarker } = useMapMarkers({ userAscentUnits });
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
        const newMarkers: { [id: number]: mapboxgl.Marker } = {};
        filteredMunros?.forEach(munro => {
            const isBagged = userBaggedMunros.includes(munro.id);
            const marker = addMapMarker({ map, munro, isBagged });
            newMarkers[munro.id] = marker;
        });
        setMarkerList(newMarkers);

    }, [map, filteredMunros, userBaggedMunros]);

    return (
        <div ref={mapRef} className="w-full h-full"></div>
    );
}