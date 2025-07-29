// src/utils/listViewSortUtils.ts
// Utility functions for sorting and managing the Munro list in the explore/list page

import type { Munro } from "@/types/data/dataTypes";

export type MunroSortColumn = 'status' | 'name' | 'region' | 'height' | 'rank' | 'latitude' | 'longitude';
export type SortDirection = 'asc' | 'desc';

export function sortMunros(
  munros: Munro[],
  sortColumn: MunroSortColumn,
  sortDirection: SortDirection,
  isBagged: (id: number) => boolean
): Munro[] {
  return [...munros].sort((a, b) => {
    let aVal: string | number | boolean;
    let bVal: string | number | boolean;
    switch (sortColumn) {
      case 'status':
        aVal = isBagged(a.id) ? 1 : 0;
        bVal = isBagged(b.id) ? 1 : 0;
        break;
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'region':
        aVal = (a.region || '').toLowerCase();
        bVal = (b.region || '').toLowerCase();
        break;
      case 'height':
        aVal = a.height;
        bVal = b.height;
        break;
      case 'rank':
        aVal = a.id;
        bVal = b.id;
        break;
      case 'latitude':
        aVal = a.latitude;
        bVal = b.latitude;
        break;
      case 'longitude':
        aVal = a.longitude;
        bVal = b.longitude;
        break;
      default:
        return 0;
    }
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
}