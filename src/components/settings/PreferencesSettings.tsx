// src/components/settings/PreferencesSettings.tsx
// PreferencesSettings component for managing user preferences settings in the main settings modal

'use client';
import React, { useState } from 'react';
import { useAuthContext } from "@/contexts/AuthContext";
import RadioInput from "../global/forms/RadioInput";
import ButtonInput from '../global/forms/ButtonInput';
import { SecondaryButton } from '../global/Buttons';
import { handleUpdatePreferences } from '@/utils/data/userPreferencesUpdaters';
import NotificationBox from '../global/NotificationBox';
import { AnimatePresence } from 'framer-motion';

export default function PreferencesSettings() {
    const { user, userProfile, refreshUserProfile } = useAuthContext();

    interface PreferencesForm {
        elevationUnit: string | undefined;
        distanceUnit: string | undefined;
    }

    const initialPreferences = {
        elevationUnit: userProfile?.preferences.elevationUnit,
        distanceUnit: userProfile?.preferences.lengthUnit
    }

    const [form, setForm] = useState<PreferencesForm>(initialPreferences);
    const [dirty, setDirty] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    return (
        <div>
             <div className="pb-6 max-w-[75%]">
                <h2 className="font-heading-font-family text-4xl mb-1">Preferences</h2>
                <p className="text-moss text-l">Update your preferences settings here.</p>
            </div>
            <div className="h-[1px] border-b border-sage"></div>
            <form
                onSubmit={async e => {
                    await handleUpdatePreferences({
                        event: e,
                        user,
                        elevationUnit: form.elevationUnit || 'metres',
                        distanceUnit: form.distanceUnit || 'kilometres',
                        setLoading,
                        setError,
                        setSuccess
                    });
                    refreshUserProfile();
                }}
            >
                <div className="pt-9 pb-6 flex justify-between gap-y-6 gap-x-18  flex-wrap">
                    <label className="space-y-1 w-45">
                        <h3 className="text-xl">Elevation Units</h3>
                        <p className="text-m text-moss">Display hill heights and route ascent values in metres or feet.</p>
                    </label>
                    <div className="w-70 flex items-end justify-end gap-12">
                        <RadioInput 
                            name="elevationUnits"
                            checked={form.elevationUnit === 'metres'}
                            value="metres"
                            label="Metres (m)"
                            onChange={(e) => {
                                setForm({ ...form, elevationUnit: 'metres' });
                                setDirty(true);
                            }}
                        />
                        <RadioInput 
                            name="elevationUnits"
                            checked={form.elevationUnit === 'feet'}
                            value="feet"
                            label="Feet (ft)"
                            onChange={(e) => {
                                setForm({ ...form, elevationUnit: 'feet' });
                                setDirty(true);
                            }}
                        />
                    </div>
                </div>
                <div className="h-[1px] border-b border-sage"></div>
                <div className="py-6 flex justify-between gap-y-6 gap-x-18  flex-wrap">
                    <label className="space-y-1 w-45">
                        <h3 className="text-xl">Distance Units</h3>
                        <p className="text-m text-moss">Display distances for route lengths in kilometres or miles.</p>
                    </label>
                    <div className="w-70 flex items-end justify-end gap-12">
                        <RadioInput 
                            name="distanceUnits"
                            checked={form.distanceUnit === 'kilometres'}
                            value="kilometres"
                            label="Kilometres (km)"
                            onChange={(e) => {
                                setForm({ ...form, distanceUnit: 'kilometres' });
                                setDirty(true);
                            }}
                        />
                        <RadioInput 
                            name="distanceUnits"
                            checked={form.distanceUnit === 'miles'}
                            value="miles"
                            label="Miles (mi)"
                            onChange={(e) => {
                                setForm({ ...form, distanceUnit: 'miles' });
                                setDirty(true);
                            }}
                        />
                    </div>
                </div>
                <div className="h-[1px] border-b border-sage"></div>
                <div className="flex justify-between gap-y-6 gap-x-18 flex-wrap pt-12">
                    <SecondaryButton 
                        label="Cancel"
                        onClick={() => {
                            setForm(initialPreferences);
                            setDirty(false);
                        }}
                        isAlternate={false}
                        disabled={!dirty}
                    />               
                    <ButtonInput 
                        disabled={!dirty}
                        label={loading ? `Saving changes...` : `Save changes`}
                    />                       
                </div>
            </form>
            <AnimatePresence>
                {error && <NotificationBox 
                                message={error} 
                                type="error"
                                onClose={() => setError(null)}
                                duration={10000} 
                            />}
                {success && <NotificationBox 
                                message={success} 
                                type="success"
                                onClose={() => setSuccess(null)}
                                duration={10000} 
                            />}
            </AnimatePresence>
        </div>
    );
}