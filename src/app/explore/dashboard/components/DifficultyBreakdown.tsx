// src/app/explore/dashboard/components/DifficultyBreakdown.tsx
// This file contains the difficulty breakdown component for the dashboard page

'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import { fetchRouteMunroLinks, fetchRouteData } from '@/utils/data/clientDataFetchers';
import { EasyIcon } from '@/components/global/SvgComponents';

type Difficulty = 'easy' | 'moderate' | 'hard' | 'technical';

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: 'bg-apple',
  moderate: 'bg-sage',
  hard: 'bg-moss',
  technical: 'bg-slate',
};

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export default function DifficultyBreakdown() {
  const { userBaggedMunros } = useBaggedMunroContext();
  const [breakdown, setBreakdown] = useState<Record<Difficulty, number>>({
    easy: 0,
    moderate: 0,
    hard: 0,
    technical: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBreakdown() {
      setLoading(true);
      const routeMunroLinks = await fetchRouteMunroLinks();
      const routes = await fetchRouteData();

      // Map Munro ID to its route(s)
      const munroToRoute = new Map<number, number[]>();
      routeMunroLinks?.forEach(link => {
        if (!munroToRoute.has(link.munroId)) munroToRoute.set(link.munroId, []);
        munroToRoute.get(link.munroId)!.push(link.routeId);
      });

      // Count difficulties for bagged Munros
      const difficultyCount: Record<Difficulty, number> = {
        easy: 0,
        moderate: 0,
        hard: 0,
        technical: 0,
      };

      userBaggedMunros.forEach(munroId => {
        const routeIds = munroToRoute.get(munroId) || [];
        // Use the first route's difficulty (or you can average if needed)
        const route = routes?.find(r => r.id === routeIds[0]);
        if (route) {
          const diff = route.difficulty as Difficulty;
          if (difficultyCount[diff] !== undefined) difficultyCount[diff]++;
        }
      });

      setBreakdown(difficultyCount);
      setLoading(false);
    }
    getBreakdown();
  }, [userBaggedMunros]);

  // Memoise total and breakdown lists so they persist across tab switches
  const total = useMemo(() => Object.values(breakdown).reduce((a, b) => a + b, 0), [breakdown]);
  const breakdownBar = useMemo(() => (
    Object.entries(breakdown)
      .filter(([_, count]) => count > 0)
      .map(([diff, count], idx, arr) => {
        const pct = total ? Math.round((count / total) * 100) : 0;
        return (
          <div
            key={diff}
            className={`${DIFFICULTY_COLORS[diff as Difficulty]} h-full`}
            style={{ width: `${pct}%`, marginRight: idx < arr.length - 1 ? '0.25rem' : 0 }}
            title={`${pct}% ${diff}`}
          />
        );
      })
  ), [breakdown, total]);

  const breakdownList = useMemo(() => (
    Object.entries(breakdown).map(([diff, count]) => {
      const pct = total ? Math.round((count / total) * 100) : 0;
      return count > 0 ? (
        <li key={diff} className="flex items-center">
          <span className={`inline-block mr-3 h-3 w-3 rounded-full ${DIFFICULTY_COLORS[diff as Difficulty]}`} />
          <span className="text-slate mr-1">{pct}%</span>
          <span className="text-moss">{capitalize(diff)}</span>
        </li>
      ) : null;
    })
  ), [breakdown, total]);

  return (
    <section className="rounded-xl p-9 border border-sage">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xxxl text-slate">Difficulty Breakdown</h2>
        <span className="h-9 w-9 p-2.5 rounded-md bg-pebble text-slate">
            <EasyIcon />
        </span>
      </div>
      <p className="mb-4 text-slate">
        {total === 0
          ? "Bag some munros to view your difficulty breakdown."
          : `Of the ${total} Munro(s) that you've climbed, the difficulty breakdown is as follows:`}
      </p>
      {loading ? (
        <div className="h-8 w-full animate-pulse rounded bg-slate-100" />
      ) : (
        total > 0 && (
          <>
            <div className="h-20 w-full overflow-hidden rounded-md flex">
              {breakdownBar}
            </div>
            <ul className="mt-6 inline-grid grid-cols-2 gap-y-2 gap-x-2">
              {breakdownList}
            </ul>
          </>
        )
      )}
    </section>
  );
}