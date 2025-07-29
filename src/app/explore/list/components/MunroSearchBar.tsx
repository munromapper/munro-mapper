'use client';

import { useListPageContext } from '@/contexts/ListPageContext';
import { SearchIcon, CrossIcon } from '@/components/global/SvgComponents';

export default function MunroSearchBar() {
  const { search, setSearch } = useListPageContext();
  return (
    <div className="max-w-[600px] flex-1 relative">
      <div className="absolute w-4 h-4 top-0 bottom-0 my-auto left-6 text-moss">
        <SearchIcon />
      </div>
      <input
      type="text"
      value={search}
      onChange={e => setSearch(e.target.value)}
      placeholder="Search Munros..."
      className="bg-pebble rounded-full w-full px-13 py-3 text-xl text-slate border border-mist 
                 placeholder:text-slate/50 
                 focus:bg-mist focus:border-slate focus:outline-none
                   transition duration-250 ease-in-out"
      aria-label="Search Munros"
      autoComplete="off"
    />
    {search && (
      <div
        onClick={() => setSearch('')}
        className="absolute right-6 top-0 bottom-0 my-auto w-6 h-6 p-1 text-moss cursor-pointer"
        aria-label="Clear search"
      >
        <CrossIcon />
      </div>
    )}
    </div>
  );
}