// src/app/explore/map/components/MapComponent.tsx
'use client';
import { useMapData } from '@/contexts/MapDataContext';
import { useRef, useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import { mapInitialise } from '@/utils/mapInitialise'
import { createMunroMarker, removeMarkerWithAnimation } from '@/utils/markerUtils';
import { isMapOffCenter, recenterMapOnMunro } from '@/utils/mapUtils';
import { filterMunros } from '@/utils/mapFilterFunction';
import { Crosshair } from '@/SvgIcons';
import 'mapbox-gl/dist/mapbox-gl.css';


export function MapComponent() {

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<mapboxgl.Map | undefined>(undefined);
    const [error, setError] = useState<string | null>(null);
    const markerMapRef = useRef<Map<number, mapboxgl.Marker>>(new Map());
    const [offCenter, setOffCenter] = useState(false);
    const [initialZoomDone, setInitialZoomDone] = useState(false);

    const { munros, routes, routeMunroLinks, filters } = useMapData();
    const router = useRouter();
    const params = useParams();

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

    }, [filteredMunros, router])

    const selectedMunro = params?.munro
        ? munros.find(m => m.slug === params.munro)
        : null;

    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !selectedMunro) return;

        setInitialZoomDone(false);
        setOffCenter(false);

        // Handler to mark initial zoom as done
        const handleInitialMoveEnd = () => {
            setInitialZoomDone(true);
            map.off('moveend', handleInitialMoveEnd);
        };

        map.easeTo({
            center: [selectedMunro.longitude, selectedMunro.latitude],
            zoom: 13,
            duration: 2000,
            essential: true,
        });

        map.on('moveend', handleInitialMoveEnd);

        // If user interrupts flyTo, still mark as done
        return () => {
            map.off('moveend', handleInitialMoveEnd);
        };
    }, [selectedMunro]);
    
    useEffect(() => {
        const map = mapInstanceRef.current;
        if (!map || !selectedMunro || !initialZoomDone) {
            setOffCenter(false);
            return;
        }
        const handleMove = () => {
            setOffCenter(isMapOffCenter(map, selectedMunro));
        };
        map.on('moveend', handleMove);
        map.on('zoomend', handleMove);

        // Initial check
        setOffCenter(isMapOffCenter(map, selectedMunro));

        return () => {
            map.off('moveend', handleMove);
            map.off('zoomend', handleMove);
        };
    }, [selectedMunro, initialZoomDone]);

    const handleRecenter = () => {
        recenterMapOnMunro(mapInstanceRef.current, selectedMunro);
    };

    if(error) {
        return (
            <div className="w-full h-full flex items-center justify-center text-mist" role="alert">
                {error}
            </div>
        )
    }

    return(
        <div ref={mapRef} className="relative w-full h-full">
            <AnimatePresence>
            {selectedMunro && initialZoomDone && offCenter && (
                <motion.button
                    key="recenter-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-mist text-slate px-4 py-2 rounded-full flex items-center gap-3 text-l hover:bg-pebble hover:text-slate transition z-20 cursor-pointer"
                    onClick={handleRecenter}
                >
                    <div className="w-4 h-4 flex items-center justify-center">
                        <Crosshair/>
                    </div>
                    Recenter on {selectedMunro.name}
                </motion.button>
            )}
        </AnimatePresence>
        </div>
    )

}