// src/contexts/MapDataContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchMunroData, fetchRouteData, fetchRouteMunroLinks } from '../utils/clientDataFetchers';
import { Munro, Route, RouteMunroLink, Filters } from '../types';

type MapDataContextType = {
    munros: Munro[];
    routes: Route[];
    routeMunroLinks: RouteMunroLink[];
    loading: boolean;
    error: string | null;
    defaultFilters: Filters;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

const MapDataContext = createContext<MapDataContextType | undefined>(undefined);

export function MapDataProvider({ children }: { children: React.ReactNode }) {

    const defaultFilters = {
        routeStyle: "all",
        difficulty: "all",
        length: [0, 50],
        ascent: [0, 4000]
    } as Filters;
    const [munros, setMunros] = useState<Munro[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [routeMunroLinks, setRouteMunroLinks] = useState<RouteMunroLink[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState(defaultFilters);

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

    return (
        <MapDataContext.Provider value={{ munros, routes, routeMunroLinks, loading, error, defaultFilters, filters, setFilters }}>
            {children}
        </MapDataContext.Provider>
    );
};

export const useMapData = () => {
    const context = useContext(MapDataContext);
    if (!context) {
        throw new Error('useMapData must be used within a MapDataProvider');
    }
    return context;
};