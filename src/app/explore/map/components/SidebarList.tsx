// src/app/explore/map/components/SidebarList.tsx
// This file contains the list of Munros displayed in the sidebar of the map page

import { Virtuoso } from 'react-virtuoso';
import { useMapState } from "@/contexts/MapStateContext";
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import BaggedIndicator from "@/components/global/BaggedIndicator";
import FriendsBagged from "../munro/[munro]/components/FriendsBagged";
import { convertHeight, convertLength } from "@/utils/misc/unitConverters";
import EstimatedTimeButton from '../munro/[munro]/components/EstimatedTimeButton';
import Link from "next/link";
import { Route } from '@/types/data/dataTypes';
import { AnimatePresence, motion } from "framer-motion";

export default function SidebarList() {
    const { isSidebarExpanded, filteredMunros, routes, routeMunroLinks, userAscentUnits, userLengthUnits, setHoveredMunro } = useMapState();
    const { isBagged } = useBaggedMunroContext();

    function getRoute(munroId: number) {
        const link = routeMunroLinks.find(l => l.munroId === munroId);
        if (!link) return null;
        return routes.find(r => r.id === link.routeId) || null;
    }

    function toSentenceCase(str: string) {
        if (!str) return '';
        return str
            .replace(/[-_]/g, ' ')
            .toLowerCase()
            .replace(/^\w/, c => c.toUpperCase());
    }

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

  return (
    <motion.div
            initial={false}
            animate={{ 
                height: isSidebarExpanded ? '100vh' : 0,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="bg-mist relative z-0 pointer-events-auto"
    >
      <div className="overflow-hidden h-full">
        <Virtuoso
          style={{ height: '100%', width: '100%' }}
          totalCount={filteredMunros.length}
          itemContent={index => {
            const munro = filteredMunros[index];
            const route = getRoute(munro.id);

            // Convert units
            const height = convertHeight(munro.height, userAscentUnits === 'ft' ? 'feet' : 'metres');
            const heightUnit = userAscentUnits === 'ft' ? 'ft' : 'm';
            const distance = route ? convertLength(route.length, userLengthUnits === 'mi' ? 'miles' : 'kilometres') : null;
            const distanceUnit = userLengthUnits === 'mi' ? 'mi' : 'km';

            return (
              <div 
                  key={munro.id} 
                  className={`border-b border-sage p-9 flex flex-col ${isBagged(munro.id) ? 'bg-mint' : 'bg-mist'}`}
                  >
                <div className="flex flex-col items-start gap-9">
                  <div className="w-full relative h-60 bg-pebble rounded-xl">
                    <img src={munro.imageURL} alt={munro.name} className="object-cover w-full h-full rounded-xl" />
                    <div className="absolute top-6 left-6">
                      <BaggedIndicator munroId={munro.id} />
                    </div>
                  </div>
                  <Link href={`/explore/map/munro/${munro.slug}`}
                        onMouseEnter={() => setHoveredMunro(munro)}
                        onMouseLeave={() => setHoveredMunro(null)}
                  >
                      <span className="text-xxxl font-heading-font-family">{munro.name}</span>
                  </Link>
                </div>
                <ul className="mt-5 flex gap-8">
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
                <div>
                  <FriendsBagged munroId={munro.id} />
                </div>
              </div>
            );
          }}
        />
      </div>
    </motion.div>
  );
}