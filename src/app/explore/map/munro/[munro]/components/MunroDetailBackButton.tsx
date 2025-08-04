// src/app/expore/map/munro/[munro]/components/MunroDetailBackButton.tsx
// This component provides a back button for the munro detail page

import Link from "next/link";
import { SmallArrow } from "@/components/global/SvgComponents";

export default function MunroDetailBackButton() {
    return (
        <Link href="/explore/map">
            <button className="w-8 h-8 rounded-full p-2 bg-pebble text-slate cursor-pointer">
                <SmallArrow />
            </button>
        </Link>
    );
}