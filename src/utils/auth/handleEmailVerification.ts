// src/utils/auth/handleVerification.ts
// This function handles the email verification logic

import { supabase } from "@/utils/auth/supabaseClient";

interface HandleEmailVerificationProps {
    event: React.FormEvent;
    userEmail: string;
    verificationCode: string;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    onSuccess: () => void;
}

export async function handleEmailVerification({
    event,
    userEmail,
    verificationCode,
    setLoading,
    setError,
    onSuccess
}: HandleEmailVerificationProps) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error: verificationError } = await supabase.auth.verifyOtp({
        email: userEmail,
        token: verificationCode,
        type: 'signup'
    });

    if (verificationError) {
        setLoading(false);
        setError(verificationError.message);
    }   else {
        setLoading(false);
        if (onSuccess) onSuccess();
    }
}

interface HandleVerificationCodeResendProps {
    userEmail: string;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export async function handleVerificationCodeResend({
    userEmail,
    setLoading,
    setError
}: HandleVerificationCodeResendProps) {
    setLoading(true);
    setError(null);

    const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail
    })

    if (resendError) {
        setLoading(false);
        setError(null);
    } else {
        setLoading(false);
    }
}