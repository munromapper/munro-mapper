// src/app/explore/map/components/filtercomponents/FilterHeader.tsx
import { ChevronIcon, CrossIcon } from '@/SvgIcons';
import { FilterHeaderProps } from '@/types';

export default function FilterHeader({ label, currentValue, isActive, isOpen, onClick, onReset }: FilterHeaderProps) {
  return (
    <div
      className={`rounded-full border pt-2 pb-2 pl-5 pr-4 flex items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out 
      ${isActive ? 'bg-pebble border-slate' : 'bg-mist border-mist'}`}
      onClick={onClick}
    >
      <label className="pointer-events-none">
        {isActive && currentValue ? currentValue : label}
      </label>
      {!isActive && (
        <div className={`w-5 h-5 p-1 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronIcon />
        </div>
      )}
      {isActive && (
        <div className="w-5 h-5 p-1 flex items-center justify-center cursor-pointer" onClick={onReset}>
          <CrossIcon />
        </div>
      )}
    </div>
  );
}