// src/app/explore/map/components/filtercomponents/FilterGroup.tsx
// Wrapper for a single filter group (e.g., route style, difficulty, length, ascent) in the filter panel.

import FilterHeader from './FilterHeader';
import FilterFieldWrapper from './FilterFieldWrapper';
import type { FilterGroupProps } from '@/types/data/dataTypes';

export default function FilterGroup({ label, currentValue, isOpen, isActive, onToggle, onReset, children }: FilterGroupProps) {
  return (
    <div className="flex flex-col items-start gap-4 relative">
      <FilterHeader label={label} currentValue={currentValue} isActive={isActive} isOpen={isOpen} onClick={onToggle} onReset={onReset} />
      <FilterFieldWrapper isOpen={isOpen}>
        {children}
      </FilterFieldWrapper>
    </div>
  );
}