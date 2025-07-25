// src/app/explore/components/ExploreSidebar.tsx
// This file contains the sidebar component for the 'explore' section of the application

'use client';
import React, { useState } from "react";
import SidebarGreeting from "./SidebarGreeting"
import SidebarAccountInfo from "./SidebarAccountInfo"
import IconLink from "@/components/global/IconLink"
import SettingsPage from "@/components/settings/SettingsPage";
import ModalElement from "@/components/global/Modal"
import { MapIcon, ListIcon, FriendsIcon, DashboardIcon, SupportIcon, SettingsIcon } from "@/components/global/SvgComponents"

export default function ExploreSidebar() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <aside className="bg-slate">
            <div className="w-75 h-full flex flex-col justify-between pt-16 px-11 pb-9">
                <div>
                    <SidebarGreeting />
                    <div className="flex flex-col gap-1 mt-9">
                        <IconLink 
                            href="/explore/dashboard"
                            transitionWrapper="explore-page-content"
                            icon={<DashboardIcon />}
                            label="Dashboard"
                            className="border-slate hover:bg-mist/10"
                        />
                        <IconLink 
                            href="/explore/map"
                            transitionWrapper="explore-page-content"
                            icon={<MapIcon />}
                            label="Map View"
                            className="border-slate hover:bg-mist/10"
                        />
                        <IconLink 
                            href="/explore/list"
                            transitionWrapper="explore-page-content"
                            icon={<ListIcon />}
                            label="List View"
                            className="border-slate hover:bg-mist/10"
                        />
                        <IconLink 
                            transitionWrapper=""
                            icon={<FriendsIcon />}
                            label="Friends"
                            className="border-slate hover:bg-mist/10"
                        />
                    </div>
                    <div className="h-[1px] mx-4 border-b border-dashed border-moss my-6"/>
                    <div className="flex flex-col gap-1">
                        <IconLink 
                            href="/contact"
                            transitionWrapper="body"
                            icon={<SupportIcon />}
                            label="Support"
                            className="border-slate hover:bg-mist/10"
                        />
                        <IconLink 
                            transitionWrapper=""
                            icon={<SettingsIcon />}
                            label="User Settings"
                            className="border-slate hover:bg-mist/10"
                            onClick={() => setIsSettingsOpen(true)}
                        />
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
        </aside>

    )
}