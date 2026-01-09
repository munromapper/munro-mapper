// src/app/explore/map/components/SidebarWrapperComponent.tsx
// This file contains the wrapper element for the sidebar element of the map page

'use client';
import React from 'react';
import { useMapState } from '@/contexts/MapStateContext';

interface SidebarWrapperComponentProps {
    children: React.ReactNode;
}

export default function SidebarWrapperComponent({
    children
}: SidebarWrapperComponentProps) {

    const { isMobileSidebarOpen } = useMapState();

    return (
        <div
            className={
                [
                    'pointer-events-auto',
                    'md:flex md:min-w-95 md:flex-0',
                    isMobileSidebarOpen
                        ? 'max-md:absolute max-md:inset-0 max-md:z-[240] max-md:flex max-md:w-full max-md:h-full'
                        : 'max-md:hidden',
                ].join(' ')
            }
        >
            {children}
        </div>
    );
}