// src/app/pricing/components/PricingButtons.tsx
// This file contains the PricingButtons component that allows users to subscribe to monthly or annual plans.

'use client';
import { PrimaryButton } from "@/components/global/Buttons";
import { useAuthContext } from "@/contexts/AuthContext";


export default function PricingButtons() {
    const { user } = useAuthContext();

    const MONTHLY_PRICE_ID = 'price_1Rp6ngRWMtm353HhxmNXRbR9'; // Replace with your monthly price ID
    const ANNUAL_PRICE_ID = 'price_1Rp6oERWMtm353HhLaZjIge1';   // Replace with your annual price ID

    const handleCheckout = async (priceId: string) => {
        if (!user) {
            alert('Please log in to subscribe');
            return;
        }

        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                priceId: priceId,
                userId: user.id, // Make sure this is the correct user ID from Supabase
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { url } = await response.json();
            
            if (url) {
                window.location.href = url; // Redirect to Stripe checkout
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
        }
    };

    return (
        <div className="flex gap-9 mt-9">
            <PrimaryButton 
                label="Subscribe Monthly Now"
                onClick={() => handleCheckout(MONTHLY_PRICE_ID)}
                isAlternate={false}
            />
            <PrimaryButton 
                label="Subscribe Annually Now"
                onClick={() => handleCheckout(ANNUAL_PRICE_ID)}
                isAlternate={false}
            />
        </div>
    );
}