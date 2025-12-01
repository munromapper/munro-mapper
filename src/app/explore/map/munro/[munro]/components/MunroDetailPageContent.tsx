// src/app/explore/map/munro/[munro]/components/MunroDetailPageContent.tsx
// This component displays the main content of the Munro detail page, including routes information

import type { Munro, Route } from "@/types/data/dataTypes";
import ReadMore from "@/components/global/ReadMore";
import { motion } from "framer-motion";
import { useMapState } from "@/contexts/MapStateContext";
import FriendsBagged from './FriendsBagged';
import RouteDifficultyIndicator from "./RouteDifficultyIndicator";
import RouteStyleIndicator from "./RouteStyleIndicator";
import Link from "next/link";
import { DownloadIcon, TooltipIcon, NewTabIcon } from "@/components/global/SvgComponents";
import { getGpxFileUrl } from "@/utils/data/clientDataFetchers";
import EstimatedTimeButton from "./EstimatedTimeButton";
import ImageCreditButton from "./ImageCreditButton";
import ShareButton from "./ShareButton";

interface MunroDetailPageContentProps {
    munro: Munro;
    route: Route | null;
    routeMunros: Munro[];
}

export default function MunroDetailPageContent({ 
    munro,
    route,
    routeMunros
}: MunroDetailPageContentProps) {
    const { isSidebarExpanded, userAscentUnits, userLengthUnits } = useMapState();

    const calculateAndFormatTime = (route: Route | null): string => {
        if (!route?.length || !route?.ascent) return 'Unknown';
        
        // Extract route details
        let distance = route.length;
        let ascent = route.ascent;
        
        // Convert to km and meters if needed
        if (userLengthUnits === 'mi') {
            distance = distance * 1.60934; // Convert miles to km
        }
        
        if (userAscentUnits === 'ft') {
            ascent = ascent * 0.3048; // Convert feet to meters
        }
        
        // Calculate base walking time in minutes (at 4.5 kph)
        const walkingTimeMinutes = (distance / 4.5) * 60;
        
        // Calculate additional time for ascent (10 min per 100m)
        const ascentTimeMinutes = (ascent / 100) * 12;
        
        // Calculate break time (10 min per hour of walking)
        const totalActiveTimeHours = (walkingTimeMinutes + ascentTimeMinutes) / 60;
        const breakTimeMinutes = totalActiveTimeHours * 5;
        
        // Total time in minutes
        let totalMinutes = walkingTimeMinutes + ascentTimeMinutes + breakTimeMinutes;
        
        // Round to nearest 15 minutes
        totalMinutes = Math.round(totalMinutes / 15) * 15;
        
        // Format the time
        const hours = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        
        if (hours === 0) {
            return `${mins} mins`;
        } else if (mins === 0) {
            return `${hours} hr`;
        } else {
            return `${hours} hr ${mins} mins`;
        }
    };

    const handleDownloadGpx = () => {
        if (!route?.gpxFile) return;
        const url = getGpxFileUrl(route.gpxFile);
        const link = document.createElement('a');
        link.href = url;
        link.download = route.gpxFile;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            initial={false}
            animate={{ 
                height: isSidebarExpanded ? 'auto' : 0,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="bg-mist relative z-0 pointer-events-auto"
        >
            <div className="overflow-hidden h-full">
                <div className="px-6 py-8">
                    <div className="mb-9">
                        <div className="w-full h-60 mb-4 bg-pebble rounded-xl">
                            <img src={munro.imageURL} alt={munro.name} className="object-cover w-full h-full rounded-xl" />
                        </div>
                        <div className="flex items-center text-moss">
                            <p className="text-sm italic">{munro.imageCredit}, <a href={munro.licenseURL} target="_blank" rel="noopener noreferrer">{munro.licenseType}</a></p>
                            <ImageCreditButton />
                        </div>
                    </div>
                    <ul className="flex gap-8">
                        <li className="mb-2 space-y-1">
                            <h2 className="text-moss text-l">Height</h2>
                            <p className="text-xl">{munro.height}{userAscentUnits}</p>
                        </li>
                        <li className="mb-2 space-y-1">
                            <h2 className="text-moss text-l">Rank</h2>
                            <p className="text-xl">#{munro.id}</p>
                        </li>
                        <li className="mb-2 space-y-1">
                            <h2 className="text-moss text-l">Grid Reference</h2>
                            <p className="text-xl">{munro.gridRef}</p>
                        </li>
                    </ul>
                    <div className="space-y-4 mt-6">
                        <h2 className="text-moss text-l">Description</h2>
                        <ReadMore 
                            text={munro.description || "In qui veniam ut sint anim nostrud anim nisi tempor ullamco aliqua Lorem. Commodo excepteur laborum irure amet. Enim labore adipisicing nulla. Mollit laborum officia culpa. Mollit reprehenderit consectetur est."}
                            maxChars={175}
                            className="text-xl"
                        />
                    </div>
                    <div className="mt-6">
                        <FriendsBagged munroId={munro.id} />
                    </div>
                    <div className="space-y-4 mt-6">
                        <h2 className="text-moss text-l">Recommended Maps</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            {munro.harveySW && (
                                <li>
                                    <a href={munro.harveySWUrl} target="_blank" className="underline decoration-dotted underline-offset-3">
                                        {munro.harveySW} 1:25k
                                    </a>
                                </li>
                            )}
                            {munro.harveyMM && (
                                <li>
                                    <a href={munro.harveyMMUrl} target="_blank" className="underline decoration-dotted underline-offset-3">
                                        {munro.harveyMM} 1:40k
                                    </a>
                                </li>
                            )}
                            {munro.osExplorer && (
                                <li>
                                    <a href={munro.osExplorerUrl} target="_blank" className="underline decoration-dotted underline-offset-3">
                                        {munro.osExplorer} 1:25k
                                    </a>
                                </li>
                            )}
                            {munro.osLandranger && (
                                <li>
                                    <a href={munro.osLandrangerUrl} target="_blank" className="underline decoration-dotted underline-offset-3">
                                        {munro.osLandranger} 1:50k
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="h-[1px] bg-sage"></div>
                <div className="px-6 py-8">
                    <h2 className="font-heading-font-family text-4xl mb-8">Route Details</h2>
                    <ul className="flex gap-8">
                        <li className="mb-2 flex flex-col-reverse gap-1">
                            <h2 className="text-moss text-l">Distance</h2>
                            <p className="text-xl">{route?.length}{userLengthUnits}</p>
                        </li>
                        <li className="mb-2 flex flex-col-reverse gap-1">
                            <h2 className="text-moss text-l">Total ascent</h2>
                            <p className="text-xl">{route?.ascent}{userAscentUnits}</p>
                        </li>
                        <li className="mb-2 flex flex-col-reverse gap-1">
                            <EstimatedTimeButton />
                            <p className="text-xl">{calculateAndFormatTime(route)}</p>
                        </li>
                    </ul>
                    <div className="space-y-4 mt-6">
                        <h2 className="text-moss text-l">Description</h2>
                        <ReadMore 
                            text={route?.description || "In qui veniam ut sint anim nostrud anim nisi tempor ullamco aliqua Lorem. Commodo excepteur laborum irure amet. Enim labore adipisicing nulla. Mollit laborum officia culpa. Mollit reprehenderit consectetur est."}
                            maxChars={175}
                            className="text-xl"
                        />
                    </div>
                    <div className="mt-9">
                        <RouteDifficultyIndicator route={route} />
                    </div>
                    <div className="mt-6 mb-9">
                        <RouteStyleIndicator route={route} />
                    </div>
                    <div className="mt-9">
                        <h2 className="text-moss text-l mb-4">Summits on this route</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            {routeMunros.map((routeMunro) => (
                            <li key={routeMunro.id}>
                                {routeMunro.id === munro.id ? (
                                <span className="text-slate">{routeMunro.name}</span>
                                ) : (
                                <Link 
                                    href={`/explore/map/munro/${routeMunro.slug || routeMunro.id}`}
                                    className="underline decoration-dotted underline-offset-3"
                                >
                                    {routeMunro.name}
                                </Link>
                                )}
                            </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-9 flex flex-col">
                        <h2 className="text-moss text-l mb-4">Starting point</h2>
                        <p>Parking at {route?.startLocation || "Unknown"}.</p>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${route?.startLatitude},${route?.startLongitude}`} target="_blank" className="underline decoration-dotted underline-offset-3">Open in Google Maps</a>
                    </div>
                </div>
                <div className="h-[1px] bg-sage"></div>
                <div className="py-8 px-6 flex flex-col gap-4">
                    <ShareButton munroName={munro.name} />
                    <a
                        className="py-2 px-4 bg-mist border border-sage rounded-full cursor-pointer flex items-center justify-center gap-3"
                        href={route?.garminLink}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <span>View on Garmin Connect</span>
                        <span className="inline-flex w-4 h-4">
                        <NewTabIcon />
                        </span>
                    </a>
                    <button 
                        onClick={handleDownloadGpx}
                        className="py-2 px-4 bg-apple rounded-full cursor-pointer flex items-center justify-center gap-3"
                    >
                        <span>Download GPX file</span>
                        <span className="inline-flex w-4 h-4">
                        <DownloadIcon/>
                        </span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

