// src/app/explore/dashboard/page.tsx
// This is the dashboard page for exploring munro bagging statistics

'use client';
import React, { useEffect } from 'react'
import BaggedMunros from './components/BaggedMunros'
import DifficultyBreakdown from './components/DifficultyBreakdown'
import RegionalBreakdown from './components/RegionalBreakdown';
import BaggedMunrosList from './components/BaggedMunrosList';
import FriendsProgress from './components/FriendsProgress';
import MunroSuggester from './components/MunroSuggester';
import PremiumAdvertSmall from './components/PremiumAdvertSmall';
import { BaggedMunroProvider } from '@/contexts/BaggedMunroContext'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function DashboardLayout() {
    const { user, userProfile } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.replace('/explore/map');
        }
    }, [user, router]);

    const isPremium = userProfile?.isPremium === 'active' || userProfile?.isPremium === 'canceling';

    return (
        <BaggedMunroProvider>
            <div className="bg-mist h-auto min-h-full flex flex-col p-16 text-slate">
                <h1 className="font-heading-font-family text-5xl">Dashboard</h1>
                <div className="pt-12 flex flex-row gap-6 max-w-400">
                    <div className="flex flex-col gap-6 w-1/3">
                        <BaggedMunros />
                        <DifficultyBreakdown />
                        <RegionalBreakdown />
                    </div>
                    <div className="flex flex-col gap-6 w-2/3">
                        <div className="h-120">
                            <BaggedMunrosList />
                        </div>
                        <div className="flex flex-1 gap-6">
                            <div className="flex-1">
                                {isPremium ? <MunroSuggester /> : <PremiumAdvertSmall />}
                            </div>
                            <div className="flex-1">
                                <FriendsProgress />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaggedMunroProvider>
    )
}