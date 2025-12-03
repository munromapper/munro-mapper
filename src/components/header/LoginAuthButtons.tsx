// src/components/Header/LoginAuthButtons.tsx
// This file contains the LoginAuthButtons component for the application, this goes in the header and manages sign in, sign out buttons, and the user profile icon/dropdown

'use client';
import React, { useState } from 'react';
import { PrimaryButton, TertiaryButton, SecondaryButton } from '@/components/global/Buttons';
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
    const { user, isAuthModalOpen, authFormMode, openAuthModal, closeAuthModal } = useAuthContext();

    // Use a media query to detect mobile
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 1000px)').matches;

    if (isMobile) {
        // On mobile, only show login/signup if no user, never show account menu
        if (!user) {
            return (
                <>
                    <div className="flex flex-col items-stretch justify-end gap-4">
                        <SecondaryButton
                            label="Log in"
                            onClick={() => openAuthModal('logIn')}
                            isAlternate={false}
                            isLarge={true}
                        />
                        <PrimaryButton
                            label="Sign up"
                            onClick={() => openAuthModal('signUp')}
                            isAlternate={false}
                            isLarge={true}
                        />
                    </div>
                    <ModalElement
                        isOpen={isAuthModalOpen}
                        onClose={closeAuthModal}
                    >
                        <AuthForm
                            mode={authFormMode}
                            onSuccess={() => {
                                window.location.reload();
                            }}
                            onSwapMode={(mode) => openAuthModal(mode)}
                        />
                    </ModalElement>
                </>
            );
        }
        // If user exists, render nothing on mobile
        return null;
    }

    // Desktop: keep current behavior
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
        );
    }

    return (
        <>
            <div className="flex items-center justify-end gap-6">
                <TertiaryButton
                    label="Log in"
                    onClick={() => openAuthModal('logIn')}
                    isAlternate={isDark}
                />
                <PrimaryButton
                    label="Sign up"
                    onClick={() => openAuthModal('signUp')}
                    isAlternate={false}
                />
            </div>
            <ModalElement
                isOpen={isAuthModalOpen}
                onClose={closeAuthModal}
            >
                <AuthForm
                    mode={authFormMode}
                    onSuccess={() => {
                        window.location.reload();
                    }}
                    onSwapMode={(mode) => openAuthModal(mode)}
                />
            </ModalElement>
        </>
    );
}
