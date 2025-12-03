// src/components/header/authformcomponents/OtpRequestPage.tsx
// This file contains the OtpRequestPage component which handles the OTP request for user authentication.

import React, { useState } from "react";
import { supabase } from "@/utils/auth/supabaseClient";
import TextInput from "@/components/global/forms/TextInput";
import ButtonInput from "@/components/global/forms/ButtonInput";
import { InlineLink } from "@/components/global/Buttons";

interface OtpRequestPageProps {
  setStep: (step: 'auth' | 'otpRequest' | 'otpVerify') => void;
  setUserEmail: (email: string) => void;
  setError: (err: string | null) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
}

export default function OtpRequestPage({
  setStep,
  setUserEmail,
  setError,
  setLoading,
  loading,
}: OtpRequestPageProps) {
  const [email, setEmail] = useState("");

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setUserEmail(email);
      setStep("otpVerify");
    }
  }

  return (
    <div className="bg-mist flex flex-col items-stretch gap-9 max-w-115 max-md:max-w-full p-14">
        <div className="text-center">
            <p className="font-heading-font-family text-4xl mb-4">Enter your email</p>
            <p className="text-moss text-xl mb-4">We&apos;ll send you a single use log in code.</p>
            <p className="text-l text-slate">Once logged in, you can change your password.</p>
        </div>
        <form onSubmit={handleSendOtp} className="flex flex-col gap-9">
            <TextInput
                name="email"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <ButtonInput
                label="Send sign in code"
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