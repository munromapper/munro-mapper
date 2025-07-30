// src/app/explore/map/components/MapPageComponent.tsx
// This file contains the entire map page as a client component

'use client';
import { useMapState } from "@/contexts/MapStateContext";
import MapComponent from "./MapComponent";
import { motion, AnimatePresence } from 'framer-motion';
import SidebarWrapperComponent from "./SidebarWrapperComponent";
import FilterComponent from "./filtercomponents/FilterComponent";

interface MapPageComponentProps {
    children: React.ReactNode;
}

export default function MapPageComponent({
    children
}: MapPageComponentProps) {
    const { loading, openFilter, setOpenFilter } = useMapState();

    return (
        <div className="relative w-full h-full">
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
            <div className="absolute z-10 p-9 top-0 left-0 w-full h-full flex gap-9 pointer-events-none">
                <SidebarWrapperComponent>
                    {children}
                </SidebarWrapperComponent>
                <FilterComponent />
            </div>
            <div className="w-full h-full relative z-0"
                 onClick={() => {
                    if (openFilter) {
                        setOpenFilter(null);
                    }
             }}
            >
                <MapComponent />
            </div>
        </div>
    );
}