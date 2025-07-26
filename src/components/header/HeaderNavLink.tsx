// src/components/Header/HeaderNavLink.tsx
// This file contains the HeaderNavLink component for the application

'use client';
import Link from "next/link";
import React from "react";
import TransitionLink from "../global/TransitionLink";
import { ThinDownChevron } from "../global/SvgComponents";

interface HeaderNavLinkProps {
    href: string;
    label: string;
    isDark: boolean;
    isDropdown: boolean;
    isDropdownActive: boolean;
}

/**
 * HeaderNavLink component for displaying a navigation link in the header.
 * @param href - The URL the link points to.
 * @param label - The text to display for the link.
 * @param isDark - Whether the link should use dark styling.
 * @param isDropdown - Whether the link is the title of a dropdown menu.
 * @param isDropdownActive - Whether the dropdown menu is currently active.
 */
export default function HeaderNavLink({
    href,
    label,
    isDark,
    isDropdown,
    isDropdownActive = false
}: HeaderNavLinkProps) {

    return (
        <TransitionLink
            transitionWrapper="body"
            href={href} 
            className={`
                text-l 
                ${isDark ? "text-slate" : "text-mist"}
                ${isDark ? "font-normal" : "font-light"}
                ${isDropdown ? "flex items-center gap-2" : ""} 
                hover:opacity-70
                transition duration-250 ease-in-out`
            }
        >
            {label}
            {isDropdown && (
                <span 
                    className={`
                    w-2 h-2 rotate-0 
                    ${isDropdownActive ? "rotate-180" : ""} 
                    transition duration-250 ease-in-out`
                    }
                >
                    <ThinDownChevron/>
                </span>
            )}
        </TransitionLink>
    )
}
