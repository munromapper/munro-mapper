// src/components/header/PremiumAdvertPopup.tsx
// This file contains the component for the premium plan advert popup used across the site

import { PremiumIcon, TickIcon, CrossIcon } from "../global/SvgComponents"
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";

const FEATURES: { label: string; free: boolean; plus: boolean }[] = [
  { label: "Filter hills by ascent, distance, and more", free: false, plus: true },
  { label: "Compare Munros bagged by you and friends", free: false, plus: true },
  { label: "Switch between satellite and terrain maps", free: false, plus: true },
  { label: "Visualize gradient with colored route lines", free: false, plus: true },
  { label: "Download routes to your device as GPX files", free: false, plus: true },
  { label: "Open routes directly in Garmin Connect", free: false, plus: true },
];

export default function PremiumAdvertPopup() {
    const { closePremiumAdModal } = useAuthContext();

    return (
        <div className="bg-premium p-14 max-w-145 flex flex-col items-stretch">
            <div className="flex gap-4 items-center">
                <h2 className="font-heading-font-family text-5xl text-center">Unlock this feature with Plus</h2>
                <span className="w-6 h-6">
                    <PremiumIcon currentColor="var(--color-heather)" />
                </span>
            </div>
            <p className="text-moss my-9 text-xl text-center">Subscribe and access advanced filters and map upgrades that make planning your next hill day a breeze.</p>
            <div className="overflow-hidden mb-6">
                <table className="w-full border-collapse">
                <thead>
                    <tr>
                    <th className="text-left font-normal px-4 py-3">Feature</th>
                    <th className="w-18 text-center font-normal px-4 py-3">Free</th>
                    <th className="w-18 text-center rounded-t-md font-normal px-4 py-3 bg-heather/20">Plus</th>
                    </tr>
                </thead>
                <tbody>
                    {FEATURES.map((f, i) => {
                        const isLast = i === FEATURES.length - 1;
                        return (
                            <tr key={f.label} className="border-t border-dashed border-heather">
                                <td className="pl-4 py-3 text-slate text-l sm:text-base">{f.label}</td>
                                <td className="px-2 py-3 text-center">
                                {f.free ? (
                                    <span className="inline-flex items-center justify-center w-3 h-3">
                                    <TickIcon />
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center justify-center w-3 h-3">
                                    {typeof CrossIcon === "function" ? <CrossIcon /> : "×"}
                                    </span>
                                )}
                                </td>
                                <td className={`px-4 py-3 text-center bg-heather/20 ${isLast ? 'rounded-b-md' : ''}`}>
                                {f.plus ? (
                                    <span className="inline-flex items-center justify-center w-3 h-3">
                                    <TickIcon />
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center justify-center w-3 h-3">
                                    {typeof CrossIcon === "function" ? <CrossIcon /> : "×"}
                                    </span>
                                )}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
          </div>
          <div>
            <p className="text-slate text-center text-xxl">£3.99/month, or £35.99 billed yearly (£2.99/month).</p>
            <p className="text-moss text-xl text-center mt-2">Cheaper than a day’s parking at Loch Muick!</p>
          </div>
          <div className="flex flex-col gap-4 mt-6">
                <Link
                    href="/pricing"
                    onClick={closePremiumAdModal}
                    className="
                        py-2 rounded-full bg-heather/30 border border-heather/30 text-slate cursor-pointer
                        hover:bg-transparent hover:text-heather
                        transition duration-250 ease-in-out text-center
                    "
                >
                    Discover Munro Mapper Plus
                </Link>
            </div>
        </div>
    )
}