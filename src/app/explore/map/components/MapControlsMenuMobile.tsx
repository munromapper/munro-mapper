// src/app/explore/map/components/MapControlsMenuMobile.tsx
// This file contains the MapControlsMenuMobile component for the map in the 'explore' section of the application

"use client";
import { useState } from "react";
import { PlusIcon } from "@/components/global/SvgComponents"; // Use your own icon here
import Map3DToggle from "./Map3DToggle";
import MapStyleToggle from "./MapStyleToggle";
import RouteStyleToggle from "./RouteStyleToggle";

export default function MapControlsMenuMobile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative md:hidden">
      {/* Menu trigger button */}
      <button
        className="w-10 h-10 flex items-center justify-center p-3 rounded-full shadow-standard bg-mist"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open map controls"
        aria-expanded={open}
      >
        <PlusIcon />
      </button>
      {/* Dropdown menu */}
      {open && (
        <div className="absolute bottom-12 right-0 flex flex-col gap-2 bg-mist rounded-xl shadow-standard p-2 z-30">
          <Map3DToggle />
          <MapStyleToggle />
          <RouteStyleToggle />
        </div>
      )}
    </div>
  );
}