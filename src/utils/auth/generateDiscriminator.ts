// src/utils/auth/generateDiscriminator.ts
// This utility function generates a unique discriminator for a user, ensuring it does not conflict with existing ones in the database.

import { supabase } from "@/utils/auth/supabaseClient";

export async function generateUniqueDiscriminator(): Promise<string | null> {
    const { data, error } = await supabase
        .from("user_discriminators")
        .select("discriminator");

    if (error) {
        console.error("Error fetching discriminators:", error);
        return null;
    }

    const existing = new Set(
    data
        .filter((d: { discriminator: string | number | null | undefined }) => d.discriminator != null)
        .map((d: { discriminator: string | number }) =>
            d.discriminator.toString().padStart(4, "0")
        )
    );
    
    const allowFiveDigits = existing.size >= 9950;

    let discriminator: string;
    let attempts = 0;
    do {
        if (allowFiveDigits) {
            const length = Math.random() < 0.5 ? 4 : 5;
            const max = length === 4 ? 9999 : 99999;
            discriminator = Math.floor(1 + Math.random() * max)
                .toString()
                .padStart(length, "0");
        } else {
            discriminator = Math.floor(1 + Math.random() * 9999)
                .toString()
                .padStart(4, "0");
        }
        attempts++;
        if (attempts > 20000) {
            return null;
        }
    } while (existing.has(discriminator));

    return discriminator;
}