// src/app/explore/map/page.tsx
'use client';
import { useMapData } from '@/contexts/MapDataContext';
import { filterMunros } from '@/utils/mapFilterFunction';
import { Virtuoso } from 'react-virtuoso';
import SideBarListItemComponent from './components/SideBarListItemComponent';


export default function MapList() {
    const { munros, routes, routeMunroLinks, filters, loading } = useMapData();

    const filteredMunros = filterMunros({
        filters,
        munros,
        routeData: routes,
        routeLinks: routeMunroLinks
    });

    if (loading) {
        return <div className="p-6">Loading Munros...</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="w-full p-6 flex flex-col gap-2 shadow-md">
                <h1>Explore</h1>
                <div className="flex justify-between items-end">
                    <p className="text-moss">Find your next hill day.</p>
                    <p className="text-l text-moss">{filteredMunros.length} found.</p>
                </div>
            </div>
            <div className="overflow-hidden flex-1">
                <Virtuoso
                    style={{ 
                        height: '100%', 
                        width: '100%',  
                    }}
                    totalCount={filteredMunros.length}
                    itemContent={index => (
                        <SideBarListItemComponent munro={filteredMunros[index]} />
                    )}
                />
            </div>
        </div>
    )
}