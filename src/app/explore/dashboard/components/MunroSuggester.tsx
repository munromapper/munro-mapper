// Munro suggester component for the dashboard page

'use client';

import React, { useState } from 'react';
import { fetchMunroData, fetchRouteData, fetchRouteMunroLinks } from '@/utils/data/clientDataFetchers';
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { HillSunIcon, RefreshIcon } from '@/components/global/SvgComponents';
import BaggedIndicator from '@/components/global/BaggedIndicator';
import { convertHeight, getHeightUnitLabel, convertLength, getLengthUnitLabel } from '@/utils/misc/unitConverters';
import type { Munro, Route, RouteMunroLink } from '@/types/data/dataTypes';

const REGIONS = [
  'any',
  'Cairngorms',
  'Lochaber',
  'Perthshire',
  'Isle of Skye',
  'Loch Lomond',
  'Glencoe',
  'Argyll',
  'Monadhliath',
  'Glen Shiel',
  'Ullapool',
  'Assynt',
  'Strathglass',
  'Wester Ross',
  'Knoydart',
  'Drumochter',
  'Isle of Mull',
  'Sutherland',
];

export default function MunroSuggester() {
  // Get user preferences
  const { userProfile } = useAuthContext();
  const lengthUnit = userProfile?.preferences?.lengthUnit === 'miles' ? 'miles' : 'kilometres';
  const ascentUnit = userProfile?.preferences?.elevationUnit === 'feet' ? 'feet' : 'metres';

  // Filter state (store in user units)
  const [length, setLength] = useState(lengthUnit === 'miles' ? 13 : 20);
  const [editingLength, setEditingLength] = useState(false);

  const [ascent, setAscent] = useState(ascentUnit === 'feet' ? 3000 : 1250);
  const [editingAscent, setEditingAscent] = useState(false);

  const [region, setRegion] = useState('any');
  const [editingRegion, setEditingRegion] = useState(false);

  const [excludeBagged, setExcludeBagged] = useState(true);

  // UI state
  const [suggestedMunro, setSuggestedMunro] = useState<null | { id: number; name: string; description: string; url: string }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { userBaggedMunros } = useBaggedMunroContext();

  // Suggestion logic
  const handleSuggest = async () => {
    setLoading(true);
    setError(null);

    try {
      const [munrosRaw, routesRaw, linksRaw] = await Promise.all([
        fetchMunroData(),
        fetchRouteData(),
        fetchRouteMunroLinks(),
      ]);
      const munros: Munro[] = munrosRaw ?? [];
      const routes: Route[] = routesRaw ?? [];
      const links: RouteMunroLink[] = linksRaw ?? [];
      if (munros.length === 0 || routes.length === 0 || links.length === 0) throw new Error('Failed to load data');

      // Filter Munros by region and bagged status
      const filteredMunros = munros.filter(m => {
        if (region !== 'any' && m.region !== region) return false;
        if (excludeBagged && userBaggedMunros.includes(m.id)) return false;
        return true;
      });

      // For each Munro, find the shortest route that matches the filters (convert route data to user units)
      const candidates = filteredMunros.map((munro: Munro) => {
        // Find all route IDs for this Munro
        const routeIds = links.filter((l: RouteMunroLink) => l.munroId === munro.id).map(l => l.routeId);
        // Find all routes for this Munro that match the filters
        const matchingRoutes = routes.filter((r: Route) => {
          if (!routeIds.includes(r.id)) return false;
          // Convert route length/ascent to user units for comparison
          const routeLength = Number(convertLength(r.length, lengthUnit));
          const routeAscent = convertHeight(r.ascent, ascentUnit);
          return routeLength <= length && routeAscent <= ascent;
        });
        // Pick the shortest matching route, if any
        const bestRoute = matchingRoutes.sort((a, b) => {
          const aLen = Number(convertLength(a.length, lengthUnit));
          const bLen = Number(convertLength(b.length, lengthUnit));
          return aLen - bLen;
        })[0];
        return bestRoute
          ? {
              munro,
              route: bestRoute,
            }
          : null;
      }).filter(Boolean) as { munro: Munro; route: Route }[];

      if (candidates.length === 0) {
        setError('No Munros found matching your filters.');
        setLoading(false);
        return;
      }

      // Pick a random candidate
      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      setSuggestedMunro({
        id: chosen.munro.id,
        name: chosen.munro.name,
        description: chosen.munro.description || 'No description available.',
        url: `/explore/map/munro/${chosen.munro.slug}`,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('Something went wrong.');
      }
    }
    setLoading(false);
  };

  const handleRefine = () => setSuggestedMunro(null);

  return (
    <section className="rounded-xl p-9 border border-sage bg-mist flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xxxl text-slate">Munro Suggester</h2>
        <span className="h-9 w-9 p-2.5 rounded-md bg-pebble text-slate flex items-center justify-center">
          <HillSunIcon />
        </span>
      </div>

      {!suggestedMunro ? (
        <>
          <div className="bg-pebble text-moss rounded-md p-4 mb-3">
            <span className="text-slate">Not sure what to do?</span> Set your limits below, then let us pick a hill.
          </div>
          <p className="text-slate text-xxl/8 mt-auto">
            Find me a hill up to{' '}
            {editingLength ? (
              <input
                type="number"
                min={1}
                max={lengthUnit === 'miles' ? 25 : 40}
                value={length}
                onChange={e => setLength(Number(e.target.value))}
                onBlur={() => setEditingLength(false)}
                className="w-12.5 border-b border-moss bg-transparent text-moss focus:outline-none"
                autoFocus
              />
            ) : (
              <span
                className="text-moss underline decoration-dotted underline-offset-4 cursor-pointer"
                onClick={() => setEditingLength(true)}
                tabIndex={0}
              >
                {length} {getLengthUnitLabel(lengthUnit)}
              </span>
            )}
            {' '}in length, with under{' '}
            {editingAscent ? (
              <input
                type="number"
                min={ascentUnit === 'feet' ? 300 : 100}
                max={ascentUnit === 'feet' ? 10000 : 3000}
                step={ascentUnit === 'feet' ? 50 : 25}
                value={ascent}
                onChange={e => setAscent(Number(e.target.value))}
                onBlur={() => setEditingAscent(false)}
                className="w-14 border-b border-moss bg-transparent text-moss focus:outline-none"
                autoFocus
              />
            ) : (
              <span
                className="text-moss underline decoration-dotted underline-offset-4 cursor-pointer"
                onClick={() => setEditingAscent(true)}
                tabIndex={0}
              >
                {ascent}{getHeightUnitLabel(ascentUnit)}
              </span>
            )}
            {' '}of ascent, in
            {region !== 'any' ? ' the ' : ' '}
            {editingRegion ? (
              <select
                value={region}
                onChange={e => { setRegion(e.target.value); setEditingRegion(false); }}
                onBlur={() => setEditingRegion(false)}
                className="w-14 border-b border-moss bg-transparent text-moss focus:outline-none"
                autoFocus
              >
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            ) : (
              <span
                className="text-moss underline decoration-dotted underline-offset-4 cursor-pointer"
                onClick={() => setEditingRegion(true)}
                tabIndex={0}
              >
                {region}
              </span>
            )}
            {' '}area, and{' '}
            <span
              className="text-moss underline decoration-dotted underline-offset-4 cursor-pointer"
              onClick={() => setExcludeBagged(v => !v)}
              tabIndex={0}
            >
              {excludeBagged ? 'exclude' : 'include'}
            </span>
            {' '}ones I&apos;ve bagged.
          </p>
          {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
          <button
            className="mt-6 w-full border border-apple cursor-pointer rounded-full bg-apple text-slate text-xl py-3 transition hover:bg-mist disabled:opacity-60 transiton-all duration-250 ease-in-out"
            onClick={handleSuggest}
            disabled={loading}
          >
            {loading ? 'Suggesting...' : 'Suggest a Munro'}
          </button>
        </>
      ) : (
        <>
          <div className="mb-8 mt-auto flex flex-col items-start gap-2">
            <BaggedIndicator munroId={suggestedMunro.id} />
            <a
                href={suggestedMunro.url}
                className="text-xxl mt-4 text-slate border-b-2 border-dotted border-slate pb-0.5"
                target="_blank"
                rel="noopener noreferrer"
            >
                {suggestedMunro.name}
            </a>
            <p className="text-moss mt-4 line-clamp-3">{suggestedMunro.description}</p>
          </div>
          <button
            className="w-full rounded-full bg-apple border border-apple text-slate text-xl cursor-pointer py-3 transition duration-250 ease-in-out hover:bg-mist flex items-center justify-center gap-2"
            onClick={handleSuggest}
            disabled={loading}
          >
            Show me a new Munro
            <span className="ml-1 w-3 h-3" role="img" aria-label="refresh">
              <RefreshIcon />
            </span>
          </button>
          <button
            className="w-full mt-3 rounded-full border border-sage text-slate cursor-pointer text-xl py-3 transition hover:bg-pebble"
            onClick={handleRefine}
            disabled={loading}
          >
            Refine filters
          </button>
        </>
      )}
    </section>
  );
}