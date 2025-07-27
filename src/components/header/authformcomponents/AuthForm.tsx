// src/components/header/AuthForm.tsx
// This file contains the AuthForm component which handles user authentication, sign in and sign up.

'use client';
import { useState } from 'react';
import { supabase } from '@/utils/auth/supabaseClient'
import Link from 'next/link';
import handleAuthSubmit from '@/utils/auth/handleAuthSubmit';
import { handleEmailVerification, handleVerificationCodeResend } from '@/utils/auth/handleEmailVerification';
import EmailVerificationPage from './EmailVerificationPage';
import SignUpLogInPage from './SignUpLogInPage';
import { TickIcon, GoogleLogo } from '@/components/global/SvgComponents';
import { Sign } from 'crypto';

interface AuthFormProps {
    mode: 'logIn' | 'signUp';
    onSuccess: () => void;
    onSwapMode: (mode: 'logIn' | 'signUp') => void;
}

export default function AuthForm({
    mode,
    onSuccess,
    onSwapMode
}: AuthFormProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailOptIn, setEmailOptIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'auth' | 'emailConfirmation'>('auth');
    const [userEmail, setUserEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');

    if (step === 'emailConfirmation') {
        return (
            <EmailVerificationPage
                userEmail={userEmail}
                verificationCode={verificationCode}
                setVerificationCode={setVerificationCode}
                loading={loading}
                setLoading={setLoading}
                error={error}
                setError={setError}
                setStep={setStep}
                mode={mode}
                onSuccess={onSuccess}
            />
        )
    }

    return (
        <SignUpLogInPage 
            mode={mode}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            emailOptIn={emailOptIn}
            setEmailOptIn={setEmailOptIn}
            setUserEmail={setUserEmail}
            loading={loading}
            setLoading={setLoading}
            error={error}
            setError={setError}
            onSwapMode={onSwapMode}
            setStep={setStep}
            onSuccess={onSuccess}
        />
    )
}