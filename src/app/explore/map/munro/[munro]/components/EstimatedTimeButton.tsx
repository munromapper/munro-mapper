// src/app/explore/map/munro/[munro]/components/EstimatedTimeButton.tsx
// This component displays a button to pop up the estimated time explainer modal

import { useState } from "react";
import { TooltipIcon } from "@/components/global/SvgComponents";
import ModalElement from "@/components/global/Modal";

export default function EstimatedTimeButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 cursor-pointer"
            >
                <h2 className="text-moss text-l">Est. time<span className="w-3.5 h-3.5 ml-2 relative top-0.5 inline-flex justify-center items-center"><TooltipIcon /></span></h2>
            </button>
            <ModalElement 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
            >
                <div className="bg-mist p-9 max-w-125">
                    <h2 className="font-heading-font-family text-4xl mb-6">Estimated Time Calculations</h2>
                    <p>Our estimated time calculations are estimations only. Your own experiences may vary based on personal and external factors such as walking speed, rest breaks and weather/ground conditions.</p>
                    <p className="mt-4">We calculate our time estimations based on the following parameters:</p>
                    <ul className="list-disc pl-6 space-y-2 my-4">
                        <li>An average walking speed of 4.5km/h, or 2.8mi/h</li>
                        <li>A slighly more pessimistic Naismiths rule, adding an extra 12 minutes for every 100m of ascent</li>
                        <li>Allowing for 5 minutes rest break for every hour of walking</li>
                        <li>Rounded up to the nearest 15 minute interval for simplicity</li>
                    </ul>
                    <p>Use these time estimates as a rough guide only, and adjust your expectations based on your own personal pacing, walking style and the conditions of the day.</p>
                </div>
            </ModalElement>
        </>
    )
}