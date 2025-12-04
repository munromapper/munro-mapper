//src/app/explore/map/components/CompassButton.tsx
// This file contains the CompassButton component for the map in the 'explore' section of the application

"use client";
import { useMapState } from "@/contexts/MapStateContext";
import { useCallback } from "react";
import { CompassIcon } from "@/components/global/SvgComponents";

export default function CompassButton() {
  const { map } = useMapState();

  const handleResetNorth = useCallback(() => {
    if (map) map.resetNorth();
  }, [map]);

  return (
    <button
      className="mapboxgl-ctrl-compass pointer-events-auto cursor-pointer"
      aria-label="Reset north"
      onClick={handleResetNorth}
      type="button"
    >
      <CompassIcon />
    </button>
  );
}