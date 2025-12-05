// src/app/explore/map/components/filtercomponents/FilterRadioGroup.tsx
// Radio button group for selecting a single filter option (e.g., route style, difficulty).

import { useEffect, useState } from 'react';
import type { FilterRadioGroupProps } from '@/types/data/dataTypes';
import { TickIcon, CrossIcon } from '@/components/global/SvgComponents';

export default function FilterRadioGroup({
  name,
  selectedValue,
  options,
  onChange,
  title,
  onClose
}: FilterRadioGroupProps) {
  const [isMaxMd, setIsMaxMd] = useState(false);

  useEffect(() => {
    const check = () => setIsMaxMd(typeof window !== 'undefined' && window.innerWidth <= 1000);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="w-full">
      {isMaxMd && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-pebble rounded-t-2xl">
          <span className="text-slate text-xxl">
            {title}
          </span>
          <button
            type="button"
            aria-label="Close"
            className="w-8 h-8 p-2.5 rounded-full bg-pebble flex items-center justify-center text-slate cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
          >
            <CrossIcon />
          </button>
        </div>
      )}

      <div className={isMaxMd ? 'grid grid-cols-2 gap-x-6 gap-y-2 px-6 py-4' : 'flex flex-col pt-4 pr-9 pb-4 pl-6'}>
        {options.map((option) => (
          <label key={option.value} className="flex gap-2 max-md:gap-3 py-1 items-center cursor-pointer select-none">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="hidden peer"
            />
            <div
              className="w-4 h-4 max-md:w-5 max-md:h-5 p-0.5 flex items-center justify-center border border-dashed border-sage text-mist text-[0px] rounded-full
                         transition-all duration-300 ease-in-out
                         peer-checked:bg-apple peer-checked:text-slate peer-checked:text-xs peer-checked:border-apple"
            >
              <TickIcon />
            </div>
            <span className="text-slate">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}