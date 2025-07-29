// src/app/explore/list/components/MunroTable.tsx
// Creates the munro list table component to display a list of Munros

'use client';
import type { Munro } from '@/types/data/dataTypes';
import { useBaggedMunroContext } from '@/contexts/BaggedMunroContext';
import { useListPageContext } from '@/contexts/ListPageContext';
import { useSortedMunros } from '@/hooks/useMunroSort';
import MunroTableRow from './MunroTableRow';
import { MunroSortColumn } from '@/utils/list/listPageUtils';
import { SortAsc, SortDesc } from '@/components/global/SvgComponents';

type MunroTableProps = {
  munros: Munro[];
  baggedMunroIds?: number[];
  highlightedMunroId?: number;
};

const columns = [
  { key: "status", label: "Status" },
  { key: "name", label: "Name" },
  { key: "region", label: "Region" },
  { key: "height", label: "Height" },
  { key: "rank", label: "Rank" },
  { key: "latitude", label: "Latitude" },
  { key: "longitude", label: "Longitude" },
  { key: "link", label: "Map Link" }
];

const COLUMN_WIDTHS = [
    "minmax(170px, 12%)", // Status
    "1fr",                // Name
    "1fr",                // Region
    "minmax(80px, 10%)",  // Height
    "minmax(60px, 10%)",  // Rank
    "minmax(120px, 12%)", // Latitude
    "minmax(120px, 12%)", // Longitude
    "minmax(120px, 5%)",   // Map Link
];
const gridTemplate = COLUMN_WIDTHS.join(' ');

function normalize(str: string) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

export default function MunroTable({ munros }: MunroTableProps) {
  const { sortColumn, setSortColumn, sortDirection, setSortDirection, search } = useListPageContext();
  const { isBagged } = useBaggedMunroContext();

  const normalizedSearch = normalize(search.trim());

  const filteredMunros = normalizedSearch
    ? munros.filter(m => {
        const name = normalize(m.name);
        const region = normalize(m.region || '');
        const bagged = isBagged(m.id);

        // Match name or region
        if (name.includes(normalizedSearch) || region.includes(normalizedSearch)) {
          return true;
        }

        // Match bagged status
        if (
          normalizedSearch.includes('bagged') && bagged
        ) return true;
        if (
          normalizedSearch.includes('not bagged') && !bagged
        ) return true;

        return false;
      })
    : munros;

  const sortedMunros = useSortedMunros(filteredMunros, sortColumn, sortDirection, isBagged);

  function handleSort(col: string) {
    if (col === "link") return;
    if (sortColumn === col) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col as MunroSortColumn);
      setSortDirection("asc");
    }
  }

  return (
    <div className="flex flex-col h-full w-full min-w-0">
      <div
        className="grid border-b border-dashed border-sage sticky top-0 z-10 bg-mist min-w-0"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((col) => {
          const isSorted = sortColumn === col.key;
          const isAsc = isSorted && sortDirection === "asc";
          const isDesc = isSorted && sortDirection === "desc";
          return (
            <div
              key={col.key}
              className={`px-3 py-6 font-medium text-xl select-none flex items-center gap-3 transition-colors duration-100
                ${col.key === "link" ? "cursor-default text-moss" : "cursor-pointer"}
                ${isSorted && col.key !== "link" ? "text-slate" : "text-moss"}
              `}
              onClick={() => handleSort(col.key)}
            >
              <span>{col.label}</span>
              {col.key !== "link" && (
                <span className="flex flex-col gap-1">
                  {/* Up chevron */}
                  <span className={`h-2 w-2 flex items-center justify-center ${isAsc ? "" : "opacity-30"}`}>
                    <SortAsc className={isAsc ? "text-slate" : "text-moss"} />
                  </span>
                  {/* Down chevron */}
                  <span className={`h-2 w-2 -mt-1 flex items-center justify-center ${isDesc ? "" : "opacity-30"}`}>
                    <SortDesc className={isDesc ? "text-slate" : "text-moss"} />
                  </span>
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-scroll no-scrollbar w-full divide-y divide-dashed divide-sage min-w-0">
        {sortedMunros.map((munro) => (
          <MunroTableRow
            key={munro.id}
            munro={munro}
            gridTemplate={gridTemplate}
          />
        ))}
      </div>
    </div>
  );
}