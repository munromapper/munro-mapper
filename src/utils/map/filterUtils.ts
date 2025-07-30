// src/utils/filterUtils.ts
// This file contains utility functions for handling filters in the application.

import type { Filters } from "@/types/data/dataTypes";

/**
 * Handles changes to radio filter inputs and updates the filters state.
 * @param name The name of the filter being changed
 * @param value The new value for the filter
 * @param setFilters Function to update the filters state
 */
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

/**
 * Handles changes to slider filter inputs and updates the filters state.
 * @param name The name of the filter being changed
 * @param value The new value for the filter, can be a single number or an array for range sliders
 * @param setFilters Function to update the filters state
 */
export function handleSliderFilterChange(
  name: string,
  value: number | number[],
  setFilters: (updateFn: (prev: Filters) => Filters) => void
) {
  setFilters((prev) => ({ ...prev, [name]: value }));
}

/**
 * Resets a specific filter to its default value.
 * @param name The name of the filter to reset
 * @param setFilters Function to update the filters state
 * @param defaultFilters The default filters object to reset to
 */
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

/**
 * Checks if a specific filter has changed from its default value.
 * @param name The name of the filter to check
 * @param currentFilters The current filters state
 * @param defaultFilters The default filters object
 * @returns True if the filter has changed, false otherwise
 */
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

/**
 * Handles the toggle state of a filter, allowing it to be opened or closed.
 * @param filterName The name of the filter to toggle
 * @param openFilter The currently open filter name, or null if none is open
 * @param setOpenFilter Function to update the open filter state
 */
export function handleFilterToggle(
    filterName: string,
    openFilter: string | null,
    setOpenFilter: (name: string | null) => void,
) {
    setOpenFilter(openFilter === filterName ? null : filterName);
}