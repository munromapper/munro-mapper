'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { CrossIcon } from '@/components/global/SvgComponents';
import BaggedIndicator from '@/components/global/BaggedIndicator';
import { fetchMunroData, fetchRouteData, fetchRouteMunroLinks } from '@/utils/data/clientDataFetchers';
import type { Munro, Route } from '@/types/data/dataTypes';
import { useMapState } from '@/contexts/MapStateContext';

type PopupData = {
  munro: Munro;
  route: Route | null;
};

function formatDuration(mins?: number | null) {
  if (!mins || mins <= 0) return undefined;
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  if (h > 0 && m > 0) return `${h} h ${m} min`;
  if (h > 0) return `${h} h`;
  return `${m} min`;
}

export default function MobileMunroPopup() {
  const { munro: munroSlug } = (useParams() as { munro?: string }) ?? {};
  const pathname = usePathname();
  const router = useRouter();
  const { isMobileSidebarOpen, setMobileSidebarOpen } = useMapState();

  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState<PopupData | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth <= 1000);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Only render on /explore/map/munro/[munro]
  const onMunroPage = useMemo(() => {
    return Boolean(pathname && pathname.startsWith('/explore/map/munro/'));
  }, [pathname]);

  // Fetch minimal data using the slug from the route
  useEffect(() => {
    if (!onMunroPage || !munroSlug) {
      setData(null);
      return;
    }

    let cancelled = false;
    (async () => {
      const [munros, routeLinks, routes] = await Promise.all([
        fetchMunroData(),
        fetchRouteMunroLinks(),
        fetchRouteData(),
      ]);

      const munro = (munros ?? []).find(m => m.slug === munroSlug) ?? null;
      if (!munro) {
        if (!cancelled) setData(null);
        return;
      }

      const link = (routeLinks ?? []).find(l => l.munroId === munro.id) ?? null;
      const route = link ? (routes ?? []).find(r => r.id === link.routeId) ?? null : null;

      if (!cancelled) setData({ munro, route });
    })();

    return () => { cancelled = true; };
  }, [onMunroPage, munroSlug]);

  if (!isMobile || !onMunroPage || !data || isMobileSidebarOpen) return null;

  const { munro, route } = data;

  // Route fields from your type
  const timeText = formatDuration(route?.estimatedTime ?? undefined);
  const distanceText = typeof route?.length === 'number' ? `${route.length.toFixed(2)}km` : undefined;
  const ascentText = typeof route?.ascent === 'number' ? `${route.ascent.toLocaleString()}m` : undefined;

  return (
    <div
      className="fixed bottom-26 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-md z-[90] pointer-events-auto"
      role="button"
      tabIndex={0}
      aria-label="Open munro details"
      onClick={() => setMobileSidebarOpen(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') setMobileSidebarOpen(true);
      }}
    >
      <div className="relative rounded-xl bg-mist shadow-standard p-4">
        {/* Close: go back to map and clear active selection */}
        <Link
          href="/explore/map"
          aria-label="Close"
          className="absolute top-2 right-2 w-8 h-8 p-2.5 rounded-full bg-pebble flex items-center justify-center text-slate cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <CrossIcon />
        </Link>

        <div className="flex items-center gap-4">
          {/* Image */}
          <div className="h-22 aspect-square rounded-md overflow-hidden bg-pebble shrink-0">
            <img src={munro.imageURL} alt={munro.name} className="object-cover w-full h-full rounded-md" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <BaggedIndicator munroId={munro.id} />
            </div>

            <div className="text-slate text-xxl">{munro.name}</div>

            <div className="text-moss text-l mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
              {timeText && <span>{timeText}</span>}
              ·
              {distanceText && <span>{distanceText}</span>}
              ·
              {ascentText && <span>↑ {ascentText}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}