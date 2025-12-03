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

export default function LoginAuthButtons({ isDark }: LoginAuthButtonsProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, isAuthModalOpen, authFormMode, openAuthModal, closeAuthModal } = useAuthContext();

  return (
    <>
      {/* Mobile (max-md): show login/signup if no user; hide entirely if user exists */}
      <div className="md:hidden">
        {!user ? (
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
            <ModalElement isOpen={isAuthModalOpen} onClose={closeAuthModal}>
              <AuthForm
                mode={authFormMode}
                onSuccess={() => {
                  window.location.reload();
                }}
                onSwapMode={(mode) => openAuthModal(mode)}
              />
            </ModalElement>
          </>
        ) : null}
      </div>

      {/* Desktop (md+): keep existing behavior */}
      <div className="hidden md:block">
        {user ? (
          <div>
            <HeaderAccountMenu isDark={isDark} setIsSettingsOpen={setIsSettingsOpen} />
            <ModalElement isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
              <SettingsPage />
            </ModalElement>
          </div>
        ) : (
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
            <ModalElement isOpen={isAuthModalOpen} onClose={closeAuthModal}>
              <AuthForm
                mode={authFormMode}
                onSuccess={() => {
                  window.location.reload();
                }}
                onSwapMode={(mode) => openAuthModal(mode)}
              />
            </ModalElement>
          </>
        )}
      </div>
    </>
  );
}
