// src/components/Header/HeaderNavDropdown.tsx
// This file contains the HeaderNavDropdown component for the application

'use client';
import React, { useState } from "react";
import HeaderNavLink from "./HeaderNavLink";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderNavDropdownProps {
    label: string;
    href: string;
    isDark: boolean;
    children: React.ReactNode;
}

/**
 * HeaderNavDropdown component for displaying a dropdown menu in the header navigation.
 * @param label - The label for the dropdown title link.
 * @param href - The URL the dropdown title link points to.
 * @param isDark - Whether the dropdown title link should use dark styling.
 * @param children - The dropdown menu items to display when the dropdown is open.
 */
export default function HeaderNavDropdown({ 
    label, 
    href,
    isDark, 
    children 
}: HeaderNavDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <HeaderNavLink
                href={href}
                label={label}
                isDark={isDark}
                isDropdown={true}
                isDropdownActive={isOpen}
            />
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="absolute left-0 z-20"
                    >
                        <ul className="py-4 pl-6 pr-20 mt-2 bg-mist font-normal text-nowrap rounded-lg space-y-2 shadow-standard">
                            {React.Children.map(children, (child, idx) => (
                                <li key={idx}>
                                    {child}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}