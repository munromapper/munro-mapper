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
import { CrossIcon, PremiumIcon } from '@/components/global/SvgComponents';
import FilterCheckboxGroup from './FilterCheckboxGroup';
import { convertHeight, convertLength } from '@/utils/misc/unitConverters';
import { useAuthContext } from '@/contexts/AuthContext';

export default function FilterComponent() {

    const { filters, setFilters, defaultAscentRanges, defaultLengthRanges, defaultFilters, openFilter, setOpenFilter, userLengthUnits, userAscentUnits } = useMapState();
    const { user, userProfile, openPremiumAdModal } = useAuthContext();
    const [isMaxMd, setIsMaxMd] = useState(false);

    useEffect(() => {
        const checkBreakpoint = () => setIsMaxMd(window.innerWidth <= 1000);
        checkBreakpoint();
        window.addEventListener('resize', checkBreakpoint);
        return () => window.removeEventListener('resize', checkBreakpoint);
    }, []);

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
    const [filtersVisible, setFiltersVisible] = useState(false);

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

    useEffect(() => {
        if (filters.length[0] !== lengthRange[0] || filters.length[1] !== lengthRange[1]) {
            setLengthRange(filters.length as [number, number]);
        }
    }, [filters.length]);

    useEffect(() => {
        if (filters.ascent[0] !== ascentRange[0] || filters.ascent[1] !== ascentRange[1]) {
            setAscentRange(filters.ascent as [number, number]);
        }
    }, [filters.ascent]);

    function handleResetAllFilters(e: React.MouseEvent) {
        e.stopPropagation();
        setFilters(defaultFilters);
        setLengthRange(lengthDefault);
        setAscentRange(ascentDefault);
    }

    const handleFilterClick = () => {
        if (filtersVisible) {
            setFiltersVisible(false);
            return;
        }
        setFiltersVisible(v => !v);
        const isPremium = !!user && ['active', 'canceling'].includes(userProfile?.isPremium ?? '');
        if (!isPremium) {
            openPremiumAdModal();
        }
    };

    const isPremium = !!user && ['active', 'canceling'].includes(userProfile?.isPremium ?? '');

    return (
        <div className="relative self-start flex items-start gap-4 flex-1 text-l pointer-events-auto max-md:ml-4 max-md:pr-4 max-md:overflow-auto no-scrollbar">
            <div
                className={`rounded-full shadow-standard text-nowrap border pt-2 pb-2 pl-5 pr-4 flex items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out max-md:hidden
                ${anyFilterChanged ? 'bg-pebble border-slate' : 'bg-mist border-mist'}`}
                onClick={handleFilterClick}
            >
                <div className="pointer-events-none flex items-center gap-2">
                    {!isPremium && (
                        <div className="w-4 h-4">
                            <PremiumIcon currentColor="var(--color-heather)" />
                        </div>
                    )}
                    <span>
                        Filter Hills
                    </span>
                </div>
                <div
                    className="w-5 h-5 p-1 flex items-center justify-center cursor-pointer"
                    onClick={e => {
                        e.stopPropagation();
                        if (anyFilterChanged) {
                            handleResetAllFilters(e);
                        } else {
                            setFiltersVisible(v => !v);
                        }
                    }}
                    title={
                        anyFilterChanged
                            ? "Reset all filters"
                            : filtersVisible
                                ? "Hide filters"
                                : "Show filters"
                    }
                >
                    {anyFilterChanged ? (
                        <CrossIcon />
                    ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div
                                className="absolute left-1/2 top-1/2 w-full h-[1px] bg-slate transition-colors duration-300"
                                style={{ transform: 'translate(-50%, -50%)' }}
                            />
                            <div
                                className="absolute left-1/2 top-1/2 w-[1px] h-full bg-slate transition-transform duration-300"
                                style={{
                                    transform: `translate(-50%, -50%) ${filtersVisible ? 'rotate(90deg)' : 'rotate(0deg)'}`
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {(filtersVisible || isMaxMd) && (
                    <motion.div
                        key="filters"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full flex flex-wrap gap-4 max-md:flex-nowrap"
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