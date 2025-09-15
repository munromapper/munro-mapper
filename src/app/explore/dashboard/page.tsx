// src/app/explore/dashboard/page.tsx
// This is the dashboard page for exploring munro bagging statistics

import React from 'react'
import BaggedMunros from './components/BaggedMunros'
import { BaggedMunroProvider } from '@/contexts/BaggedMunroContext'

export default function DashboardLayout() {
    return (
        <BaggedMunroProvider>
            <div className="bg-mist h-full p-16 text-slate">
                <h1 className="font-heading-font-family text-5xl">Dashboard</h1>
                <div className="pt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="space-y-6">
                        <BaggedMunros />
                        {/* ...other left column cards (Difficulty, Regional, etc.) */}
                    </div>

                    {/* ...other columns for rankings, randomiser, friends, etc. */}
                </div>
            </div>
        </BaggedMunroProvider>
    )
}