// src/utils/mapUtils.ts
// src/utils/mapUtils.ts

import mapboxgl from 'mapbox-gl';
import { Munro } from '@/types';

/**
 * Returns true if the map is "off-center" from the selected Munro.
 * @param map Mapbox map instance
 * @param munro Munro to check against
 * @param zoomTarget Target zoom level (default 13)
 * @param centerThreshold How far (in degrees) is considered "off" (default 0.01)
 * @param zoomThreshold How far (in zoom) is considered "off" (default 0.5)
 */
export function isMapOffCenter(
    map: mapboxgl.Map | undefined,
    munro: Munro | null | undefined,
    zoomTarget = 13,
    centerThreshold = 0.01,
    zoomThreshold = 0.5
): boolean {
    if (!map || !munro) return false;
    const center = map.getCenter();
    const zoom = map.getZoom();
    const dist = Math.sqrt(
        Math.pow(center.lng - munro.longitude, 2) +
        Math.pow(center.lat - munro.latitude, 2)
    );
    return dist > centerThreshold || Math.abs(zoom - zoomTarget) > zoomThreshold;
}

/**
 * Recenters the map on the given Munro.
 * @param map Mapbox map instance
 * @param munro Munro to center on
 * @param zoom Zoom level (default 13)
 */
export function recenterMapOnMunro(
    map: mapboxgl.Map | undefined,
    munro: Munro | null | undefined,
    zoom = 13
) {
  if (!map || !munro) return;
  map.easeTo({
    center: [munro.longitude, munro.latitude],
    zoom,
    duration: 2000,
    essential: true,
  });
}
