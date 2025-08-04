// src/app/explore/map/munro/[munro]/components/RouteDifficultyIndicator.tsx
// This component displays the difficulty indicator for a Munro route

'use client';
import { useState } from "react";
import type { Route } from "@/types/data/dataTypes";
import { EasyIcon, ModerateIcon, HardIcon, ErrorIcon, TooltipIcon } from "@/components/global/SvgComponents";
import ModalElement from "@/components/global/Modal";

interface RouteDifficultyIndicatorProps {
    route: Route | null;
}

export default function RouteDifficultyIndicator({ 
    route 
}: RouteDifficultyIndicatorProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const difficulty = route?.difficulty;

    const formatDifficulty = (text: string | undefined): string => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    };

    return (
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 flex items-center justify-center bg-pebble rounded-lg p-4">
                {difficulty === "easy" && <EasyIcon />}
                {difficulty === "moderate" && <ModerateIcon />}
                {difficulty === "hard" && <HardIcon />}
                {difficulty === "technical" && <ErrorIcon />}
            </div>
            <div>
                <button
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    <p className="text-xl">{formatDifficulty(difficulty)}<span className="w-3.5 h-3.5 ml-2 relative top-0.5 inline-flex justify-center items-center"><TooltipIcon /></span></p>
                </button>
                <p className="text-moss text-l">
                    {difficulty === "easy" && "This route is easy."}
                    {difficulty === "moderate" && "This route is moderate."}
                    {difficulty === "hard" && "This route is hard."}
                    {difficulty === "technical" && "Scrambling is essential on this route."}
                </p>
            </div>
            <ModalElement 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
            >
                <div className="bg-mist p-9 max-w-175">
                    <h2 className="font-heading-font-family text-4xl mb-6">Route Difficulty Explained</h2>
                    <p className="mb-4">Our route difficulty grades are intended to be relative grades compared to other Munro routes, and are decided based on the overall distance, elevation gain and commitment factor.</p>
                    <p>This means that while we might grade a route as 'easy', it just means that it is 'easy' <em>for a Munro day</em>, and proper care and attention should still be made when preparing for and undertaking this type of walk.</p>
                    <ul className="my-6 divide-y-1 divide-dashed divide-sage">
                        <li className="pb-6">
                            <h3 className="font-heading-font-family text-xxxl mb-4">
                                Easy
                            </h3>
                            <p className="text-moss text-xl">These routes will be the shortest and/or lowest in elevation gain, and will typically have an estimated walk time of under 4hr 30mins, while usually only taking in a single summit.</p>
                        </li>
                        <li className="py-6">
                            <h3 className="font-heading-font-family text-xxxl mb-4">
                                Moderate
                            </h3>
                            <p className="text-moss text-xl">These will be your average Munro day experiences, ranging from 4hrs 30mins to 7hrs. These may also contain multiple summits in a single outing, or just a single, more committing Munro.</p>   
                        </li>
                        <li className="py-6">
                            <h3 className="font-heading-font-family text-xxxl mb-4">
                                Hard
                            </h3>
                            <p className="text-moss text-xl">These will be the longest and most intense Munro days; bagging multiple summits with lots of elevation gain, or having a significant and committing approach. Some of the longest of these routes may be best attempted over multiple days.</p>
                        </li>
                        <li className="pt-6">
                            <h3 className="font-heading-font-family text-xxxl mb-4">
                                Technical
                            </h3>
                            <p className="text-moss text-xl">Our technical route difficulty is reserved for Munros that have significant, unavoidable, graded scrambling sections that cannot be bypassed to access the summit. The grades of the sections themselves will be outlined in the route description.</p>
                        </li>
                    </ul>
                    <p>We encourage all walkers to assess their own abilities and experience when considering a route, and not to take any grading criteria, even ours, at face value. The current weather conditions, time of year and individual fitness levels can all impact the perceived difficulty level of any experience in the hills.</p>
                </div>
            </ModalElement>
        </div>
    )
}