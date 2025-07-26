// src/contexts/MapStateContext.tsx
// // Main map context for sharing munro, route and route-munro link data across the map page, as well as tracking loading and filter state, plus hovered/active munro.

'use client';
import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
import { Munro, Route, RouteMunroLink } from '../types/data/dataTypes';
import { fetchMunroData, fetchRouteData, fetchRouteMunroLinks } from '@/utils/data/clientDataFetchers';
import mapboxgl from 'mapbox-gl';

type MapStateContextType = {
    munros: Munro[];
    routes: Route[];
    routeMunroLinks: RouteMunroLink[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    hoveredMunro: Munro | null;
    setHoveredMunro: (munro: Munro | null) => void;
    activeMunro: Munro | null;
    setActiveMunro: (munro: Munro | null) => void;
    map: mapboxgl.Map | null;
    setMap: (map: mapboxgl.Map | null) => void;
}

const MapStateContext = createContext<MapStateContextType | undefined>(undefined);

export function MapStateProvider({ children }: { children: React.ReactNode }) {
    const [munros, setMunros] = useState<Munro[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [routeMunroLinks, setRouteMunroLinks] = useState<RouteMunroLink[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredMunro, setHoveredMunro] = useState<Munro | null>(null);
    const [activeMunro, setActiveMunro] = useState<Munro | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            const munroData = await fetchMunroData();
            const routeData = await fetchRouteData();
            const routeMunroLinkData = await fetchRouteMunroLinks();

            if (munroData) setMunros(munroData);
            if (routeData) setRoutes(routeData);
            if (routeMunroLinkData) setRouteMunroLinks(routeMunroLinkData);

            setLoading(false);
        };

        fetchData();
    }, []);

    console.log('MapStateProvider initialized with munros:', munros.length, 'routes:', routes.length, 'routeMunroLinks:', routeMunroLinks.length);

    return (
        <MapStateContext.Provider value={
            {
                munros,
                setMunros,
                routes,
                setRoutes,
                routeMunroLinks,
                setRouteMunroLinks,
                loading,
                setLoading,
                error,
                setError,
                hoveredMunro,
                setHoveredMunro,
                activeMunro,
                setActiveMunro,
                map,
                setMap
            } as MapStateContextType
        }>
            {children}
        </MapStateContext.Provider>
    );
}

export const useMapState = () => {
    const context = useContext(MapStateContext);
    if (!context) {
        throw new Error('useMapState must be used within a MapStateProvider');
    }
    return context;
};