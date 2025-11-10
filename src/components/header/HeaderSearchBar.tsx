import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchMunroData } from "@/utils/data/clientDataFetchers";
import { Munro } from "@/types/data/dataTypes";
import { SearchIcon } from "../global/SvgComponents";

export default function HeaderSearchBar() {
  const [query, setQuery] = useState("");
  const [munros, setMunros] = useState<Munro[]>([]);
  const [suggestions, setSuggestions] = useState<Munro[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch munros on mount
    fetchMunroData().then(data => {
      if (data) setMunros(data);
    });
  }, []);

  function normalizeStr(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  useEffect(() => {
    if (query.length === 0) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
    }
    const normalizedQuery = normalizeStr(query);
    const filtered = munros.filter(m =>
        normalizeStr(m.name).includes(normalizedQuery)
    );
    setSuggestions(filtered);
    setShowDropdown(filtered.length > 0);
    setActiveIndex(-1);
}, [query, munros]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      handleSelect(suggestions[activeIndex]);
    }
  };

  const handleSelect = (munro: Munro) => {
    setQuery("");
    setShowDropdown(false);
    router.push(`/explore/map/munro/${encodeURIComponent(munro.slug)}`);
  };

  return (
    <div className="flex-1 relative mx-15">
        <div className="absolute w-4 h-4 top-0 bottom-0 my-auto left-6 text-moss">
        <SearchIcon />
        </div>
        <input
        ref={inputRef}
        type="text"
        className="bg-pebble rounded-full w-full px-13 py-3 text-xl text-slate border border-mist 
                    placeholder:text-slate/50 
                    focus:bg-mist focus:border-slate focus:outline-none
                    transition duration-250 ease-in-out"
        placeholder="Search Munros"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowDropdown(suggestions.length > 0)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        aria-label="Search for munros"
        autoComplete="off"
        />
        {showDropdown && (
        <ul className="absolute left-0 top-full mt-2 w-full bg-mist text-slate rounded-xl z-50 max-h-60 overflow-y-auto border border-sage">
            {suggestions.map((munro, idx) => (
            <li
                key={munro.id}
                className={`px-4 py-2 cursor-pointer ${activeIndex === idx ? "bg-mist" : ""}`}
                onMouseDown={() => handleSelect(munro)}
                onMouseEnter={() => setActiveIndex(idx)}
            >
                {munro.name}
            </li>
            ))}
            {suggestions.length === 0 && (
            <li className="px-4 py-2 text-sage">No results found</li>
            )}
        </ul>
        )}
    </div>
    );
}