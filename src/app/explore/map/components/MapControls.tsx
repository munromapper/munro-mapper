"use client";
import { useState } from "react";
import ZoomControls from "./ZoomControls";
import CompassButton from "./CompassButton";
import Map3DToggle from "./Map3DToggle";
import MapStyleToggle from "./MapStyleToggle";
import RouteStyleToggle from "./RouteStyleToggle";
import { PlusIcon } from "@/components/global/SvgComponents";
import { motion } from "framer-motion";

export default function MapControls() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="z-20 flex flex-col items-center gap-2">
      {/* Desktop: controls always visible, toggle button hidden */}
      <div className="hidden md:flex flex-col items-center gap-2 pointer-events-none">
        <Map3DToggle />
        <MapStyleToggle />
        <RouteStyleToggle />
        <ZoomControls />
        <CompassButton />
      </div>

      {/* Mobile: toggle button + accordion */}
      <button
        className="bg-apple rounded-full w-10 h-10 p-3 flex items-center justify-center shadow-standard cursor-pointer md:hidden pointer-events-auto"
        onClick={() => setMenuOpen((o) => !o)}
        aria-expanded={menuOpen}
        aria-controls="map-controls-accordion"
      >
        <span
          className={`flex justify-center items-center transition-transform duration-200 ${menuOpen ? "rotate-45" : ""}`}
        >
          <PlusIcon />
        </span>
      </button>

      <motion.div
        id="map-controls-accordion"
        aria-hidden={!menuOpen}
        initial={false}
        animate={{
          height: menuOpen ? "auto" : 0,
          marginTop: menuOpen ? 0 : -8,
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: menuOpen ? "visible" : "hidden" }}
        className="w-full md:hidden"
      >
        <div
          className={`flex flex-col pointer-events-none items-center gap-2 transition-[opacity,transform] duration-200
                      ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-0.5"}`}
          aria-hidden={!menuOpen}
        >
          <Map3DToggle />
          <MapStyleToggle />
          <RouteStyleToggle />
          <ZoomControls />
          <CompassButton />
        </div>
      </motion.div>
    </div>
  );
}