// src/components/settings/SubscriptionSettings.tsx
// SubscriptionSettings component for managing user subscription settings in the main settings modal

'use client';
import { useAuthContext } from "@/contexts/AuthContext";

export default function SubscriptionSettings() {
    const { user, userProfile } = useAuthContext();

    return (
        <div>
             <h2 className="font-heading-font-family text-4xl mb-1">Subscription</h2>
             <p className="text-moss text-l">Update your subscription settings here.</p>
             <div className="h-[1px] border-b border-dashed border-sage mt-6 mb-9"></div>
        </div>
    );
}