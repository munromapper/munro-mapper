// src/utils/map/initialiseMap.ts
// This file contains the logic to initialize the map for the 'map view' page in the 'explore' section of the application

import mapboxgl from 'mapbox-gl'

interface InitialiseMapParams {
    mapContainer: HTMLDivElement | null;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export function initialiseMap({
    mapContainer,
    setLoading,
    setError
}: InitialiseMapParams) {
    if (!mapContainer) return;

    setLoading(true);
    setError(null);

    try {
        const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        if (!accessToken) {
            setError('Mapbox access token unavailable.');
            setLoading(false);
            return;
        }
        mapboxgl.accessToken = accessToken;

        const map = new mapboxgl.Map({
            container: mapContainer,
            style: 'mapbox://styles/munromapper/cmcxenw8j002x01sd1wrv9bm4',
            center: [-4.5, 56.8],
            zoom: 7.2,
            pitch: 45,
            bearing: -10,
            antialias: true,
        })

        const mapControls = new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true
        });

        map.addControl(mapControls, 'bottom-right');

        map.on('error', (e) => {
            setError("An error occurred loading the map. Please try again later.");
            setLoading(false);
            return;
        })

        map.on('load', () => {
            setLoading(false);
        });
        
        return map;
    } catch (error) {
        setError("An error occurred initializing the map. Please try again later.");
        setLoading(false);
        return null;
    }
    
}