// src/app/explore/map/components/filtercomponents/FilterFriendsGroup.tsx
// This file contains the filter component for filtering friends munros

'use client';
import { useAuthContext } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { TickIcon } from "@/components/global/SvgComponents";
import type { UserProfile } from "@/types/data/dataTypes";
import RadioInput from "@/components/global/forms/RadioInput";
import SearchInput from "@/components/global/forms/SearchInput";
import { fetchUserProfile } from "@/utils/data/clientDataFetchers";
import UserProfilePicture from "@/components/global/UserProfilePicture";

interface FilterFriendsGroupProps {
    value: {
        selectedPeople: string[];
        baggedMode: 'bagged' | 'incomplete';
    };
    onChange: (value: { selectedPeople: string[]; baggedMode: 'bagged' | 'incomplete' }) => void;
}

export default function FilterFriendsGroup({ 
    value, 
    onChange 
}: FilterFriendsGroupProps) {
    const { friends, user, userProfile } = useAuthContext();
    const [friendProfiles, setFriendProfiles] = useState<UserProfile[]>([]);

    const [searchedFriends, setSearchedFriends] = useState<string>('');
    const selectedPeople = value.selectedPeople;
    const baggedMode = value.baggedMode;

    useEffect(() => {
        if (!user) return;
        const acceptedFriendIds = friends
            ?.filter(f => f && f.requestStatus === 'accepted')
            .map(f => {
                if (f!.requesterId === user?.id) return f!.addresseeId;
                return f!.requesterId;
            }) ?? [];
        Promise.all(acceptedFriendIds.map(id => fetchUserProfile(id)))
            .then(profiles => setFriendProfiles(profiles));
    }, [friends, user?.id]);

    const people = [
        { id: user?.id ?? 'me', name: 'Me' },
        ...friendProfiles
            .filter(profile => profile && profile.id)
            .map(profile => ({
                id: profile!.id as string,
                name: `${profile!.firstName} ${profile!.lastName}`.trim()
            }))
    ];

    const filteredPeople =
        searchedFriends.trim() === ""
            ? people
            : people.filter(person =>
                person.name.toLowerCase().includes(searchedFriends.toLowerCase())
            );

    return (
        <div className="w-75 whitespace-normal">
            <div className="space-y-4 mb-4 px-6 pt-6">
                <p className="font-heading-font-family text-4xl">Compare status</p>
                <p className="text-moss text-l">Enim mollit occaecat id proident esse in ulla eiusmod mollit laboris id pariatur.</p>  
            </div>
            <div className="mb-4 px-6">
                <SearchInput 
                    name="friends"
                    value={searchedFriends}
                    onChange={(value: string) => setSearchedFriends(value)}
                    placeholder="Search..."
                />
            </div>
            <div className="px-3 mb-4">
                <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                    {(!user || !userProfile || !['active', 'canceling'].includes(userProfile.isPremium)) ? (
                        <span className="text-moss text-sm px-3">Upgrade to Munro Mapper Plus to enable bagged status filtering and friends comparison</span>
                    ) : filteredPeople.length === 0 && searchedFriends.trim() !== "" ? (
                        <span className="text-moss text-sm">No friends found.</span>
                    ) : (
                        filteredPeople.map(person => (
                            <label key={person.id} className="flex items-center gap-4 rounded-full px-3 py-2 cursor-pointer hover:bg-sage/50 transition duration-250 ease-in-out">
                                <input
                                    type="checkbox"
                                    className="hidden peer"
                                    checked={selectedPeople.includes(person.id)}
                                    onChange={() => {
                                        const newSelected =
                                            selectedPeople.includes(person.id)
                                                ? selectedPeople.filter(id => id !== person.id)
                                                : [...selectedPeople, person.id];
                                        onChange({ selectedPeople: newSelected, baggedMode });
                                    }}
                                    disabled={!user || !userProfile || !['active', 'canceling'].includes(userProfile.isPremium)}
                                />
                                <div
                                    className={`
                                        w-4 h-4 p-0.5 flex items-center justify-center rounded-full border border-dashed pointer-events-none
                                        transition-all duration-300 ease-in-out
                                        border-sage bg-transparent text-transparent
                                        peer-checked:bg-slate peer-checked:text-apple peer-checked:border-slate
                                    `}
                                >
                                    <TickIcon />
                                </div>
                                <div className="w-8 h-8">
                                    <UserProfilePicture 
                                        userId={person.id}
                                        refreshTrigger={Date.now()}
                                    />
                                </div>
                                <span>{person.name}</span>
                            </label>
                        ))
                    )}
                </div>
            </div>
            <div className="h-1 w-full border-b border-sage"></div>
            <div className="p-6 flex flex-col items-start gap-3">
                <RadioInput
                    label="Show bagged"
                    name="baggedMode"
                    value="bagged"
                    checked={baggedMode === 'bagged'}
                    onChange={() => onChange({ selectedPeople, baggedMode: 'bagged' })}
                />
                <span className="text-moss text-m pl-7 italic mt-[-0.5rem]">Only display hills that are already bagged by all the selected people.</span>
                <RadioInput
                    label="Show incomplete"
                    name="baggedMode"
                    value="incomplete"
                    checked={baggedMode === 'incomplete'}
                    onChange={() => onChange({ selectedPeople, baggedMode: 'incomplete' })}
                />
                <span className="text-moss text-m pl-7 italic mt-[-0.5rem]">Only display hills that have not been bagged by all the selected people.</span>
            </div>
        </div>
    )
}