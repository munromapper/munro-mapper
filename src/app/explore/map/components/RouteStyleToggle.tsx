// src/app/explore/map/components/RouteStyleToggle.tsx
// Component to toggle between different route styles: standard, gradient, hidden

import { use, useEffect, useRef, useState } from 'react';
import { useMapState } from '@/contexts/MapStateContext';
import { AnimatePresence, motion } from 'framer-motion';
import { RouteLineIcon, PremiumIconOutline } from '@/components/global/SvgComponents';
import { useAuthContext } from '@/contexts/AuthContext';

export default function RouteStyleToggle() {
    const { routeStyleMode, setRouteStyleMode } = useMapState();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { user, userProfile, openPremiumAdModal } = useAuthContext();

    const isPremium = !!user && ['active', 'canceling'].includes(userProfile?.isPremium ?? '');
    const gradientLocked = !isPremium;

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target as Node)) setOpen(false);
        };
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onDocClick);
        document.addEventListener('keydown', onEsc);
        return () => {
            document.removeEventListener('mousedown', onDocClick);
            document.removeEventListener('keydown', onEsc);
        };
    }, []);

    useEffect(() => {
        if (gradientLocked && routeStyleMode === 'gradient') {
            setRouteStyleMode('standard');
        }
    }, [gradientLocked, routeStyleMode, setRouteStyleMode]);

    const selectMode = (mode: 'standard' | 'gradient' | 'hidden') => {
        if (mode === 'gradient' && gradientLocked) {
            openPremiumAdModal();
            return;
        }
        setRouteStyleMode(mode);
    };

    const is = (m: 'standard' | 'gradient' | 'hidden') => routeStyleMode === m;

    return (
        <div className="relative z-10 pointer-events-auto" ref={menuRef}>
            <button
                className="relative w-10 h-10 flex items-center justify-center p-3 rounded-full shadow-standard bg-mist cursor-pointer"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Choose route style"
                title="Choose route style"
            >
                {/* Premium badge (non‑premium users only) */}
                {gradientLocked && (
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-0.75 -left-0.75 w-5 h-5"
                    >
                        <PremiumIconOutline currentColor="var(--color-heather)" />
                    </span>
                )}
                <div className="w-7 h-7">
                    <RouteLineIcon />
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="route-style-menu"
                        role="menu"
                        aria-label="Route style options"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
                        exit={{ opacity: 0, y: 8, transition: { duration: 0.15, ease: 'easeIn' } }}
                        className="absolute bottom-0 right-full mr-9 w-64 rounded-xl bg-mist shadow-standard p-2"
                    >
                        <Option
                            title="Standard"
                            description="Single color route display"
                            selected={is('standard')}
                            onClick={() => selectMode('standard')}
                        >
                            <PreviewStandard />
                        </Option>

                        <Option
                            title="Gradient"
                            description="Colored by slope gradient"
                            selected={is('gradient')}
                            onClick={() => selectMode('gradient')}
                            locked={gradientLocked}
                        >
                            <PreviewGradient locked={gradientLocked} />
                        </Option>

                        <Option
                            title="Hidden"
                            description="Turn off all route lines"
                            selected={is('hidden')}
                            onClick={() => selectMode('hidden')}
                        >
                            <PreviewHidden />
                        </Option>
                    </motion.div>
                )}
            </AnimatePresence>
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
            className="w-full cursor-pointer flex items-center gap-4 p-2 rounded-lg text-left hover:bg-pebble focus:outline-none transition duration-250 ease-in-out"
        >
            <div
                className={`relative w-12 h-12 rounded-md overflow-hidden flex items-center justify-center border-2 transition-colors
                    ${selected ? 'border-slate' : 'border-transparent'}`}
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
                <div className="text-l font-body-font-family text-slate mb-1">{title}</div>
                <div className="text-m font-body-font-family text-moss">{description}</div>
            </div>
        </button>
    );
}

function PreviewStandard() {
    return (
        <div
            className="w-full h-full bg-center bg-cover"
            style={{ backgroundImage: 'url(/images/linestylestandard.jpg)' }}
            aria-label="Standard route style preview"
        />
    );
}

function PreviewGradient({ locked }: { locked?: boolean }) {
    return (
        <div
            className="w-full h-full bg-center bg-cover"
            style={{ backgroundImage: 'url(/images/linestylegradient.jpg)' }}
            aria-label="Gradient route style preview"
        />
    );
}

function PreviewHidden() {
    return (
        <div
            className="w-full h-full bg-center bg-cover"
            style={{ backgroundImage: 'url(/images/linestylenone.jpg)' }}
            aria-label="Hidden route style preview"
        />
    );
}