// src/components/header/MobileMenu.tsx
// This file contains the MobileMenu component for the application

'use client';
import React from "react";
import LoginAuthButtons from "./LoginAuthButtons";
import { useAuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { LogoDark } from "../global/SvgComponents";
import { ChevronIcon } from "../global/SvgComponents";
import { handleAuthSignOut } from '@/utils/auth/handleAuthSignOut';

interface MobileMenuProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function MobileMenu({ 
    isMobileMenuOpen, 
    setIsMobileMenuOpen 
}: MobileMenuProps) {
    const { user } = useAuthContext();
    return (
        <div className={`fixed flex flex-col gap-12 top-0 w-full py-8 px-6 h-full z-60 bg-mist text-slate transition-all duration-250 ease-in-out
                        ${isMobileMenuOpen ? 'opacity-100 left-0 pointer-events-auto' : 'opacity-0 -left-[50vw] pointer-events-none'}
        `}>
            <div>
                <div className="w-60">
                    <Link href="/" className="cursor-pointer">
                        <LogoDark />
                    </Link>
                </div>
            </div>
            <nav className="flex-1 flex flex-col text-xxl">
                <div>
                    <div className="flex items-center cursor-pointer justify-between py-6 border-b border-sage">
                        Explore
                        <span className="w-3 h-3">
                            <ChevronIcon />
                        </span>
                    </div>
                    <ul className="mt-6 flex flex-col gap-2">
                        {user && (
                            <li>
                                <Link href="/explore/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard View</Link>
                            </li>
                        )}
                        <li>
                            <Link href="/explore/map" onClick={() => setIsMobileMenuOpen(false)}>Map View</Link>
                        </li>
                        <li>
                            <Link href="/explore/list" onClick={() => setIsMobileMenuOpen(false)}>List View</Link>
                        </li>
                    </ul>
                </div>
                <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer py-6 border-b border-sage">
                    Pricing
                </Link>
                <Link href="/About" onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer py-6 border-b border-sage">
                    About
                </Link>
                <Link href="/Contact" onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer py-6 border-b border-sage">
                    Contact
                </Link>
                {user && (
                   <div>
                        <div className="flex items-center cursor-pointer justify-between py-6 border-b border-sage">
                            Account
                            <span className="w-3 h-3">
                                <ChevronIcon />
                            </span>
                        </div>
                        <ul className="mt-6 flex flex-col gap-2">
                            <li>
                                <Link href="/explore/dashboard">Settings</Link>
                            </li>
                            <li>
                                <button className="cursor-pointer"
                                    onClick={async () => {
                                    const success = await handleAuthSignOut();
                                    if (success) {
                                        window.location.reload();
                                    }
                                }}
                                >
                                    Log out
                                </button>
                            </li>
                        </ul>
                    </div> 
                )}
            </nav>
            <div>
                <LoginAuthButtons 
                    isDark={true}
                />
            </div>
        </div>
    )
}
