// src/app/explore/dashboard/page.tsx
// This is the dashboard page for exploring munro bagging statistics

'use client';
import React, { useEffect } from 'react'
import BaggedMunros from './components/BaggedMunros'
import DifficultyBreakdown from './components/DifficultyBreakdown'
import RegionalBreakdown from './components/RegionalBreakdown';
import BaggedMunrosList from './components/BaggedMunrosList';
import { BaggedMunroProvider } from '@/contexts/BaggedMunroContext'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function DashboardLayout() {
    const { user } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.replace('/explore/map');
        }
    }, [user, router]);

    return (
        <BaggedMunroProvider>
            <div className="bg-mist h-full flex flex-col p-16 text-slate">
                <h1 className="font-heading-font-family text-5xl">Dashboard</h1>
                <div className="pt-12 h-full grid grid-cols-3 grid-rows-6 gap-6">
                    <div className="space-y-6 row-span-6 col-span-1">
                        <BaggedMunros />
                        <DifficultyBreakdown />
                        <RegionalBreakdown />
                    </div>
                    <div className="col-span-2 row-span-3">
                        <BaggedMunrosList />
                    </div>
                    <div className="row-span-2">
                        {/* <FriendsProgress /> */}
                    </div>
                </div>
            </div>
        </BaggedMunroProvider>
    )
}