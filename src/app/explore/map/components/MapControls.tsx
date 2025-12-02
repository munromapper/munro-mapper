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
    <div className="absolute bottom-9 max-md:bottom-auto max-md:top-18 right-9 max-md:right-4 z-20 flex flex-col items-center gap-2">
      <button
        className="bg-apple rounded-full w-10 h-10 p-3 flex items-center justify-center shadow-standard cursor-pointer"
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

      {/* Accordion wrapper */}
      <motion.div
        id="map-controls-accordion"
        aria-hidden={!menuOpen}
        initial={false}
        animate={{
          height: menuOpen ? "auto" : 0,
          marginTop: menuOpen ? 0 : -8 // -mt-2 when closed, smooth
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: menuOpen ? "visible" : "hidden" }}
        className="w-full"
      >
        <div
          className={`flex flex-col items-center gap-2 transition-[opacity,transform] duration-200
                      ${menuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none translate-y-0.5"}`}
          aria-hidden={!menuOpen}
        >
          <Map3DToggle />
          <MapStyleToggle />
          <RouteStyleToggle />
          <ZoomControls />
        </div>
      </motion.div>

      <CompassButton />
    </div>
  );
}