// src/components/header/authformcomponents/OtpVerificationPage.tsx
// This file contains the OtpVerificationPage component which handles the OTP verification for user authentication.

import React, { useState } from "react";
import { supabase } from "@/utils/auth/supabaseClient";
import TextInput from "@/components/global/forms/TextInput";
import ButtonInput from "@/components/global/forms/ButtonInput";
import { InlineLink } from "@/components/global/Buttons";

interface OtpVerifyPageProps {
  userEmail: string;
  setStep: (step: 'auth' | 'otpRequest' | 'otpVerify') => void;
  setError: (err: string | null) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  onSuccess: () => void;
}

export default function OtpVerifyPage({
  userEmail,
  setStep,
  setError,
  setLoading,
  loading,
  onSuccess,
}: OtpVerifyPageProps) {
  const [otp, setOtp] = useState("");

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: userEmail,
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      onSuccess();
    }
  }

  return (
    <div className="bg-mist flex flex-col items-stretch gap-9 max-w-115 p-14">
            <div className="text-center">
                <p className="font-heading-font-family text-4xl mb-4">Check your email</p>
                <p className="text-moss text-xl mb-4">We've sent a single use OTP code to your email if you have an account.</p>
                <p className="text-l text-slate">Once logged in, you can change your password.</p>
            </div>
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-9">
                <TextInput
                    name="otp"
                    type="text"
                    placeholder="Enter your 6 digit code"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                />
                <ButtonInput
                    label="Verify code"
                    disabled={loading}
                />
            </form>
            <div className="flex justify-center text-l">
                <InlineLink 
                    label="Return to sign in"
                    transitionWrapper=""
                    onClick={() => setStep('auth')}
                />
            </div>
        </div>
  );
}