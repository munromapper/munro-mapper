// src/components/friends/FriendsRequests.tsx
// This component handles displaying and managing friend requests.

import { useAuthContext } from "@/contexts/AuthContext";
import UserProfilePicture from "../global/UserProfilePicture";
import { useState } from "react";
import { acceptFriendRequest, declineFriendRequest } from "@/utils/data/userFriendUpdaters";
import type { UserProfile } from "@/types/data/dataTypes";
import { PrimaryButton } from "../global/Buttons";
import SignInPrompt from "./SignInPrompt";

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
    const { user, friends, refreshFriends } = useAuthContext();
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

    if (!user) {
        return <SignInPrompt />;
    }
  

    if (requestProfiles.length === 0) {
        return (
            <div className="absolute inset-0 p-6">
                <div className="h-full flex flex-col items-center justify-center gap-4 px-5 text-center">
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
                <div className="h-full flex flex-col items-center justify-center gap-4 px-5 text-center">
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
                                    className="text-m bg-apple/50 px-3 py-1 rounded-full cursor-pointer hover:bg-apple transition duration-250 ease-in-out"
                                    onClick={async () => {
                                        setLoadingId(profile!.id);
                                        await acceptFriendRequest({ requesterId: profile!.id, addresseeId: user!.id });
                                        await refreshFriends();
                                        setLoadingId(null);
                                    }}
                                >
                                    Accept
                                </button>
                                <button
                                    disabled={isLoading}
                                    className="text-m px-3 py-1 text-rust border border-blush rounded-full cursor-pointer hover:bg-petal transition duration-250 ease-in-out"
                                    onClick={async () => {
                                        setLoadingId(profile!.id);
                                        await declineFriendRequest({ requesterId: profile!.id, addresseeId: user!.id });
                                        await refreshFriends();
                                        setLoadingId(null);
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