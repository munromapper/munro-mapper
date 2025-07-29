// src/components/friends/FriendsPage.tsx
// This file contains the main friends page modal component that displays the list of friends and allows for adding new friends.

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FriendsMenu from './FriendsMenu';
import SearchInput from '../global/forms/SearchInput';
import FriendsRequests from './FriendsRequests';
import FriendsAddFriend from './FriendsAddFriend';
import { fetchAllUserProfiles } from '@/utils/data/clientDataFetchers';
import { UserProfile } from '@/types/data/dataTypes';
import { useAuthContext } from '@/contexts/AuthContext';
import FriendsList from './FriendsList';

export default function FriendsPage() {
    const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'addFriends'>('friends');
    const [searchQuery, setSearchQuery] = useState('');
    const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
    const { user, friends } = useAuthContext();

    useEffect(() => {
        const fetchData = async () => {
            const profiles = await fetchAllUserProfiles();
            if (profiles) {
                setUserProfiles(profiles);
            }
        };
        fetchData();
    }, []);

    console.log('User Profiles:', userProfiles);

    return (
        <div className="divide-y-1 divide-sage bg-mist min-h-125 min-w-100 flex flex-col">
            <div className="p-6 flex flex-col gap-6">
                <div className="px-2 flex flex-col gap-4">
                    <h2 className="font-heading-font-family text-4xl">Friends</h2>
                    <FriendsMenu activeTab={activeTab} setActiveTab={setActiveTab} setSearchQuery={setSearchQuery} />
                </div>
                <SearchInput
                    name="friend-search"
                    value={searchQuery}
                    onChange={(value) => setSearchQuery(value)}
                    placeholder="Search..."
                />
            </div>
            <div className="relative flex-1">
                <AnimatePresence>
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="h-full"
                    >
                        {activeTab === 'friends' && 
                            <FriendsList 
                                searchQuery={searchQuery} 
                                userProfiles={userProfiles} 
                                setActiveTab={setActiveTab}
                            />
                        }
                        {activeTab === 'requests' && 
                            <FriendsRequests 
                                searchQuery={searchQuery} 
                                userProfiles={userProfiles} 
                                setActiveTab={setActiveTab}
                            />
                        }
                        {activeTab === 'addFriends' && 
                            <FriendsAddFriend 
                                searchQuery={searchQuery} 
                                userProfiles={userProfiles} 
                            />
                        }
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}