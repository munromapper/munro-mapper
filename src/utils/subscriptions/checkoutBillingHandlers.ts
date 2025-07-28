// src/utils/subscriptions/checkoutBillingHandlers.ts
// This file contains handlers for managing checkout and billing sessions

export const handleCheckout = async (
    userId: string | null,
    priceId: string
) => {
        if (!userId) {
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
                    userId: userId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { url } = await response.json();
            
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
        }
};

export const handleManageBilling = async (
    userId: string | undefined
) => {

        if (!userId) {
            alert('Please log in to manage billing');
            return;
        }

        try {
        const response = await fetch('/api/create-billing-session', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
            }),
        });

        const data = await response.json();

        if (data.url) {
            window.location.href = data.url;
        } else {
            console.error('Failed to create billing session');
        }
        } catch (error) {
            console.error('Error creating billing session:', error);
        }
};