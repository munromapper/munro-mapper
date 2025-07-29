// src/components/friends/FriendsList.tsx
// This file contains the component that displays the list of friends.

import { useAuthContext } from "@/contexts/AuthContext";
import UserProfilePicture from "../global/UserProfilePicture";
import { PrimaryButton } from "../global/Buttons";
import type { UserProfile } from "@/types/data/dataTypes";

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
    const { user, friends } = useAuthContext();

    // Find all accepted friends (where status is 'accepted' and current user is either requester or addressee)
    const acceptedConnections = (friends ?? []).filter(
        f => f?.requestStatus === "accepted" &&
            (f?.requesterId === user?.id || f?.addresseeId === user?.id)
    );

    // Map to the other user's profile
    const friendProfiles = acceptedConnections
        .map(conn => {
            const friendId = conn?.requesterId === user?.id ? conn?.addresseeId : conn?.requesterId;
            return userProfiles.find(profile => profile?.id === friendId);
        })
        .filter(Boolean) as UserProfile[];

    // Apply search filter
    const filteredProfiles = friendProfiles.filter(profile =>
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
                {filteredProfiles.map(profile => (
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
                        {/* You can add more friend actions here if needed */}
                    </li>
                ))}
            </ul>
        </div>
    );
}