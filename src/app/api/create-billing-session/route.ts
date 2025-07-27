import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: user } = await supabaseAdmin
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single();

    if (!user?.stripe_customer_id) {
      return NextResponse.json({ error: 'User not found or not subscribed' }, { status: 404 });
    }

    const customerId = user.stripe_customer_id;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${req.nextUrl.origin}/`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Portal error' }, { status: 500 });
  }
}