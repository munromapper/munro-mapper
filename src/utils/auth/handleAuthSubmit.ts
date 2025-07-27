// src/utils/auth/handleAuthSubmit.ts
// This function handles the standard authentication form submission logic

import { generateUniqueDiscriminator } from "@/utils/auth/generateDiscriminator";
import { supabase } from "@/utils/auth/supabaseClient";

interface handleAuthSubmitProps {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    emailOptIn: boolean;
    event: React.FormEvent;
    mode: string;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setUserEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setStep: (step: 'auth' | 'emailConfirmation') => void;
    onSuccess?: () => void;
}

export default async function handleAuthSubmit({
    email,
    password,
    firstName,
    lastName,
    emailOptIn,
    event,
    mode,
    setLoading,
    setError,
    setUserEmail,
    setPassword,
    setStep,
    onSuccess
}: handleAuthSubmitProps) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "signUp") {

        const discriminator = await generateUniqueDiscriminator();
        if (!discriminator) {
            setError("Failed to generate a unique discriminator.");
            setLoading(false);
            return;
        }

        const { error: signUpError, data } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    email_opt_in: emailOptIn,
                    discriminator
                }
            }
        });

        if (!data.user && !data.session) {
            setError("This email is already registered. Please log in, or use a different email.");
            setLoading(false);
            return;
        }

        if (signUpError) {
            console.error("Sign up error:", signUpError);
            setError(signUpError.message);
            setLoading(false);
            return;
        } else {
            setLoading(false);
            setUserEmail(email);
            setStep("emailConfirmation");
        }

    } else if (mode === "logIn") {

        const { error: logInError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (logInError) {
            if (logInError.message.includes('Email not confirmed')) {
                setLoading(false);
                setUserEmail(email);
                setStep("emailConfirmation");
                setError("Please verify your email address before signing in.");

                await supabase.auth.resend({
                    type: 'signup',
                    email: email
                });
            } else {
                setLoading(false);
                setError(logInError.message);
            }
        } else {
            setLoading(false);
            setUserEmail("");
            setPassword("");
            if (onSuccess) onSuccess();
        }

    }

}