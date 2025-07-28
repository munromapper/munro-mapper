// src/components/global/forms/SearchInput.tsx
// This file defines a SearchInput component that allows users to input search queries.

import { SearchIcon } from "../SvgComponents";

interface SearchInputProps {
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchInput({
    name,
    value,
    onChange,
    placeholder = "Search..."
}: SearchInputProps) {
    return (
        <div className="relative">
            <div className="text-moss w-3 h-3 absolute left-3 top-0 bottom-0 my-auto">
                <SearchIcon />
            </div>
            <input
                type="text"
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="pr-4 pl-8 py-2 w-full rounded-full bg-pebble text-slate text-l border border-pebble
                           placeholder:text-slate/50
                           hover:border-sage
                           focus:border-moss focus:bg-mist focus:outline-none
                           transition duration-250 ease-in-out"
            />
        </div>
    );
}