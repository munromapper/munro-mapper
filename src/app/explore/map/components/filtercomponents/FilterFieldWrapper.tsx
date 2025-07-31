// src/app/explore/map/components/filtercomponents/FilterFieldWrapper.tsx
// Wrapper component for filter fields, providing animation for hiding and displaying as well as styling.

import { motion, AnimatePresence } from 'framer-motion';
import type { FilterFieldWrapperProps } from '@/types/data/dataTypes';

export default function FilterFieldWrapper({ isOpen, children }: FilterFieldWrapperProps) {
    return (
        <AnimatePresence mode="wait">
        {isOpen && (
            <motion.div
            className="absolute text-nowrap w-auto left-0 top-full mt-2 z-10 bg-mist rounded-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            >
            {children}
            </motion.div>
        )}
        </AnimatePresence>
    );
}