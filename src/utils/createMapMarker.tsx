import mapboxgl from "mapbox-gl" // Importing Mapbox
import type { Feature, Point, GeoJsonProperties } from "geojson"; // Importing GeoJSON variable types
import ReactDOM from "react-dom/client"; // Importing ReactDOM to manipulate DOM elements
import MapMarker from "../app/explore/map/components/MapMarker"; // Importing the custom MapMarker Component

// Creating the function with the arguments; a map, and a feature. The function should return a mapboxgl.marker
export default function createMapMarker(
    map: mapboxgl.Map,
    feature: Feature<Point, GeoJsonProperties>
): mapboxgl.Marker {

    const container = document.createElement("div"); // Creating our marker container

    const root = ReactDOM.createRoot(container); // Tells react that we can render inside this element
    root.render(<MapMarker />); // Tells react to render the MapMarker component inside the element we just defined

    const [lng, lat] = feature.geometry.coordinates; // Fetches the longitude and latitude values from the inputted feature

    return new mapboxgl.Marker(container).setLngLat([lng, lat]).addTo(map); // Returns the new marker, created using our new react rendered container, with the longitude and latitude values set, and adds it to the map

};
