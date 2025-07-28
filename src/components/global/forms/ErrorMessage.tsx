// src/components/global/forms/ErrorMessage.tsx
// This file contains the ErrorMessage component for displaying error messages in forms

import { ErrorIcon } from "../SvgComponents";

interface ErrorMessageProps {
    error: string | null;
}

export default function ErrorMessage({ 
    error 
}: ErrorMessageProps) {
    if (!error) return null;

    return (
        <div className="flex items-center gap-2 bg-petal text-rust px-4 py-2 rounded-full text-l">
            <div className="w-4 h-4">
                <ErrorIcon />
            </div>
            {error}
        </div>
    );
}