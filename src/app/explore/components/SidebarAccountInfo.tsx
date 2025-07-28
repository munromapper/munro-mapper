// src/app/explore/components/SidebarAccountInfo.tsx
// This file contains the small account information component inside the sidebar of the 'explore' section

'use client';
import { useAuthContext } from "@/contexts/AuthContext";
import UserProfilePicture from "@/components/global/UserProfilePicture";

export default function SidebarAccountInfo() {
    const { userProfile } = useAuthContext();

    if (!userProfile) return null;

    return (
        <div className="px-4 flex items-center gap-3">
            <div className="w-9 h-9">
                <UserProfilePicture userId={userProfile.id} />
            </div>
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