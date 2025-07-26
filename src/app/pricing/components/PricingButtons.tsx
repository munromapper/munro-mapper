'use client';
import { PrimaryButton } from "@/components/global/Buttons";

export default function PricingButtons() {

    const MONTHLY_PRICE_ID = 'price_1Rp6ngRWMtm353HhxmNXRbR9'; // Replace with your monthly price ID
    const ANNUAL_PRICE_ID = 'price_1Rp6oERWMtm353HhLaZjIge1';   // Replace with your annual price ID

    const handleCheckout = async (priceId: string) => {
        const res = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ priceId }),
        });
        const data = await res.json();
        if (data.url) {
            window.location.href = data.url;
        } else {
            alert('Failed to start checkout.');
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