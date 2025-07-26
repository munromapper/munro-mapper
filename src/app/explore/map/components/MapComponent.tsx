// src/app/explore/map/components/MapComponent.tsx
// This file contains the main MapComponent for the map view page in the explore section of the application

'use client';
import React, { useRef, useEffect } from 'react';
import { useMapState } from "@/contexts/MapStateContext";
import { initialiseMap } from '@/utils/map/initialiseMap';
import { motion, AnimatePresence } from 'framer-motion';

export default function MapComponent() {
    const { map, setMap, loading, setLoading, error, setError } = useMapState();
    const mapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (mapRef.current) {
            let map = initialiseMap({
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
    }, [mapRef, setMap]);

    return (
        <div ref={mapRef} className="w-full h-full"></div>
    );
}