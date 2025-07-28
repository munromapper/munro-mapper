// src/components/global/forms/TextInput.tsx

import React, { useState } from 'react';
import { PasswordHiddenIcon, PasswordVisibleIcon } from '../SvgComponents';

interface TextInputProps {
    type: string,
    name: string,
    placeholder?: string,
    value: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    maxLength?: number,
    minLength?: number,
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
    maxLength,
    minLength,
    required,
    disabled,
    autoFocus,
    autoComplete,
}: TextInputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
        <div className="relative">
            <input
                type={isPassword && showPassword ? "text" : type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                minLength={minLength}
                required={required}
                disabled={disabled}
                autoFocus={autoFocus}
                autoComplete={autoComplete}
                className="px-4 py-2 w-full pr-10 rounded-full bg-pebble text-slate text-l border border-pebble
                           placeholder:text-slate/50
                           hover:border-sage
                           focus:border-moss focus:bg-mist focus:outline-none
                           transition duration-250 ease-in-out
                "    
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none cursor-pointer"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? (
                        // Eye with slash (hide)
                        <div className="w-5 h-5">
                            <PasswordVisibleIcon />
                        </div>
                    ) : (
                        // Eye (show)
                        <div className="w-5 h-5">
                            <PasswordHiddenIcon />
                        </div>
                    )}
                </button>
            )}
        </div>
    )
}