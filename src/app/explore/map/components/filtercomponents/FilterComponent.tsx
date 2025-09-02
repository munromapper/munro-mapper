// src/app/explore/map/components/FilterComponent.tsx
// Main filter panel for the map. Manages filter state and renders filter groups.

'use client'
import { useState, useEffect } from 'react';
import { useMapState } from '@/contexts/MapStateContext';
import { handleRadioFilterChange, handleSliderFilterChange, resetFilter, isFilterChanged, handleFilterToggle } from '@/utils/map/filterUtils';
import FilterGroup from './FilterGroup';
import FilterFriendsGroup from './FilterFriendsGroup';
import FilterRadioGroup from './FilterRadioGroup';
import FilterSliderGroup from './FilterSliderGroup';
import { motion, AnimatePresence } from "framer-motion";
import { FilterIcon, CrossIcon } from '@/components/global/SvgComponents';
import FilterCheckboxGroup from './FilterCheckboxGroup';
import { convertHeight, convertLength } from '@/utils/misc/unitConverters';

export default function FilterComponent() {

    const { filters, setFilters, defaultAscentRanges, defaultLengthRanges, defaultFilters, openFilter, setOpenFilter, userLengthUnits, userAscentUnits } = useMapState();

    const ascentDefault = userAscentUnits === 'ft'
        ? defaultAscentRanges.ft
        : defaultAscentRanges.m;
    const lengthDefault = userLengthUnits === 'mi'
        ? defaultLengthRanges.mi
        : defaultLengthRanges.km;
    const routeStyleChanged = isFilterChanged('routeStyle', filters, defaultFilters);
    const difficultyChanged = isFilterChanged('difficulty', filters, defaultFilters);
    const lengthChanged = isFilterChanged('length', filters, {
        ...defaultFilters,
        length: lengthDefault,
    });
    const ascentChanged = isFilterChanged('ascent', filters, {
        ...defaultFilters,
        ascent: ascentDefault,
    });
    const [filtersVisible, setFiltersVisible] = useState(true);

    const [ascentRange, setAscentRange] = useState(ascentDefault);
    const [lengthRange, setLengthRange] = useState(lengthDefault);

    const routeStyleLabels: Record<string, string> = {
        'circular-loop': 'Circular Loop',
        'out-and-back': 'Out and Back',
        'point-to-point': 'Point to Point'
    };

    const difficultyLabels: Record<string, string> = {
        all: 'All',
        easy: 'Easy',
        moderate: 'Moderate',
        hard: 'Hard',
        technical: 'Technical'
    };

    useEffect(() => {
        setLengthRange(lengthDefault);
        setFilters(f => ({ ...f, length: lengthDefault }));
    }, [userLengthUnits]);

    useEffect(() => {
        setAscentRange(ascentDefault);
        setFilters(f => ({ ...f, ascent: ascentDefault }));
    }, [userAscentUnits]);

    const lengthLabel = lengthChanged ? `${lengthRange[0]}–${lengthRange[1]}${userLengthUnits}` : undefined;
    const ascentLabel = ascentChanged ? `${ascentRange[0]}–${ascentRange[1]}${userAscentUnits}` : undefined;

    const anyFilterChanged = routeStyleChanged || difficultyChanged || lengthChanged || ascentChanged || filters.friends.selectedPeople.length > 0;

    function handleResetAllFilters(e: React.MouseEvent) {
        e.stopPropagation();
        setFilters(defaultFilters);
        setLengthRange(lengthDefault);
        setAscentRange(ascentDefault);
    }

    return (
        <div className="relative self-start flex items-start gap-4 flex-1 text-l pointer-events-auto">
            <div
                className={`rounded-full text-nowrap border pt-2 pb-2 pl-5 pr-4 flex items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out
                ${anyFilterChanged ? 'bg-pebble border-slate' : 'bg-mist border-mist'}`}
                onClick={() => setFiltersVisible(v => !v)}
            >
                <div className="pointer-events-none flex items-center gap-2">
                    <div className="w-3 h-3">
                        <FilterIcon />
                    </div>
                    <span>
                        Filters
                    </span>
                </div>
                {anyFilterChanged && (
                    <div
                        className="w-5 h-5 p-1 flex items-center justify-center cursor-pointer"
                        onClick={e => { e.stopPropagation(); handleResetAllFilters(e); }}
                        title="Reset all filters"
                    >
                        <CrossIcon />
                    </div>
                )}
            </div>

            <AnimatePresence>
                {filtersVisible && (
                    <motion.div
                        key="filters"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full flex flex-wrap gap-4"
                    >
                        {/* ...all your FilterGroup components... */}
                        <FilterGroup
                            id="friends"
                            label="Bagged Status"
                            isOpen={openFilter === 'friends'}
                            isActive={filters.friends.selectedPeople.length > 0}
                            onToggle={() => handleFilterToggle('friends', openFilter, setOpenFilter)}
                            onReset={(e) => {
                                e.stopPropagation();
                                resetFilter('friends', setFilters, defaultFilters);
                            }}
                        >
                            <FilterFriendsGroup 
                                value={filters.friends}
                                onChange={val => setFilters(f => ({ ...f, friends: val }))}
                            />
                        </FilterGroup>
                        <FilterGroup
                            id="routeStyle"
                            label="Route Style"
                            currentValue={routeStyleChanged ? routeStyleLabels[filters.routeStyle] : undefined}
                            isOpen={openFilter === 'routeStyle'}
                            isActive={routeStyleChanged}
                            onToggle={() => handleFilterToggle('routeStyle', openFilter, setOpenFilter)}
                            onReset={(e) => {
                                e.stopPropagation();
                                resetFilter('routeStyle', setFilters, defaultFilters);
                            }}
                        >
                            <FilterRadioGroup
                                name="routeStyle"
                                selectedValue={filters.routeStyle}
                                onChange={(val) => handleRadioFilterChange('routeStyle', val, setFilters)}
                                options={[
                                    { value: 'all', label: 'All' },
                                    { value: 'circular-loop', label: 'Circular Loop' },
                                    { value: 'out-and-back', label: 'Out and Back' },
                                    { value: 'point-to-point', label: 'Point to Point' }
                                ]}
                            />
                        </FilterGroup>
                        <FilterGroup
                            id="difficulty"
                            label="Difficulty"
                            currentValue={difficultyChanged ? difficultyLabels[filters.difficulty] : undefined}
                            isOpen={openFilter === 'difficulty'}
                            isActive={difficultyChanged}
                            onToggle={() => handleFilterToggle('difficulty', openFilter, setOpenFilter)}
                            onReset={(e) => {
                                e.stopPropagation();
                                resetFilter('difficulty', setFilters, defaultFilters);
                            }}
                        >
                            <FilterRadioGroup
                                name="difficulty"
                                selectedValue={filters.difficulty}
                                onChange={(val) => handleRadioFilterChange('difficulty', val, setFilters)}
                                options={[
                                    { value: 'all', label: 'All' },
                                    { value: 'easy', label: 'Easy' },
                                    { value: 'moderate', label: 'Moderate' },
                                    { value: 'hard', label: 'Hard' },
                                    { value: 'technical', label: 'Technical' }
                                ]}
                            />
                        </FilterGroup>
                        <FilterGroup
                            id="length"
                            label="Length"
                            currentValue={lengthLabel}
                            isOpen={openFilter === 'length'}
                            isActive={lengthChanged}
                            onToggle={() => handleFilterToggle('length', openFilter, setOpenFilter)}
                            onReset={(e) => {
                                e.stopPropagation();
                                resetFilter('length', setFilters, {
                                    ...defaultFilters,
                                    length: lengthDefault,
                                });
                                setLengthRange(lengthDefault);
                            }}
                        >
                            <FilterSliderGroup
                                value={lengthRange}
                                onChange={setLengthRange}
                                onAfterChange={val => handleSliderFilterChange('length', val, setFilters)}
                                min={lengthDefault[0]}
                                max={lengthDefault[1]}
                                step={userLengthUnits === 'mi' ? 1 : 1}
                                unit={userLengthUnits === 'mi' ? 'mi' : 'km'}
                            />
                        </FilterGroup>
                        <FilterGroup
                            id="ascent"
                            label="Ascent"
                            currentValue={ascentLabel}
                            isOpen={openFilter === 'ascent'}
                            isActive={ascentChanged}
                            onToggle={() => handleFilterToggle('ascent', openFilter, setOpenFilter)}
                            onReset={(e) => {
                                e.stopPropagation();
                                resetFilter('ascent', setFilters, {
                                    ...defaultFilters,
                                    ascent: ascentDefault,
                                });
                                setAscentRange(ascentDefault);
                            }}
                        >
                            <FilterSliderGroup
                                value={ascentRange}
                                onChange={setAscentRange}
                                onAfterChange={val => handleSliderFilterChange('ascent', val, setFilters)}
                                min={ascentDefault[0]}
                                max={ascentDefault[1]}
                                step={userAscentUnits === 'ft' ? 75 : 25}
                                unit={userAscentUnits === 'ft' ? 'ft' : 'm'}
                            />
                        </FilterGroup>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )

}