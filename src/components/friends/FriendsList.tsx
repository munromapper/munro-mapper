// src/components/friends/FriendsList.tsx
// This file contains the component that displays the list of friends.

import { useAuthContext } from "@/contexts/AuthContext";
import UserProfilePicture from "../global/UserProfilePicture";
import { PrimaryButton } from "../global/Buttons";
import type { UserProfile } from "@/types/data/dataTypes";
import { useState } from "react";
import { declineFriendRequest } from "@/utils/data/userFriendUpdaters";

interface FriendsListProps {
    searchQuery: string;
    userProfiles: UserProfile[];
    setActiveTab?: (tab: 'friends' | 'requests' | 'addFriends') => void;
}

export default function FriendsList({
    searchQuery,
    userProfiles,
    setActiveTab
}: FriendsListProps) {
    const { user, friends, refreshFriends } = useAuthContext();
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
    const [loadingId, setLoadingId] = useState<string | null>(null);

    // Find all accepted friends (where status is 'accepted' and current user is either requester or addressee)
    const acceptedConnections = (friends ?? []).filter(
        f => f?.requestStatus === "accepted" &&
            (f?.requesterId === user?.id || f?.addresseeId === user?.id)
    );

    // Map to the other user's profile
    const friendProfiles = acceptedConnections
        .map(conn => {
            const friendId = conn?.requesterId === user?.id ? conn?.addresseeId : conn?.requesterId;
            return {
                profile: userProfiles.find(profile => profile?.id === friendId),
                connection: conn
            };
        })
        .filter(fp => fp.profile) as { profile: UserProfile, connection: any }[];

    // Apply search filter
    const filteredProfiles = friendProfiles.filter(({ profile }) =>
        profile?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile?.discriminator.includes(searchQuery)
    );

    // If you have no friends at all, show "No friends" content
    if (friendProfiles.length === 0) {
        return (
            <div className="absolute inset-0 p-6">
                <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                    <p className="font-heading-font-family text-4xl">No friends yet.</p>
                    <p className="text-l text-moss">Add some friends to explore Munros together. It&apos;s way more fun with company.</p>
                    <PrimaryButton
                        label="Add friend +"
                        isAlternate={false}
                        onClick={() => setActiveTab?.('addFriends')}
                    />
                </div>
            </div>
        );
    }

    // If you have friends, but search yields no matches, show "No results found."
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

    // Otherwise, show the filtered list
    return (
        <div className="absolute inset-0 p-6">
            <ul className="flex flex-col gap-6">
                {filteredProfiles.map(({ profile, connection }) => (
                    <li key={profile?.id} className="flex items-center gap-9 justify-between relative">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9">
                                <UserProfilePicture userId={profile?.id} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-l">{profile?.firstName} {profile?.lastName}</span>
                                <span className="text-m text-moss">#{profile?.discriminator}</span>
                            </div>
                        </div>
                        {/* Context menu trigger */}
                        <div className="relative">
                            <button
                                className="p-2 rounded-full hover:bg-gray-100"
                                onClick={() => setMenuOpenId(menuOpenId === profile?.id ? null : profile!.id)}
                            >
                                <span style={{ fontSize: 24 }}>⋮</span>
                            </button>
                            {menuOpenId === profile?.id && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10 flex flex-col p-2">
                                    {/* Remove Friend Button */}
                                    <button
                                        className={
                                            confirmRemoveId === profile?.id
                                                ? "bg-red-100 text-red-600 rounded-full px-3 py-2 font-semibold"
                                                : "hover:bg-gray-100 rounded-full px-3 py-2 text-left"
                                        }
                                        disabled={loadingId === profile?.id}
                                        onClick={async () => {
                                            if (confirmRemoveId === profile.id) {
                                                setLoadingId(profile.id);
                                                await declineFriendRequest({
                                                    requesterId: connection.requesterId,
                                                    addresseeId: connection.addresseeId
                                                });
                                                setLoadingId(null);
                                                setMenuOpenId(null);
                                                setConfirmRemoveId(null);
                                                await refreshFriends?.();
                                            } else {
                                                setConfirmRemoveId(profile.id);
                                            }
                                        }}
                                    >
                                        {confirmRemoveId === profile.id ? "Are you sure?" : "Remove friend"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}