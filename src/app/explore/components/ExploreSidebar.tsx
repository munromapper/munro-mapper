// src/app/explore/components/ExploreSidebar.tsx
// This file contains the sidebar component for the 'explore' section of the application

'use client';
import React, { useState } from "react";
import SidebarGreeting from "./SidebarGreeting"
import SidebarAccountInfo from "./SidebarAccountInfo"
import SidebarFriendsButton from "./SidebarFriendsButton";
import IconLink from "@/components/global/IconLink"
import FriendsPage from "@/components/friends/FriendsPage";
import SettingsPage from "@/components/settings/SettingsPage";
import ModalElement from "@/components/global/Modal"
import { MapIcon, ListIcon, FriendsIcon, DashboardIcon, SupportIcon, SettingsIcon } from "@/components/global/SvgComponents"
import { useAuthContext } from "@/contexts/AuthContext";

export default function ExploreSidebar() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isFriendsOpen, setIsFriendsOpen] = useState(false);
    const { user } = useAuthContext();

    return (
        <aside className="bg-slate">
            <div className="w-75 h-full flex flex-col justify-between pt-16 px-11 pb-9">
                <div>
                    <SidebarGreeting />
                    <div className="flex flex-col gap-1 mt-9">
                        <IconLink 
                            href="/explore/dashboard"
                            icon={<DashboardIcon />}
                            label="Dashboard"
                            className="border-slate hover:bg-mist/10"
                        />
                        <IconLink 
                            href="/explore/map"
                            icon={<MapIcon />}
                            label="Map View"
                            className="border-slate hover:bg-mist/10"
                        />
                        <IconLink 
                            href="/explore/list"
                            icon={<ListIcon />}
                            label="List View"
                            className="border-slate hover:bg-mist/10"
                        />
                        <SidebarFriendsButton setIsFriendsOpen={setIsFriendsOpen} />
                    </div>
                    <div className="h-[1px] mx-4 border-b border-dashed border-moss my-6"/>
                    <div className="flex flex-col gap-1">
                        <IconLink 
                            href="/contact"
                            icon={<SupportIcon />}
                            label="Support"
                            className="border-slate hover:bg-mist/10"
                        />
                        {user && (
                            <IconLink 
                                icon={<SettingsIcon />}
                                label="User Settings"
                                className="border-slate hover:bg-mist/10"
                                onClick={() => setIsSettingsOpen(true)}
                            />
                        )}
                    </div>
                </div>
                <div>
                    <SidebarAccountInfo />
                </div>
            </div>
            <ModalElement 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)}
            >
                <SettingsPage />
            </ModalElement>
            <ModalElement 
                isOpen={isFriendsOpen} 
                onClose={() => setIsFriendsOpen(false)}
            >
                <FriendsPage />
            </ModalElement>
        </aside>

    )
}