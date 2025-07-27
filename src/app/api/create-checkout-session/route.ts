// src/app/api/create-checkout-session/route.ts
// This file contains the API route to create a Stripe checkout session for subscriptions.

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: NextRequest) {
  try {
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
    const { priceId, userId } = await req.json();

    if (!priceId || !userId) {
      return NextResponse.json({ error: 'Missing priceId or userId' }, { status: 400 });
    }

    const { data: existingSubscription } = await supabaseAdmin
      .from('user_subscriptions')
      .select('stripe_customer_id, status')
      .eq('user_id', userId)
      .single();

    if (existingSubscription?.stripe_customer_id) {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: existingSubscription.stripe_customer_id,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${origin}/success`,
        cancel_url: `${origin}/pricing`,
        metadata: { user_id: userId }
      });
      return NextResponse.json({ url: session.url });
    } else {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${req.nextUrl.origin}/success`,
        cancel_url: `${req.nextUrl.origin}/pricing`,
        metadata: {
          user_id: userId,
        },
      });
      return NextResponse.json({ url: session.url });
    }

  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
  }
}