// src/app/explore/map/components/RouteStyleToggle.tsx
// Component to toggle between different route styles: standard, gradient, hidden

import { useEffect, useRef, useState } from 'react';
import { useMapState } from '@/contexts/MapStateContext';
import { AnimatePresence, motion } from 'framer-motion';
import { RouteLineIcon } from '@/components/global/SvgComponents';

export default function RouteStyleToggle() {
    const { routeStyleMode, setRouteStyleMode } = useMapState();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

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

    const selectMode = (mode: 'standard' | 'gradient' | 'hidden') => {
        setRouteStyleMode(mode);
    };

    const is = (m: 'standard' | 'gradient' | 'hidden') => routeStyleMode === m;

    return (
        <div className="absolute bottom-45 right-6 z-10 pointer-events-auto" ref={menuRef}>
            <button
                className="w-9 h-9 flex items-center justify-center p-2 rounded-full shadow-standard bg-mist"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Choose route style"
                title="Choose route style"
            >
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
                        className="absolute bottom-0 right-full mr-2 w-64 rounded-xl bg-white shadow-lg border border-slate-200 p-2"
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
                        >
                            <PreviewGradient />
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
}: {
    title: string;
    description: string;
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            role="menuitemradio"
            aria-checked={selected}
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left hover:bg-slate-50 focus:outline-none ${
                selected ? 'ring-2 ring-slate-300' : ''
            }`}
        >
            <div className="w-12 h-12 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center">
                {children}
            </div>
            <div className="flex-1">
                <div className="text-sm font-medium text-slate-900">{title}</div>
                <div className="text-xs text-slate-500">{description}</div>
            </div>
        </button>
    );
}

function PreviewStandard() {
    return (
        <div className="relative w-10 h-10">
            <div className="absolute left-1 right-1 top-1 bottom-1">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                    <path
                        d="M4 34 C 14 20, 26 28, 36 6"
                        stroke="#22c55e"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </div>
    );
}

function PreviewGradient() {
    return (
        <div className="relative w-10 h-10">
            <svg viewBox="0 0 40 40" className="w-full h-full">
                <defs>
                    <linearGradient id="gradLine" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#fde047" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>
                <path
                    d="M4 34 C 12 18, 26 28, 36 10"
                    stroke="url(#gradLine)"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
}

function PreviewHidden() {
    return <div className="w-8 h-8 bg-slate-200 rounded" />;
}