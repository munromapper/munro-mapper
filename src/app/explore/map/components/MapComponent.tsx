'use client';
import React, { useRef, useEffect, useCallback } from 'react';
import mapboxgl, { MapMouseEvent, LngLatLike, PointLike, GeoJSONSource } from 'mapbox-gl';
import type { LineString, Feature } from 'geojson';
import type { Route } from '@/types/data/dataTypes';
import { useMapState } from "@/contexts/MapStateContext";
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import useMapMarkers from '@/hooks/useMapMarkers';
import useGpxRoutes from '@/hooks/useGpxRoutes';
import useMapNavigation from '@/hooks/useMapNavigation';
import initialiseMap from '@/utils/map/initialiseMap';
import { RecenterButton } from './RecenterButton';

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
        routeStyleMode,
        mapBaseStyleMode 
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

    // Selected route layer registry
    const selectedLayerIdsRef = useRef<Set<string>>(new Set());
    // Last hovered munro id
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

    // START markers (route start points)
    // Keys: `${routeId}-selected` / `${routeId}-hovered`
    const routeStartMarkersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

    const createStartMarkerEl = (variant: 'selected' | 'hovered') => {
        const el = document.createElement('div');
        el.className = `route-start-marker ${variant}`;
        // basic inline fallback if no CSS yet
        el.style.width = '10px';
        el.style.height = '10px';
        el.style.borderRadius = '50%';
        el.style.boxSizing = 'border-box';
        el.style.background = 'var(--color-slate)';
        el.style.border = `2px solid ${variant === 'selected' ? 'var(--color-neon)' : 'var(--color-moss)'}`;
        el.style.boxShadow = '0 0 0 2px var(--color-mist)';
        return el;
    };

    const addStartMarker = useCallback((route: Route, variant: 'selected' | 'hovered') => {
        if (!map) return;
        if (routeStyleMode === 'hidden') return;
        const key = `${route.id}-${variant}`;
        if (routeStartMarkersRef.current.has(key)) return;
        const el = createStartMarkerEl(variant);
        const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([route.startLongitude, route.startLatitude])
            .addTo(map);
        routeStartMarkersRef.current.set(key, marker);
    }, [map, routeStyleMode]);

    const removeStartMarker = useCallback((key: string) => {
        const mk = routeStartMarkersRef.current.get(key);
        if (mk) {
            mk.remove();
            routeStartMarkersRef.current.delete(key);
        }
    }, []);

    const removeAllStartMarkers = useCallback((predicate?: (key: string) => boolean) => {
        for (const key of Array.from(routeStartMarkersRef.current.keys())) {
            if (!predicate || predicate(key)) {
                removeStartMarker(key);
            }
        }
    }, [removeStartMarker]);

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

    // Base style switching
    const styleChangeCounterRef = useRef(0);
    const [styleChangeCounter, setStyleChangeCounter] = React.useState(0);
    const TERRAIN_STYLE = 'mapbox://styles/munromapper/cmcxenw8j002x01sd1wrv9bm4';
    const SATELLITE_STYLE = 'mapbox://styles/munromapper/cmdrxf2b5009801sb0eckccpf';
    const currentBaseStyleRef = useRef<'terrain' | 'satellite'>('terrain');

    useEffect(() => {
        if (!map) return;
        if (currentBaseStyleRef.current === mapBaseStyleMode) return;
        const target = mapBaseStyleMode === 'terrain' ? TERRAIN_STYLE : SATELLITE_STYLE;
        currentBaseStyleRef.current = mapBaseStyleMode;
        map.setStyle(target);
        map.once('style.load', () => {
            styleChangeCounterRef.current += 1;
            setStyleChangeCounter(styleChangeCounterRef.current);
        });
    }, [map, mapBaseStyleMode]);

    // Munro markers
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

    // Hovered routes + start markers
    useEffect(() => {
        if (!map) return;

        // cleanup function for a given munro id's hovered routes
        const removeHoveredForMunro = (munroId: number) => {
            const links = routeMunroLinks.filter(link => link.munroId === munroId);
            links.forEach(link => {
                removeRouteFromMap(map, `${link.routeId}-hovered`);
                removeStartMarker(`${link.routeId}-hovered`);
            });
        };

        if (!hoveredMunro || routeStyleMode === 'hidden' || (activeMunro && hoveredMunro.id === activeMunro.id)) {
            if (latestHoveredId.current != null) {
                removeHoveredForMunro(latestHoveredId.current);
                latestHoveredId.current = null;
            }
            return;
        }

        const currentHoverId = hoveredMunro.id;
        latestHoveredId.current = currentHoverId;

        // Remove any other hovered routes/markers
        routeMunroLinks.forEach(link => {
            if (link.munroId !== currentHoverId) {
                removeRouteFromMap(map, `${link.routeId}-hovered`);
                removeStartMarker(`${link.routeId}-hovered`);
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
                        addStartMarker(route, 'hovered');
                    }
                }
            }
        })();

        return () => {
            cancelled = true;
            removeHoveredForMunro(currentHoverId);
        };
    }, [map, hoveredMunro, activeMunro, routeStyleMode, routeMunroLinks, routes, addRouteToMap, removeRouteFromMap, fetchAndCacheGeoJson, addStartMarker, removeStartMarker]);

    // Selected routes + start markers
    useEffect(() => {
        if (!map) return;

        const clearAllSelected = () => {
            for (const id of Array.from(selectedLayerIdsRef.current)) {
                removeRouteFromMap(map, id);
                selectedLayerIdsRef.current.delete(id);
                removeStartMarker(id);
            }
        };

        const clearAllHovered = () => {
            routeMunroLinks.forEach(link => {
                removeRouteFromMap(map, `${link.routeId}-hovered`);
                removeStartMarker(`${link.routeId}-hovered`);
            });
            latestHoveredId.current = null;
        };

        let cancelled = false;

        const nextId = activeMunro?.id ?? null;
        const activeVisible = nextId != null && (filteredMunros?.some(m => m.id === nextId) || false);

        if (!nextId || routeStyleMode === 'hidden' || !activeVisible) {
            clearAllSelected();
            if (routeStyleMode === 'hidden') {
                clearAllHovered();
                removeAllStartMarkers();
            }
            return;
        }

        const desiredLinks = routeMunroLinks.filter(link => link.munroId === nextId);
        const desiredIds = new Set(desiredLinks.map(l => `${l.routeId}-selected`));

        // Remove deselected
        for (const id of Array.from(selectedLayerIdsRef.current)) {
            if (!desiredIds.has(id)) {
                removeRouteFromMap(map, id);
                selectedLayerIdsRef.current.delete(id);
                removeStartMarker(id);
            }
        }

        // Add selected
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
                addStartMarker(route, 'selected');
            }
        })();

        return () => { cancelled = true; };
    }, [map, activeMunro, routeStyleMode, filteredMunros, routeMunroLinks, routes, addRouteToMap, removeRouteFromMap, fetchAndCacheGeoJson, addStartMarker, removeStartMarker, removeAllStartMarkers]);

    // Remove all start markers if switching to hidden
    useEffect(() => {
        if (routeStyleMode === 'hidden') {
            removeAllStartMarkers();
        }
    }, [routeStyleMode, removeAllStartMarkers]);

    // Marker selected CSS
    useEffect(() => {
        Object.values(markerList).forEach(marker => setMarkerSelected(marker, false));
        if (activeMunro && markerList[activeMunro.id]) {
            setMarkerSelected(markerList[activeMunro.id], true);
        }
    }, [activeMunro, markerList, setMarkerSelected]);

    // Hover popup control
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

    // Clear hovered when selecting
    useEffect(() => {
        if (activeMunro) setHoveredMunro(null);
    }, [activeMunro, setHoveredMunro]);

    // Utility for gradient hover snapping (return t for interpolation)
    const nearestOnSegmentPx = useCallback(
        (
            map: mapboxgl.Map,
            mouse: mapboxgl.Point,
            a: [number, number],
            b: [number, number]
        ): { lngLat: mapboxgl.LngLat; distPx: number; t: number } => {
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
            return { lngLat, distPx, t };
        },
        []
    );

    // Gradient hover artifacts over selected routes
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

        const onMove = (e: MapMouseEvent) => {
            if (!map) return;

            if (routeStyleMode !== 'gradient' || !activeMunro) {
                hideHover();
                return;
            }

            const selectedRouteLayerIds: string[] = routeMunroLinks
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

            const bbox: [PointLike, PointLike] = [
                [px.x - queryRadiusPx, px.y - queryRadiusPx],
                [px.x + queryRadiusPx, px.y + queryRadiusPx]
            ];

            const feats = map
                .queryRenderedFeatures([bbox[0], bbox[1]], { layers: selectedRouteLayerIds })
                .filter(
                    (f: Feature) =>
                        f.geometry.type === 'LineString' &&
                        typeof (f.properties?.gradient) === 'number'
                );

            if (!feats.length) {
                hideHover();
                return;
            }

            let best: { lngLat: LngLatLike; distPx: number; gradient: number; elevM?: number } | null = null;

            for (const f of feats) {
                const coords = (f.geometry as LineString).coordinates as Array<[number, number, number?]>;
                // Each feature is a segment ([prev, curr]), but keep robust iteration:
                for (let i = 1; i < coords.length; i++) {
                    const a = coords[i - 1];
                    const b = coords[i];
                    const snap = nearestOnSegmentPx(map, px, [a[0], a[1]], [b[0], b[1]]);
                    const gradient = f.properties?.gradient as number;

                    let elevM: number | undefined;
                    if (a.length >= 3 && b.length >= 3 && Number.isFinite(a[2]!) && Number.isFinite(b[2]!)) {
                        const zA = a[2] as number;
                        const zB = b[2] as number;
                        elevM = zA + (zB - zA) * snap.t;
                    }

                    if (!best || snap.distPx < best.distPx) {
                        best = { lngLat: snap.lngLat, distPx: snap.distPx, gradient, elevM };
                    }
                }
            }

            if (!best || best.distPx > maxSnapDistPx) {
                hideHover();
                return;
            }

            const src = map.getSource('route-hover-point') as GeoJSONSource | undefined;
            if (!src) {
                hideHover();
                return;
            }
            src.setData({
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'Point',
                            coordinates: [
                                (best.lngLat as mapboxgl.LngLat).lng,
                                (best.lngLat as mapboxgl.LngLat).lat
                            ]
                        }
                    }
                ]
            });
            if (map.getLayer('route-hover-point-layer')) {
                map.setLayoutProperty('route-hover-point-layer', 'visibility', 'visible');
            }

            map.getCanvas().style.cursor = 'pointer';
            const gradientText = `${Math.round(best.gradient)}%`;

            let elevLine = '';
            if (typeof best.elevM === 'number' && Number.isFinite(best.elevM)) {
                const meters = best.elevM;
                const isFeet = userAscentUnits === 'ft';
                const value = isFeet ? meters * 3.280839895 : meters;
                const unit = isFeet ? 'ft' : 'm';
                elevLine = `<div>Elevation: ${Math.round(value).toLocaleString()} ${unit}</div>`;
            }

            hoverPopupRef.current!
                .setLngLat(best.lngLat as mapboxgl.LngLat)
                .setHTML(`<div class="rgp-wrap"><span class="rgp-badge">${gradientText}</span><span class="rgp-label">Gradient</span></div>`)
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
    }, [map, routeStyleMode, nearestOnSegmentPx, activeMunro, routeMunroLinks, userAscentUnits]);

    return (
        <div ref={mapRef} className="w-full h-full">
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