// src/components/global/forms/ErrorMessage.tsx
// This file contains the ErrorMessage component for displaying error messages in forms

interface ErrorMessageProps {
    error: string | null;
}

export default function ErrorMessage({ 
    error 
}: ErrorMessageProps) {
    if (!error) return null;

    return (
        <div className="bg-petal border border-blush px-4 py-2 rounded-full text-slate text-l text-center">
            {error}
        </div>
    );
}