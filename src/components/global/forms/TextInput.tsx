// src/components/global/forms/TextInput.tsx

interface TextInputProps {
    type: string,
    name: string,
    placeholder?: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    required?: boolean,
    disabled?: boolean,
    autoFocus?: boolean,
    autoComplete?: string,
}

export default function TextInput({
    type,
    name,
    placeholder,
    value,
    onChange,
    required,
    disabled,
    autoFocus,
    autoComplete,
}: TextInputProps) {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            className="px-4 py-2 rounded-full bg-pebble text-slate text-l border border-pebble
                       placeholder:text-slate/50
                       hover:border-sage
                       focus:border-moss focus:bg-mist focus:outline-none
                       transition duration 250ms ease-in-out
            "    
        />
    )
}