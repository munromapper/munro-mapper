// src/app/explore/map/components/filtercomponents/FilterFriendsGroup.tsx
// This file contains the filter component for filtering friends munros

'use client';
import { useAuthContext } from "@/contexts/AuthContext";
import { useBaggedMunroContext } from "@/contexts/BaggedMunroContext";
import { useState, useEffect } from "react";
import RadioInput from "@/components/global/forms/RadioInput";
import SearchInput from "@/components/global/forms/SearchInput";
import { fetchUserProfile } from "@/utils/data/clientDataFetchers";

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
    const { friends, user } = useAuthContext();
    const [friendProfiles, setFriendProfiles] = useState<any[]>([]);

    const [searchedFriends, setSearchedFriends] = useState<string>('');
    const selectedPeople = value.selectedPeople;
    const baggedMode = value.baggedMode;

    useEffect(() => {
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
        { id: 'me', name: 'Me' },
        ...friendProfiles
            .filter(profile => profile)
            .map(profile => ({
                id: profile.id,
                name: `${profile.firstName} ${profile.lastName}`.trim()
            }))
    ];

    const filteredPeople =
        searchedFriends.trim() === ""
            ? people
            : people.filter(person =>
                person.name.toLowerCase().includes(searchedFriends.toLowerCase())
            );

    return (
        <>
            <div>
            <p className="font-heading-font-family text-xxxl">Compare friends</p>
            <p className="text-moss text-l">Enim mollit occaecat id proident esse in ulla eiusmod mollit laboris id pariatur.</p>  
            </div>
            <div>
                <SearchInput 
                    name="friends"
                    value={searchedFriends}
                    onChange={(value: string) => setSearchedFriends(value)}
                    placeholder="Search..."
                />
            </div>
            <div className="max-h-48 overflow-y-auto mt-2 flex flex-col gap-2">
                {filteredPeople.length === 0 && searchedFriends.trim() !== "" ? (
                    <span className="text-moss text-sm">No friends found.</span>
                ) : (
                    filteredPeople.map(person => (
                        <label key={person.id} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedPeople.includes(person.id)}
                                onChange={() => {
                                    const newSelected =
                                        selectedPeople.includes(person.id)
                                            ? selectedPeople.filter(id => id !== person.id)
                                            : [...selectedPeople, person.id];
                                    onChange({ selectedPeople: newSelected, baggedMode });
                                }}
                            />
                            <span>{person.name}</span>
                        </label>
                    ))
                )}
            </div>
            <div>
                <RadioInput
                    label="Show bagged"
                    name="baggedMode"
                    value="bagged"
                    checked={baggedMode === 'bagged'}
                    onChange={() => onChange({ selectedPeople, baggedMode: 'bagged' })}
                />
                <RadioInput
                    label="Show incomplete"
                    name="baggedMode"
                    value="incomplete"
                    checked={baggedMode === 'incomplete'}
                    onChange={() => onChange({ selectedPeople, baggedMode: 'incomplete' })}
                />
            </div>
        </>
    )
}