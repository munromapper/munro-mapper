// components/filters/FilterGroup.tsx
import FilterHeader from './FilterHeader';
import FilterFieldWrapper from './FilterFieldWrapper';
import { FilterGroupProps } from '@/types';

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