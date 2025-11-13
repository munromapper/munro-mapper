// src/app/components/Header/Header.tsx
// This file contains the Header component for the application

'use client';
import React from "react";
import LogoLink from "./LogoLink";
import HeaderNavLink from "./HeaderNavLink";
import HeaderSearchBar from "./HeaderSearchBar";
import HeaderNavDropdown from "./HeaderNavDropdown";
import LoginAuthButtons from "./LoginAuthButtons";
import ModalElement from "@/components/global/Modal";
import PremiumAdvertPopup from "./PremiumAdvertPopup";
import { useAuthContext } from "@/contexts/AuthContext";
import { MapIcon, ListIcon, DashboardIcon } from "../global/SvgComponents";

const navLinks = {
    explore: {
        href: "/explore",
        label: "Explore",
        children: [
            {
                href: "/explore/dashboard",
                label: "Dashboard",
                icon: <DashboardIcon />
            },
            {
                href: "/explore/map",
                label: "Map View",
                icon: <MapIcon />
            },
            {
                href: "/explore/list",
                label: "List View",
                icon: <ListIcon />
            },
        ]
    },
    pricing: {
        href: "/pricing",
        label: "Pricing",
        children: null
    },
    about: {
        href: "/about",
        label: "About",
        children: null
    },
    contact: {
        href: "/contact",
        label: "Contact",
        children: null
    },
}

interface HeaderProps {
    isAppHeader: boolean;
}

/**
 * Header component for displaying the application header.
 * @param isAppHeader - Whether the header is for the 'explore' application page (Removes logo link, changes background color and border, adjusts content layout and alignment)
 */
export default function Header({ isAppHeader }: HeaderProps) {
    const { isPremiumAdModalOpen, closePremiumAdModal } = useAuthContext();
    const { user } = useAuthContext();

    return(
        <header 
            className="w-full py-6 px-15 flex items-center justify-between z-30 min-h-22"
            style = {{
                backgroundColor: isAppHeader ? "var(--color-mist)" : "transparent",
                borderBottom: isAppHeader ? "1px solid var(--color-sage)" : "none",
                position: isAppHeader ? "static" : "absolute",
            }}
        >
            {!isAppHeader && (
                <LogoLink 
                    href="/"
                    isDark={false}
                />
            )}
            {isAppHeader && (
                <LogoLink 
                    href="/"
                    isDark={true}
                />
            )}
            <HeaderSearchBar />
            <nav className="flex items-center gap-16">
                <ul className="flex items-center gap-5">
                    {Object.entries(navLinks).map(([key, link]) => (
                        <li key={key} className="inline-block">
                            {Array.isArray(link.children) ? (
                                <HeaderNavDropdown
                                    label={link.label}
                                    href={link.href}
                                    isDark={isAppHeader}
                                    children={
                                        // Only show 'Nearby trails' if user exists, otherwise filter it out
                                        link.children.filter(item => item.href !== "/explore/dashboard" || user)
                                    }
                                />
                            ) : (
                                <HeaderNavLink
                                    href={link.href}
                                    label={link.label}
                                    isDark={isAppHeader}
                                    isDropdown={false}
                                    isDropdownActive={false}
                                />
                            )}
                        </li>
                    ))}
                </ul>
                <div>
                    <LoginAuthButtons 
                        isDark={isAppHeader}
                    />
                </div>
            </nav>
            <ModalElement
                isOpen={isPremiumAdModalOpen}
                onClose={closePremiumAdModal}
                closeButtonBgClass="bg-lilac/25"
                closeButtonHoverBgClass="hover:bg-lilac/50"
            >
                <PremiumAdvertPopup />
            </ModalElement>
        </header>
    )
}