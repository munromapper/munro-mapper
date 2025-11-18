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
    className?: string,
    size?: "default" | "large"
}

export default function CheckboxInput({
    name,
    checked,
    value,
    onChange,
    label,
    disabled,
    className,
    size = "default"
}: CheckboxInputProps) {

    const sizeClasses = size === "large"
        ? "h-8 px-4 text-xl"
        : "py-1 px-3 text-l";
    
    const circleSizeClasses = size === "large"
        ? "w-4 h-4"
        : "w-3.75 h-3.75";    

    return (
        <label className={`flex items-center justify-center ${sizeClasses} cursor-pointer gap-3
            ${className === "bagged-checkbox" ? "text-slate" : "text-moss"}
            ${className ? className : ""}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="hidden peer"
                disabled={disabled}
                value={value}
            />
            <span className={`${circleSizeClasses} flex items-center justify-center border border-dashed border-sage text-transparent rounded-full transition-all duration-250 ease-in-out
                ${className === "bagged-checkbox"
                    ? "peer-checked:bg-slate peer-checked:border-slate peer-checked:text-apple"
                    : "peer-checked:bg-apple peer-checked:border-apple peer-checked:text-slate"
                }`}>
                <span className="p-0.5 transition-all duration-250 ease-in-out flex items-center justify-center">
                    <TickIcon />
                </span>
            </span>
            {label}
        </label>
    )
}