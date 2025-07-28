// src/utils/auth/patchGoogleUserProfile.ts
// This function patches the Google user profile to ensure it has a discriminator

import { supabase } from "@/utils/auth/supabaseClient";
import { generateUniqueDiscriminator } from "@/utils/auth/generateDiscriminator";

export default async function patchGoogleUserProfile(userId: string) {
  // Check if discriminator is missing
  const { data, error } = await supabase
    .from("user_discriminators")
    .select("discriminator")
    .eq("user_id", userId)
    .single();

  if (!data || !data.discriminator) {
    const discriminator = await generateUniqueDiscriminator();
    await supabase
      .from("user_discriminators")
      .insert({ user_id: userId, discriminator })
      .select();
  }
}