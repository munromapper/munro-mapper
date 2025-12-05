// src/hooks/useMapMarkers.ts
// This hook provides functions to create, add, remove, and manage map markers for Munros

import { useCallback } from "react";
import type { Munro } from "@/types/data/dataTypes";
import { mapMarker, HillIcon } from "@/components/global/SvgComponents";
import mapboxgl from "mapbox-gl";
import { useRouter } from 'next/navigation';

interface UseMapMarkersProps {
    userAscentUnits: 'm' | 'ft';
}

export default function useMapMarkers({
    userAscentUnits
}: UseMapMarkersProps) {

    const router = useRouter();

    // Treat ≤1000px as mobile
    const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 1000;

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

        return new mapboxgl.Marker(marker)
            .setLngLat([munro.longitude, munro.latitude]);
    }

    interface AddMapMarkerProps {
        map: mapboxgl.Map;
        munro: Munro;
        isBagged?: boolean;
    }

    function addMapMarker({
        map,
        munro,
        isBagged = false,
        setHoveredMunro,
        setActiveMunro
    }: AddMapMarkerProps & {
        setHoveredMunro: (munro: Munro | null) => void;
        setActiveMunro: (munro: Munro | null) => void;
    })  {
        const marker = createMapMarker({ munro, isBagged });
        const markerDiv = marker.getElement();
        const markerInner = markerDiv.querySelector('.marker-inner');
        markerInner?.classList.add("marker-enter");
        marker.addTo(map);

        markerDiv.addEventListener('animationend', () => {
            markerInner?.classList.remove("marker-enter");
        }, { once: true });

        // Disable hover interactions on mobile
        if (!isMobile()) {
            markerDiv.addEventListener('mouseenter', () => {
                setHoveredMunro(munro);
            });
            markerDiv.addEventListener('mouseleave', () => {
                setHoveredMunro(null);
            });
        }

        // Click navigates to munro detail (works on both mobile and desktop)
        markerDiv.addEventListener('click', () => {
            router.push(`/explore/map/munro/${munro.slug}`);
        });

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

        setTimeout(() => {
            if (markerDiv.parentNode) {
                marker.remove();
            }
        }, 400);
    }

    function setMarkerSelected(marker: mapboxgl.Marker, isSelected: boolean) {
        const el = marker.getElement();
        if (isSelected) {
            el.classList.add('marker-selected');
        } else {
            el.classList.remove('marker-selected');
        }
    }

    // No-op on mobile: suppress popup creation completely
    const createPopup = useCallback((markerEl: HTMLElement, munro: Munro) => {
        if (isMobile()) return;

        const popups = markerEl.querySelectorAll('.popup');
        popups.forEach(popup => {
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
        `;
        markerEl.appendChild(popup);
        popup.className = 'popup popup-enter';

        popup.addEventListener('animationend', () => {
            popup.classList.remove('popup-enter');
        });
    }, [userAscentUnits]);

    const removePopup = useCallback((markerEl: HTMLElement) => {
        const popups = markerEl.querySelectorAll('.popup');
        popups.forEach(popup => {
            if (!popup.classList.contains('popup-exit')) {
                popup.classList.add('popup-exit');
                popup.addEventListener('animationend', () => {
                    popup.remove();
                }, { once: true });
            }
        });
    }, []);

    return {
        addMapMarker,
        removeMapMarker,
        setMarkerSelected,
        updateMarkersSelection: (
            markerMap: Map<number, mapboxgl.Marker>, 
            selectedMunroId: number | null
        ) => {
            markerMap.forEach((marker, id) => {
                setMarkerSelected(marker, id === selectedMunroId);
            });
        },
        createPopup,
        removePopup
    };

}