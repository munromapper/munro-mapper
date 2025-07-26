// src/app/api/stripe-webhook/route.ts
// This file handles Stripe webhook events, specifically for subscription creation.

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle subscription created event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;
      const email = session.customer_email;

      // TODO: Lookup your user by email or metadata, then update Supabase
      // Example using supabase-js:
      // await supabase.from('user_subscriptions').insert({ user_id, stripe_subscription_id: subscriptionId, ... });

      // You may need to fetch the user_id from your users table using the email
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}