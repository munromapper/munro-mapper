// src/app/explore/map/components/filtercomponents/FilterFriendsGroup.tsx
// This file contains the filter component for filtering friends munros

import { useAuthContext } from "@/contexts/AuthContext";
import { useBaggedMunroContext } from "@/contexts/BaggedMunroContext";
import { useState } from "react";

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
    const { userBaggedMunros, friendsBaggedMunros } = useBaggedMunroContext();

    const [selectedPeople, setSelectedPeople] = useState<string[]>(value.selectedPeople);
    return (
        <div>
            
        </div>
    )
}