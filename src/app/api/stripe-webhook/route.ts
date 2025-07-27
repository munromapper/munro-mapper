// src/app/api/stripe-webhook/route.ts
// This file handles Stripe webhook events, specifically for subscription creation.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
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

      const user_id = session.metadata?.user_id;
      const stripe_customer_id = session.customer as string;
      const stripe_subscription_id = session.subscription as string;

      let plan = null;
      let status = null;
      let current_period_end = null;

      if (stripe_subscription_id) {
        const subscription = await stripe.subscriptions.retrieve(stripe_subscription_id);
        plan = subscription.items.data[0]?.price.nickname || subscription.items.data[0]?.price.id || null;
        status = subscription.status;
        current_period_end = subscription.items.data[0]?.current_period_end
          ? new Date(subscription.items.data[0].current_period_end * 1000).toISOString()
          : null;
      }

      if (user_id && stripe_customer_id && stripe_subscription_id) {

        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        );
        
        await supabaseAdmin.from('user_subscriptions').upsert({
          user_id,
          stripe_customer_id,
          stripe_subscription_id,
          plan,
          status,
          current_period_end,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'stripe_subscription_id' });
      }
      
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 400 });
  }
}