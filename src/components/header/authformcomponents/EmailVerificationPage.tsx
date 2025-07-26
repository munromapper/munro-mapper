// src/components/header/authformcomponents/EmailVerificationPage.tsx
// This file contains the EmailVerificationPage component for handling email verification in the authentication flow
import { handleEmailVerification, handleVerificationCodeResend } from "@/utils/auth/handleEmailVerification";
import ErrorMessage from "@/components/global/forms/ErrorMessage";

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
        <div className="flex flex-col items-center justify-center max-w-115 p-14 bg-mist">
            <h2 className="text-xxxl font-medium mb-4">
                Check your email
            </h2>
            <p className="text-moss text-center mb-6">
                We&apos;ve sent a verification code to <span className="font-semibold">{userEmail}</span>.<br />
                Please enter the code below to complete verification.
            </p>

            <form 
                onSubmit={e => handleEmailVerification({
                    event: e,
                    userEmail,
                    verificationCode,
                    setLoading,
                    setError,
                    onSuccess
                })}
                className="w-full"
            >
                <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="text-center text-xl tracking-widest"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    maxLength={6}
                    autoFocus
                />

                <ErrorMessage error={error} />
                            
                <button
                    type="submit"
                    className="bg-moss text-white py-2 px-4 rounded w-full"
                    disabled={loading || verificationCode.length !== 6}
                >
                    {loading ? "Verifying..." : "Verify Email"}
                </button>
            </form>
                        
            <div className="flex flex-col items-center gap-4">
            <button
                type="button"
                onClick={() => handleVerificationCodeResend({
                    userEmail,
                    setLoading,
                    setError,
                })}
                disabled={loading}
                className="underline decoration-dotted underline-offset-4 cursor-pointer text-moss"
            >
                Resend Code
            </button>
                        
            <button
                type="button"
                onClick={() => setStep('auth')}
                className="underline decoration-dotted underline-offset-4 cursor-pointer text-moss"
            >
                Back to {mode === "signUp" ? "Sign Up" : "Sign In"}
            </button>
            </div>
        </div>
    )
}
