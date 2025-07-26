// src/components/settings/SecuritySettings.tsx
// SecuritySettings component for managing user security settings in the main settings modal

'use client';
import React, { useState } from 'react';
import { handleUpdatePassword } from "@/utils/data/userPasswordUpdaters";
import TextInput from '../global/forms/TextInput';
import ButtonInput from '../global/forms/ButtonInput';
import { SecondaryButton } from '../global/Buttons';
import { AnimatePresence } from 'framer-motion';
import NotificationBox from '../global/NotificationBox';
import { useAuthContext } from '@/contexts/AuthContext';

export default function SecuritySettings() {
    const initialFormValues = {
        newPassword: '',
        confirmPassword: ''
    }
    const [form, setForm] = useState(initialFormValues);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [dirty, setDirty] = useState(false);

    return (
        <div className="max-w-139">
            <div className="pb-9 max-w-[75%]">
                <h2 className="font-heading-font-family text-4xl mb-1">Security</h2>
                <p className="text-moss text-l">Update your password here.</p>
            </div>
             <div className="h-[1px] border-b border-dashed border-sage"></div>
             <form
                onSubmit={async e => {
                    await handleUpdatePassword({
                        event: e,
                        newPassword: form.newPassword,
                        confirmPassword: form.confirmPassword,
                        setLoading,
                        setError,
                        setSuccess,
                    });
                }}
             >
                <div className="py-9">
                    <div className="flex justify-between gap-y-6 gap-x-18 flex-wrap">
                        <label className="w-35">
                            <h3 className="text-xl">New password</h3>
                        </label>
                        <div className="w-80 flex flex-col">
                        <TextInput
                            type="password"
                            name="newPassword"
                            value={form.newPassword}
                            onChange={e => { setForm(f => ({ ...f, newPassword: e.target.value })); setDirty(true); }}
                            placeholder="New password"
                            />
                        </div>
                    </div>
                </div>
                <div className="h-[1px] border-b border-dashed border-sage"></div>
                <div className="py-9">
                    <div className="flex justify-between gap-y-6 gap-x-18 flex-wrap">
                        <label className="w-35">
                            <h3 className="text-xl">Re-enter<br/>new password</h3>
                        </label>
                        <div className="w-80 flex flex-col">
                        <TextInput
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={e => { setForm(f => ({ ...f, confirmPassword: e.target.value })); setDirty(true); }}
                            placeholder="Confirm new password"
                            />
                        </div>
                    </div>
                </div>
                <div className="h-[1px] border-b border-dashed border-sage"></div>
                <div className="flex justify-between gap-y-6 gap-x-18 flex-wrap pt-9">
                    <SecondaryButton 
                        label="Cancel"
                        onClick={() => {
                            setForm(initialFormValues);
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