// src/utils/map/addMapMarker.ts
// This function adds a marker to the map for a given Munro

import type { Munro } from "@/types/data/dataTypes";
import { markerIconDefault, markerIconActive, markerIconBagged } from "@/components/global/SvgComponents";
import mapboxgl from "mapbox-gl";
import { mark } from "framer-motion/client";

interface CreateMapMarkerProps {
    munro: Munro
    isBagged?: boolean;
}

export function createMapMarker({
    munro,
    isBagged = false
}: CreateMapMarkerProps) {

    const markerDiv = document.createElement("div");
    markerDiv.className = "map-marker-base";
    markerDiv.innerHTML = `
        <span class="map-marker-active"></span>
    `;
    if (isBagged) {
        markerDiv.className="map-marker-base icon-bagged";
    }

    return new mapboxgl.Marker({ element: markerDiv }).setLngLat([munro.longitude, munro.latitude]);
}

interface AddMapMarkerProps {
    map: mapboxgl.Map;
    munro: Munro;
    isBagged?: boolean;
}

export function addMapMarker({
    map,
    munro,
    isBagged = false
}: AddMapMarkerProps) {
    const marker = createMapMarker({ munro, isBagged });
    const markerDiv = marker.getElement();
    markerDiv.classList.add("marker-enter");
    marker.addTo(map);

    markerDiv.addEventListener('animationend', () => {
        markerDiv.classList.remove("marker-enter");
    }, { once: true });

    return marker;
}

interface RemoveMapMarkerProps {
    munro: Munro;
    markerList: { [id: number]: mapboxgl.Marker };
}

export function removeMapMarker({
    munro,
    markerList
}: RemoveMapMarkerProps) {
    const marker = markerList[munro.id];
    if (!marker) return;

    const markerDiv = marker.getElement();
    markerDiv.classList.add("marker-exit");

    markerDiv.addEventListener('animationend', () => {
        marker.remove();
        delete markerList[munro.id];
    }, { once: true });
}
