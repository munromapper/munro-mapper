// src/utils/data/userSettingsUpdaters.ts
// This file contains functions to update user settings in the application.

import { supabase } from "../auth/supabaseClient";

interface handlePhotoChangeProps {
    event: React.ChangeEvent<HTMLInputElement>;
    setPhotoFile: React.Dispatch<React.SetStateAction<File | null>>;
    setPhotoPreview: React.Dispatch<React.SetStateAction<string>>;
    setDirty: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export function handlePhotoChange({
    event,
    setPhotoFile,
    setPhotoPreview,
    setDirty,
    setError
}: handlePhotoChangeProps) {
    const file = event.target.files?.[0];
    if (!file) return;

    function validateImageFile(file: File): string | null {
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) return "Only JPG or PNG image files allowed.";
        if (file.size > 5 * 1024 * 1024) return "File size exceeds 5MB.";
        return null;
    }

    const error = validateImageFile(file);

    if (error) {
        setError(error);
        return;
    }  else {
        setPhotoFile(file);
        setPhotoPreview(URL.createObjectURL(file));
        setDirty(true);
        setError(null);
    }
}

interface handleDeletePhotoProps {
    setPhotoFile: React.Dispatch<React.SetStateAction<File | null>>;
    setPhotoPreview: React.Dispatch<React.SetStateAction<string>>;
    setForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
    setDirty: React.Dispatch<React.SetStateAction<boolean>>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
}

async function uploadProfilePhoto(photoFile: File, userId: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', photoFile);
  formData.append('userId', userId);

  const res = await fetch('/api/upload-profile-photo', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data.url;
}

export function handleDeletePhoto({
    setPhotoFile,
    setPhotoPreview,
    setForm,
    setDirty,
    fileInputRef
}: handleDeletePhotoProps) {
    const defaultProfilePicture = "https://zhagbgmbodswwtajijsb.supabase.co/storage/v1/object/public/profilepictures/default-profile-picture.png";

    setPhotoFile(null);
    setPhotoPreview(defaultProfilePicture);
    setForm((form: ProfileForm) => ({ ...form, profilePhotoUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    setDirty(true);
}

function sanitizeName(name: string): string {
  // Remove leading/trailing whitespace
  let sanitized = name.trim();
  // Remove any HTML tags or angle brackets
  sanitized = sanitized.replace(/[<>]/g, '');
  // Limit to 50 chars
  sanitized = sanitized.slice(0, 50);
  return sanitized;
}

function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string): boolean {
  // Simple RFC 5322 compliant regex for most cases
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


interface ProfileForm {
    profilePhotoUrl: string | null;
    firstName: string;
    lastName: string;
    emailOptIn: boolean;
    email: string;
}

interface handleUpdateUserSettingsProps {
    event: React.FormEvent<HTMLFormElement>;
    form: ProfileForm;
    photoFile: File | null;
    userId: string;
    prevPhotoUrl: string | null;
    prevEmail?: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
    setDirty: React.Dispatch<React.SetStateAction<boolean>>;
    setPhotoFile: React.Dispatch<React.SetStateAction<File | null>>;
    setPhotoPreview: React.Dispatch<React.SetStateAction<string>>;
    setForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
}

export async function handleUpdateUserSettings({
    event,
    form,
    photoFile,
    userId,
    prevPhotoUrl,
    prevEmail,
    setLoading,
    setError,
    setSuccess,
    setDirty,
    setPhotoFile,
    setPhotoPreview,
    setForm
}: handleUpdateUserSettingsProps) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    let profilePhotoUrl: string | null = prevPhotoUrl || null;

    async function clearUserFileStorage() {
        const { data: listData, error: listError } = await supabase
        .storage
        .from("profilepictures")
        .list(`${userId}/`, { limit: 100 });
        console.log("Removing old profile pictures:", listData);

        if (!listError && listData && listData.length > 0) {
            listData.forEach(async file => {
                await supabase.storage.from("profilepictures").remove([`${userId}/${file.name}`]);
            });
        }
    }

    // If user has uploaded a new photo over an existing file, or added a new photo to replace the default
    if (photoFile) {
        await clearUserFileStorage();

        try {
            // Use your API route instead of direct Supabase upload
            profilePhotoUrl = await uploadProfilePhoto(photoFile, userId);
        } catch (err: any) {
            setError(err.message || "Failed to upload photo.");
            setLoading(false);
            return;
        }
    }

    // If user has removed their profile photo to revert to default
    if (form.profilePhotoUrl === null) {
        await clearUserFileStorage();
        profilePhotoUrl = "https://zhagbgmbodswwtajijsb.supabase.co/storage/v1/object/public/profilepictures//default-profile-picture.png";
    }

    const sanitizedFirstName = sanitizeName(form.firstName);
    const sanitizedLastName = sanitizeName(form.lastName);

    const sanitizedEmail = sanitizeEmail(form.email);
    if (!isValidEmail(sanitizedEmail)) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
    }

    if (typeof form.emailOptIn !== "boolean") {
        setError("Invalid value for email opt-in.");
        return;
    }

    let emailUpdateRequired = false;
    if (form.email && form.email !== prevEmail) {
        emailUpdateRequired = true;
        const { error: emailError } = await supabase.auth.updateUser({
            email: sanitizedEmail,
        });
        if (emailError) {
            setError("Failed to update email: " + emailError.message);
            return;
        }
    }

    const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
            profile_photo_url: profilePhotoUrl,
            first_name: sanitizedFirstName,
            last_name: sanitizedLastName,
            email_opt_in: form.emailOptIn,
        })
        .eq("user_id", userId);

    if (updateError) {
        setError("Failed to update profile. Name inputs may only contain letters, spaces, hyphens, and apostrophes.");
        return;
    }

    setLoading(false);
    setDirty(false);
    setPhotoFile(null);
    setPhotoPreview(profilePhotoUrl || ""); // or your default image url if null
    setForm((f: ProfileForm) => ({ ...f, profilePhotoUrl }));
    if (emailUpdateRequired) {
        setSuccess("A confirmation link has been sent to your new email address. Please check your inbox and click the link to confirm the change. You will need to log out and in again to see any changes after confirmation.");
    } else {
        setSuccess("Profile updated successfully.");
    }

}