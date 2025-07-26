// src/app/explore/components/SidebarAccountInfo.tsx
// This file contains the small account information component inside the sidebar of the 'explore' section

'use client';
import { useAuthContext } from "@/contexts/AuthContext";

export default function SidebarAccountInfo() {
    const { userProfile } = useAuthContext();

    if (!userProfile) return null;

    return (
        <div className="px-4 flex items-center gap-3">
            <div className={`rounded-full w-9 h-9 bg-cover bg-center`} style={{ backgroundImage: `url(${userProfile?.profilePhotoUrl})` }}></div>
            <div className="flex flex-col">
                <span className="text-l">
                    {userProfile?.firstName} {userProfile?.lastName}
                </span>
                <span className="text-m text-sage">
                    #{userProfile?.discriminator}
                </span>
            </div>
        </div>
    );
}