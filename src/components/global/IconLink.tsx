// src/components/global/IconLink.tsx
// This file contains the IconLink component for the application, which provides a link with an icon and pill wrapper

import React from 'react';
import TransitionLink from './TransitionLink';

interface IconLinkProps {
    icon: React.ReactNode;
    label: string;
    href?: string;
    transitionWrapper: string;
    onClick?: () => void;
    className?: string;
}

export default function IconLink({
    icon,
    label,
    href,
    transitionWrapper,
    onClick,
    className = ''
}: IconLinkProps) {
    return (
        <button 
            className={`
                px-4 py-2 border rounded-full flex items-center gap-4 cursor-pointer transition duration-250 ease-in-out ${className}`}
            onClick={onClick}
        >
            <span className="w-3 h-3 flex items-center justify-center">
                {icon}
            </span>
            {!href && (
                <span className="text-l">
                    {label}
                </span>
            )}
            {href && (
                <TransitionLink
                    transitionWrapper={transitionWrapper}
                    href={href}
                    className="text-l"
                >
                    {label}
                </TransitionLink>
            )}
        </button>
    )
}