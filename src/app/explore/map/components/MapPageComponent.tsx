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
            <div className="absolute z-10 top-0 left-0 w-full h-full flex pointer-events-none">
                {/*Sidebar List, children and filters in here*/}
            </div>
            <div className="w-full h-full relative z-0">
                <MapComponent />
            </div>
            <div className="absolute z-10 top-0 left-0 w-full h-full flex pointer-events-none">
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.5, duration: 0.5, ease: "easeInOut" }}
                            className="w-full h-full"
                        >
                            <div className="w-full h-full flex items-center justify-center gap-4 bg-mist text-slate">
                                <div
                                    className="animate-spin rounded-full h-4 w-4 border-t-1 border-b-1 border-slate border-solid"
                                    style={{ borderTopColor: 'transparent' }}
                                />
                                <p className="text-2xl">Loading...</p>
                            </div>
                        </motion.div>
                    )}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            Error: {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}