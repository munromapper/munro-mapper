// src/app/explore/map/components/SidebarComponent.tsx
import React from 'react';

type SidebarComponentProps = {
  children?: React.ReactNode;
};

export function SidebarComponent({ children }: SidebarComponentProps) {
    return(
        <div className="h-full w-100 bg-mist rounded-xl" aria-label="Map Munro List Sidebar">
            {children}
        </div>
    )
}