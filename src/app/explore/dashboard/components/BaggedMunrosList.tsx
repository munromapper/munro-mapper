'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import { fetchMunroData } from '@/utils/data/clientDataFetchers';
import type { Munro } from '@/types/data/dataTypes';
import { TrophyIcon, SortAsc, SortDesc, LocationIcon } from '@/components/global/SvgComponents';
import Link from 'next/link';

type SortKey = 'name' | 'region' | 'height' | 'rank';
type SortOrder = 'asc' | 'desc';

const columns: { key: SortKey | 'link'; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'region', label: 'Region' },
  { key: 'height', label: 'Height' },
  { key: 'rank', label: 'Rank' },
  { key: 'link', label: 'Map Link' },
];

const COLUMN_WIDTHS = [
  "2fr",    // Name
  "1.5fr",  // Region
  "1fr",    // Height
  "1fr",    // Rank
  "minmax(120px, 5%)", // Map Link
];
const gridTemplate = COLUMN_WIDTHS.join(' ');

function sortMunros(
  munros: (Munro & { rank: number })[],
  sortKey: SortKey,
  sortOrder: SortOrder
): (Munro & { rank: number })[] {
  return [...munros].sort((a, b) => {
    if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
}

export default function BaggedMunrosList() {
  const { userBaggedMunros, loading, error } = useBaggedMunroContext();
  const [munros, setMunros] = useState<Array<Munro & { rank: number }>>([]);
  const [sortKey, setSortKey] = useState<SortKey>('height');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function loadMunros() {
      setDataLoading(true);
      const allMunros = await fetchMunroData();
      if (allMunros) {
        const bagged = allMunros
          .filter((m: Munro) => userBaggedMunros.includes(m.id))
          .map((m: Munro) => ({
            ...m,
            height: Math.round(m.height),
            rank: m.id,
          }));
        setMunros(bagged);
      }
      setDataLoading(false);
    }
    if (!loading) loadMunros();
  }, [userBaggedMunros, loading]);

  const handleSort = (key: SortKey | 'link') => {
    if (key === 'link') return;
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key as SortKey);
      setSortOrder('asc');
    }
  };

  const sortedMunros = useMemo(
    () => sortMunros(munros, sortKey, sortOrder),
    [munros, sortKey, sortOrder]
  );

  return (
    <section className="rounded-xl p-9 border border-sage h-full flex flex-col bg-mist">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xxxl text-slate">Your Bagged Munros</h2>
        <span className="h-9 w-9 p-2.5 rounded-md bg-pebble text-slate flex items-center justify-center">
          <TrophyIcon />
        </span>
      </div>
      {loading || dataLoading ? (
        <div className="h-24 w-full animate-pulse rounded bg-slate-100" />
      ) : error ? (
        <p className="text-sm text-red-600">Failed to load: {error}</p>
      ) : sortedMunros.length === 0 ? (
        <p className="text-slate">Bag some munros to view your list of bagged Munros.</p>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0 no-scrollbar w-full">
          {/* Table header */}
          <div
            className="grid border-sage sticky top-0 z-10 bg-pebble rounded-xl"
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {columns.map((col) => {
              const isSorted = sortKey === col.key;
              const isAsc = isSorted && sortOrder === "asc";
              const isDesc = isSorted && sortOrder === "desc";
              return (
                <div
                  key={col.key}
                  className={`px-4 py-4 text-xl select-none flex items-center gap-2 transition-colors duration-100
                    ${col.key === "link" ? "cursor-default text-moss" : "cursor-pointer"}
                    ${isSorted && col.key !== "link" ? "text-slate" : "text-moss"}
                  `}
                  onClick={() => handleSort(col.key)}
                >
                  <span>{col.label}</span>
                  {col.key !== "link" && (
                    <span className="flex flex-col gap-0.5 ml-1">
                      <span className={`h-2 w-2 flex items-center justify-center ${isAsc ? "" : "opacity-30"}`}>
                        <SortAsc className={isAsc ? "text-slate" : "text-moss"} />
                      </span>
                      <span className={`h-2 w-2 -mt-1 flex items-center justify-center ${isDesc ? "" : "opacity-30"}`}>
                        <SortDesc className={isDesc ? "text-slate" : "text-moss"} />
                      </span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {/* Table rows */}
          <div className="divide-y divide-dashed divide-sage">
            {sortedMunros.map((munro) => (
              <div
                key={munro.id}
                className="grid items-center text-xl bg-mist"
                style={{ gridTemplateColumns: gridTemplate }}
              >
                <div className="px-4 py-4">{munro.name}</div>
                <div className="px-4 py-4">{munro.region}</div>
                <div className="px-4 py-4">{munro.height}m</div>
                <div className="px-4 py-4">#{munro.rank}</div>
                <div className="px-4 py-4">
                  <Link href={`/explore/map/munro/${munro.slug}`}>
                    <button
                      className="rounded-lg h-8 w-8 p-2 border border-sage transition cursor-pointer hover:bg-apple"
                      aria-label={`View ${munro.name} on map`}
                    >
                      <LocationIcon />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}