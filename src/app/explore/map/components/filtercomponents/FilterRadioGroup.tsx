// src/app/explore/map/components/filtercomponents/FilterRadioGroup.tsx
// Radio button group for selecting a single filter option (e.g., route style, difficulty).

import type { FilterRadioGroupProps } from '@/types/data/dataTypes';
import { TickIcon } from '@/components/global/SvgComponents';

export default function FilterRadioGroup({
    name,
    selectedValue,
    options,
    onChange
}: FilterRadioGroupProps) {
    return (
        <div className="flex flex-col">
            {options.map((option) => (
                <label key={option.value} className="flex gap-2 py-1 items-center cursor-pointer">
                <input
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={selectedValue === option.value}
                    onChange={() => onChange(option.value)}
                    className="hidden peer"
                />
                <div className="w-4 h-4 p-0.5 flex items-center justify-center border border-dashed border-sage text-mist text-[0px] rounded-full 
                                transition-all duration-300 ease-in-out 
                                peer-checked:bg-slate peer-checked:text-apple peer-checked:text-xs peer-checked:border-slate">
                    <TickIcon />
                </div>
                <span>{option.label}</span>
                </label>
            ))}
        </div>
    );
}