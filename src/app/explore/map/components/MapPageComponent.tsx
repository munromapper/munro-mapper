// src/app/explore/map/components/MapPageComponent.tsx
// This file contains the entire map page as a client component

'use client';
import { useMapState } from "@/contexts/MapStateContext";
import MapComponent from "./MapComponent";
import { motion, AnimatePresence } from 'framer-motion';

interface MapPageComponentProps {
    children: React.ReactNode;
}

export default function MapPageComponent({
    children
}: MapPageComponentProps) {
    const { loading, error } = useMapState();

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
                        className="absolute inset-0 z-50 flex items-center justify-center bg-mist bg-opacity-90"
                        style={{ pointerEvents: 'all' }}
                    >
                        <div className="text-2xl text-slate">Loading map...</div>
                        {/* You can add a spinner here if you want */}
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="absolute z-10 top-0 left-0 w-full h-full flex pointer-events-none">
                {/*Sidebar List, children and filters in here*/}
                {children}
            </div>
            <div className="w-full h-full relative z-0">
                <MapComponent />
            </div>
        </div>
    );
}