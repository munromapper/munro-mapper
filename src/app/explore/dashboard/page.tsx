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
                <div className="pt-12 h-auto grid grid-cols-3 grid-rows-6 gap-6">
                    <div className="space-y-6 row-span-6 col-span-1 flex flex-col">
                        <BaggedMunros />
                        <DifficultyBreakdown />
                        <RegionalBreakdown />
                    </div>
                    <div className="col-span-2 row-span-3 max-h-130">
                        <BaggedMunrosList />
                    </div>
                    <div className="row-span-3 col-span-2 grid grid-cols-2 gap-6">
                        {isPremium ? <MunroSuggester /> : <PremiumAdvertSmall />}
                        <FriendsProgress />
                    </div>
                </div>
            </div>
        </BaggedMunroProvider>
    )
}