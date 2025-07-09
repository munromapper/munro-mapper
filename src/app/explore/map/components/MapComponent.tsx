'use client';

import { useEffect, useRef, useState } from 'react';
import initialiseMap from '@/utils/initialiseMap';


export default function MapComponent() {

    const mapRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mapRef.current) return;
        
        initialiseMap(mapRef.current, () => {
        console.log('Map loaded');
        });
    }, []);

    return (

        <div
          ref={mapRef}
          className="top-0 left-0 w-full h-full z-0"
        />
        
    );

}