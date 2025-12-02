// src/app/explore/map/components/RecenterButton.tsx
// Button UI for recentering the map on the currently selected Munro.

import { motion, AnimatePresence } from 'framer-motion';
import { Crosshair } from '@/components/global/SvgComponents';
import type { Munro } from '@/types/data/dataTypes';

type RecenterButtonProps = {
    selectedMunro: Munro | null;
    initialZoomDone: boolean;
    offCenter: boolean;
    onRecenter: () => void;
};

export function RecenterButton({ 
    selectedMunro, 
    initialZoomDone, 
    offCenter, 
    onRecenter 
}: RecenterButtonProps) {
    return (
        <AnimatePresence>
            {selectedMunro && initialZoomDone && offCenter && (
                <motion.button
                    key="recenter-btn"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-9 font-body-font-family left-1/2 -translate-x-1/2 bg-mist text-slate px-4 py-2 rounded-full flex items-center gap-3 text-l hover:bg-pebble hover:text-slate transition z-20 cursor-pointer max-md:hidden"
                    onClick={onRecenter}
                >
                    <div className="w-4 h-4 flex items-center justify-center">
                        <Crosshair />
                    </div>
                    Recenter on {selectedMunro.name}
                </motion.button>
            )}
        </AnimatePresence>
    );
}