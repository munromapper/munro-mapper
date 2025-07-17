// src/utils/markerUtils.ts
import mapboxgl from 'mapbox-gl';
import { Munro } from '@/types';
import { markerIconDefault, markerIconActive, hillIcon } from '@/SvgIcons'

export function createMunroMarker(
    munro: Munro, 
    onClick: (munro: Munro) => void,
){
    const defaultIcon = markerIconDefault;
    const activeIcon = markerIconActive;

    const marker = document.createElement('a');
    marker.href = `/explore/map/munro/${munro.slug || "slug-placeholder"}`;
    marker.setAttribute('aria-label', munro.name);
    marker.tabIndex = 0;
    marker.className = 'marker marker-enter';
    const markerInner = document.createElement('div');
    markerInner.className = 'marker-inner';
    markerInner.innerHTML = `
        <span class="icon-default-static">${defaultIcon}</span>
        <span class="icon-default">${defaultIcon}</span>
        <span class="icon-active">${activeIcon}</span>
    `;
    marker.appendChild(markerInner);

    // Remove entry class after animation
    marker.addEventListener('animationend', () => {
        marker.classList.remove('marker-enter');
    });

    // Hover effect
    marker.addEventListener('mouseenter', () => {
        marker.classList.add('marker-hover');
        marker.style.zIndex = '10';
        createPopup(marker, munro);
    });
    marker.addEventListener('mouseleave', () => {
        marker.classList.remove('marker-hover');
        marker.style.zIndex = '1';
        removePopupWithAnimation(marker);
    });

    // Click handler
    marker.addEventListener('click', () => onClick(munro));

    // For exit: before removing, add .marker-exit and wait for transitionend
    // (see below)

    return new mapboxgl.Marker({ element: marker }).setLngLat([munro.longitude, munro.latitude]);
}

export function removeMarkerWithAnimation(marker: mapboxgl.Marker) {
    const el = marker.getElement();
    el.classList.add('marker-exit');
    el.addEventListener('transitionend', () => {
        marker.remove();
    }, { once: true });
}

function createPopup(markerEl: HTMLAnchorElement, munro: Munro) {

    const popups = markerEl.querySelectorAll('.popup');
    popups.forEach(popup => popup.remove());

    const popup = document.createElement('div');
    popup.setAttribute('aria-label', `${munro.name} Popup`);
    popup.tabIndex = 0;
    popup.innerHTML = `
        <div class="popup-upper">
            <div class="popup-title">${munro.name}</div>
            <div class="popup-height-wrapper">
                <div class="popup-height-icon">
                    ${hillIcon}
                </div>
                <div class="popup-height">${munro.height | 1200}m</div>
            </div>
        </div>
        <div class="popup-region">${munro.region || 'Scotland'}</div>
    `
    markerEl.appendChild(popup);
    popup.className = 'popup popup-enter';

    popup.addEventListener('animationend', () => {
        popup.classList.remove('popup-enter');
        console.log("Popup animation ended, class removed");
    });
}

function removePopupWithAnimation(markerEl: HTMLAnchorElement) {
    const popup = markerEl.querySelector('.popup');
    if (popup) {
        popup.classList.add('popup-exit');
        popup.addEventListener('transitionend', () => {
            popup.remove();
        }, { once: true });
    }
}