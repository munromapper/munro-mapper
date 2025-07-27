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

  console.log('🚀 Webhook received');

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('✅ Event constructed:', event.type);

    // Handle subscription created event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const user_id = session.metadata?.user_id;
      const stripe_customer_id = session.customer as string;
      const stripe_subscription_id = session.subscription as string;

      console.log('📊 Session data:', {
        user_id,
        stripe_customer_id,
        stripe_subscription_id,
        metadata: session.metadata
      });

      let plan = null;
      let status = null;
      let current_period_end = null;

      if (stripe_subscription_id) {
        console.log('🔍 Retrieving subscription:', stripe_subscription_id);
        const subscription = await stripe.subscriptions.retrieve(stripe_subscription_id);
        plan = subscription.items.data[0]?.price.nickname || subscription.items.data[0]?.price.id || null;
        status = subscription.status;
        current_period_end = subscription.items.data[0]?.current_period_end
          ? new Date(subscription.items.data[0]?.current_period_end * 1000).toISOString()
          : null;

        console.log('💳 Subscription details:', { plan, status, current_period_end });
      }

      if (user_id && stripe_customer_id && stripe_subscription_id) {
        console.log('💾 Attempting to save to Supabase...');

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

        const dataToInsert = {
          user_id,
          stripe_customer_id,
          stripe_subscription_id,
          plan,
          status,
          current_period_end,
          updated_at: new Date().toISOString(),
        };

        console.log('📝 Data to insert:', dataToInsert);

        const { data, error } = await supabaseAdmin
          .from('user_subscriptions')
          .upsert(dataToInsert, { onConflict: 'stripe_subscription_id' });

        if (error) {
          console.error('❌ Supabase error:', error);
          return NextResponse.json({ error: 'Database error', details: error }, { status: 500 });
        }

        console.log('✅ Successfully saved to Supabase:', data);
      } else {
        console.log('⚠️ Missing required data:', {
          user_id: !!user_id,
          stripe_customer_id: !!stripe_customer_id,
          stripe_subscription_id: !!stripe_subscription_id
        });
      }
      
    } else {
      console.log('ℹ️ Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error('💥 Webhook error:', err);
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 400 });
  }
}