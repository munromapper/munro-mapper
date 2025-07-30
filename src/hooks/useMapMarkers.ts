// src/hooks/useMapMarkers.ts
// This hook provides functions to create, add, remove, and manage map markers for Munros

import type { Munro } from "@/types/data/dataTypes";
import { mapMarker, HillIcon } from "@/components/global/SvgComponents";
import mapboxgl from "mapbox-gl";

interface UseMapMarkersProps {
    userAscentUnits: 'm' | 'ft';
}

export default function useMapMarkers({
    userAscentUnits
}: UseMapMarkersProps) {

    interface CreateMapMarkerProps {
        munro: Munro
        isBagged?: boolean;
    }

    function createMapMarker({
        munro,
        isBagged = false
    }: CreateMapMarkerProps) {

        const marker = document.createElement('div');
        marker.setAttribute('aria-label', munro.name);
        marker.tabIndex = 0;
        marker.className = 'marker marker-enter' + (isBagged ? ' is-bagged' : '');
        const markerInner = document.createElement('div');
        markerInner.className = 'marker-inner';
        markerInner.innerHTML = `<span class="icon-marker">${mapMarker}</span>`;
        marker.appendChild(markerInner);

        marker.addEventListener('animationend', () => {
            marker.classList.remove('marker-enter');
        });

        marker.addEventListener('mouseenter', () => {
            marker.classList.add('marker-hover');
            createPopup(marker, munro);
        });
        marker.addEventListener('mouseleave', () => {
            marker.classList.remove('marker-hover');
            removePopup(marker);
        });

        return new mapboxgl.Marker({ element: marker }).setLngLat([munro.longitude, munro.latitude]);
    }

    interface AddMapMarkerProps {
        map: mapboxgl.Map;
        munro: Munro;
        isBagged?: boolean;
    }

    function addMapMarker({
        map,
        munro,
        isBagged = false
    }: AddMapMarkerProps) {
        const marker = createMapMarker({ munro, isBagged });
        const markerDiv = marker.getElement();
        const markerInner = markerDiv.querySelector('.map-marker-inner');
        markerInner?.classList.add("marker-enter");
        marker.addTo(map);

        markerDiv.addEventListener('animationend', () => {
            markerInner?.classList.remove("marker-enter");
        }, { once: true });

        return marker;
    }

    interface RemoveMapMarkerProps {
        marker: mapboxgl.Marker;
    }

    function removeMapMarker({
        marker
    }: RemoveMapMarkerProps) {
        if (!marker || !marker.getElement()) return;

        const markerDiv = marker.getElement();
        markerDiv.classList.add("marker-exit");

        markerDiv.addEventListener('animationend', () => {
            marker.remove();
        }, { once: true });
    }

    function setMarkerSelected(marker: mapboxgl.Marker, isSelected: boolean) {
        const el = marker.getElement();
        if (isSelected) {
            el.classList.add('marker-selected');
        } else {
            el.classList.remove('marker-selected');
        }
    }

    function updateMarkersSelection(
        markerMap: Map<number, mapboxgl.Marker>, 
        selectedMunroId: number | null
    ) {
        for (const [munroId, marker] of markerMap.entries()) {
            setMarkerSelected(marker, munroId === selectedMunroId);
        }
    }

    function createPopup(markerEl: HTMLElement, munro: Munro) {

        const popups = markerEl.querySelectorAll('.popup');
        popups.forEach(popup => {
            // Only add exit class if not already exiting
            if (!popup.classList.contains('popup-exit')) {
                popup.classList.add('popup-exit');
                popup.addEventListener('animationend', () => {
                    popup.remove();
                }, { once: true });
            }
        });

        const popup = document.createElement('div');
        popup.setAttribute('aria-label', `${munro.name} Popup`);
        popup.tabIndex = 0;
        popup.innerHTML = `
            <div class="popup-upper">
                <div class="popup-title">${munro.name}</div>
                <div class="popup-height-wrapper">
                    <div class="popup-height-icon">
                        ${HillIcon}
                    </div>
                    <div class="popup-height">${munro.height}${userAscentUnits || 'm'}</div>
                </div>
            </div>
            <div class="popup-region">${munro.region || 'Scotland'}</div>
        `
        markerEl.appendChild(popup);
        popup.className = 'popup popup-enter';

        popup.addEventListener('animationend', () => {
            popup.classList.remove('popup-enter');
        });
    }

    function removePopup(markerEl: HTMLElement) {
        const popups = markerEl.querySelectorAll('.popup');
        popups.forEach(popup => {
            if (!popup.classList.contains('popup-exit')) {
                popup.classList.add('popup-exit');
                popup.addEventListener('animationend', () => {
                    popup.remove();
                }, { once: true });
            }
        });
    }

    return {
        addMapMarker,
        removeMapMarker,
        setMarkerSelected,
        updateMarkersSelection,
    };

}
