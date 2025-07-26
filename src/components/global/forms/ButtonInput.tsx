// src/components/global/forms/ButtonInput.tsx
// This file defines a ButtonInput component that renders a button element with a submit type

interface ButtonInputProps {
    label: string;
    disabled?: boolean;
    loading?: boolean;
    className?: string;
}

export default function ButtonInput({
    label,
    disabled = false,
    loading = false,
    className = ''
}: ButtonInputProps) {
    return (
        <button
            type="submit"
            disabled={disabled || loading}
            className={`
                px-4 py-2 text-l bg-apple text-slate rounded-full border border-apple
                transition duration-250 ease-in-out
                ${!disabled && !loading ? 'cursor-pointer hover:bg-transparent' : 'cursor-not-allowed'}
                ${loading ? 'bg-opacity-70' : ''}
                ${disabled ? 'opacity-50' : ''}
                ${className}
            `}
        >
            {loading ? 'Please wait...' : label}
        </button>
    )
}