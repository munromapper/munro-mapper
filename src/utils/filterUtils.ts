// src/utils/filterUtils.ts
import { Filters } from '../types';

export function handleRadioFilterChange(
    name: string,
    value: string,
    setFilters: (updateFn: (prev: Filters) => Filters) => void,
) {
    setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
    }));
}

export function handleSliderFilterChange(
  name: string,
  value: number | number[],
  setFilters: (updateFn: (prev: Filters) => Filters) => void
) {
  setFilters((prev) => ({ ...prev, [name]: value }));
}

export function resetFilter(
    name: string,
    setFilters: (updateFn: (prev: Filters) => Filters) => void,
    defaultFilters: Filters
) {
    setFilters((prev) => ({
        ...prev,
        [name]: defaultFilters[name as keyof typeof defaultFilters],
    }));
}

export function isFilterChanged(
    name: string,
    currentFilters: Filters,
    defaultFilters: Filters
): boolean {
    const defaultValue = defaultFilters[name as keyof typeof defaultFilters];
    const currentValue = currentFilters[name as keyof typeof currentFilters];

    if (Array.isArray(defaultValue) && Array.isArray(currentValue)) {
        return (
            defaultValue.length !== currentValue.length ||
            defaultValue.some((val, i) => val !== currentValue[i])
        );
    }

    return defaultValue !== currentValue;
}

export function handleFilterToggle(
    filterName: string,
    openFilter: string | null,
    setOpenFilter: (name: string | null) => void,
) {
    setOpenFilter(openFilter === filterName ? null : filterName);
}