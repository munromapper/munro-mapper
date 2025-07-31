// src/hooks/useMapNavigation.ts
// This hook manages map navigation and zoom to/recenter effects

import { useState, useEffect, useCallback } from 'react';
import type mapboxgl from 'mapbox-gl';
import type { Munro } from '@/types/data/dataTypes';

interface UseMapNavigationProps {
    map: mapboxgl.Map | null;
    activeMunro: Munro | null;
    zoom?: number;
    centerThreshold?: number;
    zoomThreshold?: number;
    animationDuration?: number;
}

export default function useMapNavigation({
    map,
    activeMunro,
    zoom = 13,
    centerThreshold = 0.01,
    zoomThreshold = 0.5,
    animationDuration = 1500,
}: UseMapNavigationProps) {
    const [offCenter, setOffCenter] = useState(false);
    const [initialZoomDone, setInitialZoomDone] = useState(false);

    function isMapOffCenter(
        map: mapboxgl.Map | null,
        munro: Munro | null,
        zoomTarget = 13,
        centerThreshold = 0.01,
        zoomThreshold = 0.5
    ): boolean {
        if (!map || !munro) return false;
        const center = map.getCenter();
        const zoom = map.getZoom();
        const dist = Math.sqrt(
            Math.pow(center.lng - munro.longitude, 2) +
            Math.pow(center.lat - munro.latitude, 2)
        );
        return dist > centerThreshold || Math.abs(zoom - zoomTarget) > zoomThreshold;
    }

    function recenterMapOnMunro(
        map: mapboxgl.Map | null,
        munro: Munro | null,
        zoom = 13,
        duration = 1500
    ) {
        if (!map || !munro) return;
        map.easeTo({
            center: [munro.longitude, munro.latitude],
            zoom,
            duration,
            essential: true,
        });
    }

    useEffect(() => {
        if (!map || !activeMunro) return;

        setInitialZoomDone(false);
        setOffCenter(false);

        const handleInitialMoveEnd = () => {
            setInitialZoomDone(true);
            map.off('moveend', handleInitialMoveEnd);
        };

        map.easeTo({
            center: [activeMunro.longitude, activeMunro.latitude],
            zoom,
            duration: animationDuration,
            essential: true,
        });

        map.on('moveend', handleInitialMoveEnd);

        return () => {
            map.off('moveend', handleInitialMoveEnd);
        };
    }, [map, activeMunro, zoom, animationDuration]);

    useEffect(() => {
        if (!map || !activeMunro || !initialZoomDone) {
            setOffCenter(false);
            return;
        }

        const handleMove = () => {
            setOffCenter(isMapOffCenter(map, activeMunro, zoom, centerThreshold, zoomThreshold));
        };

        map.on('moveend', handleMove);
        map.on('zoomend', handleMove);
        setOffCenter(isMapOffCenter(map, activeMunro, zoom, centerThreshold, zoomThreshold));

        return () => {
            map.off('moveend', handleMove);
            map.off('zoomend', handleMove);
        };
    }, [map, activeMunro, initialZoomDone, zoom, centerThreshold, zoomThreshold]);

    const handleRecenter = useCallback(() => {
        recenterMapOnMunro(map, activeMunro, zoom, animationDuration);
    }, [map, activeMunro, zoom, animationDuration]);

    return {
        initialZoomDone,
        offCenter,
        recenter: handleRecenter,
    };
}