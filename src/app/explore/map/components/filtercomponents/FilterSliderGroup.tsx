// src/app/explore/map/components/filtercomponents/FilterSliderGroup.tsx
// Slider input for selecting a numeric range filter (e.g., length, ascent).

import { useEffect, useState } from 'react';
import type { FilterSliderGroupProps } from '@/types/data/dataTypes';
import Slider from '@mui/material/Slider';
import { CrossIcon } from '@/components/global/SvgComponents';

export default function FilterSliderGroup({
  value,
  onChange,
  onAfterChange,
  min,
  max,
  step,
  unit,
  title,
  onClose
}: FilterSliderGroupProps) {
  const [isMaxMd, setIsMaxMd] = useState(false);

  useEffect(() => {
    const check = () => setIsMaxMd(typeof window !== 'undefined' && window.innerWidth <= 1000);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className={isMaxMd ? 'w-full' : 'w-40'}>
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

      <div className={isMaxMd ? 'px-6 py-4' : 'py-4 px-6'}>
        <div className="mb-2 text-slate">{value[0]} – {value[1]}{unit}</div>
        <Slider
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(_, newValue) => onChange(newValue as [number, number])}
          onChangeCommitted={(_, newValue) => onAfterChange?.(newValue as [number, number])}
          valueLabelDisplay="off"
          sx={{
            display: 'block',
            height: 4,
            padding: '12px 0px',
            width: isMaxMd ? '100%' : 'calc(100% - 16px)',
            margin: '0 auto',
            '& .MuiSlider-thumb': {
              width: 16,
              height: 16,
              backgroundColor: '#D0E399',
              border: 'none',
              boxShadow: 'none',
            },
            '& .MuiSlider-track': {
              height: 4,
              borderRadius: 2,
              backgroundColor: '#161D18',
              border: 'none'
            },
            '& .MuiSlider-rail': {
              height: 4,
              borderRadius: 2,
              backgroundColor: '#C5CCB6',
              opacity: 1,
            },
          }}
        />
        <div className="flex justify-between text-m text-moss mt-2">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );
}