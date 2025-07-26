// src/components/header/HeaderAccountMenu.tsx
// This file contains the HeaderAccountMenu component for the application, which displays the user account menu in the header

'use client';
import React, { useState } from 'react';
import { useAuthContext } from "@/contexts/AuthContext"
import HeaderAccountMenuDropdown from './HeaderAccountMenuDropdown';
import { ThinDownChevron } from "../global/SvgComponents";
import SettingsPage from '../settings/SettingsPage';
import ModalElement from '../global/Modal';

interface HeaderAccountMenuProps {
    isDark: boolean;
    setIsSettingsOpen: (open: boolean) => void;
}

export default function HeaderAccountMenu({ 
    isDark,
    setIsSettingsOpen
}: HeaderAccountMenuProps) {
    const { userProfile } = useAuthContext();
    const [isDropdownActive, setIsDropdownActive] = useState(false);

    return (
        <div 
            className="flex items-center justify-end gap-3 cursor-pointer relative"
            onMouseEnter={() => setIsDropdownActive(true)}
            onMouseLeave={() => setIsDropdownActive(false)}
        >
            <div className={`rounded-full w-7 h-7 bg-cover bg-sage bg-center`} style={{ backgroundImage: `url(${userProfile?.profilePhotoUrl})` }}></div>
            <span 
                className={`
                    w-2 h-2 flex items-center justify-center mt-1
                    ${isDark ? 'text-slate' : 'text-mist'}
                    ${isDropdownActive ? "rotate-180" : ""}
                    transition duration-250 ease-in-out`
                }
            >
                <ThinDownChevron />
            </span>
            <HeaderAccountMenuDropdown 
                isDropdownActive={isDropdownActive} 
                setIsSettingsOpen={setIsSettingsOpen}
            />
        </div>
    )
}