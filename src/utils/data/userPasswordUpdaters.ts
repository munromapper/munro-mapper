// src/utils/data/userPasswordUpdaters.ts
// This file contains functions to update user passwords in the application.

import { supabase } from './supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';

interface HandleUpdatePasswordProps {
    event: React.FormEvent<HTMLFormElement>;
    newPassword: string;
    confirmPassword: string;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSuccess: (message: string | null) => void;
}

export async function handleUpdatePassword({
    event,
    newPassword,
    confirmPassword,
    setLoading,
    setError,
    setSuccess,
}: HandleUpdatePasswordProps): Promise<void> {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
        setError("New password and confirmation do not match.");
        setLoading(false);
        return;
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    });
    if (error) {
        setError("Failed to update password: " + error.message);
        setLoading(false);
    } else {
        setSuccess("Password updated successfully.");
        setLoading(false);
    }
}