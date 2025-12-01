// src/components/header/MobileMenu.tsx
// This file contains the MobileMenu component for the application

'use client';
import React from "react";
import LoginAuthButtons from "./LoginAuthButtons";
import { useAuthContext } from "@/contexts/AuthContext";
import { LogoDark } from "../global/SvgComponents";

interface MobileMenuProps {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

export default function MobileMenu({ 
    isMobileMenuOpen, 
    setIsMobileMenuOpen 
}: MobileMenuProps) {
    return (
        <div className={`fixed top-0 w-full py-8 px-6 h-full z-60 bg-mist text-slate transition-all duration-250 ease-in-out
                        ${isMobileMenuOpen ? 'opacity-100 left-0 pointer-events-auto' : 'opacity-0 -left-[50vw] pointer-events-none'}
        `}>
            <div className="w-60">
                <a href="/" className="cursor-pointer">
                    <LogoDark />
                </a>
            </div>  
        </div>
    )
}
