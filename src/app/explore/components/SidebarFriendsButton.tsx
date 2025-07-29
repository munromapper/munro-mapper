// src/app/explore/components/SidebarFriendsButton.tsx
// This component defines the button to open the friends modal in the explore sidebar

'use client';
import { useAuthContext } from "@/contexts/AuthContext";
import IconLink from "@/components/global/IconLink";
import { FriendsIcon } from "@/components/global/SvgComponents";

interface SidebarFriendsButtonProps {
    setIsFriendsOpen: (isOpen: boolean) => void;
}

export default function SidebarFriendsButton({ 
    setIsFriendsOpen 
}: SidebarFriendsButtonProps) {
    const { user, friends } = useAuthContext();

    const pendingRequestsCount = (friends ?? []).filter(
        f => f?.addresseeId === user?.id && f?.requestStatus === "pending"
    ).length;

    return (
        <IconLink 
            icon={
                <div>
                    <FriendsIcon />
                    {pendingRequestsCount > 0 && (
                    <span className="flex absolute right-20 top-0 bottom-0 my-auto justify-center items-center bg-apple text-slate text-xs rounded h-4 w-4 pr-0.5">
                        {pendingRequestsCount}
                    </span>
                    )}
                </div>
            }
            label="Friends"
            className="border-slate hover:bg-mist/10"
            onClick={() => setIsFriendsOpen(true)}
        />
    )
}