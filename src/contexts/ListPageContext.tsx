// src/contexts/ListPageContext.tsx
// Context for managing states in the Munro list page

'use client';
import { MunroSortColumn } from "@/utils/list/listPageUtils";
import { createContext, useContext, useState } from 'react';

type SortDirection = 'asc' | 'desc';

type ListPageContextType = {
  sortColumn: MunroSortColumn;
  setSortColumn: (col: MunroSortColumn) => void;
  sortDirection: SortDirection;
  setSortDirection: (dir: SortDirection) => void;
  search: string;
  setSearch: (s: string) => void;
};

const ListPageContext = createContext<ListPageContextType | undefined>(undefined);

export function ListPageProvider({ children }: { children: React.ReactNode }) {
  const [sortColumn, setSortColumn] = useState<MunroSortColumn>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [search, setSearch] = useState<string>("");

  return (
    <ListPageContext.Provider value={{ sortColumn, setSortColumn, sortDirection, setSortDirection, search, setSearch }}>
      {children}
    </ListPageContext.Provider>
  );
}

export function useListPageContext() {
  const ctx = useContext(ListPageContext);
  if (!ctx) throw new Error('useListPageContext must be used within a ListPageProvider');
  return ctx;
}