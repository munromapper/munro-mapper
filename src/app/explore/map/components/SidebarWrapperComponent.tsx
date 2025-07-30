// src/app/explore/map/components/SidebarWrapperComponent.tsx
// This file contains the wrapper element for the sidebar element of the map page

'use client';
import React, { useState } from 'react';

interface SidebarWrapperComponentProps {
    children: React.ReactNode;
}

export default function SidebarWrapperComponent({
    children
}: SidebarWrapperComponentProps) {

    return (
        <div className="flex flex-col w-90">
            {children}
        </div>
    );
}