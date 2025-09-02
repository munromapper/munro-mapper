// src/app/explore/map/munro/[munro]/MunroDetailPage.tsx
// This component displays detailed information about a specific Munro, including its routes and related hills.

'use client';
import React, { useState } from 'react';
import type { Munro, Route } from "@/types/data/dataTypes";
import MunroDetailHeader from './MunroDetailHeader';
import MunroDetailPageContent from './MunroDetailPageContent';
import { useMapState } from "@/contexts/MapStateContext";
import { convertHeight, convertLength } from "@/utils/misc/unitConverters";

interface MunroDetailPageProps {
    munro: Munro;
    route: Route | null;
    routeMunros: Munro[];
}

export default function MunroDetailPage({ 
    munro,
    route,
    routeMunros 
}: MunroDetailPageProps) {
    const [isOpen, setIsOpen] = useState(true);
    const { userAscentUnits, userLengthUnits } = useMapState();

    // Convert munro data
    const convertedMunro = {
        ...munro,
        height: userAscentUnits === 'ft' 
            ? convertHeight(munro.height, 'feet')
            : munro.height
    };
    
    // Convert route data if it exists
    const convertedRoute = route ? {
        ...route,
        length: userLengthUnits === 'mi'
            ? Number(convertLength(route.length, 'miles'))
            : Number(route.length),
        ascent: userAscentUnits === 'ft'
            ? convertHeight(route.ascent, 'feet')
            : route.ascent
    } : null;

    // Convert other munros in the route
    const convertedRouteMunros = routeMunros.map(m => ({
        ...m,
        height: userAscentUnits === 'ft'
            ? convertHeight(m.height, 'feet')
            : m.height
    }));

    return (
        <div className="rounded-xl overflow-auto no-scrollbar h-auto max-h-full shadow-standard">
            <MunroDetailHeader 
                munro={convertedMunro} 
            />
            <MunroDetailPageContent 
                munro={convertedMunro}
                route={convertedRoute}
                routeMunros={convertedRouteMunros}
            />
        </div>
    )
}