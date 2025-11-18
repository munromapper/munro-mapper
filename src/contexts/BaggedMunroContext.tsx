// src/context/BaggedMunroContext.tsx
// Context for managing bagged Munros for the current user

'use client';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuthContext } from './AuthContext';
import { bagMunro, unbagMunro } from '@/utils/data/clientDataFetchers';
import { supabase } from '@/utils/auth/supabaseClient';

type BaggedMunroContextType = {
    userBaggedMunros: number[]; 
    friendsBaggedMunros: { [friendUserId: string]: number[] };
    refreshBaggedMunros: () => void;
    loading: boolean;
    error: string | null;
    toggleBagged: (munroId: number, shouldBag: boolean) => Promise<void>;
    isBagged: (munroId: number) => boolean;
    lastToggledMunroId: number | null;
};

const BaggedMunroContext = createContext<BaggedMunroContextType | undefined>(undefined);

export const BaggedMunroProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, friends } = useAuthContext();
    const [userBaggedMunros, setUserBaggedMunros] = useState<number[]>([]);
    const [friendsBaggedMunros, setFriendsBaggedMunros] = useState<{ [friendUserId: string]: number[] }>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastToggledMunroId, setLastToggledMunroId] = useState<number | null>(null);

    // Always fetch bagged munros when user or friends change
    const fetchBaggedMunros = useCallback(async () => {
        if (!user) {
            setUserBaggedMunros([]);
            setFriendsBaggedMunros({});
            return;
        }
        setLoading(true);
        setError(null);

        try {
            // Fetch current user's bagged munros
            const { data: userData, error: userError } = await supabase
                .from('bagged_munros')
                .select('munro_id')
                .eq('user_id', user.id);

            if (userError) throw userError;
            setUserBaggedMunros(userData?.map((row) => row.munro_id) || []);

            // Fetch friends' bagged munros
            const friendsMap: { [friendUserId: string]: number[] } = {};
            if (friends && friends.length > 0) {
                const friendUserIds = friends
                    .filter(f => f && f.requestStatus === 'accepted')
                    .map(f => (f?.requesterId === user.id ? f?.addresseeId : f?.requesterId));

                if (friendUserIds.length > 0) {
                    const { data: friendsData, error: friendsError } = await supabase
                        .from('bagged_munros')
                        .select('user_id, munro_id')
                        .in('user_id', friendUserIds);

                    if (friendsError) throw friendsError;

                    friendsData?.forEach((row) => {
                        if (!friendsMap[row.user_id]) friendsMap[row.user_id] = [];
                        friendsMap[row.user_id].push(row.munro_id);
                    });
                }
            }
            setFriendsBaggedMunros(friendsMap);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to fetch bagged munros');
            }
        } finally {
            setLoading(false);
        }
    }, [user, friends]);

    useEffect(() => {
        fetchBaggedMunros();
    }, [user, friends, fetchBaggedMunros]);

    const toggleBagged = useCallback(
        async (munroId: number, shouldBag: boolean) => {
            if (!user) return;
            setLastToggledMunroId(munroId);
            setError(null);
            setUserBaggedMunros(prev =>
                shouldBag ? [...prev, munroId] : prev.filter(id => id !== munroId)
            );
            if (shouldBag) {
                const { error } = await bagMunro(user.id, munroId);
                if (error) setError(error.message);
            } else {
                const { error } = await unbagMunro(user.id, munroId);
                if (error) setError(error.message);
            }
            fetchBaggedMunros();
        },
        [user, fetchBaggedMunros]
    );

    return (
        <BaggedMunroContext.Provider value={{
            userBaggedMunros,
            friendsBaggedMunros,
            refreshBaggedMunros: fetchBaggedMunros,
            loading,
            error,
            toggleBagged,
            isBagged: (munroId: number) => userBaggedMunros.includes(munroId),
            lastToggledMunroId,
        }}>
            {children}
        </BaggedMunroContext.Provider>
    );
};

export const useBaggedMunroContext = () => {
    const ctx = useContext(BaggedMunroContext);
    if (!ctx) throw new Error('useBaggedMunroContext must be used within a BaggedMunroProvider');
    return ctx;
};