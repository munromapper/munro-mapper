// src/app/components/Header/LogoLink.tsx
// This file contains the LogoLink component for the application

import React from "react";
import TransitionLink from "../global/TransitionLink";
import { LogoLight, LogoDark} from '@/components/global/SvgComponents'

interface LogoLinkProps {
    href: string;
    isDark: boolean;
}

/**
 * LogoLink component for displaying the application logo and its link wrapper.
 * @param href - The URL the logo link points to.
 * @param isDark - Whether the logo should use dark styling.
 */
export default function LogoLink({ 
    href, 
    isDark 
}: LogoLinkProps) {
    return (
        <TransitionLink
            transitionWrapper="body" 
            href={href} 
            className="w-50"
        >
            {isDark && (
                <LogoDark />
            )}
            {!isDark && (
                <LogoLight />
            )}
        </TransitionLink>
    );
}
