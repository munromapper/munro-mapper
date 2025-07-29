// src/app/explore/map/components/MapComponent.tsx
// This file contains the main MapComponent for the map view page in the explore section of the application

'use client';
import React, { useRef, useEffect } from 'react';
import { useMapState } from "@/contexts/MapStateContext";
import initialiseMap from '@/utils/map/initialiseMap';
import { addMapMarker, removeMapMarker } from '@/utils/map/markerUtils';
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import type { Munro } from '@/types/data/dataTypes';

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

        // Clone the current marker list to track changes
        const updatedMarkerList = { ...markerList };
        
        // Process visible munros - add new markers or update existing ones
        visibleMunros?.forEach(munro => {
            const isBagged = userBaggedMunros.includes(munro.id);
            const existingMarker = markerList[munro.id];
            
            // If marker doesn't exist, add it
            if (!existingMarker) {
                const newMarker = addMapMarker({
                    map,
                    munro,
                    isBagged
                });
                updatedMarkerList[munro.id] = newMarker;
            } 
            // If marker exists but bagged status changed, update it
            else {
                const markerElement = existingMarker.getElement();
                const isCurrentlyBagged = markerElement.classList.contains('icon-bagged');
                
                if (isBagged !== isCurrentlyBagged) {
                    // Remove old marker
                    removeMapMarker({
                        munro,
                        markerList: updatedMarkerList
                    });
                    
                    // Add new marker with correct status
                    const newMarker = addMapMarker({
                        map,
                        munro,
                        isBagged
                    });
                    updatedMarkerList[munro.id] = newMarker;
                }
            }
        });
        
        // Remove markers that are no longer visible
        const visibleMunroIds = new Set(visibleMunros?.map(m => m.id));
        Object.keys(markerList).forEach(idStr => {
            const id = parseInt(idStr);
            if (!visibleMunroIds.has(id)) {
                // Find the munro object or create minimal version for removal
                const munro = visibleMunros?.find(m => m.id === id) || { id } as Munro;
                removeMapMarker({
                    munro,
                    markerList: updatedMarkerList
                });
            }
        });
        
        // Update the marker list state if changes were made
        if (JSON.stringify(Object.keys(markerList).sort()) !== 
            JSON.stringify(Object.keys(updatedMarkerList).sort())) {
            setMarkerList(updatedMarkerList);
        }
    }, [map, visibleMunros, markerList, userBaggedMunros]);

    return (
        <div ref={mapRef} className="w-full h-full"></div>
    );
}