// src/components/global/forms/RadioInput.tsx
// This file contains the radio input component used in forms.

interface RadioInputProps {
    name: string,
    value?: string,
    checked: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    label: string,
    className?: string
}

export default function RadioInput({
    name,
    checked,
    value,
    onChange,
    label,
    className
}: RadioInputProps) {
    return (
        <label className={`flex items-center justify-center text-l cursor-pointer gap-3 ${className}`}>
            <input
                type="radio"
                name={name}
                checked={checked}
                onChange={onChange}
                className="hidden peer"
                value={value}
            />
            <span className="w-4 h-4 flex items-center justify-center border border-dashed border-sage text-mist rounded-full transition-all duration-250 ease-in-out
                          peer-checked:bg-moss peer-checked:border-moss">
                <span className="w-2 h-2 bg-mist rounded-full transition-all duration-250 ease-in-out flex items-center justify-center"></span>
            </span>
            {label}
        </label>
    )
}