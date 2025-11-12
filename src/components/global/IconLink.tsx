// src/components/global/IconLink.tsx
// This file contains the IconLink component for the application, which provides a link with an icon and pill wrapper

import React from 'react';
import TransitionLink from './TransitionLink';
import Link from 'next/link';

interface IconLinkProps {
    icon: React.ReactNode;
    label: string;
    href?: string;
    onClick?: () => void;
    className?: string;
}

export default function IconLink({
    icon,
    label,
    href,
    onClick,
    className = ''
}: IconLinkProps) {
    return (
        <Link
            className={`
                relative px-4 py-2 border rounded-full flex items-center gap-4 cursor-pointer transition duration-250 ease-in-out ${className}`}
            onClick={onClick}
            href={href || '#'}
        >
            <span className="w-3.5 h-3.5 flex items-center justify-center">
                {icon}
            </span>
            <span className="text-l">
                {label}
            </span>
        </Link>
    )
}