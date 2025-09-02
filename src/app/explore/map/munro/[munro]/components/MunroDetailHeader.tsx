// src/app/explore/map/munro/[munro]/components/MunroDetailHeader.tsx
// This component displays the header section for the munro detail page

import type { Munro } from "@/types/data/dataTypes";
import { useMapState } from "@/contexts/MapStateContext";
import BaggedIndicator from "@/components/global/BaggedIndicator";
import MunroDetailBackButton from "./MunroDetailBackButton";
import { LocationIcon, ThinDownChevron } from "@/components/global/SvgComponents";
import { motion } from "framer-motion";

interface MunroDetailHeaderProps {
    munro: Munro;
}

export default function MunroDetailHeader({ 
    munro, 
}: MunroDetailHeaderProps) {
    const { isSidebarExpanded, setSidebarExpanded } = useMapState();

    return (
        <div className="bg-mist sticky top-0 z-1 p-6 pointer-events-auto border-b border-sage shadow-standard">
            <div className="flex justify-between items-center gap-6 mb-6">
                <MunroDetailBackButton />
                <BaggedIndicator munroId={munro.id} />
            </div>
            <h1 className="font-heading-font-family text-4xl">{munro.name}</h1>
            <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2 text-xl">
                    <div className="w-4 h-4 flex items-center justify-center">
                        <LocationIcon />
                    </div>
                    <p>{munro.region || "Region"}</p>
                </div>
                <div>
                    <button className="w-9 h-9 p-3 rounded-full flex items-center justify-center bg-pebble text-slate cursor-pointer"
                            onClick={() => setSidebarExpanded(!isSidebarExpanded)}
                            aria-label={isSidebarExpanded ? "Collapse details" : "Expand details"}
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
        </div>
    );
}