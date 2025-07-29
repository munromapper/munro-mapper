// src/components/global/UserProfilePicture.tsx
// This file defines a UserProfilePicture component for displaying the user's profile picture

import React, { useEffect, useState } from 'react';
import { fetchUserProfile } from "@/utils/data/clientDataFetchers";
import { UserProfile } from '@/types/data/dataTypes';
import { PremiumIcon } from "./SvgComponents";

interface UserProfilePictureProps {
    userId: string | undefined;
    refreshTrigger?: number;
}

export default  function UserProfilePicture({
    userId,
    refreshTrigger
}: UserProfilePictureProps) {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        if (!userId) return;
        fetchUserProfile(userId).then(profile => {
            setUserProfile(profile);
        });
    }, [userId, refreshTrigger]);

    return (
        <div className="relative w-full h-full">
            <div className="w-full h-full bg-sage rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${userProfile?.profilePhotoUrl})` }}></div>
            {(
                userProfile?.isPremium === 'active' ||
                userProfile?.isPremium === 'paused' ||
                userProfile?.isPremium === 'canceling'
            ) && (
                <div className="w-[40%] h-[40%] absolute top-[-15%] left-[-15%] text-heather">
                    <PremiumIcon />
                </div>
            )}
        </div>
    );
}