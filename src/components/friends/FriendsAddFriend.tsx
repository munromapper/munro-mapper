// src/components/friends/FriendsAddFriend.tsx
// This file contains the FriendsAddFriend component which allows users to add friends by searching for their usernames.

import type { UserProfile } from "@/types/data/dataTypes";
import { useAuthContext } from "@/contexts/AuthContext";
import UserProfilePicture from "../global/UserProfilePicture";

interface FriendsAddFriendProps {
    searchQuery: string;
    userProfiles: UserProfile[];
}

export default function FriendsAddFriend({ 
    searchQuery, 
    userProfiles 
}: FriendsAddFriendProps) {
    const { user } = useAuthContext();
    // Filter user profiles based on the search query
    const filteredProfiles = userProfiles.filter(profile => 
        profile?.id !== user?.id && 
        profile?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile?.discriminator.includes(searchQuery)
    );

    return (
        <div className="absolute inset-0 p-6">
            <ul className="flex flex-col gap-6">
                {filteredProfiles.map(profile => (
                    <li key={profile?.id} className="flex items-center gap-9 justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9">
                                <UserProfilePicture 
                                    userId={profile?.id} 
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-l">{profile?.firstName} {profile?.lastName}</span>
                                <span className="text-m text-moss">#{profile?.discriminator}</span>
                            </div>
                        </div>
                        <button 
                            onClick={() => console.log(`Add ${profile?.firstName} ${profile?.lastName}`)}
                            className="text-m bg-apple px-3 py-1 rounded-full cursor-pointer"
                        >
                            Add Friend +
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}