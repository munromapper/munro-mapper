// src/utils/data/userSettingsUpdaters.ts
// This file contains functions to update user settings in the application.

import { supabase } from "./supabaseClient";

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

    if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
        return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setDirty(true);
    setError(null);
}

interface handleDeletePhotoProps {
    setPhotoFile: React.Dispatch<React.SetStateAction<File | null>>;
    setPhotoPreview: React.Dispatch<React.SetStateAction<string>>;
    setForm: React.Dispatch<React.SetStateAction<ProfileForm>>;
    setDirty: React.Dispatch<React.SetStateAction<boolean>>;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
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
    setForm((form: ProfileForm) => ({ ...form, profilePhotoUrl: defaultProfilePicture }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    setDirty(true);
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

        const fileExt = photoFile?.name.split(".").pop();
        const fileName = `profile-picture-${userId}-${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("profilepictures")
            .upload(filePath, photoFile, { upsert: true });

        if (uploadError) {
            setError(uploadError.message);
            return;
        }

        const { data: publicUrlData } = supabase.storage
            .from("profilepictures")
            .getPublicUrl(filePath);

        profilePhotoUrl = publicUrlData.publicUrl;
    }

    // If user has removed their profile photo to revert to default
    if (form.profilePhotoUrl === null) {
        await clearUserFileStorage();
        profilePhotoUrl = null;
    }

    let emailUpdateRequired = false;
    if (form.email && form.email !== prevEmail) {
        emailUpdateRequired = true;
        const { error: emailError } = await supabase.auth.updateUser({
            email: form.email,
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
            first_name: form.firstName,
            last_name: form.lastName,
            email_opt_in: form.emailOptIn,
        })
        .eq("user_id", userId);

    if (updateError) {
        setError("Failed to update profile.");
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