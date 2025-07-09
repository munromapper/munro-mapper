import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getSupabaseClient } from './supabaseClient'
import type {Feature, FeatureCollection, Point, GeoJsonProperties} from 'geojson';
import createMapMarker from './createMapMarker'

const supabase = getSupabaseClient()

export default async function initialiseMap(
    mapContainer: HTMLElement,
    onDataLoaded: (features: Feature<Point, GeoJsonProperties>[]) => void
): Promise<mapboxgl.Map> {

    if (!mapContainer) {
        throw new Error("Map container element not found.");
    }

    // Mapbox Access Token
    mapboxgl.accessToken = "pk.eyJ1IjoiYWV2ZXJpbmd0b24iLCJhIjoiY21jcDdrMHFwMDJ2MjJsczkzMTRxNGdtOCJ9.KSLf0LeHGYWKxcorh_TnEQ";
    
    const map = new mapboxgl.Map({
        container: mapContainer,
        style: "mapbox://styles/aeverington/cmcp8a59502hf01s26z4k4vvh", // Map Style URL
        center: [-4.5, 56.8], // Set Center Point
        zoom: 7.2, // Set Initial Zoom
        pitch: 45, // Set Initial Pitch
        bearing: -10, // Set Initial Bearing
        antialias: true, // Enable Antialiasing
    });

    // Adding Map Controls
    map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

    const {data, error} = await supabase.from('munros').select('*');
    if (error || !data || data.length === 0) {
        console.error('Error or empty data:', error?.message);
        return map;
    } else {
        console.log('Munro data:', data)
    }

    const features: Feature<Point, GeoJsonProperties>[] = data.map((row) => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [row.longitude, row.latitude]
        },
        properties: {...row}
    }));

    const geojsonData: FeatureCollection<Point, GeoJsonProperties> = {
        type: 'FeatureCollection',
        features
    };

    map.on('load', () => {

        map.addSource('munros', {
            type: 'geojson',
            data: geojsonData
        });

        features.forEach((feature) => {
            createMapMarker(map, feature);
        })

        onDataLoaded(features);

    });

    return map;

}