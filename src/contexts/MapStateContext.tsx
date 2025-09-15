// src/contexts/MapStateContext.tsx
// // Main map context for sharing munro, route and route-munro link data across the map page, as well as tracking loading and filter state, plus hovered/active munro.

'use client';
import React, { createContext, useContext, useEffect, useState, useRef, useMemo } from 'react';
import { Munro, Route, RouteMunroLink, Filters } from '../types/data/dataTypes';
import { fetchMunroData, fetchRouteData, fetchRouteMunroLinks } from '@/utils/data/clientDataFetchers';
import { useAuthContext } from './AuthContext';
import { convertHeight, getHeightUnitLabel, convertLength, getLengthUnitLabel } from '@/utils/misc/unitConverters';
import { useBaggedMunroContext } from './BaggedMunroContext';
import { filterMunros } from '@/utils/map/filterFunction';
import { useParams } from 'next/navigation';
import mapboxgl from 'mapbox-gl';

type MapStateContextType = {
    munros: Munro[];
    routes: Route[];
    routeMunroLinks: RouteMunroLink[];
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    defaultAscentRanges: { m: [number, number]; ft: [number, number] };
    defaultLengthRanges: { km: [number, number]; mi: [number, number] };
    defaultFilters: Filters;
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
    openFilter: string | null;
    setOpenFilter: React.Dispatch<React.SetStateAction<string | null>>;
    filteredMunros: Munro[];
    hoveredMunro: Munro | null;
    setHoveredMunro: (munro: Munro | null) => void;
    activeMunro: Munro | null;
    setActiveMunro: (munro: Munro | null) => void;
    visibleMunros?: Munro[];
    setVisibleMunros?: (munros: Munro[]) => void;
    markerList: { [id: number]: mapboxgl.Marker };
    setMarkerList: React.Dispatch<React.SetStateAction<{ [id: number]: mapboxgl.Marker }>>;
    map: mapboxgl.Map | null;
    setMap: (map: mapboxgl.Map | null) => void;
    userAscentUnits: 'm' | 'ft';
    userLengthUnits: 'km' | 'mi';
    routeStyleMode: 'gradient' | 'standard' | 'hidden';
    setRouteStyleMode: React.Dispatch<React.SetStateAction<'gradient' | 'standard' | 'hidden'>>;
    isSidebarExpanded: boolean;
    setSidebarExpanded: (expanded: boolean) => void;
}

const MapStateContext = createContext<MapStateContextType | undefined>(undefined);

