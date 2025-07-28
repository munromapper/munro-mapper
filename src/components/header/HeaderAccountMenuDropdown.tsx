// src/components/header/HeaderAccountMenu.tsx
// This file contains the HeaderAccountMenu component for the application, which displays the user account menu in the header

import { motion, AnimatePresence } from 'framer-motion';
import { useAuthContext } from "@/contexts/AuthContext";
import { handleAuthSignOut } from '@/utils/auth/handleAuthSignOut';
import UserProfilePicture from '../global/UserProfilePicture';
import IconLink from '../global/IconLink'; 
import { DashboardIcon, SettingsIcon, LogoutIcon, PremiumIcon } from '../global/SvgComponents';

interface HeaderAccountMenuDropdownProps {
    isDropdownActive: boolean;
    setIsSettingsOpen: (open: boolean) => void;
}

export default function HeaderAccountMenuDropdown({
    isDropdownActive = false,
    setIsSettingsOpen
}: HeaderAccountMenuDropdownProps) {
    const { userProfile } = useAuthContext();

    return (
        <div className="absolute right-0 top-[100%] z-20">
            <AnimatePresence>
                {isDropdownActive && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="bg-mist text-slate min-w-57 font-normal whitespace-nowrap rounded-xl mt-2 divide-y divide-sage cursor-auto shadow-standard"
                    >
                        <div className="p-6 flex items-center gap-3">
                            <div className="w-12 h-12">
                                <UserProfilePicture userId={userProfile?.id || ''} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-l">
                                    {userProfile?.firstName} {userProfile?.lastName}
                                </span>
                                <span className="text-m text-moss">
                                    #{userProfile?.discriminator}
                                </span>
                            </div>
                        </div>
                        <div className="p-3 flex flex-col gap-1">
                            {(userProfile && (userProfile.isPremium === 'none' || userProfile.isPremium === 'canceled')) && (
                                <IconLink 
                                    icon={<PremiumIcon currentColor='var(--color-heather)'/>}
                                    label="Discover Plus"
                                    href="/pricing"
                                    transitionWrapper='body'
                                    className="bg-linear-to-r from-cloud from-0% to-lilac to-100% bg-opacity-100 border-mist
                                               hover:border hover:border-heather
                                               transition duration-250 ease-in-out"
                                />
                            )}
                            <IconLink 
                                icon={<DashboardIcon />}
                                label="Dashboard"
                                transitionWrapper='body'
                                href="/explore/dashboard"
                                className="hover:bg-pebble hover:border-pebble border-mist transition duration-250 ease-in-out"
                            />
                            <IconLink 
                                icon={<SettingsIcon />}
                                label="User Settings"
                                transitionWrapper=''
                                className="hover:bg-pebble hover:border-pebble border-mist transition duration-250 ease-in-out"
                                onClick ={() => setIsSettingsOpen(true)}
                            />
                        </div>
                        <div className="p-3 flex flex-col">
                            <IconLink 
                                icon={<LogoutIcon />}
                                label="Logout"
                                transitionWrapper=''
                                className="hover:bg-pebble hover:border-pebble border-mist transition duration-250 ease-in-out"
                                onClick={() => handleAuthSignOut()}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}