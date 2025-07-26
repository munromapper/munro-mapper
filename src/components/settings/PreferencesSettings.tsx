// src/components/settings/PreferencesSettings.tsx
// PreferencesSettings component for managing user preferences settings in the main settings modal

'use client';
import { useAuthContext } from "@/contexts/AuthContext";

export default function PreferencesSettings() {
    const { user, userProfile } = useAuthContext();

    return (
        <div>
             <h2 className="font-heading-font-family text-4xl mb-1">Preferences</h2>
             <p className="text-moss text-l">Update your preferences settings here.</p>
             <div className="h-[1px] border-b border-dashed border-sage mt-6 mb-9"></div>
        </div>
    );
}