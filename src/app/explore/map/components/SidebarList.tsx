// src/app/explore/map/components/SidebarList.tsx
// This file contains the list of Munros displayed in the sidebar of the map page

import { Virtuoso } from 'react-virtuoso';
import { useMapState } from "@/contexts/MapStateContext";
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import BaggedIndicator from "@/components/global/BaggedIndicator";
import FriendsBagged from "../munro/[munro]/components/FriendsBagged";
import { convertHeight, convertLength } from "@/utils/misc/unitConverters";
import Link from "next/link";
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
                  className={`border-b border-sage px-6 py-6 flex flex-col ${isBagged(munro.id) ? 'bg-mint' : 'bg-mist'}`}
                  >
                <div className="flex flex-col items-start gap-4">
                  <BaggedIndicator munroId={munro.id} />
                  <Link href={`/explore/map/munro/${munro.slug}`}
                        onMouseEnter={() => setHoveredMunro(munro)}
                        onMouseLeave={() => setHoveredMunro(null)}
                  >
                      <span className="text-xxxl font-heading-font-family">{munro.name}</span>
                  </Link>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3 text-l">
                  <span>{height}{heightUnit}</span>
                  ·
                  {distance !== null && (
                    <span>{distance}{distanceUnit}</span>
                  )}
                  ·
                  {route && (
                    <>
                      <span>{route && toSentenceCase(route.difficulty)}</span>
                      ·
                      <span>{route && toSentenceCase(route.style)}</span>
                    </>
                  )}
                </div>
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