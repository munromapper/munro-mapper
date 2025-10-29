// src/app/explore/dashboard/page.tsx
// This is the dashboard page for exploring munro bagging statistics

'use client';
import React, { useEffect } from 'react'
import BaggedMunros from './components/BaggedMunros'
import DifficultyBreakdown from './components/DifficultyBreakdown'
import RegionalBreakdown from './components/RegionalBreakdown';
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
            <div className="bg-mist h-full p-16 text-slate">
                <h1 className="font-heading-font-family text-5xl">Dashboard</h1>
                <div className="pt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="space-y-6">
                        <BaggedMunros />
                        <DifficultyBreakdown />
                        <RegionalBreakdown />
                        {/* ...other left column cards (Difficulty, Regional, etc.) */}
                    </div>

                    {/* ...other columns for rankings, randomiser, friends, etc. */}
                </div>
            </div>
        </BaggedMunroProvider>
    )
}