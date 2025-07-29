// src/components/friends/FriendsAddFriend.tsx
// This file contains the FriendsAddFriend component which allows users to add friends by searching for their usernames.

import type { UserProfile } from "@/types/data/dataTypes";
import { sendFriendRequest } from "@/utils/data/userFriendUpdaters";
import { useAuthContext } from "@/contexts/AuthContext";
import UserProfilePicture from "../global/UserProfilePicture";
import { useState } from "react";

interface FriendsAddFriendProps {
    searchQuery: string;
    userProfiles: UserProfile[];
}

export default function FriendsAddFriend({ 
    searchQuery, 
    userProfiles 
}: FriendsAddFriendProps) {
    const { user, friends } = useAuthContext();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    // Helper to get friend status between current user and another user
    function getFriendStatus(profileId: string) {
        if (!friends || !user?.id) return null;
        const connection = friends.find(
            f =>
                (f?.requesterId === user.id && f?.addresseeId === profileId) ||
                (f?.addresseeId === user.id && f?.requesterId === profileId)
        );
        return connection ? connection.requestStatus : null;
    }

    // Filter user profiles based on the search query and exclude current user
    const filteredProfiles = userProfiles.filter(profile =>
        profile?.id !== user?.id &&
        (
            profile?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            profile?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            profile?.discriminator.includes(searchQuery)
        )
    );

    if (searchQuery === "") {
        return (
            <div className="absolute inset-0 p-6">
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                    <p className="font-heading-font-family text-4xl">Search for your friends.</p>
                    <p className="text-l text-moss">Use the search bar to find friends by name or ID number and send them a request.</p>
                </div>
            </div>
        );
    }

    if (filteredProfiles.length === 0) {
        return (
            <div className="absolute inset-0 p-6">
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                    <p className="font-heading-font-family text-4xl">No results found.</p>
                    <p className="text-l text-moss">We couldn&apos;t find a match. Double-check the spelling or try a different name.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 p-6">
            <ul className="flex flex-col gap-6">
                {filteredProfiles.map(profile => {
                    if (!profile?.id) return null;
                    const status = getFriendStatus(profile.id);
                    const isLoading = loadingId === profile.id;
                    let buttonText = "Add Friend +";
                    let buttonClass = "text-m bg-apple px-3 py-1 rounded-full cursor-pointer";
                    let disabled = false;

                    if (status === "pending") {
                        buttonText = "Request Sent";
                        buttonClass = "text-m bg-gray-300 px-3 py-1 rounded-full cursor-not-allowed";
                        disabled = true;
                    } else if (status === "accepted") {
                        buttonText = "Friends";
                        buttonClass = "text-m bg-gray-200 px-3 py-1 rounded-full cursor-not-allowed";
                        disabled = true;
                    } else if (isLoading) {
                        buttonText = "Sending...";
                        buttonClass = "text-m bg-gray-300 px-3 py-1 rounded-full cursor-wait";
                        disabled = true;
                    }

                    return (
                        <li key={profile?.id} className="flex items-center gap-9 justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9">
                                    <UserProfilePicture userId={profile?.id} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-l">{profile?.firstName} {profile?.lastName}</span>
                                    <span className="text-m text-moss">#{profile?.discriminator}</span>
                                </div>
                            </div>
                            <button
                                disabled={disabled}
                                className={buttonClass}
                                onClick={async () => {
                                    if (disabled) return;
                                    setLoadingId(profile?.id);
                                    await sendFriendRequest({ requesterId: user!.id, addresseeId: profile!.id });
                                    setLoadingId(null);
                                    // Optionally, trigger a refresh of friends in AuthContext here
                                }}
                            >
                                {buttonText}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}