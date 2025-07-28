// src/app/pricing/components/PricingButtons.tsx
// This file contains the PricingButtons component that allows users to subscribe to monthly or annual plans.

'use client';
import { PrimaryButton } from "@/components/global/Buttons";
import { useAuthContext } from "@/contexts/AuthContext";
import { handleCheckout } from "@/utils/subscriptions/checkoutBillingHandlers";

export default function PricingButtons() {
    const { user, userProfile } = useAuthContext();

    const MONTHLY_PRICE_ID = 'price_1Rp6ngRWMtm353HhxmNXRbR9'; // Replace with your monthly price ID
    const ANNUAL_PRICE_ID = 'price_1Rp6oERWMtm353HhLaZjIge1';   // Replace with your annual price ID

    return (
        <div className="flex gap-9 mt-9">
            {!user && (
                <div>
                    <PrimaryButton 
                        label="Sign in to Subscribe"
                        onClick={() => {}}
                        disabled={true}
                        isAlternate={false}
                    />
                    <PrimaryButton 
                        label="Sign in to Subscribe"
                        onClick={() => {}}
                        disabled={true}
                        isAlternate={false}
                    />
                </div>
            )}
            {(user && userProfile?.isPremium === 'none') && (
                <div>
                    <PrimaryButton 
                            label="Subscribe to Plus monthly"
                            onClick={() => handleCheckout(user.id, MONTHLY_PRICE_ID)}
                            isAlternate={false}
                    />
                    <PrimaryButton 
                        label="Subscribe to Plus annually"
                        onClick={() => handleCheckout(user.id, ANNUAL_PRICE_ID)}
                        isAlternate={false}
                    />
                </div>
            )}
            {(user && userProfile?.isPremium === 'canceled') && (
                <div>
                    <PrimaryButton 
                            label="Resubscribe to Plus monthly"
                            onClick={() => handleCheckout(user.id, MONTHLY_PRICE_ID)}
                            isAlternate={false}
                    />
                    <PrimaryButton 
                        label="Resubscribe to Plus annually"
                        onClick={() => handleCheckout(user.id, ANNUAL_PRICE_ID)}
                        isAlternate={false}
                    />
                </div>
            )}
            {user && (userProfile?.isPremium === 'active' || userProfile?.isPremium === 'paused' || userProfile?.isPremium === 'canceling') && (
                <div>
                    <PrimaryButton 
                        label="You are subscribed to Plus"
                        onClick={() => {}}
                        disabled={true}
                        isAlternate={false}
                    />
                    <PrimaryButton 
                        label="You are subscribed to Plus"
                        onClick={() => {}}
                        disabled={true}
                        isAlternate={false}
                    />
                </div>
            )}
        </div>
    );
}