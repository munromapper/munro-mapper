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

  function escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function highlightParts(original: string, query: string) {
    if (!query) return [{ text: original, highlight: false }];

    const normOriginal = normalizeStr(original);
    const normQuery = normalizeStr(query);
    const idx = normOriginal.indexOf(normQuery);
    if (idx < 0) return [{ text: original, highlight: false }];

    // Map normalized indices back to original indices
    const mapNormToOrig: number[] = [];
    for (let oi = 0, ni = 0; oi < original.length; oi++) {
      const normChar = normalizeStr(original[oi]);
      // normChar can be multiple code points; count how many were produced
      for (let k = 0; k < normChar.length; k++) {
        mapNormToOrig[ni++] = oi;
      }
    }

    const startOrig = mapNormToOrig[idx] ?? 0;
    const endNorm = idx + normQuery.length - 1;
    const endOrig = (mapNormToOrig[endNorm] ?? original.length - 1) + 1;

    return [
      { text: original.slice(0, startOrig), highlight: false },
      { text: original.slice(startOrig, endOrig), highlight: true },
      { text: original.slice(endOrig), highlight: false },
    ];
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
        <div className="absolute z-60 w-3.5 h-3.5 top-0 bottom-0 my-auto left-6 text-moss">
          <SearchIcon />
        </div>
        <div className="absolute z-40 bg-mist w-full h-10 -top-10"></div>
        <input
          ref={inputRef}
          type="text"
          className="bg-pebble relative z-50 rounded-full w-full px-13 py-3 text-xl text-slate border border-mist
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
        <ul className="absolute left-[-1%] -top-10 pt-[6.5rem] p-4 w-[102%] no-scrollbar bg-mist text-slate rounded-xl z-30 max-h-80 overflow-y-auto shadow-standard">
            {suggestions.map((munro, idx) => (
            <li
              key={munro.id}
              className={`px-4 py-3 cursor-pointer rounded-xl hover:bg-pebble transition duration-250 ease-in-out ${
                activeIndex === idx ? "bg-pebble" : ""
              }`}
              onMouseDown={() => handleSelect(munro)}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <div className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 text-moss">
                  <SearchIcon />
                </span>
                <span className="text-xl">
                  {highlightParts(munro.name, query).map((part, i) => (
                    <span
                      key={i}
                      className={part.highlight ? "text-moss" : "text-slate"}
                    >
                      {part.text}
                    </span>
                  ))}
                </span>
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