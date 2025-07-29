// src/components/settings/SubscriptionSettings.tsx
// SubscriptionSettings component for managing user subscription settings in the main settings modal

'use client';
import React, { useState, useEffect } from 'react';
import { useAuthContext } from "@/contexts/AuthContext";
import { format } from 'date-fns';
import { TertiaryButton } from '../global/Buttons';
import ProPlanAdvert from './ProPlanAdvert';
import StatusText from '../global/StatusText';
import { handleManageBilling } from '@/utils/subscriptions/checkoutBillingHandlers';

export default function SubscriptionSettings() {
    const { user, userProfile, userSubscription } = useAuthContext();
    const [subscriptionState, setSubscriptionState] = useState<string | null>(null);

    function formatDate(
        dateString: string | undefined
    ): string | null {
        if (!dateString) return null;
        return format(new Date(dateString), 'do MMMM, yyyy');
    }

    function toSentenceCase(str: string | undefined): string {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    useEffect(() => {
    setSubscriptionState(toSentenceCase(userProfile?.isPremium) || 'No subscription found');
    }, [userProfile]);

    return (
        <div>
            <div className="pb-9 max-w-[75%]">
                <h2 className="font-heading-font-family text-4xl mb-1">Subscription</h2>
                <p className="text-moss text-l">View and manage your subscription settings here.</p>
            </div>
            <div className="h-[1px] border-b border-dashed border-sage"></div>
            <div className="my-6">
                <div className="py-6 flex items-end justify-between gap-y-6 gap-x-18 flex-wrap">
                    <h3 className="text-xl w-45">Account created</h3>
                    <p className="text-l text-moss w-70 text-right">{formatDate(user?.created_at)}</p>
                </div>
                <div className="h-[1px] border-b border-dashed border-sage"></div>
                {userSubscription?.[0] && (
                    <>
                    <div className="py-6 flex items-end justify-between gap-y-6 gap-x-18 flex-wrap">
                        <h3 className="text-xl w-45">Subscription started</h3>
                        <p className="text-l text-moss w-70 text-right">{formatDate(userSubscription?.[0]?.createdAt)}</p>
                    </div>
                    <div className="h-[1px] border-b border-dashed border-sage"></div>
                    </>
                )}
            </div>
            <div>
                <div className="py-6 flex items-end justify-between gap-y-6 gap-x-18 flex-wrap">
                    <h3 className="text-xl w-45">Current plan</h3>
                    <p className="text-l text-moss w-70 text-right">
                        {
                            !userSubscription?.[0] && subscriptionState === 'Active'
                                ? "Gifted Plus for free"
                                : (!userSubscription?.[0] || subscriptionState === 'None')
                                ? 'Free'
                                : userSubscription?.[0]?.plan
                        }
                    </p>
                </div>
                <div className="h-[1px] border-b border-dashed border-sage"></div>
                {userSubscription?.[0] && (
                    <>
                        <div className="py-6 flex items-end justify-between gap-y-6 gap-x-18 flex-wrap">
                            <h3 className="text-xl w-45">Status</h3>
                            <StatusText
                                status={subscriptionState}
                                type={
                                    subscriptionState === 'Active'
                                    ? 'positive'
                                    : subscriptionState === 'Canceled'
                                    ? 'negative'
                                    : subscriptionState === 'Paused' || subscriptionState === 'Canceling'
                                    ? 'neutral'
                                    : 'negative'
                                } 
                            />
                        </div>
                        <div className="h-[1px] border-b border-dashed border-sage"></div>
                        {subscriptionState !== 'Canceled' && (
                            <>
                                {subscriptionState !== 'Canceling' && (
                                <div className="py-6 flex items-end justify-between gap-y-6 gap-x-18 flex-wrap">
                                    <h3 className="text-xl w-45">Next payment</h3>
                                    <p className="text-l text-moss w-70 text-right">
                                        {userSubscription?.[0]?.plan === 'Munro Mapper Plus - Monthly'
                                            ? '£3.99'
                                            : userSubscription?.[0]?.plan === 'Munro Mapper Plus - Annual'
                                            ? '£35.99'
                                            : ''}
                                    </p>
                                </div>
                                )}
                                <div className="h-[1px] border-b border-dashed border-sage"></div>
                                <div className="py-6 flex items-end justify-between gap-y-6 gap-x-18 flex-wrap">
                                    <h3 className="text-xl w-45">{subscriptionState === 'Canceling' ? 'Subscription ends' : 'Payment date'}</h3>
                                    <p className="text-l text-moss w-70 text-right">{formatDate(userSubscription?.[0]?.currentPeriodEnd)}</p>
                                </div>
                                <div className="h-[1px] border-b border-dashed border-sage"></div>
                                <div className="py-6 flex items-end justify-between gap-y-6 gap-x-18 flex-wrap">
                                    <h3 className="text-xl w-45">Billing</h3>
                                    <TertiaryButton
                                        label="Manage Billing"
                                        onClick={() => handleManageBilling(user?.id)}
                                        isAlternate={true}
                                    />
                                </div>
                                <div className="h-[1px] border-b border-dashed border-sage"></div>
                            </>
                        )}
                    </>
                )}
                {((subscriptionState === 'None' || !userSubscription) || subscriptionState === 'Canceled') && (
                    <div className="pt-9">
                        <ProPlanAdvert />
                    </div>
                )}
            </div>
        </div>
    );
}