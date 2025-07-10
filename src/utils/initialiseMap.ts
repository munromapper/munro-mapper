import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import convertDataToGeoJSON from './convertDataToGeoJSON'
import createMapMarker from './createMapMarker'

export default async function initialiseMap(
    mapContainer: HTMLDivElement,
    data: any[], // eventually replace `any` with a Munro type
    onLoad: () => void
) {

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

    map.on('load', async () => {

        // Adding Map Controls
        map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

        const geoJsonData = convertDataToGeoJSON(data);

        map.addSource('munros', {
            type: 'geojson',
            data: geoJsonData
        });

        geoJsonData.features.forEach((feature) => {
            createMapMarker(map, feature);
        })

        onLoad();

    });

    return map;

}