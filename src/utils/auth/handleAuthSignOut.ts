// src/utils/auth/handleAuthSignOut.ts
// This file handles the sign-out process for authentication

import { supabase } from "./supabaseClient";

export const handleAuthSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error signing out:", error);
        return false;
    }
    return true;
};