// src/app/explore/components/MobileMenuBar.tsx
// This file contains the mobile menu bar component for the 'explore' section of the application

'use client';
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcon, FriendsIcon, MapIcon, ListIcon, SettingsIcon } from "@/components/global/SvgComponents";

export default function MobileMenuBar() {
    const pathname = usePathname();

    const menu = [
        { href: "/explore/dashboard", label: "Stats", icon: <DashboardIcon /> },
        { href: "/explore/friends", label: "Friends", icon: <FriendsIcon /> },
        { href: "/explore/map", label: "Map", icon: <MapIcon /> },
        { href: "/explore/list", label: "List", icon: <ListIcon /> },
        { href: "/explore/settings", label: "Settings", icon: <SettingsIcon /> },
    ];

    return (
        <nav
            className="w-full bg-mist z-50 flex justify-center md:hidden"
            aria-label="Mobile navigation bar"
        >
            <ul className="flex justify-center gap-2 w-full max-w-md mx-auto py-2">
                {menu.map(({ href, label, icon }) => {
                    const isActive = pathname.startsWith(href);
                    return (
                        <li key={href} className="flex-1 flex justify-center">
                            <Link
                                href={href}
                                className={`flex flex-col items-center justify-center text-slate pt-3 pb-1.5 aspect-square rounded-md transition-colors
                                    ${isActive ? "bg-pebble" : "hover:bg-pebble"}`}
                                aria-current={isActive ? "page" : undefined}
                            >
                                <span className="w-4.5 h-4.5">
                                    {icon}
                                </span>
                                <span className="text-xl mt-2">
                                    {label}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}