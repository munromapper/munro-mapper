// src/app/explore/map/components/FilterComponent.tsx
'use client'
import { useState, useEffect } from 'react';
import { useMapData } from '@/contexts/MapDataContext';
import { handleRadioFilterChange, handleSliderFilterChange, resetFilter, isFilterChanged, handleFilterToggle } from '@/utils/filterUtils';
import FilterGroup from './FilterGroup'; // Importing the Filter Components
import FilterRadioGroup from './FilterRadioGroup';
import FilterSliderGroup from './FilterSliderGroup';

export default function FilterComponent() {

    const { filters, setFilters, defaultFilters } = useMapData();

    const routeStyleChanged = isFilterChanged('routeStyle', filters, defaultFilters);
    const difficultyChanged = isFilterChanged('difficulty', filters, defaultFilters);
    const lengthChanged = isFilterChanged('length', filters, defaultFilters);
    const ascentChanged = isFilterChanged('ascent', filters, defaultFilters);

    const [lengthRange, setLengthRange] = useState(filters.length);
    const [ascentRange, setAscentRange] = useState(filters.ascent);

    const [openFilter, setOpenFilter] = useState<string | null>(null);

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

    const lengthLabel = lengthChanged ? `${lengthRange[0]}–${lengthRange[1]}km` : undefined;
    const ascentLabel = ascentChanged ? `${ascentRange[0]}–${ascentRange[1]}m` : undefined;

    useEffect(() => {
        setLengthRange(filters.length);
        setAscentRange(filters.ascent);
    }, [filters.length, filters.ascent]);

    return (
        <div className="relative flex gap-4 text-l pointer-events-auto">

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
                    onChange={(val) => handleRadioFilterChange({ target: { name: 'routeStyle', value: val } } as any, setFilters)}
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
                    onChange={(val) => handleRadioFilterChange({ target: { name: 'difficulty', value: val } } as any, setFilters)}
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
                resetFilter('length', setFilters, defaultFilters);
                }}
            >
                <FilterSliderGroup
                value={lengthRange}
                onChange={setLengthRange}
                onAfterChange={(val) => handleSliderFilterChange('length', val, setFilters)}
                min={defaultFilters.length[0]}
                max={defaultFilters.length[1]}
                step={1}
                unit="km"
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
                resetFilter('ascent', setFilters, defaultFilters);
                }}
            >
                <FilterSliderGroup
                value={ascentRange}
                onChange={setAscentRange}
                onAfterChange={(val) => handleSliderFilterChange('ascent', val, setFilters)}
                min={defaultFilters.ascent[0]}
                max={defaultFilters.ascent[1]}
                step={25}
                unit="m"
                />
            </FilterGroup>

        </div>
    )

}