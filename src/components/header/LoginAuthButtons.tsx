// src/components/Header/LoginAuthButtons.tsx
// This file contains the LoginAuthButtons component for the application, this goes in the header and manages sign in, sign out buttons, and the user profile icon/dropdown

'use client';
import React, { useState } from 'react';
import { PrimaryButton, TertiaryButton } from '@/components/global/Buttons';
import AuthForm from '@/components/header/authformcomponents/AuthForm';
import HeaderAccountMenu from './HeaderAccountMenu';
import { useAuthContext } from '@/contexts/AuthContext';
import ModalElement from '@/components/global/Modal';
import SettingsPage from '../settings/SettingsPage';

interface LoginAuthButtonsProps {
    isDark: boolean;
}

export default function LoginAuthButtons({ 
    isDark 
}: LoginAuthButtonsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formMode, setFormMode] = useState<'logIn' | 'signUp'>('logIn');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { user } = useAuthContext();

    if (user) {
        return (
            <div>
                <HeaderAccountMenu 
                    isDark={isDark}
                    setIsSettingsOpen={setIsSettingsOpen}
                />
                <ModalElement
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                >
                    <SettingsPage />
                </ModalElement>
            </div>

        )
    }

    return (
        <>
            <div className="flex items-center justify-end gap-6">
                <TertiaryButton
                    label="Log in"
                    onClick={() => {setIsModalOpen(true); setFormMode('logIn');}}
                    isAlternate={isDark}
                />
                <PrimaryButton
                    label="Sign up"
                    onClick={() => {setIsModalOpen(true); setFormMode('signUp');}}
                    isAlternate={false}
                />
            </div>
            <ModalElement
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            >
                <AuthForm
                    mode={formMode}
                    onSuccess={() => {
                        setIsModalOpen(false);
                        {/* Add post success logic here */}
                    }}
                    onSwapMode={(mode) => setFormMode(mode)}
                />
            </ModalElement>
        </>
    )
}
