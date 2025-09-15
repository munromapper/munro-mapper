'use client';
import React, { useRef, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import type { LineString } from 'geojson';

import { useMapState } from "@/contexts/MapStateContext";
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import useMapMarkers from '@/hooks/useMapMarkers';
import useGpxRoutes from '@/hooks/useGpxRoutes';
import useMapNavigation from '@/hooks/useMapNavigation';
import initialiseMap from '@/utils/map/initialiseMap';
import { RecenterButton } from './RecenterButton';
import RouteStyleToggle from './RouteStyleToggle';

export default function MapComponent() {
    const { 
        map, 
        setMap,
        routeMunroLinks,
        routes, 
        filteredMunros, 
        markerList,
        hoveredMunro,
        setHoveredMunro,
        activeMunro,
        setActiveMunro,
        userAscentUnits, 
        setMarkerList, 
        setLoading, 
        setError,
        routeStyleMode 
    } = useMapState();

    const { userBaggedMunros } = useBaggedMunroContext();
    const { 
        addMapMarker, 
        removeMapMarker,
        setMarkerSelected,
        createPopup,
        removePopup 
    } = useMapMarkers({ userAscentUnits });

    const {
        fetchAndCacheGeoJson,
        addRouteToMap,
        removeRouteFromMap,
    } = useGpxRoutes();

    const mapRef = useRef<HTMLDivElement | null>(null);

    // Track which layers we have created for "selected" so we can remove them reliably.
    const selectedLayerIdsRef = useRef<Set<string>>(new Set());

    // Track the last hovered munro id for cleanup.
    const latestHoveredId = useRef<number | null>(null);
    const prevHoveredMarkerId = useRef<number | null>(null);

    const { initialZoomDone, offCenter, recenter  } = useMapNavigation({
        map,
        activeMunro,
        zoom: 13,
        centerThreshold: 0.01,
        zoomThreshold: 0.5,
        animationDuration: 2000,
    });

    const hoverPopupRef = useRef<mapboxgl.Popup | null>(null);

    // Init map
    useEffect(() => {
        if (!mapRef.current) return;
        const m = initialiseMap({
            mapContainer: mapRef.current,
            setLoading,
            setError
        });
        if (m) setMap(m);
        else setError("Failed to initialize map");
    }, [mapRef, setMap, setError, setLoading]);

    // Add markers for filtered munros
    useEffect(() => {
        if (!map) return;

        Object.values(markerList).forEach(marker => removeMapMarker({ marker }));
        setMarkerList({});

        const newMarkers: { [id: number]: mapboxgl.Marker } = {};
        filteredMunros?.forEach(munro => {
            const isBagged = userBaggedMunros.includes(munro.id);
            const marker = addMapMarker({ map, munro, isBagged, setHoveredMunro, setActiveMunro });
            newMarkers[munro.id] = marker;
        });
        setMarkerList(newMarkers);
    }, [map, filteredMunros, userBaggedMunros]);

    // Hovered routes (single owner + cancellation + hide non-current hovered quickly)
    useEffect(() => {
        if (!map) return;

        // If no hovered, or hidden mode, or hovering the active munro, hide any hovered routes and exit
        if (!hoveredMunro || routeStyleMode === 'hidden' || (activeMunro && hoveredMunro.id === activeMunro.id)) {
            if (latestHoveredId.current != null) {
                const oldLinks = routeMunroLinks.filter(link => link.munroId === latestHoveredId.current!);
                oldLinks.forEach(link => removeRouteFromMap(map, `${link.routeId}-hovered`));
                latestHoveredId.current = null;
            }
            return;
        }

        const currentHoverId = hoveredMunro.id;
        latestHoveredId.current = currentHoverId;

        // Proactively hide hovered routes from any other munro
        routeMunroLinks.forEach(link => {
            if (link.munroId !== currentHoverId) {
                removeRouteFromMap(map, `${link.routeId}-hovered`);
            }
        });

        let cancelled = false;
        const links = routeMunroLinks.filter(link => link.munroId === currentHoverId);

        (async () => {
            for (const link of links) {
                const route = routes.find(r => r.id === link.routeId);
                if (route && route.gpxFile) {
                    const geojson = await fetchAndCacheGeoJson(route.id, route.gpxFile);
                    if (!cancelled && latestHoveredId.current === currentHoverId) {
                        addRouteToMap(map, geojson, `${route.id}-hovered`, { color: "#686F68", width: 2, opacity: 0.7 });
                    }
                }
            }
        })();

        return () => {
            cancelled = true;
            const clinks = routeMunroLinks.filter(link => link.munroId === currentHoverId);
            clinks.forEach(link => removeRouteFromMap(map, `${link.routeId}-hovered`));
        };
    }, [map, hoveredMunro, activeMunro, routeStyleMode, routeMunroLinks, routes, addRouteToMap, removeRouteFromMap, fetchAndCacheGeoJson]);

    // Selected routes — deterministic cleanup using a registry
    useEffect(() => {
        if (!map) return;

        // Utility to clear all selected layers
        const clearAllSelected = () => {
            for (const id of Array.from(selectedLayerIdsRef.current)) {
                removeRouteFromMap(map, id);
                selectedLayerIdsRef.current.delete(id);
            }
        };

        // Utility to clear all hovered layers
        const clearAllHovered = () => {
            routeMunroLinks.forEach(link => {
                removeRouteFromMap(map, `${link.routeId}-hovered`);
            });
            latestHoveredId.current = null;
        };

        let cancelled = false;

        const nextId = activeMunro?.id ?? null;
        const activeVisible = nextId != null && (filteredMunros?.some(m => m.id === nextId) || false);

        // If no selection, style hidden, or selected munro filtered out -> remove everything we own
        if (!nextId || routeStyleMode === 'hidden' || !activeVisible) {
            clearAllSelected();
            clearAllHovered();
            return;
        }

        // Build desired set for the current selection
        const desiredLinks = routeMunroLinks.filter(link => link.munroId === nextId);
        const desiredIds = new Set(desiredLinks.map(l => `${l.routeId}-selected`));

        // Remove any previously-added selected layers that are no longer desired
        for (const id of Array.from(selectedLayerIdsRef.current)) {
            if (!desiredIds.has(id)) {
                removeRouteFromMap(map, id);
                selectedLayerIdsRef.current.delete(id);
            }
        }

        // Add/update selected routes for the active munro
        (async () => {
            for (const link of desiredLinks) {
                if (cancelled) return;
                const id = `${link.routeId}-selected`;
                const route = routes.find(r => r.id === link.routeId);
                if (!route || !route.gpxFile) continue;

                const geojson = await fetchAndCacheGeoJson(route.id, route.gpxFile);
                if (cancelled) return;
                addRouteToMap(map, geojson, id, { color: "#E1FF9E", width: 4, opacity: 1 });
                selectedLayerIdsRef.current.add(id);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [map, activeMunro, routeStyleMode, filteredMunros, routeMunroLinks, routes, addRouteToMap, removeRouteFromMap, fetchAndCacheGeoJson]);

    // Marker selected CSS
    useEffect(() => {
        Object.values(markerList).forEach(marker => setMarkerSelected(marker, false));
        if (activeMunro && markerList[activeMunro.id]) {
            setMarkerSelected(markerList[activeMunro.id], true);
        }
    }, [activeMunro, markerList, setMarkerSelected]);

    // Hover popup control (delta updates only to avoid flicker)
    useEffect(() => {
        if (prevHoveredMarkerId.current != null) {
            const prevMarker = markerList[prevHoveredMarkerId.current];
            if (prevMarker) {
                const el = prevMarker.getElement();
                el.classList.remove("marker-hover");
                removePopup(el);
            }
        }

        if (hoveredMunro && markerList[hoveredMunro.id]) {
            const el = markerList[hoveredMunro.id].getElement();
            el.classList.add("marker-hover");
            createPopup(el, hoveredMunro);
            prevHoveredMarkerId.current = hoveredMunro.id;
        } else {
            prevHoveredMarkerId.current = null;
        }
    }, [hoveredMunro, markerList, createPopup, removePopup]);

    // Clear hovered when selecting a munro
    useEffect(() => {
        if (activeMunro) setHoveredMunro(null);
    }, [activeMunro, setHoveredMunro]);

    // Utility for gradient hover snapping
    const nearestOnSegmentPx = useCallback((map: mapboxgl.Map, mouse: mapboxgl.Point, a: [number, number], b: [number, number]) => {
        const A = map.project({ lng: a[0], lat: a[1] });
        const B = map.project({ lng: b[0], lat: b[1] });
        const APx = { x: mouse.x - A.x, y: mouse.y - A.y };
        const AB = { x: B.x - A.x, y: B.y - A.y };
        const ab2 = AB.x * AB.x + AB.y * AB.y || 1;
        let t = (APx.x * AB.x + APx.y * AB.y) / ab2;
        t = Math.max(0, Math.min(1, t));
        const Q = { x: A.x + AB.x * t, y: A.y + AB.y * t };
        const dx = Q.x - mouse.x, dy = Q.y - mouse.y;
        const distPx = Math.hypot(dx, dy);
        const lngLat = map.unproject([Q.x, Q.y]);
        return { lngLat, distPx };
    }, []);

    // Gradient: show a small hover point + popup over selected routes only
    useEffect(() => {
        if (!map) return;

        const addHoverArtifacts = () => {
            if (!map.getSource('route-hover-point')) {
                map.addSource('route-hover-point', {
                    type: 'geojson',
                    data: { type: 'FeatureCollection', features: [] }
                });
            }
            if (!map.getLayer('route-hover-point-layer')) {
                map.addLayer({
                    id: 'route-hover-point-layer',
                    type: 'circle',
                    source: 'route-hover-point',
                    paint: {
                        'circle-radius': 5,
                        'circle-color': '#111111',
                        'circle-stroke-color': '#FFFFFF',
                        'circle-stroke-width': 2
                    },
                    layout: { 'visibility': 'none' }
                });
            }
        };

        if (map.isStyleLoaded()) {
            addHoverArtifacts();
        } else {
            const addOnce = () => addHoverArtifacts();
            map.once('load', addOnce);
            map.once('style.load', addOnce);
        }
        map.on('style.load', addHoverArtifacts);

        if (!hoverPopupRef.current) {
            hoverPopupRef.current = new mapboxgl.Popup({
                className: 'route-gradient-popup',
                closeButton: false,
                closeOnClick: false,
                offset: 10
            });
        }

        const hideHover = () => {
            if (map.getLayer('route-hover-point-layer')) {
                map.setLayoutProperty('route-hover-point-layer', 'visibility', 'none');
            }
            map.getCanvas().style.cursor = '';
            hoverPopupRef.current?.remove();
        };

        const onMove = (e: mapboxgl.MapMouseEvent) => {
            if (!map) return;

            if (routeStyleMode !== 'gradient' || !activeMunro) {
                hideHover();
                return;
            }

            const selectedRouteLayerIds = routeMunroLinks
                .filter(l => l.munroId === activeMunro.id)
                .map(l => `${l.routeId}-selected`)
                .filter(id => !!map.getLayer(id));

            if (!selectedRouteLayerIds.length) {
                hideHover();
                return;
            }

            const px = e.point;
            const queryRadiusPx = 14;
            const maxSnapDistPx = 20;

            const bbox: [mapboxgl.PointLike, mapboxgl.PointLike] = [
                [px.x - queryRadiusPx, px.y - queryRadiusPx],
                [px.x + queryRadiusPx, px.y + queryRadiusPx]
            ];

            const feats = map
                .queryRenderedFeatures([bbox[0], bbox[1]], { layers: selectedRouteLayerIds as string[] })
                .filter(f => f.geometry.type === 'LineString' && typeof (f.properties as any)?.gradient === 'number');

            if (!feats.length) {
                hideHover();
                return;
            }

            let best: { lngLat: mapboxgl.LngLatLike; distPx: number; gradient: number } | null = null;

            for (const f of feats) {
                const coords = (f.geometry as LineString).coordinates;
                for (let i = 1; i < coords.length; i++) {
                    const a = coords[i - 1] as [number, number];
                    const b = coords[i] as [number, number];
                    const snap = nearestOnSegmentPx(map, px, a, b);
                    const gradient = (f.properties as any).gradient as number;
                    if (!best || snap.distPx < best.distPx) {
                        best = { lngLat: snap.lngLat, distPx: snap.distPx, gradient };
                    }
                }
            }

            if (!best || best.distPx > maxSnapDistPx) {
                hideHover();
                return;
            }

            const src = map.getSource('route-hover-point') as mapboxgl.GeoJSONSource | undefined;
            if (!src) {
                hideHover();
                return;
            }
            src.setData({
                type: 'FeatureCollection',
                features: [{
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: [(best.lngLat as any).lng, (best.lngLat as any).lat]
                    }
                }]
            });
            if (map.getLayer('route-hover-point-layer')) {
                map.setLayoutProperty('route-hover-point-layer', 'visibility', 'visible');
            }

            map.getCanvas().style.cursor = 'pointer';
            const gradientText = `${best.gradient.toFixed(1)}%`;
            hoverPopupRef.current!
                .setLngLat(best.lngLat as any)
                .setHTML(`<div class="text-xs">Gradient: ${gradientText}</div>`)
                .addTo(map);
        };

        map.on('mousemove', onMove);
        const onCanvasLeave = () => hideHover();
        map.getCanvas().addEventListener('mouseleave', onCanvasLeave);

        return () => {
            map.off('mousemove', onMove);
            map.getCanvas().removeEventListener('mouseleave', onCanvasLeave);
            hoverPopupRef.current?.remove();
        };
    }, [map, routeStyleMode, nearestOnSegmentPx, activeMunro, routeMunroLinks]);

    return (
        <div ref={mapRef} className="w-full h-full">
            <RouteStyleToggle />
            {offCenter && activeMunro && (
                <RecenterButton 
                    selectedMunro={activeMunro}
                    initialZoomDone={initialZoomDone}
                    offCenter={offCenter}
                    onRecenter={recenter}
                />
            )}
        </div>
    );
}