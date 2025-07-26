// src/app/components/Header/Header.tsx
// This file contains the Header component for the application

import React from "react";
import LogoLink from "./LogoLink";
import HeaderNavLink from "./HeaderNavLink";
import HeaderNavDropdown from "./HeaderNavDropdown";
import LoginAuthButtons from "./LoginAuthButtons";

const navLinks = {
    explore: {
        href: "/explore",
        label: "Explore",
        children: {
            mapview: {
                href: "/explore/map",
                label: "Map View",
            },
            listview: {
                href: "/explore/list",
                label: "List View",
            },
            dashboard: {
                href: "/explore/dashboard",
                label: "Dashboard",
            }
        }
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
            <nav className="flex items-center gap-16">
                <ul className="flex items-center gap-6">
                    {Object.entries(navLinks).map(([key, link]) => (
                        <li key={key} className="inline-block mr-4">
                            {link.children ? (
                                <HeaderNavDropdown label={link.label} href={link.href} isDark={isAppHeader}>
                                {Object.entries(link.children).map(([childKey, child]) => (
                                    <HeaderNavLink
                                        key={childKey}
                                        href={child.href}
                                        label={child.label}
                                        isDark={true}
                                        isDropdown={false}
                                        isDropdownActive={false}
                                    />
                                ))}
                                </HeaderNavDropdown>
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
        </header>
    )
}