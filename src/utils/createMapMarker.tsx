import mapboxgl from "mapbox-gl"
import type { Feature, Point, GeoJsonProperties } from "geojson";
import ReactDOM from "react-dom/client";
import MapMarker from "../app/explore/map/components/MapMarker";

export default function createMapMarker(
    map: mapboxgl.Map,
    feature: Feature<Point, GeoJsonProperties>
): mapboxgl.Marker {

    const container = document.createElement("div");

    const root = ReactDOM.createRoot(container);
    root.render(<MapMarker />);

    const [lng, lat] = feature.geometry.coordinates;

    return new mapboxgl.Marker(container).setLngLat([lng, lat]).addTo(map);

};
