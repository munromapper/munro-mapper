// src/components/header/AuthForm.tsx
// This file contains the AuthForm component which handles user authentication, sign in and sign up.

'use client';
import { useState } from 'react';
import EmailVerificationPage from './EmailVerificationPage';
import SignUpLogInPage from './SignUpLogInPage';
import OtpRequestPage from './OtpRequestPage';
import OtpVerifyPage from './OtpVerificationPage';

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
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [emailOptIn, setEmailOptIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<'auth' | 'emailConfirmation' | 'otpRequest' | 'otpVerify'>('auth');
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

    if (step === 'otpRequest') {
        return (
            <OtpRequestPage
            setStep={setStep}
            setUserEmail={setUserEmail}
            setError={setError}
            setLoading={setLoading}
            loading={loading}
            />
        );
        }

        if (step === 'otpVerify') {
        return (
            <OtpVerifyPage
            userEmail={userEmail}
            setStep={setStep}
            setError={setError}
            setLoading={setLoading}
            loading={loading}
            onSuccess={onSuccess}
            />
        );
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
            passwordConfirm={passwordConfirm}
            setPasswordConfirm={setPasswordConfirm}
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