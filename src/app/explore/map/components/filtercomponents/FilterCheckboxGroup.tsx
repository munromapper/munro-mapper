// src/app/explore/map/components/filtercomponents/FilterCheckboxGroup.tsx
// This component renders a basic checkbox filter

import { TickIcon } from '@/components/global/SvgComponents';
import type { FilterCheckboxProps } from '@/types/data/dataTypes';

export default function FilterCheckboxGroup({
  checked = false,
  onChange,
  label,
}: FilterCheckboxProps) {

  return (
    <div className="p-6">
      <div
        className="inline-flex relative items-center"
        style={{ position: "relative" }}
      >
        <input
          type="checkbox"
          className="hidden peer"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          id={`checkbox-button-${label.replace(/\s+/g, '-')}`}
        />
        <div
          className={`
            w-5 h-5 p-1 flex items-center justify-center rounded-full border border-dashed mr-3 absolute left-4 pointer-events-none
            transition-all duration-300 ease-in-out
            border-sage bg-transparent text-transparent
            peer-checked:bg-slate peer-checked:text-apple peer-checked:border-slate
          `}
        >
          <TickIcon />
        </div>
        <label
          htmlFor={`checkbox-button-${label.replace(/\s+/g, '-')}`}
          className={`
            flex items-center px-4 py-2 pl-12 rounded-full
            cursor-pointer select-none
            bg-mist border border-mist
            transition-all duration-300 ease-in-out
            peer-checked:bg-pebble peer-checked:text-slate peer-checked:border-slate
          `}
        >
          <span className="text-l font-normal transition-colors duration-300 ease-in-out">
            {label}
          </span>
        </label>
      </div>
    </div>
  );
}