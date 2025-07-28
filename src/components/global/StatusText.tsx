// src/components/global/StatusText.tsx
// This component contains a text component for displaying statuses in the application

interface StatusTextProps {
    status: string | null;
    type: 'positive' | 'negative' | 'neutral';
}

export default function StatusText({ 
    status, 
    type 
}: StatusTextProps) {
    const statusClasses = {
        positive: 'bg-apple/50 text-slate',
        negative: 'bg-petal/70 text-rust',
        neutral: 'bg-sand text-bronze'
    };

    return (
        <p className={`text-l py-1 px-3 rounded-full ${statusClasses[type]}`}>
            {status}
        </p>
    );
}