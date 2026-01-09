// src/app/expore/map/munro/[munro]/components/MunroDetailBackButton.tsx
// This component provides a back button for the munro detail page

'use client';

import { useMapState } from '@/contexts/MapStateContext';
import { useRouter } from 'next/navigation';
import { SmallArrow } from "@/components/global/SvgComponents";

export default function MunroDetailBackButton() {
    const router = useRouter();
    const { closeMobileSidebar } = useMapState();

    return (
        <button
            type="button"
            className="w-8 h-8 rounded-full p-2 bg-pebble text-slate cursor-pointer"
            aria-label="Back"
            onClick={() => {
                const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches;
                if (isMobile) {
                    closeMobileSidebar();
                    return;
                }
                router.push('/explore/map');
            }}
        >
            <SmallArrow />
        </button>
    );
}