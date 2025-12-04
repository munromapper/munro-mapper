'use client';
import { useEffect, useRef, useState } from 'react';
import { useMapState } from '@/contexts/MapStateContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import { PremiumIconOutline, MapStyleIcon } from '@/components/global/SvgComponents';
import { createPortal } from 'react-dom';

export default function MapStyleToggle() {
    const { mapBaseStyleMode, setMapBaseStyleMode } = useMapState();
    const { user, userProfile, openPremiumAdModal } = useAuthContext();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const isPremium = !!user && ['active', 'canceling'].includes(userProfile?.isPremium ?? '');
    const satelliteLocked = !isPremium;

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target as Node)) setOpen(false);
        };
        const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onEsc);
        };
    }, []);

    useEffect(() => {
        if (satelliteLocked && mapBaseStyleMode === 'satellite') {
            setMapBaseStyleMode('terrain');
        }
    }, [satelliteLocked, mapBaseStyleMode, setMapBaseStyleMode]);

    const selectMode = (mode: 'terrain' | 'satellite') => {
        if (mode === 'satellite' && satelliteLocked) {
            openPremiumAdModal();
            return;
        }
        setMapBaseStyleMode(mode);
        setOpen(false);
    };

    const is = (m: 'terrain' | 'satellite') => mapBaseStyleMode === m;

    const menuContent = (
        <>
            <Option
                title="Terrain"
                description="Topographic hill shading"
                selected={is('terrain')}
                onClick={() => selectMode('terrain')}
            >
                <PreviewTerrain />
            </Option>
            <Option
                title="Satellite"
                description="Detailed aerial imagery"
                selected={is('satellite')}
                onClick={() => selectMode('satellite')}
                locked={satelliteLocked}
            >
                <PreviewSatellite />
            </Option>
        </>
    );

    const menu =
        typeof window !== 'undefined' && window.innerWidth <= 1000
            ? createPortal(
                <AnimatePresence>
                    {open && (
                        <motion.div
                            key="map-style-menu-mobile"
                            role="menu"
                            aria-label="Map style options"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
                            exit={{ opacity: 0, y: 16, transition: { duration: 0.15, ease: 'easeIn' } }}
                            className="fixed bottom-26 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-md space-y-2 rounded-xl bg-mist shadow-standard p-2 z-[100]"
                            style={{ pointerEvents: 'auto' }}
                        >
                            {menuContent}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )
            : (
                <AnimatePresence>
                    {open && (
                        <motion.div
                            key="map-style-menu-desktop"
                            role="menu"
                            aria-label="Map style options"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
                            exit={{ opacity: 0, y: 8, transition: { duration: 0.15, ease: 'easeIn' } }}
                            className="absolute bottom-0 right-full space-y-2 mr-9 w-64 rounded-xl bg-mist shadow-standard p-2 z-[100]"
                            style={{ pointerEvents: 'auto' }}
                        >
                            {menuContent}
                        </motion.div>
                    )}
                </AnimatePresence>
            );

    return (
        <div className="relative z-10 pointer-events-auto" ref={menuRef}>
            <button
                className="relative w-10 h-10 flex items-center justify-center p-3 rounded-full shadow-standard bg-mist cursor-pointer"
                onClick={() => setOpen(v => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Choose base map style"
                title="Choose base map style"
            >
                {satelliteLocked && (
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-0.75 -left-0.75 w-5 h-5"
                    >
                        <PremiumIconOutline currentColor="var(--color-heather)" />
                    </span>
                )}
                <div className="w-7 h-7">
                    <MapStyleIcon />
                </div>
            </button>
            {menu}
        </div>
    );
}

function Option({
    title,
    description,
    selected,
    onClick,
    children,
    locked = false,
}: {
    title: string;
    description: string;
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
    locked?: boolean;
}) {
    return (
        <button
            role="menuitemradio"
            aria-checked={selected}
            onClick={onClick}
            className={`w-full cursor-pointer flex items-center gap-4 p-2 rounded-lg text-left focus:outline-none transition duration-250 ease-in-out
                ${selected ? 'bg-pebble' : 'hover:bg-pebble'}`}
        >
            <div
                className="relative w-14 h-14 rounded-md overflow-hidden flex items-center justify-center transition-colors"
            >
                {children}
                {locked && (
                    <div className="absolute inset-0 bg-slate/45 flex flex-col items-center justify-center gap-1">
                        <div className="w-5 h-5">
                            <PremiumIconOutline currentColor="var(--color-heather)" />
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-1">
                <div className="text-xxl font-body-font-family text-slate mb-1">{title}</div>
                <div className="text-xl font-body-font-family text-moss">{description}</div>
            </div>
        </button>
    );
}

function PreviewTerrain() {
    return (
        <div
            className="w-full h-full bg-center bg-cover"
            style={{ backgroundImage: 'url(/images/mapstyleterrain.jpg)' }}
            aria-label="Terrain style preview"
        />
    );
}

function PreviewSatellite() {
    return (
        <div
            className="w-full h-full bg-center bg-cover"
            style={{ backgroundImage: 'url(/images/mapstylesatellite.jpg)' }}
            aria-label="Satellite style preview"
        />
    );
}