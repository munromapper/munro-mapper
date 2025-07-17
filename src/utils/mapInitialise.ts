// src/utils/mapInitialise.ts
import mapboxgl from 'mapbox-gl'

export function mapInitialise(
    mapRef: HTMLDivElement | null,
    setError: React.Dispatch<React.SetStateAction<string | null>>
    ): mapboxgl.Map | undefined {

    if (!mapRef) {
         setError("No map container reference found!");
        return;
    }

    try {
        let accessToken = mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
        if (!accessToken) {
            setError("Mapbox access token is missing. Set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment.");
            return
        }

        let map = new mapboxgl.Map({
            container: mapRef,
            style: 'mapbox://styles/munromapper/cmcxenw8j002x01sd1wrv9bm4',
            center: [-4.5, 56.8],
            zoom: 7.2,
            pitch: 45,
            bearing: -10,
            antialias: true,
        });

        const mapControls = new mapboxgl.NavigationControl({
            showCompass: true,
            showZoom: true,
            visualizePitch: true
        });

        map.addControl(mapControls, 'bottom-right');

        map.on('error', (e) => {
            setError("An error occurred loading the map. Please try again later.");
            if (e && e.error) {
                console.error("Map error:", e.error);
            }
        })

        return map;

    } catch(err) {
        setError("An unexpected error occurred loading the map.");
        console.error("MapComponent error:", err);
    }

}