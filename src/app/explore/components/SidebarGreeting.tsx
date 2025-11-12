// src/app/explore/components/SidebarGreeting.tsx
// This file contains the greeting message for the sidebar in the 'explore' section

'use client';
import { useAuthContext } from "@/contexts/AuthContext"

export default function SidebarGreeting() {
    const { userProfile } = useAuthContext();

    return (
        <div className="px-4 space-y-3">
            <h2 className="text-4xl font-heading-font-family">Hello, {userProfile?.firstName || 'friend'}!</h2>
            <p className="text-l">Ready for your next hill? Let&apos;s figure out where to go.</p>
        </div>
    )
}