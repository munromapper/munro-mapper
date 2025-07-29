// src/components/global/TransitionLink.tsx
// This file contains the TransitionLink component for the application, which provides a link with transition effects
'use client';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { sleep } from '@/utils/misc/sleep';
import React from 'react';

interface TransitionLinkProps extends LinkProps {
    children: React.ReactNode;
    href: string;
    target?: string;
    transitionWrapper: string | "";
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    className?: string;
}

export default function TransitionLink({
    children,
    href,
    target,
    transitionWrapper,
    onMouseEnter,
    onMouseLeave,
    className,
}: TransitionLinkProps) {
    const router = useRouter();

    const getSelector = (selector: string) => {
        if (!selector) return '';
        if (/^[a-z]+$/.test(selector)) return selector;
        if (selector.startsWith('#') || selector.startsWith('.')) return selector;
        return `#${selector}`;
    };

    const handleTransition = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (target === '_blank') return;

        event.preventDefault();

        const selector = getSelector(transitionWrapper);
        const transitionElement = document.querySelector(selector);
        if (transitionElement) {
            transitionElement.classList.add('page-transition');
            await sleep(250);
            router.push(href);
            await sleep(250);
            transitionElement.classList.remove('page-transition');
        } else {
            router.push(href);
        }
    }

    return (
        <Link
            href={href}
            target={target}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={handleTransition}
            className={className}
        >
            {children}
        </Link>
    )
}