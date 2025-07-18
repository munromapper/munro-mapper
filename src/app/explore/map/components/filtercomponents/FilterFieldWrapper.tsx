// src/app/explore/map/components/filtercomponents/FilterFieldWrapper.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { FilterFieldWrapperProps } from '@/types';

export default function FilterFieldWrapper({ isOpen, children }: FilterFieldWrapperProps) {
    return (
        <AnimatePresence mode="wait">
        {isOpen && (
            <motion.div
            className="absolute text-nowrap w-auto left-0 top-full mt-2 z-10 bg-mist py-6 pr-9 pl-6 rounded-2xl"
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