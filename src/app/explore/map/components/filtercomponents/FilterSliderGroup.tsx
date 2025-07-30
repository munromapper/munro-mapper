// src/app/explore/map/components/filtercomponents/FilterSliderGroup.tsx
// Slider input for selecting a numeric range filter (e.g., length, ascent).

import type { FilterSliderGroupProps } from '@/types/data/dataTypes';
import Slider from '@mui/material/Slider';

export default function FilterSliderGroup({
  value,
  onChange,
  onAfterChange,
  min,
  max,
  step,
  unit
}: FilterSliderGroupProps) {
  return (
    <div className='w-36 display-flex flex-col items-center gap-2'>
      <div className="mb-2">{value[0]} – {value[1]}{unit}</div>
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
          width: 'calc(100% - 16px)',
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
      <div className="flex justify-between text-m text-moss">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}