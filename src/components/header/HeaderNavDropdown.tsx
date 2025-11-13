// src/components/Header/HeaderNavDropdown.tsx
// This file contains the HeaderNavDropdown component for the application

'use client';
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ThinDownChevron } from "../global/SvgComponents";

interface DropdownItem {
    href: string;
    label: string;
    icon?: React.ReactNode;
}

interface HeaderNavDropdownProps {
    label: string;
    href: string;
    isDark: boolean;
    items: DropdownItem[];
}

export default function HeaderNavDropdown({ 
    label, 
    href,
    isDark, 
    items 
}: HeaderNavDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <Link
                href={href}
                className={`
                    text-l ${isDark ? "text-slate" : "text-mist"}
                    font-normal flex items-center gap-2 hover:opacity-70
                    transition duration-250 ease-in-out
                `}
            >
                {label}
                <span className={`w-2 h-2 ${isOpen ? "rotate-180" : ""} transition duration-250 ease-in-out`}>
                    <ThinDownChevron />
                </span>
            </Link>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="absolute left-0 z-20"
                    >
                        <ul className="p-2 mt-2 bg-mist font-normal text-nowrap rounded-lg space-y-1 shadow-standard min-w-45">
                            {items.map((item, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={item.href}
                                        className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-pebble transition duration-200 ease-in-out w-full"
                                    >
                                        <span className="flex items-center text-slate justify-center h-3.5 w-3.5">
                                            {item.icon}
                                        </span>
                                        <span className="text-slate text-l">{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}