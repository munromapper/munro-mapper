// src/components/friends/FriendsRequests.tsx
// This component handles displaying and managing friend requests.

import { useAuthContext } from "@/contexts/AuthContext";
import UserProfilePicture from "../global/UserProfilePicture";
import { useState } from "react";
import { acceptFriendRequest, declineFriendRequest } from "@/utils/data/userFriendUpdaters";
import type { UserProfile } from "@/types/data/dataTypes";
import { PrimaryButton } from "../global/Buttons";

interface FriendsRequestsProps {
    searchQuery: string;
    userProfiles: UserProfile[];
    setActiveTab?: (tab: 'friends' | 'requests' | 'addFriends') => void;
}

export default function FriendsRequests({ 
    searchQuery, 
    userProfiles,
    setActiveTab
}: FriendsRequestsProps) {
    const { user, friends } = useAuthContext();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    const incomingRequests = (friends ?? []).filter(
        f => f?.addresseeId === user?.id && f?.requestStatus === "pending"
    );

    const requestProfiles = incomingRequests
        .map(req => userProfiles.find(profile => profile?.id === req?.requesterId))
        .filter(Boolean) as UserProfile[];

    const filteredProfiles = requestProfiles.filter(profile =>
        profile?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile?.discriminator.includes(searchQuery)
    );

    if (requestProfiles.length === 0) {
        return (
            <div className="absolute inset-0 p-6">
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                    <p className="font-heading-font-family text-4xl">Your inbox is empty.</p>
                    <p className="text-l text-moss">Add some friends to explore Munros together. It&apos;s way more fun with company.</p>
                    <PrimaryButton
                        label="Add friend +"
                        isAlternate={false}
                        onClick={() => {
                            setActiveTab?.('addFriends');
                        }}
                    />
                </div>
            </div>
        );
    }

    // If you have requests, but search yields no matches, show "No results found."
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
                    const isLoading = loadingId === profile?.id;
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
                            <div className="flex gap-2">
                                <button
                                    disabled={isLoading}
                                    className="text-m bg-apple px-3 py-1 rounded-full cursor-pointer"
                                    onClick={async () => {
                                        setLoadingId(profile!.id);
                                        await acceptFriendRequest({ requesterId: profile!.id, addresseeId: user!.id });
                                        setLoadingId(null);
                                        // Optionally, trigger a refresh of friends in AuthContext here
                                    }}
                                >
                                    Accept
                                </button>
                                <button
                                    disabled={isLoading}
                                    className="text-m bg-gray-300 px-3 py-1 rounded-full cursor-pointer"
                                    onClick={async () => {
                                        setLoadingId(profile!.id);
                                        await declineFriendRequest({ requesterId: profile!.id, addresseeId: user!.id });
                                        setLoadingId(null);
                                        // Optionally, trigger a refresh of friends in AuthContext here
                                    }}
                                >
                                    Decline
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

}