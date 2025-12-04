// src/app/explore/map/components/ZoomControls.tsx
// This file contains the ZoomControls component for the map in the 'explore' section of the application

"use client";
import { useMapState } from "@/contexts/MapStateContext";
import { useCallback } from "react";
import { PlusIcon, MinusIcon } from "@/components/global/SvgComponents";

export default function ZoomControls() {
  const { map } = useMapState();

  const handleZoomIn = useCallback(() => {
    if (map) map.zoomIn();
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (map) map.zoomOut();
  }, [map]);

  return (
    <>
      <button
        className=" pointer-events-auto mapboxgl-ctrl-zoom-in cursor-pointer max-md:hidden"
        aria-label="Zoom in"
        onClick={handleZoomIn}
        type="button"
      >
        <PlusIcon />
      </button>
      <button
        className=" pointer-events-auto mapboxgl-ctrl-zoom-out cursor-pointer max-md:hidden"
        aria-label="Zoom out"
        onClick={handleZoomOut}
        type="button"
      >
        <MinusIcon />
      </button>
    </>
  );
}