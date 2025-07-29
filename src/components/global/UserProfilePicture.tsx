// src/components/global/UserProfilePicture.tsx
// This file defines a UserProfilePicture component for displaying the user's profile picture

import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from "@/utils/data/clientDataFetchers";
import { UserProfile } from '@/types/data/dataTypes';
import { PremiumIconOutline } from "./SvgComponents";

// Simple spinner component
function Spinner() {
    return (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-moss border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

interface UserProfilePictureProps {
    userId: string | undefined;
    refreshTrigger?: number;
}

export default function UserProfilePicture({
    userId,
    refreshTrigger
}: UserProfilePictureProps) {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (!userId) return;
        fetchUserProfile(userId).then(profile => {
            setUserProfile(profile);
        });
    }, [userId, refreshTrigger]);

    useEffect(() => {
        setImageLoaded(false);
        if (userProfile?.profilePhotoUrl) {
            const img = new window.Image();
            img.src = userProfile.profilePhotoUrl;
            img.onload = () => setImageLoaded(true);
        }
    }, [userProfile?.profilePhotoUrl]);

    return (
        <div className="relative w-full h-full">
            <div
                className="w-full h-full bg-sage rounded-full bg-cover bg-center relative overflow-hidden"
                style={
                userProfile?.profilePhotoUrl
                    ? { backgroundImage: `url(${userProfile.profilePhotoUrl})` }
                    : undefined
                }
            >
                {!imageLoaded && <Spinner />}
            </div>
            {(userProfile?.isPremium === 'active' ||
                userProfile?.isPremium === 'paused' ||
                userProfile?.isPremium === 'canceling') && (
                <div className="w-[50%] h-[50%] absolute top-[-15%] right-[-15%] text-heather">
                    <PremiumIconOutline currentColor="currentColor"/>
                </div>
            )}
        </div>
    );
}