// src/app/explore/dashboard/components/RegionalBreakdown.tsx
// Regional breakdown component for the dashboard page

'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import { fetchMunroData } from '@/utils/data/clientDataFetchers';
import { LocationIcon } from '@/components/global/SvgComponents';

type RegionSwatch = {
  // For the SVG stroke (uses currentColor)
  stroke: string; // e.g. "text-apple"
  // For the legend dot background
  dot: string; // e.g. "bg-apple"
};

type RegionData = {
  name: string;
  count: number;
  color: RegionSwatch;
};

const REGION_COLORS: RegionSwatch[] = [
  { stroke: 'text-apple', bg: undefined } as unknown as RegionSwatch, // placeholder to keep TS happy during refactor
] as unknown as RegionSwatch[];

// Define the swatches explicitly (avoids accidental purge and keeps intent clear)
const SWATCHES: RegionSwatch[] = [
  { stroke: 'text-apple',  dot: 'bg-apple' }, // 1st region
  { stroke: 'text-apple/50',   dot: 'bg-apple/50' },  // 2nd region
  { stroke: 'text-sage',   dot: 'bg-sage' },  // 3rd region
  { stroke: 'text-moss',  dot: 'bg-moss' }, // 4th region
  { stroke: 'text-slate',  dot: 'bg-slate' }, // Other
];

export default function RegionalBreakdown() {
  const { userBaggedMunros } = useBaggedMunroContext();
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBreakdown() {
      setLoading(true);
      const munros = await fetchMunroData();
      if (!munros) {
        setRegions([]);
        setTotal(0);
        setLoading(false);
        return;
      }

      // Count bagged Munros per region
      const regionCount: Record<string, number> = {};
      userBaggedMunros.forEach((id) => {
        const munro = munros.find((m) => m.id === id);
        if (munro) {
          regionCount[munro.region] = (regionCount[munro.region] || 0) + 1;
        }
      });

      // Sort regions by count
      const sorted = Object.entries(regionCount)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count }));

      // Top 4 regions, rest as "Other"
      const top = sorted.slice(0, 4);
      const otherCount = sorted.slice(4).reduce((sum, r) => sum + r.count, 0);

      const regionsData: RegionData[] = top.map((r, i) => ({
        name: r.name,
        count: r.count,
        color: SWATCHES[i] ?? SWATCHES[SWATCHES.length - 1],
      }));

      if (otherCount > 0) {
        regionsData.push({
          name: 'Other',
          count: otherCount,
          color: SWATCHES[SWATCHES.length - 1],
        });
      }

      setRegions(regionsData);
      setTotal(userBaggedMunros.length);
      setLoading(false);
    }

    getBreakdown();
  }, [userBaggedMunros]);

  // Calculate percentages (memoized)
  const regionPercents = useMemo(
    () =>
      regions.map((r) => ({
        ...r,
        percent: total ? Math.round((r.count / total) * 100) : 0,
      })),
    [regions, total]
  );

  // Doughnut chart SVG generator
  function DoughnutChart({ data }: { data: Array<RegionData & { percent: number }> }) {
    const size = 150;
    const strokeWidth = 30;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const gapDegrees = 5; // degrees of gap between segments
    const gap = (gapDegrees / 360) * circumference;

    let startAngle = 0;

    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Regional spread donut chart"
      >
        {data.map((r, i) => {
          // Subtract gap from each arc except the last one
          const arc = Math.max(0, (r.percent / 100) * circumference - gap);
          const angle = (startAngle / circumference) * 360;

          const segment = (
            <g key={r.name} transform={`rotate(${angle} ${size / 2} ${size / 2})`}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                className={r.color.stroke}
                strokeWidth={strokeWidth}
                strokeDasharray={`${arc} ${circumference - arc}`}
                strokeDashoffset={circumference / 4}
                style={{ transition: 'stroke-dashoffset 300ms ease' }}
              />
            </g>
          );

          startAngle += (r.percent / 100) * circumference;
          return segment;
        })}
        {/* Doughnut hole */}
        <circle cx={size / 2} cy={size / 2} r={radius - strokeWidth / 2} fill="#FBFDF6" />
      </svg>
    );
  }

  return (
    <section className="rounded-xl p-9 border flex-1 border-sage">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xxxl text-slate">Regional Spread</h2>
        <span className="h-9 w-9 p-2.5 rounded-md bg-pebble text-slate" aria-hidden>
          <LocationIcon />
        </span>
      </div>

      {loading ? (
        <div className="h-24 w-full animate-pulse rounded bg-slate-100" />
      ) : total === 0 ? (
        <p className="text-slate">Bag some munros to view your regional breakdown.</p>
      ) : (
        <div className="flex items-center gap-8">
          <DoughnutChart data={regionPercents} />
          <ul className="inline-grid grid-cols-1 gap-y-2">
            {regionPercents.map((r) => (
              <li key={r.name} className="flex items-center">
                <span className={`inline-block mr-3 h-3 w-3 rounded-full ${r.color.dot}`} />
                <span className="text-slate">{r.percent}%</span>
                <span className="ml-2 text-moss">{r.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}