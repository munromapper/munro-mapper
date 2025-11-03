// src/app/explore/dashboard/components/BaggedMunros.tsx
// This file contains the total bagged munros component for the dashboard page

'use client';

import React, { useMemo } from 'react';
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { RoundedTick } from '@/components/global/SvgComponents';

const TOTAL_MUNROS = 282;

// Pick a message based on completion percentage
function getProgressMessage(pct: number) {
  if (pct <= 0) return "Get out there and climb some hills!";
  if (pct >= 100) return "Time for some corbetts?";
  if (pct < 25) return "Great start — keep going!";
  if (pct < 50) return "Great progress - over a quarter done!";
  if (pct < 75) return "Over halfway — great work!";
  return "So close — the finish is in sight!";
}

function Donut({
  value,
  total,
  size = 150,
  strokeWidth = 14,
  className = '',
  centerNumber,
  centerLabel = 'Munros',
}: {
  value: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  centerNumber?: number | string;
  centerLabel?: string;
}) {
  const safeTotal = Math.max(total, 1);
  const clamped = Math.max(0, Math.min(value, safeTotal));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (clamped / safeTotal) * circumference;
  const centerYOffset = -Math.round(size * 0.05);
  const labelGap = Math.round(size * 0.25);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-label={`Progress ${clamped} of ${safeTotal}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-sage/25"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-apple"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 300ms ease' }}
      />
      {typeof centerNumber !== 'undefined' && (
        <g transform={`translate(0, ${centerYOffset})`}>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-slate"
            fontSize={Math.round(size * 0.28)}
          >
            {centerNumber}
          </text>
          <text
            x="50%"
            y="50%"
            dy={labelGap}
            textAnchor="middle"
            className="fill-moss"
            fontSize={Math.round(size * 0.10)}
          >
            {centerLabel}
          </text>
        </g>
      )}
    </svg>
  );
}

export default function BaggedMunros() {
  const { user } = useAuthContext();
  const { userBaggedMunros, loading, error } = useBaggedMunroContext();

  // Memoise all derived values so they persist across tab switches
  const {
    bagged,
    unbagged,
    baggedPct,
    unbaggedPct,
    progressMessage,
  } = useMemo(() => {
    const bagged = userBaggedMunros.length;
    const unbagged = Math.max(TOTAL_MUNROS - bagged, 0);
    const baggedPct = bagged === 0 ? 0 : Math.max(1, Math.round((bagged / TOTAL_MUNROS) * 100));
    const unbaggedPct = 100 - baggedPct;
    const progressMessage = getProgressMessage(baggedPct);
    return { bagged, unbagged, baggedPct, unbaggedPct, progressMessage };
  }, [userBaggedMunros]);

  return (
    <section className="rounded-xl p-9 border flex-1 border-sage">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xxxl text-slate">Munros Bagged</h2>
        <span className="h-9 w-9 p-2.5 rounded-md bg-pebble text-slate">
            <RoundedTick />
        </span>
      </div>

      {loading ? (
        <div className="flex items-center gap-6">
          <div className="h-32 w-32 animate-pulse rounded-full bg-lime-100" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <div className="shrink-0">
            <Donut
              value={bagged}
              total={TOTAL_MUNROS}
              centerNumber={bagged}
              centerLabel="Munros"
            />
          </div>
          <div className="space-y-2">
            <p className="text-slate">
              You’ve bagged <span className="font-medium">{bagged}</span> out of{' '}
              <span className="font-medium">{TOTAL_MUNROS}</span> Munros. {progressMessage}
            </p>

            <ul className="mt-3 flex flex-col gap-1">
              <li className="flex items-center gap-2">
                <span className="inline-block shrink-0 h-3 w-3 rounded-full bg-apple" />
                <span className="text-slate-700">{baggedPct}% bagged</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block shrink-0 h-3 w-3 rounded-full bg-sage/25" />
                <span className="text-slate-700">{unbaggedPct}% not bagged</span>
              </li>
            </ul>
            {error ? (
              <p className="text-sm text-red-600">Failed to load: {error}</p>
            ) : null}
          </div>
        </div>
      )}
    </section>
  );
}