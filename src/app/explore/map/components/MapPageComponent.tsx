// src/app/explore/map/components/MapPageComponent.tsx
// This file contains the entire map page as a client component

'use client';
import { useMapState } from "@/contexts/MapStateContext";
import MapComponent from "./MapComponent";
import MapControls from "./MapControls";
import { motion, AnimatePresence } from 'framer-motion';
import SidebarWrapperComponent from "./SidebarWrapperComponent";
import FilterComponent from "./filtercomponents/FilterComponent";
import MobileMunroPopup from "./MobileMunroPopup";
import { useEffect } from 'react';

interface MapPageComponentProps {
    children: React.ReactNode;
}

export default function MapPageComponent({
    children
}: MapPageComponentProps) {
    const { loading, isMobileSidebarOpen, setMobileSidebarOpen } = useMapState();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (!isMobile) return;

        const onPopState = () => {
            if (isMobileSidebarOpen) {
                setMobileSidebarOpen(false);
            }
        };

        window.addEventListener('popstate', onPopState);
        return () => window.removeEventListener('popstate', onPopState);
    }, [isMobileSidebarOpen, setMobileSidebarOpen]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (!isMobile) return;

        if (isMobileSidebarOpen) {
            const state = window.history.state as any;
            if (!state || state.__mm_mobileSidebarOpen !== true) {
                window.history.pushState({ ...(state ?? {}), __mm_mobileSidebarOpen: true }, '', window.location.href);
            }
        }
    }, [isMobileSidebarOpen]);

    return (
        <div className="relative w-full h-full overflow-hidden">
            <AnimatePresence>
                {loading && (
                    <motion.div
                        key="loading-overlay"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-50 flex items-center gap-4 justify-center bg-mist bg-opacity-90"
                        style={{ pointerEvents: 'all' }}
                    >
                        <div className="w-6 h-6 border-2 border-moss border-t-transparent rounded-full animate-spin" />
                        <div className="text-2xl text-slate">Loading map...</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overlay layer ABOVE the map (not inside transformed map container) */}
            <div
                className={[
                    'absolute z-[200] top-0 left-0 w-full h-full flex gap-9 pointer-events-none',
                    'p-9',
                    isMobileSidebarOpen ? 'max-md:p-0 max-md:py-0' : 'max-md:p-0 max-md:py-4',
                ].join(' ')}
            >
                <SidebarWrapperComponent>
                    {children}
                </SidebarWrapperComponent>
                <FilterComponent />

                {/* Portal root for mobile filter fields */}
                <div id="filter-portal-root" className="absolute inset-0 pointer-events-none z-[201]" />

                <div className="absolute bottom-9 right-9 pointer-events-none max-md:top-18 max-md:right-4">
                    <MapControls />
                </div>
            </div>

            {/* Map underlay */}
            <div className="w-full h-full relative z-0">
                <MapComponent />
            </div>

            <MobileMunroPopup />
        </div>
    );
}