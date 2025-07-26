// src/components/global/PrimaryButton.tsx
// This file contains the multi-use PrimaryButton component for the application

import React from "react";
import TransitionLink from "./TransitionLink";

interface PrimaryButtonProps {
    label: string;
    href?: string;
    onClick: () => void;
    disabled?: boolean;
    isAlternate: boolean;
    isLarge?: boolean;
}

/**
 * PrimaryButton component for displaying a primary button.
 * @param label - The text to display on the button.
 * @param href - Optional URL to use in an on click callback for navigation.
 * @param onClick - Function to call when the button is clicked.
 * @param disabled - Whether the button is disabled.
 * @param isAlternate - Whether to use the alternate styling.
 * @param isLarge - Whether to use large button styling.
 */
export function PrimaryButton({ 
    label, 
    href,
    onClick, 
    disabled = false, 
    isAlternate = false,
    isLarge = false
}: PrimaryButtonProps) {

    const baseClasses = `
        px-6 py-2 rounded-full font-normal border
        transition duration-250 ease-in-out
        ${isLarge ? 'text-xl' : 'text-l'}
        ${isAlternate 
            ? 'bg-petal text-slate border-petal' 
            : 'bg-apple text-slate border-apple'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `;

    // Only add hover classes if not disabled
    const hoverClasses = !disabled
        ? (isAlternate 
            ? 'hover:border-blush hover:bg-blush hover:text-mist' 
            : 'hover:bg-mist')
        : '';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${hoverClasses}`}
        >
            {label}
        </button>
    );
}

interface SecondaryButtonProps {
    label: string;
    href?: string;
    onClick: () => void;
    disabled?: boolean;
    isAlternate: boolean;
    isLarge?: boolean;
}

/**
 * SecondaryButton component for displaying a secondary button.
 * @param label - The text to display on the button.
 * @param href - Optional URL to use in an on click callback for navigation.
 * @param onClick - Function to call when the button is clicked.
 * @param disabled - Whether the button is disabled.
 * @param isAlternate - Whether to use the alternate styling.
 * @param isLarge - Whether to use large button styling.
 */
export function SecondaryButton({ 
    label, 
    href,
    onClick, 
    disabled = false, 
    isAlternate = false,
    isLarge = false
}: SecondaryButtonProps) {

    const baseClasses = `
        px-6 py-2 rounded-full border
        transition duration-250 ease-in-out
        ${isLarge ? 'text-xl' : 'text-l'}
        ${isAlternate 
            ? 'border-sage text-mist font-light' 
            : 'border-sage text-slate font-normal'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `;

    // Only add hover classes if not disabled
    const hoverClasses = !disabled
        ? (isAlternate 
            ? 'hover:bg-sage hover:text-slate' 
            : 'hover:bg-sage')
        : '';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${hoverClasses}`}
        >
            {label}
        </button>
    );
}

interface TertiaryButtonProps {
    label: string;
    href?: string;
    onClick: () => void;
    disabled?: boolean;
    isAlternate: boolean;
    isLarge?: boolean;
}

/**
 * TertiaryButton component for displaying a tertiary button.
 * @param label - The text to display on the button.
 * @param href - Optional URL to use in an on click callback for navigation.
 * @param onClick - Function to call when the button is clicked.
 * @param disabled - Whether the button is disabled.
 * @param isAlternate - Whether to use the alternate styling.
 * @param isLarge - Whether to use large button styling.
 */
export function TertiaryButton({ 
    label, 
    href,
    onClick, 
    disabled = false, 
    isAlternate = false,
    isLarge = false
}: TertiaryButtonProps) {

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                cursor-pointer
                ${isAlternate 
                    ? 'text-slate font-normal hover:opacity-70' 
                    : 'text-mist font-light hover:opacity-70'
                }
                ${isLarge 
                    ? 'text-xl' 
                    : 'text-l'
                } 
                transition duration-250 ease-in-out
            `}
        >
            {label}
        </button>
    );
}

interface InlineLinkProps {
    label: string;
    href?: string;
    target?: string;
    transitionWrapper: string | "";
    onClick?: () => void;
}

export function InlineLink({
    label,
    href,
    target,
    transitionWrapper,
    onClick
}: InlineLinkProps) {
    return (
        <span
            onClick={onClick}
            className="cursor-pointer underline decoration-dotted underline-offset-4
                       hover:opacity-70
                       transition duration-250 ease-in-out"
        >
            {!href && (
                <span>{label}</span>
            )}
            {href && (
                <TransitionLink
                    transitionWrapper={transitionWrapper}
                    href={href}
                    target={target}
                >
                    {label}
                </TransitionLink>
            )}
        </span>
    );
}
