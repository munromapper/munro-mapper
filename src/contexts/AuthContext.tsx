// src/contexts/AuthContext.tsx
// This file contains the AuthContext for managing authentication state across the application

'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/auth/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { UserProfile, UserSubscription, Friend } from '@/types/data/dataTypes';
import { fetchUserProfile, fetchUserSubscription, fetchUserFriends } from '@/utils/data/clientDataFetchers';

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    userSubscription: UserSubscription[] | null;
    refreshUserProfile: () => Promise<void>;
    friends: Friend[] | null;
    globalMessage: string | null;
    setGlobalMessage: (msg: string | null) => void;
    children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userProfile: null,
    userSubscription: null,
    refreshUserProfile: async () => {},
    friends: null,
    globalMessage: null,
    setGlobalMessage: () => {},
    children: null,
});

export const AuthProvider = (
    { children }
    : { children: React.ReactNode }
) => {
    const [user, setUser] = useState<User | null>(null);
    const [userSubscription, setUserSubscription] = useState<UserSubscription[] | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [friends, setFriends] = useState<Friend[] | null>(null);
    const [globalMessage, setGlobalMessage] = useState<string | null>(null);

    useEffect(() => {
        
        // Fetch the current user session and set the user state when the component mounts
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                console.error('Error fetching user session:', error);
                return;
            }
            const currentUser = session?.user || null;
            setUser(currentUser);
            if (currentUser !== null) {
                fetchUserProfile(currentUser.id).then(setUserProfile);
                fetchUserSubscription(currentUser.id).then(setUserSubscription);
                fetchUserFriends(currentUser.id).then(setFriends);
            }
        });

        // Set up a listener for authentication state changes to update user state
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser !== null) {
                fetchUserProfile(currentUser.id).then(setUserProfile);
                fetchUserSubscription(currentUser.id).then(setUserSubscription);
                fetchUserFriends(currentUser.id).then(setFriends);
            } else {
                setUserProfile(null);
            }
        });

        return () => listener?.subscription.unsubscribe();

    }, []);

    const refreshUserProfile = async () => {
        if (user) {
            const updatedProfile = await fetchUserProfile(user.id);
            setUserProfile(updatedProfile);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, userSubscription, friends, refreshUserProfile, globalMessage, setGlobalMessage, children }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    return useContext(AuthContext);
}
