// src/components/friends/FriendsList.tsx
// This file contains the component that displays the list of friends.

import { useAuthContext } from "@/contexts/AuthContext";
import UserProfilePicture from "../global/UserProfilePicture";
import { PrimaryButton } from "../global/Buttons";
import type { UserProfile } from "@/types/data/dataTypes";
import { useState } from "react";
import { declineFriendRequest } from "@/utils/data/userFriendUpdaters";
import type { Friend } from "@/types/data/dataTypes";
import { motion, AnimatePresence } from "framer-motion";
import ContextualMenu from "../global/ContextualMenu";
import { ContextMenuIcon, TickIcon, CrossIcon } from "../global/SvgComponents";

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
    const [contextualMenuOpenId, setContextualMenuOpenId] = useState<string | null>(null);
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
        .filter(fp => fp.profile) as { profile: UserProfile, connection: Friend }[];

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
        <div className="absolute inset-0 py-6 px-3">
            <ul className="flex flex-col gap-6">
                {filteredProfiles.map(({ profile, connection }) => (
                    <li key={profile?.id} className="flex items-center gap-9 justify-between relative rounded-full px-4 py-2 hover:bg-mint transition duration-250 ease-in-out">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9">
                                <UserProfilePicture userId={profile?.id} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-l">{profile?.firstName} {profile?.lastName}</span>
                                <span className="text-m text-moss">#{profile?.discriminator}</span>
                            </div>
                        </div>
                        <div className="relative flex items-center">
                            <button 
                                className="w-4 h-4 cursor-pointer text-moss"
                                onClick={() => {
                                    if (contextualMenuOpenId === (profile?.id ?? null)) {
                                        setContextualMenuOpenId(null);
                                        setConfirmRemoveId(null);
                                    } else {
                                        setContextualMenuOpenId(profile?.id ?? null);
                                        setConfirmRemoveId(null);
                                    }
                                }}
                            >
                                <ContextMenuIcon />
                            </button>
                            <ContextualMenu
                                isOpen={contextualMenuOpenId === profile?.id}
                                onClose={() => {
                                    setContextualMenuOpenId(null);
                                    setConfirmRemoveId(null);
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    {confirmRemoveId === profile?.id ? (
                                        <>
                                            <span className="text-rust text-l px-3 py-1 rounded-full bg-petal">Are you sure?</span>
                                            <button
                                                className="bg-apple/50 hover:bg-apple text-green-800 rounded-full w-5 h-5 p-1 flex items-center justify-center cursor-pointer transition duration-250 ease-in-out"
                                                disabled={loadingId === profile?.id}
                                                onClick={async () => {
                                                    setLoadingId(profile.id);
                                                    await declineFriendRequest({
                                                        requesterId: connection?.requesterId,
                                                        addresseeId: connection?.addresseeId
                                                    });
                                                    setLoadingId(null);
                                                    setContextualMenuOpenId(null);
                                                    setConfirmRemoveId(null);
                                                    await refreshFriends?.();
                                                }}
                                                title="Confirm remove"
                                            >
                                                <TickIcon />
                                            </button>
                                            <button
                                                className="bg-petal hover:bg-blush text-rust rounded-full w-5 h-5 p-1 flex items-center justify-center cursor-pointer transition duration-250 ease-in-out"
                                                onClick={() => setConfirmRemoveId(null)}
                                                title="Cancel"
                                            >
                                                <CrossIcon />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            className="text-rust text-l cursor-pointer px-3 py-1 rounded-full hover:bg-petal transition duration-250 ease-in-out"
                                            onClick={() => setConfirmRemoveId(profile?.id ?? null)}
                                        >
                                            Remove friend
                                        </button>
                                    )}
                                </div>
                            </ContextualMenu>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}