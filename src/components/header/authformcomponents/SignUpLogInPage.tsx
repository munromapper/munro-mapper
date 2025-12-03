// src/components/header/authformcomponents/SignUpLogInPage.tsx
// This file contains the SignUpLogInPage component which handles user authentication for signing up and logging in.

import { useEffect } from "react";
import handleAuthSubmit from "@/utils/auth/handleAuthSubmit";
import TextInput from "@/components/global/forms/TextInput";
import CheckboxInput from "@/components/global/forms/CheckboxInput";
import ButtonInput from "@/components/global/forms/ButtonInput";
import { InlineLink } from "@/components/global/Buttons";
import { GoogleLogo } from "@/components/global/SvgComponents";
import ErrorMessage from "@/components/global/forms/ErrorMessage";
import { supabase } from "@/utils/auth/supabaseClient";

interface SignUpLogInPageProps {
    mode: "signUp" | "logIn";
    firstName: string;
    setFirstName: (value: string) => void;
    lastName: string;
    setLastName: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    passwordConfirm: string;
    setPasswordConfirm: (value: string) => void;
    emailOptIn: boolean;
    setEmailOptIn: (value: boolean) => void;
    setUserEmail: (value: string) => void;
    loading: boolean;
    setLoading: (value: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    onSwapMode: (mode: "logIn" | "signUp") => void;
    setStep: (step: 'auth' | 'emailConfirmation' | 'otpRequest' | 'otpVerify') => void;
    onSuccess: () => void;
}

export default function SignUpLogInPage({
    mode,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    emailOptIn,
    setEmailOptIn,
    setUserEmail,
    loading,
    setLoading,
    error,
    setError,
    onSwapMode,
    setStep,
    onSuccess,
}: SignUpLogInPageProps) {

    useEffect(() => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPasswordConfirm("");
        setEmailOptIn(false);
        setError(null);
    }, [mode]);

    return (
        <form 
            onSubmit={e => handleAuthSubmit({
                email,
                password,
                passwordConfirm,
                firstName,
                lastName,
                emailOptIn,
                event: e,
                mode,
                setLoading,
                setError,
                setUserEmail,
                setPassword,
                setStep,
                onSuccess
            })} 
            className="flex flex-col items-stretch gap-9 max-w-115 max-md:max-w-full p-14 bg-mist"
        >
            <div className="text-center">
                <h2 className="font-heading-font-family text-4xl mb-3">{mode === "signUp" ? "Sign Up" : "Log In"}</h2>
                <p className="text-moss text-l">
                    {mode === "signUp" 
                    ? "Sign up Placeholder Text Dolor id ex adipisicing eiusmod sint enim eiusmod proident ea ea." 
                    : "Sign in Placeholder Text Dolor id ex adipisicing eiusmod sint enim eiusmod proident ea ea."}
                </p>
            </div>
            <div className="flex flex-col items-stretch gap-4">
                {mode === "signUp" && (
                    <>
                    <TextInput 
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                        autoFocus
                    />
                    <TextInput 
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                    />
                    </>
                )}
                <TextInput 
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus={mode === "logIn"}
                    autoComplete="email"
                />
                <TextInput 
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                />
                {mode === "signUp" && (
                    <>
                        <TextInput 
                        name="password-confirm"
                        type="password"
                        placeholder="Confirm Password"
                        value={passwordConfirm}
                        onChange={e => setPasswordConfirm(e.target.value)}
                        required
                        autoComplete="current-password"
                        />
                        <CheckboxInput 
                            name="emailOptIn"
                            label="Sign up for bagging tips and special offers"
                            checked={emailOptIn}
                            onChange={e => setEmailOptIn(e.target.checked)}
                        />
                    </>
                )}
            </div>
            <ErrorMessage error={error} />
            <div className="flex flex-col gap-4">
                <ButtonInput 
                    label={mode === "signUp" ? "Sign Up" : "Log In"}
                    disabled={loading}
                    loading={loading}
                />
                <button 
                    className="py-2 px-4 flex items-center justify-center gap-4 cursor-pointer border border-sage rounded-full text-l hover:border-slate transition duration-250 ease-in-out"
                    onClick={async (event) => {
                        event?.preventDefault();
                        setLoading(true);
                        setError(null);
                        const { error } = await supabase.auth.signInWithOAuth({
                            provider: "google",
                            options: {
                                redirectTo: window.location.origin, // or your desired redirect URL
                            },
                        });
                        if (error) setError(error.message);
                        setLoading(false);
                    }}
                >
                    <div className="w-4 h-4">
                        <GoogleLogo />
                    </div>
                    {mode === "signUp" ? "Sign Up with Google" : "Log In with Google"}
                </button>
            </div>
            <div className="flex flex-col gap-2 text-center">
                <p className="text-l">
                    {mode === "signUp" ? (
                    <>
                        Already have an account?{' '}
                        <InlineLink 
                            label="Log in."
                            onClick={() => onSwapMode && onSwapMode("logIn")}
                            transitionWrapper=""
                        />
                    </>
                    ) : (
                    <>
                        Don&apos;t have an account?{' '}
                        <InlineLink 
                            label="Sign up."
                            onClick={() => onSwapMode && onSwapMode("signUp")}
                            transitionWrapper=""
                        />
                    </>
                    )}
                </p>
                {mode === "signUp" && (
                    <p className="text-m text-moss">
                    By continuing to use Munro Mapper, you agree to our{' '}
                    <InlineLink
                        href="/terms"
                        label="Terms of Service"
                        target="_blank"
                        transitionWrapper=""
                    />
                    {' '}and{' '}
                    <InlineLink
                        href="/privacy"
                        label="Privacy Policy."
                        target="_blank"
                        transitionWrapper=""
                    />
                </p>
                )}
                {mode === "logIn" && (
                    <p className="text-m text-moss">
                        <InlineLink 
                            label="Forgot your password?"
                            onClick={() => setStep('otpRequest')}
                            transitionWrapper=""
                        />
                    </p>
                )}
            </div>
        </form>
    )
}