// src/contexts/AuthContext.tsx
// This file contains the AuthContext for managing authentication state across the application

'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/auth/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { UserProfile, UserSubscription, Friend } from '@/types/data/dataTypes';
import { fetchUserProfile, fetchUserSubscription, fetchUserFriends } from '@/utils/data/clientDataFetchers';
import patchGoogleUserProfile from '@/utils/auth/patchGoogleUserProfile';

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    userSubscription: UserSubscription[] | null;
    refreshUserProfile: () => Promise<void>;
    refreshFriends: () => Promise<void>;
    friends: Friend[] | null;
    globalMessage: string | null;
    setGlobalMessage: (msg: string | null) => void;
    children: React.ReactNode;
    isAuthModalOpen: boolean;
    authFormMode: 'logIn' | 'signUp';
    openAuthModal: (mode: 'logIn' | 'signUp') => void;
    closeAuthModal: () => void;
    isPremiumAdModalOpen: boolean;
    openPremiumAdModal: () => void;
    closePremiumAdModal: () => void;
    
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userProfile: null,
    userSubscription: null,
    refreshUserProfile: async () => {},
    refreshFriends: async () => {},
    friends: null,
    globalMessage: null,
    setGlobalMessage: () => {},
    children: null,
    isAuthModalOpen: false,
    authFormMode: 'logIn',
    openAuthModal: (mode: 'logIn' | 'signUp') => {},
    closeAuthModal: () => {},
    isPremiumAdModalOpen: false,
    openPremiumAdModal: () => {},
    closePremiumAdModal: () => {},
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
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authFormMode, setAuthFormMode] = useState<'logIn' | 'signUp'>('logIn');
    const [isPremiumAdModalOpen, setIsPremiumAdModalOpen] = useState(false);

    // Modal control functions
    const openAuthModal = (mode: 'logIn' | 'signUp') => {
        setAuthFormMode(mode);
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const openPremiumAdModal = () => {
        setIsPremiumAdModalOpen(true);
    };

    const closePremiumAdModal = () => {
        setIsPremiumAdModalOpen(false);
    };

    useEffect(() => {
    const checkSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
            setUser(null);
            setUserProfile(null);
            setUserSubscription(null);
            setFriends(null);
            return;
        }
        // Double-check with Supabase if the session is valid
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
            setUser(null);
            setUserProfile(null);
            setUserSubscription(null);
            setFriends(null);
            return;
        }
        const currentUser = userData.user;
        setUser(currentUser);
        fetchUserProfile(currentUser.id).then(setUserProfile);
        fetchUserSubscription(currentUser.id).then(setUserSubscription);
        fetchUserFriends(currentUser.id).then(setFriends);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
            setUser(null);
            setUserProfile(null);
            setUserSubscription(null);
            setFriends(null);
            return;
        }
        // Double-check with Supabase if the session is valid
        supabase.auth.getUser().then(({ data: userData, error: userError }) => {
            if (userError || !userData?.user) {
                setUser(null);
                setUserProfile(null);
                setUserSubscription(null);
                setFriends(null);
                return;
            }
            const currentUser = userData.user;
            setUser(currentUser);
            fetchUserProfile(currentUser.id).then(setUserProfile);
            fetchUserSubscription(currentUser.id).then(setUserSubscription);
            fetchUserFriends(currentUser.id).then(setFriends);
        });
    });

    return () => listener?.subscription.unsubscribe();
}, []);

    useEffect(() => {
        const checkAndPatch = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user && session.user.app_metadata.provider === "google") {
            await patchGoogleUserProfile(session.user.id);
        }
        };
        checkAndPatch();
    }, []);

    const refreshUserProfile = async () => {
        if (user) {
            const updatedProfile = await fetchUserProfile(user.id);
            setUserProfile(updatedProfile);
        }
    };

    const refreshFriends = async () => {
        if (user?.id) {
            const updated = await fetchUserFriends(user.id);
            setFriends(updated);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            userProfile, 
            userSubscription, 
            friends, 
            refreshUserProfile, 
            refreshFriends, 
            globalMessage, 
            setGlobalMessage, 
            children,
            isAuthModalOpen,
            authFormMode,
            openAuthModal,
            closeAuthModal,
            isPremiumAdModalOpen,
            openPremiumAdModal,
            closePremiumAdModal,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    return useContext(AuthContext);
}
