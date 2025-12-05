'use client';
import { useEffect, useRef, useState } from 'react';
import { useMapState } from '@/contexts/MapStateContext';
import { AnimatePresence, motion } from 'framer-motion';
import { RouteLineIcon, PremiumIconOutline } from '@/components/global/SvgComponents';
import { useAuthContext } from '@/contexts/AuthContext';
import { createPortal } from 'react-dom';

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
        setOpen(false);
    };

    const is = (m: 'standard' | 'gradient' | 'hidden') => routeStyleMode === m;

    const menuContent = (
        <>
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
        </>
    );

    const menu =
        typeof window !== 'undefined' && window.innerWidth <= 1000
            ? createPortal(
                <AnimatePresence>
                    {open && (
                        <motion.div
                            key="route-style-menu-mobile"
                            role="menu"
                            aria-label="Route style options"
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
                            key="route-style-menu-desktop"
                            role="menu"
                            aria-label="Route style options"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } }}
                            exit={{ opacity: 0, y: -8, transition: { duration: 0.15, ease: 'easeIn' } }}
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
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Choose route style"
                title="Choose route style"
            >
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
                className="relative w-12 h-12 max-md:w-14 max-md:h-14 rounded-md overflow-hidden flex items-center justify-center transition-colors"
            >
                {children}
                {locked && (
                    <div className="absolute inset-0 bg-slate/45 flex flex-col items-center justify-center gap-1">
                        <div className="w-5 h-5 max-md:w-7 max-md:h-7">
                            <PremiumIconOutline currentColor="var(--color-heather)" />
                        </div>
                    </div>
                )}
            </div>
            <div className="flex-1">
                <div className="text-l max-md:text-xxl font-body-font-family text-slate mb-1">{title}</div>
                <div className="text-m max-md:text-xl font-body-font-family text-moss">{description}</div>
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