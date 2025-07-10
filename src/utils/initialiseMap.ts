import mapboxgl from 'mapbox-gl'; // Importing mapbox functions
import 'mapbox-gl/dist/mapbox-gl.css'; // Importing mapbox default styles and css
import convertDataToGeoJSON from './convertDataToGeoJSON' // Importing our convertDataToGeoJSON utility function
import createMapMarker from './createMapMarker' // Importing our createMapMarker utility function

// Creating the function with three arguments - the map container, the data, and an onLoad return function (something that should happen when the function finishes running)
export default async function initialiseMap(
    mapContainer: HTMLDivElement,
    data: any[], 
    onLoad: () => void
) {

    if (!mapContainer) {
        throw new Error("Map container element not found."); // If there is no map container found, throw an error
    }

    // Mapbox Access Token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN; // Fetching the access token from environment variables
    
    // Creating the map element and defining its settings
    const map = new mapboxgl.Map({
        container: mapContainer,
        style: "mapbox://styles/munromapper/cmcxenw8j002x01sd1wrv9bm4", // Map Style URL
        center: [-4.5, 56.8], // Set Center Point
        zoom: 7.2, // Set Initial Zoom
        pitch: 45, // Set Initial Pitch
        bearing: -10, // Set Initial Bearing
        antialias: true, // Enable Antialiasing
    });

    // Run all the below functions when the map has finished setting up
    map.on('load', async () => {

        // Adding Map Controls
        map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

        // Running the utility function to convert the raw data inputted to the function to a geoJSON for Mapbox to parse
        const geoJsonData = convertDataToGeoJSON(data);

        // Adding the new geoJSON data as a data source on the map
        map.addSource('munros', {
            type: 'geojson',
            data: geoJsonData
        });

        // Running the createMapMarker function for each feature in the geoJSON data, creating our markers
        geoJsonData.features.forEach((feature) => {
            createMapMarker(map, feature);
        })

        // Running the onload function to let the whole function know it completed successfully, and to run the function set as the argument
        onLoad();

    });

    // Return the map, with the added markers as the final product of the function
    return map;

}