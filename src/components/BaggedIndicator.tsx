// src/components/BaggedIndicator.tsx
'use client';
import { TickIcon } from '@/SvgIcons';

export default function BaggedIndicator() {
    return (
        <div className="inline-flex relative items-center">
            <input
                type="checkbox"
                id="bagged-checkbox"
                className="hidden peer"
            />
            <div
                className={`
                    w-5 h-5 p-1 flex items-center justify-center rounded-full border border-dashed mr-3 absolute left-4 pointer-events-none
                    transition-all duration-300 ease-in-out
                    border-sage bg-transparent text-transparent
                    peer-checked:bg-slate peer-checked:text-apple peer-checked:border-slate
                `}
            >
                <TickIcon />
            </div>
            <label
                htmlFor="bagged-checkbox"
                className={`
                    flex items-center px-4 py-2 pl-12 rounded-full
                    bg-petal
                    cursor-pointer select-none
                    transition-all duration-300 ease-in-out
                    peer-checked:bg-apple peer-checked:text-slate
                `}
            >
                <span className="text-l font-medium transition-colors duration-300 ease-in-out">
                    <span className="peer-checked:hidden">Not bagged</span>
                    <span className="hidden peer-checked:inline">Bagged</span>
                </span>
            </label>
        </div>
    );
}