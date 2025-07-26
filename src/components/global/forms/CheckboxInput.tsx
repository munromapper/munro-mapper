// src/components/global/forms/CheckboxInput.tsx
// This file contains the checkbox input component used in forms.

import { TickIcon } from "../SvgComponents"

interface CheckboxInputProps {
    name: string,
    checked: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    label: string,
    className?: string
}

export default function CheckboxInput({
    name,
    checked,
    onChange,
    label,
    className
}: CheckboxInputProps) {
    return (
        <label className={`flex items-center justify-center text-l cursor-pointer gap-3 ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="hidden peer"
            />
            <span className="w-4 h-4 flex items-center justify-center border border-dashed border-sage text-mist rounded-full transition-all duration-250 ease-in-out
                          peer-checked:bg-slate peer-checked:border-slate peer-checked:text-apple">
                <span className="p-0.5 transition-all duration-250 ease-in-out flex items-center justify-center">
                    <TickIcon />
                </span>
            </span>
            {label}
        </label>
    )
}