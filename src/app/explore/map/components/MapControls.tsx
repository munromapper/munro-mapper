"use client";

import { useMapState } from "@/contexts/MapStateContext";
import { useCallback } from "react";
import { PlusIcon, MinusIcon, CompassIcon } from "@/components/global/SvgComponents";

export default function MapControls() {
  const { map } = useMapState();

  const handleZoomIn = useCallback(() => {
    if (map) map.zoomIn();
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (map) map.zoomOut();
  }, [map]);

  const handleResetNorth = useCallback(() => {
    if (map) map.resetNorth();
  }, [map]);

  return (
    <div className="absolute bottom-5 right-0 z-20 flex flex-col items-center gap-2 mapboxgl-ctrl-group">
      <button
        className="mapboxgl-ctrl-zoom-in"
        aria-label="Zoom in"
        onClick={handleZoomIn}
        type="button"
      >
        <PlusIcon />
      </button>
      <button
        className="mapboxgl-ctrl-zoom-out"
        aria-label="Zoom out"
        onClick={handleZoomOut}
        type="button"
      >
        <MinusIcon />
      </button>
      <button
        className="mapboxgl-ctrl-compass"
        aria-label="Reset north"
        onClick={handleResetNorth}
        type="button"
      >
        <CompassIcon />
      </button>
    </div>
  );
}