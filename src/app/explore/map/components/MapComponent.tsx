'use client';

import { useEffect, useRef, useState } from 'react';
import initialiseMap from '@/utils/initialiseMap';
import fetchMunroData from '@/utils/fetchMunroData';

export default function MapComponent() {

    const mapRef = useRef<HTMLDivElement | null>(null);
    const [munroData, setMunroData] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchMunroData();
            setMunroData(data);
        };

        loadData();
    }, []);

    useEffect(() => {
        if (!mapRef.current || munroData.length === 0) return;
        initialiseMap(mapRef.current, munroData, () => {
            console.log('Map loaded');
        })
    }, [munroData]);

    return (

        <div
          ref={mapRef}
          className="top-0 left-0 w-full h-full z-0"
        />
        
    );

}