// src/app/explore/map/components/filtercomponents/FilterFieldWrapper.tsx
// Wrapper component for filter fields, providing animation for hiding and displaying as well as styling.

import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import type { FilterFieldWrapperProps } from '@/types/data/dataTypes';

export default function FilterFieldWrapper({ isOpen, children }: FilterFieldWrapperProps) {
    const [isMaxMd, setIsMaxMd] = useState(false);
    const [portalEl, setPortalEl] = useState<Element | null>(null);

    useEffect(() => {
        const check = () => setIsMaxMd(window.innerWidth <= 1000);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        setPortalEl(document.getElementById('filter-portal-root'));
    }, []);

    const content = (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    className={`shadow-standard text-nowrap mt-2 z-10 bg-mist rounded-2xl pointer-events-auto
                                ${isMaxMd ? 'fixed bottom-26 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-md' : 'absolute left-0 w-auto top-full'}`}
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

    // On mobile, render into portal root to escape overflow-hidden
    if (isMaxMd && portalEl) {
        return createPortal(content, portalEl);
    }

    // Desktop: render in place
    return content;
}