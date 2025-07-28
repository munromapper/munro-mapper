// src/components/header/authformcomponents/EmailVerificationPage.tsx
// This file contains the EmailVerificationPage component for handling email verification in the authentication flow
import { handleEmailVerification, handleVerificationCodeResend } from "@/utils/auth/handleEmailVerification";
import ErrorMessage from "@/components/global/forms/ErrorMessage"
import TextInput from "@/components/global/forms/TextInput";
import ButtonInput from "@/components/global/forms/ButtonInput";
import { InlineLink } from "@/components/global/Buttons";

interface EmailVerificationPageProps {
    userEmail: string;
    verificationCode: string;
    setVerificationCode: (code: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    setStep: (step: 'auth' | 'emailConfirmation') => void;
    mode: 'logIn' | 'signUp';
    onSuccess: () => void;
}

export default function EmailVerificationPage({
    userEmail,
    verificationCode,
    setVerificationCode,
    loading,
    setLoading,
    error,
    setError,
    setStep,
    mode,
    onSuccess
}: EmailVerificationPageProps) {
    return (
        <div className="flex flex-col gap-9 items-center justify-center max-w-100 p-14 bg-mist">
            <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-4xl font-heading-font-family">
                    Check your email
                </p>
                <p className="text-moss text-l">
                    We&apos;ve sent a verification code to <span className="text-slate">{userEmail}</span>.<br />
                </p>
                <p className="text-l text-moss">
                    Please enter the code below.
                </p>
            </div>

            <form 
                onSubmit={e => handleEmailVerification({
                    event: e,
                    userEmail,
                    verificationCode,
                    setLoading,
                    setError,
                    onSuccess
                })}
                className="w-full flex flex-col gap-6"
            >
                <TextInput 
                    name="verificationCode"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    autoFocus
                />
                <ButtonInput 
                    label="Verify email"
                    disabled={loading || verificationCode.length !== 6}
                    loading={loading}
                />   
            </form>
            <ErrorMessage error={error} />         
            <div className="flex flex-col items-center text-center text-l">
                <div className="flex items-end gap-2">
                    <p>Need a new one?</p>
                    <InlineLink
                        label="Resend code."
                        transitionWrapper="" 
                        onClick={() => handleVerificationCodeResend({
                            userEmail,
                            setLoading,
                            setError,
                        })}
                    />
                </div>                        
            <button
                type="button"
                onClick={() => setStep('auth')}
                className="cursor-pointer text-moss mt-4"
            >
                Back to {mode === "signUp" ? "Sign Up" : "Sign In"}
            </button>
            </div>
        </div>
    )
}
