// src/components/global/forms/CheckboxInput.tsx
// This file contains the checkbox input component used in forms.

import { TickIcon } from "../SvgComponents"

interface CheckboxInputProps {
    name: string,
    value?: string,
    checked: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    label: string,
    disabled?: boolean,
    className?: string
}

export default function CheckboxInput({
    name,
    checked,
    value,
    onChange,
    label,
    disabled,
    className
}: CheckboxInputProps) {
    return (
        <label className={`flex items-center text-moss justify-center py-1 px-3 text-l cursor-pointer gap-3 ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="hidden peer"
                disabled={disabled}
                value={value} // Optional value prop for checkbox
            />
            <span className="w-3.75 h-3.75 flex items-center justify-center border border-dashed border-sage text-transparent rounded-full transition-all duration-250 ease-in-out
                          peer-checked:bg-sage peer-checked:border-sage peer-checked:text-slate">
                <span className="p-0.5 transition-all duration-250 ease-in-out flex items-center justify-center">
                    <TickIcon />
                </span>
            </span>
            {label}
        </label>
    )
}