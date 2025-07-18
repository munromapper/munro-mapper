// src/app/explore/map/components/MapComponent.tsx
'use client';
import { useMapData } from '@/contexts/MapDataContext';
import { useRef, useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation';
import { mapInitialise } from '@/utils/mapInitialise'
import { createMunroMarker, removeMarkerWithAnimation } from '@/utils/markerUtils';
import { filterMunros } from '@/utils/mapFilterFunction';
import 'mapbox-gl/dist/mapbox-gl.css';


export function MapComponent() {

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<mapboxgl.Map | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const markerMapRef = useRef<Map<number, mapboxgl.Marker>>(new Map());

    const { munros, routes, routeMunroLinks, filters } = useMapData();
    const router = useRouter();

    const filteredMunros = useMemo(() => {
        return filterMunros({
            filters,
            munros,
            routeData: routes,
            routeLinks: routeMunroLinks
        });
    }, [filters, munros, routes, routeMunroLinks]);

    useEffect(() => {
        mapInstanceRef.current = mapInitialise(mapRef.current, setError)
        return () => {
            mapInstanceRef.current?.remove();
            mapInstanceRef.current = undefined;
        }
    }, []);

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || filteredMunros.length === 0) return;

        const markerMap = markerMapRef.current;
        const newIds = new Set(filteredMunros.map(m => m.id));

        for (const [id, marker] of markerMap.entries()) {
            if (!newIds.has(id)) {
                removeMarkerWithAnimation(marker);
                markerMap.delete(id);
            }
        }

        for (const munro of filteredMunros) {
            if (!markerMap.has(munro.id)) {
                const marker = createMunroMarker(
                    munro,
                    (clickedMunro) => { router.push(`/explore/map/munro/${clickedMunro.slug}`); },
                );
                marker.addTo(map);
                markerMap.set(munro.id, marker);
            }
        }

        return () => {
            for (const marker of markerMap.values()) {
                removeMarkerWithAnimation(marker);
            }
            markerMap.clear();
        };

    }, [filteredMunros])

    if(error) {
        return (
            <div className="w-full h-full flex items-center justify-center text-mist" role="alert">
                {error}
            </div>
        )
    }

    return(
        <div ref={mapRef} className="relative w-full h-full"></div>
    )

}