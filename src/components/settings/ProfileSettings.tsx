// src/components/settings/ProfileSettings.tsx
// ProfileSettings component for managing user profile settings in the main settings modal

'use client';
import React, { useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuthContext } from "@/contexts/AuthContext";
import TextInput from '../global/forms/TextInput';
import CheckboxInput from '../global/forms/CheckboxInput';
import ButtonInput from '../global/forms/ButtonInput';
import { SecondaryButton } from '../global/Buttons';
import NotificationBox from '../global/NotificationBox';
import { handlePhotoChange, handleDeletePhoto, handleUpdateUserSettings } from '@/utils/data/userSettingsUpdaters';

export default function ProfileSettings() {
    const { user, userProfile, refreshUserProfile } = useAuthContext();

    interface ProfileForm {
        profilePhotoUrl: string | null;
        firstName: string;
        lastName: string;
        email: string;
        emailOptIn: boolean;
    }

    const initialProfile = {
        profilePhotoUrl: userProfile?.profilePhotoUrl || '',
        firstName: userProfile?.firstName || '',
        lastName: userProfile?.lastName || '',
        email: user?.email || '',
        emailOptIn: userProfile?.isEmailOptIn || false
    }

    const [form, setForm] = useState<ProfileForm>(initialProfile);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState(initialProfile.profilePhotoUrl);
    const [dirty, setDirty] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    return (
        <div className="max-w-139">
            <div className="pb-9 max-w-[75%]">
                <h2 className="font-heading-font-family text-4xl mb-1">Profile</h2>
                <p className="text-moss text-l">Update your profile and personal details here.</p>
            </div>
             <div className="h-[1px] border-b border-dashed border-sage"></div>
             <form
                onSubmit={async e => {
                    await handleUpdateUserSettings({
                        event: e,
                        form,
                        photoFile,
                        userId: user?.id || '',
                        prevPhotoUrl: userProfile?.profilePhotoUrl || null,
                        prevEmail: user?.email,
                        setLoading,
                        setError,
                        setSuccess,
                        setDirty,
                        setPhotoFile,
                        setPhotoPreview,
                        setForm
                    });
                    await refreshUserProfile();
                }}
             >
                <div className="py-9 flex items-center justify-between gap-y-6 gap-x-18 flex-wrap">
                    <label className="space-y-1 w-35">
                        <h3 className="text-xl">Profile photo</h3>
                        <p className="text-m text-moss">Lorem ipsum dolor sit.</p>
                    </label>
                    <div className="flex items-center gap-6 w-80">
                        <div
                            className="rounded-full w-16 h-16 bg-cover bg-center bg-sage"
                            style={{ backgroundImage: photoPreview ? `url(${photoPreview})` : undefined }}
                        />
                        <div>
                            <div className="mb-2">
                                <button 
                                    type="button" 
                                    onClick={() => fileInputRef.current?.click()} 
                                    className="text-l underline decoration-dotted underline-offset-4 cursor-pointer mr-4"
                                >
                                        Upload new image
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={event =>
                                        handlePhotoChange({
                                            event,
                                            setPhotoFile,
                                            setPhotoPreview,
                                            setDirty,
                                            setError
                                        })
                                    }
                                />
                                <button 
                                    type="button" 
                                    onClick={() => handleDeletePhoto({
                                        setPhotoFile,
                                        setPhotoPreview,
                                        setForm,
                                        setDirty,
                                        fileInputRef
                                    })}
                                    className="text-rust text-l cursor-pointer"
                                >
                                    Delete image
                                </button>
                            </div>
                            <div className="text-xs text-moss">File must be smaller than 5MB.</div>
                        </div>
                    </div>
                </div>
                <div className="h-[1px] border-b border-dashed border-sage"></div>
                <div className="py-9 flex justify-between gap-y-6 gap-x-18  flex-wrap">
                    <label className="w-35">
                        <h3 className="text-xl">First name</h3>
                    </label>
                    <div className="w-80 flex flex-col">
                        <TextInput
                            type="text"
                            name="firstName"
                            value={form.firstName}
                            onChange={e => { setForm(f => ({ ...f, firstName: e.target.value })); setDirty(true); }}
                            placeholder="First name"
                        />
                    </div>
                </div>
                <div className="h-[1px] border-b border-dashed border-sage"></div>
                <div className="py-9 flex justify-between gap-y-6 gap-x-18  flex-wrap">
                    <label className="w-35">
                        <h3 className="text-xl">Last name</h3>
                    </label>
                    <div className="w-80 flex flex-col">
                        <TextInput
                            type="text"
                            name="lastName"
                            value={form.lastName}
                            onChange={e => { setForm(f => ({ ...f, lastName: e.target.value })); setDirty(true); }}
                            placeholder="Last name"
                        />
                    </div>
                </div>
                <div className="h-[1px] border-b border-dashed border-sage"></div>
                <div className="py-9 flex justify-between gap-y-6 gap-x-18 flex-wrap">
                    <label className="space-y-1 w-35">
                        <h3 className="text-xl">Email address</h3>
                        <p className="text-moss text-m">Lorem ipsum dolor sit.</p>
                    </label>
                    <div className="w-80 flex flex-col gap-4">
                        <TextInput
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setDirty(true); }}
                            placeholder="Email address"
                        />
                        <div className="self-start">
                            <CheckboxInput
                                name="emailOptIn" 
                                label="Receive email notifications"
                                checked={form.emailOptIn || false}
                                onChange={e => { setForm(f => ({ ...f, emailOptIn: e.target.checked })); setDirty(true); }}
                            />            
                        </div>
                    </div>
                </div>
                <div className="h-[1px] border-b border-dashed border-sage"></div>
                <div className="flex justify-between gap-y-6 gap-x-18 flex-wrap pt-9">
                    <SecondaryButton 
                        label="Cancel"
                        onClick={() => {
                            setForm(initialProfile);
                            setPhotoFile(null);
                            setPhotoPreview(initialProfile.profilePhotoUrl);
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
                            