export function MapStateProvider({ children }: { children: React.ReactNode }) {
    const [munros, setMunros] = useState<Munro[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [routeMunroLinks, setRouteMunroLinks] = useState<RouteMunroLink[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const defaultAscentRanges: { m: [number, number]; ft: [number, number] } = {
        m: [0, 3000],
        ft: [0, 10000],
    };
    const defaultLengthRanges: { km: [number, number]; mi: [number, number] } = {
        km: [0, 60],
        mi: [0, 40],
    };
    const defaultFilters = {
        routeStyle: "all",
        difficulty: "all",
        length: defaultLengthRanges.km,
        ascent: defaultAscentRanges.m,
        friends: {
            selectedPeople: [],
            baggedMode: 'bagged'
        }
    } as Filters;
    const [filters, setFilters] = useState(defaultFilters);
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const [hoveredMunro, setHoveredMunro] = useState<Munro | null>(null);
    const [activeMunro, setActiveMunro] = useState<Munro | null>(null);
    const [visibleMunros, setVisibleMunros] = useState<Munro[]>([]);
    const [markerList, setMarkerList] = useState<{ [id: number]: mapboxgl.Marker }>({});
    const [map, setMap] = useState<mapboxgl.Map | null>(null);
    const [userAscentUnits, setUserAscentUnits] = useState<'m' | 'ft'>('m');
    const [userLengthUnits, setUserLengthUnits] = useState<'km' | 'mi'>('km');
    const { user, userProfile, openPremiumAdModal } = useAuthContext();
    const { userBaggedMunros, friendsBaggedMunros } = useBaggedMunroContext();
    const params = useParams();
    const munroSlug = params?.munro as string | undefined;
    const [routeStyleMode, setRouteStyleMode] = useState<'gradient' | 'standard' | 'hidden'>('standard');
    const [isSidebarExpanded, setSidebarExpanded] = useState<boolean>(true);

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

    useEffect(() => {
        if (userProfile) {
            const elevationUnit = userProfile.preferences.elevationUnit;
            if (elevationUnit === 'metres' || elevationUnit === 'feet') {
                setUserAscentUnits(getHeightUnitLabel(elevationUnit) as 'm' | 'ft');
            }
            const lengthUnit = userProfile.preferences.lengthUnit;
            if (lengthUnit === 'kilometres' || lengthUnit === 'miles') {
                setUserLengthUnits(getLengthUnitLabel(lengthUnit) as 'km' | 'mi');
            }
        }
    }, [userProfile]);

    const munrosConverted = useMemo(() => {
        return munros.map(munro => ({
            ...munro,
            height: userAscentUnits === 'ft'
            ? convertHeight(munro.height, 'feet')
            : munro.height,
        }));
    }, [munros, userAscentUnits]);

    const routesConverted = useMemo(() => {
        return routes.map(route => ({
            ...route,
            length: userLengthUnits === 'mi'
                ? Number(convertLength(route.length, 'miles'))
                : Number(route.length),
            ascent: userAscentUnits === 'ft'
                ? convertHeight(route.ascent, 'feet')
                : route.ascent,
        }));
    }, [routes, userLengthUnits, userAscentUnits]);

    const unitAdjustedDefaults = useMemo(() => {
        return {
            ...defaultFilters,
            length: userLengthUnits === 'mi' ? defaultLengthRanges.mi : defaultLengthRanges.km,
            ascent: userAscentUnits === 'ft' ? defaultAscentRanges.ft : defaultAscentRanges.m,
        } as Filters;
    }, [userLengthUnits, userAscentUnits]);

    const isAnyFilterActive = useMemo(() => {
        const f = filters;
        const d = unitAdjustedDefaults;
        const lengthActive = f.length[0] !== d.length[0] || f.length[1] !== d.length[1];
        const ascentActive = f.ascent[0] !== d.ascent[0] || f.ascent[1] !== d.ascent[1];
        const routeStyleActive = f.routeStyle !== d.routeStyle;
        const difficultyActive = f.difficulty !== d.difficulty;
        const friendsActive = (f.friends?.selectedPeople?.length ?? 0) > 0;
        return lengthActive || ascentActive || routeStyleActive || difficultyActive || friendsActive;
    }, [filters, unitAdjustedDefaults]);

    const isPremium = useMemo(() => {
        const status = userProfile?.isPremium ?? '';
        return !!user && ['active', 'canceling'].includes(status);
    }, [user, userProfile?.isPremium]);

    useEffect(() => {
        if (!isPremium && isAnyFilterActive) {
            openPremiumAdModal();
            setFilters(unitAdjustedDefaults);
        }
    }, [isPremium, isAnyFilterActive, openPremiumAdModal, setFilters, unitAdjustedDefaults]);

    const filteredMunros = useMemo(() => {
        if (!isPremium && isAnyFilterActive) {
            return filterMunros({
                filters: unitAdjustedDefaults,
                munros: munrosConverted,
                routeData: routesConverted,
                routeLinks: routeMunroLinks,
                userBaggedMunros,
                friendsBaggedMunros,
                currentUserId: userProfile?.id || '',
            });
        }
        return filterMunros({
            filters,
            munros: munrosConverted,    
            routeData: routesConverted,
            routeLinks: routeMunroLinks,
            userBaggedMunros,
            friendsBaggedMunros,
            currentUserId: userProfile?.id || '',
        });
    }, [filters, munrosConverted, routesConverted, routeMunroLinks, userBaggedMunros, friendsBaggedMunros, isPremium, isAnyFilterActive, userProfile?.id, unitAdjustedDefaults]);

    useEffect(() => {
        if (!munroSlug) {
            if (activeMunro) setActiveMunro(null);
            return;
        }
        if (!filteredMunros?.length) return;
        const munro = filteredMunros.find(m => m.slug === munroSlug);
        if (munro && (!activeMunro || activeMunro.id !== munro.id)) {
            setActiveMunro(munro);
        }
    }, [munroSlug, filteredMunros, activeMunro]);

    return (
        <MapStateContext.Provider value={
            {
                munros: munrosConverted,
                setMunros,
                routes: routesConverted,
                setRoutes,
                routeMunroLinks,
                setRouteMunroLinks,
                loading,
                setLoading,
                error,
                setError,
                defaultAscentRanges,
                defaultLengthRanges,
                defaultFilters,
                filters,
                setFilters,
                openFilter,
                setOpenFilter,
                filteredMunros,
                hoveredMunro,
                setHoveredMunro,
                activeMunro,
                setActiveMunro,
                visibleMunros,
                setVisibleMunros,
                markerList,
                setMarkerList,
                map,
                setMap,
                userAscentUnits,
                userLengthUnits,
                routeStyleMode,
                setRouteStyleMode,
                isSidebarExpanded,
                setSidebarExpanded
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