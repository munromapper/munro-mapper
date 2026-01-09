// src/app/explore/map/components/SidebarHeader.tsx
// This file contains the header for the sidebar element of the map page

import { useMapState } from "@/contexts/MapStateContext";
import { ThinDownChevron } from "@/components/global/SvgComponents";
import { motion } from "framer-motion";

export default function SidebarHeader() {
    const { isSidebarExpanded, setSidebarExpanded, filteredMunros } = useMapState();

    return (
        <div className="bg-mist sticky top-0 z-1 py-6 px-9 pointer-events-auto border-b shadow-standard border-sage">
            <div className="mb-3">
                <h1 className="font-heading-font-family text-4xl">The Munro Map</h1>
            </div>
            <div className="flex justify-between items-center gap-6">
                <span className="text-l text-moss">{filteredMunros.length} results found</span>
                <button className="w-9 h-9 p-3 rounded-full flex items-center justify-center bg-pebble text-slate cursor-pointer max-md:hidden"
                        onClick={() => setSidebarExpanded(!isSidebarExpanded)}
                        aria-label={isSidebarExpanded ? "Collapse list" : "Expand list"}
                        aria-expanded={isSidebarExpanded}
                        aria-controls="map-sidebar-list"
                >
                        <span
                            className={`transition-transform duration-300 ease-in-out ${isSidebarExpanded ? 'rotate-180' : ''}`}
                            aria-hidden="true"
                        >
                            <ThinDownChevron />
                        </span>
                </button>
            </div>
        </div>
    )
}