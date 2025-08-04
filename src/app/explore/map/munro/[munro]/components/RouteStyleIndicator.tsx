// src/app/explore/map/munro/[munro]/components/RouteStyleIndicator.tsx
// This component displays the style indicator for a Munro route

'use client';
import { useState } from "react";
import type { Route } from "@/types/data/dataTypes";
import { CircularLoopIcon, PointToPointIcon, OutAndBackIcon, TooltipIcon } from "@/components/global/SvgComponents";
import ModalElement from "@/components/global/Modal";

interface RouteStyleIndicatorProps {
    route: Route | null;
}

export default function RouteStyleIndicator({ 
    route 
}: RouteStyleIndicatorProps) {
    const style = route?.style;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const formatRouteStyle = (text: string | undefined): string => {
        if (!text) return '';
        const textWithoutHyphens = text.replace(/-/g, ' ');
        return textWithoutHyphens.charAt(0).toUpperCase() + textWithoutHyphens.slice(1).toLowerCase();
    };

    return (
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center bg-pebble rounded-lg p-4">
                {style === "circular-loop" && <CircularLoopIcon />}
                {style === "point-to-point" && <PointToPointIcon />}
                {style === "out-and-back" && <OutAndBackIcon />}
            </div>
            <div>
                <button
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {setIsModalOpen(true)}}
                >
                    <p className="text-xl">{formatRouteStyle(style)}<span className="w-3.5 h-3.5 ml-2 relative top-0.5 inline-flex justify-center items-center"><TooltipIcon /></span></p>
                </button>
                <p className="text-moss text-l">
                    {style === "circular-loop" && "This route forms a loop."}
                    {style === "point-to-point" && "This route ends at a different place."}
                    {style === "out-and-back" && "This route returns the same way."}
                </p>
            </div>
            <ModalElement 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <div className="bg-mist p-9 max-w-125">
                    <h2 className="font-heading-font-family text-4xl mb-6">Route Style Explained</h2>
                    <ul className="mt-6 divide-y-1 divide-dashed divide-sage">
                        <li className="pb-6">
                            <h3 className="font-heading-font-family text-xxxl mb-4">
                                Out and Back
                            </h3>
                            <p className="text-moss text-xl">These routes will return to the starting point by the same path they took to reach the summit.</p>
                        </li>
                        <li className="py-6">
                            <h3 className="font-heading-font-family text-xxxl mb-4">
                                Circular Loop
                            </h3>
                            <p className="text-moss text-xl">These routes will form a loop, returning to the starting point via a different path, or joining the initial ascent path at a lower point on the return, where a significant part of the return leg has been skipped.</p>
                        </li>
                        <li className="py-6">
                            <h3 className="font-heading-font-family text-xxxl mb-4">
                                Point to Point
                            </h3>
                            <p className="text-moss text-xl">These routes will start at one point and finish at another, requiring transport to the start and/or finish, or a long road walk between the two.</p>
                        </li>
                    </ul>
                </div>
            </ModalElement>
        </div>
    )
}