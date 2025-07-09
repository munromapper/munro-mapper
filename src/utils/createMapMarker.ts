import mapboxgl from "mapbox-gl"
import type { Feature, Point, GeoJsonProperties } from "geojson";

export default function createMapMarker(
    map: mapboxgl.Map,
    feature: Feature<Point, GeoJsonProperties>
): mapboxgl.Marker {

    const coordinates = feature.geometry.coordinates;
    const {hillName} = feature.properties || {};

    const marker = document.createElement("div");
    marker.classList.add("map-marker");

    const markerInner = document.createElement("div");
    markerInner.classList.add("map-marker-icon");
    marker.appendChild(markerInner);

    marker.onmouseenter = () => {
        if (!markerInner.classList.contains("map-marker-focused")) {
        markerInner.classList.add("map-marker-active");
        }
    }

    marker.onmouseleave = () => {
        if (!markerInner.classList.contains("map-marker-focused")) {
        markerInner.classList.remove("map-marker-active");
        }
    }

    marker.onclick = () => {
        markerInner.classList.toggle("map-marker-focused");
        console.log("Clicked marker:", hillName);
    };

    const newMarker = new mapboxgl.Marker(marker)
        .setLngLat(coordinates as [number, number])
        .addTo(map);

    return newMarker;

    };
