// src/components/settings/ProPlanAdvert.tsx
// Component for displaying the Pro Plan advertisement in the subscription settings modal

import TransitionLink from "../global/TransitionLink"
import { PremiumIcon } from "../global/SvgComponents"

export default function ProPlanAdvert() {
    return (
        <TransitionLink 
            href="/pricing"
            transitionWrapper="body"
            className="rounded-xl block p-6 bg-premium border border-lilac
                                               hover:border hover:border-heather
                                               transition duration-250 ease-in-out"
        >
            <div className="mb-4 flex items-center gap-2">
                <h3 className="text-xxl">Subscribe to Plus</h3>
                <div className="w-5 h-5 text-heather">
                    <PremiumIcon currentColor="currentColor" />
                </div>
            </div>
            <p className="text-xl text-moss mb-2">Nisi non laboris ad aliquip deserunt tempor.</p>
            <p className="text-l">From only £2.99 per month!</p>
        </TransitionLink>
    )
}