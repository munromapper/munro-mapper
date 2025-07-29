import { useMemo } from 'react';
import type { Munro } from '@/types/data/dataTypes';
import { sortMunros, MunroSortColumn, SortDirection } from '@/utils/list/listPageUtils';

export function useSortedMunros(
  munros: Munro[],
  sortColumn: MunroSortColumn,
  sortDirection: SortDirection,
  isBagged: (id: number) => boolean
) {
  return useMemo(
    () => sortMunros(munros, sortColumn, sortDirection, isBagged),
    [munros, sortColumn, sortDirection, isBagged]
  );
}