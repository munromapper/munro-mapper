import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { fetchMunroData } from "@/utils/data/clientDataFetchers";
import { Munro } from "@/types/data/dataTypes";
import { SearchIcon } from "../global/SvgComponents";
import { useAuthContext } from "@/contexts/AuthContext";
import { convertHeight, getHeightUnitLabel } from "@/utils/misc/unitConverters";

export default function HeaderSearchBar() {
  const [query, setQuery] = useState("");
  const [munros, setMunros] = useState<Munro[]>([]);
  const [suggestions, setSuggestions] = useState<Munro[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { userProfile } = useAuthContext();

  useEffect(() => {
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

  const heightUnit: "metres" | "feet" =
    userProfile?.preferences?.elevationUnit === "feet" ? "feet" : "metres";

  return (
    <div className="flex-1 relative mx-15">
        <div className="absolute w-4 h-4 top-0 bottom-0 my-auto left-6 text-moss">
        <SearchIcon />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="bg-pebble rounded-full w-full px-13 py-3 text-xl text-slate border border-mist
                      hover:border-sage
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
        <ul className="absolute left-0 top-full p-2 mt-2 w-full no-scrollbar bg-mist text-slate rounded-xl z-50 max-h-60 overflow-y-auto shadow-standard">
            {suggestions.map((munro, idx) => (
            <li
                key={munro.id}
                className={`px-4 py-2 cursor-pointer rounded-xl hover:bg-pebble transition duration-250 ease-in-out ${activeIndex === idx ? "bg-mist" : ""}`}
                onMouseDown={() => handleSelect(munro)}
                onMouseEnter={() => setActiveIndex(idx)}
            >
                <div>{munro.name}</div>
                <div className="text-l text-moss flex items-center gap-1">
                    <span>#{munro.id}</span>
                    <span className="mx-1">•</span>
                    <span>
                      {convertHeight(munro.height, heightUnit)}
                      {getHeightUnitLabel(heightUnit)}
                    </span>
                    <span className="mx-1">•</span>
                    <span>{munro.region}</span>
                </div>
            </li>
            ))}
            {suggestions.length === 0 && (
            <li className="px-4 py-2 text-moss">No results found</li>
            )}
        </ul>
        )}
    </div>
    );
}