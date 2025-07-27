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

    console.log('✅ Event received:', event.type);

    // Handle different subscription events
    if (event.type === 'checkout.session.completed') {
      // Your existing code for new subscriptions
      await handleCheckoutCompleted(event);
      
    } else if (event.type === 'customer.subscription.updated') {
      // Handle subscription changes (plan changes, cancellations, etc.)
      await handleSubscriptionUpdated(event);
      
    } else if (event.type === 'customer.subscription.deleted') {
      // Handle subscription deletions
      await handleSubscriptionDeleted(event);
      
    } else if (event.type === 'invoice.payment_failed') {
      // Handle failed payments
      await handlePaymentFailed(event);
      
    } else {
      console.log('ℹ️ Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    console.error('💥 Webhook error:', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 });
  }
}

async function handleCheckoutCompleted(event: Stripe.Event) {
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
  let created_at = null;
  let current_period_end = null;
  let canceled_at = null;
  let cancel_at_period_end = false;

  if (stripe_subscription_id) {
    console.log('🔍 Retrieving subscription:', stripe_subscription_id);
    const subscription = await stripe.subscriptions.retrieve(stripe_subscription_id);
        
    // Get the product ID from the price
    const productId = subscription.items.data[0]?.price.product as string;
        
    // Retrieve the product to get its name
    const product = await stripe.products.retrieve(productId);
    plan = product.name || subscription.items.data[0]?.price.id || null;
        
    status = subscription.status;
    created_at = subscription.created
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
      created_at,
      updated_at: new Date().toISOString(),
      canceled_at,
      cancel_at_period_end,
    };

    console.log('📝 Data to insert:', dataToInsert);

    const { data, error } = await supabaseAdmin
      .from('user_subscriptions')
      .upsert(dataToInsert, { onConflict: 'stripe_customer_id' });

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
}

async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  
  console.log('🔄 Subscription updated:', subscription.id);
  
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

  // Get product name
  const productId = subscription.items.data[0]?.price.product as string;
  const product = await stripe.products.retrieve(productId);
  const plan = product.name || subscription.items.data[0]?.price.id || null;

  const updateData = {
    plan,
    status: subscription.status,
    current_period_end: subscription.items.data[0]?.current_period_end
      ? new Date(subscription.items.data[0]?.current_period_end * 1000).toISOString()
      : null,
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at 
      ? new Date(subscription.canceled_at * 1000).toISOString() 
      : null,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update(updateData)
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('❌ Failed to update subscription:', error);
    throw error;
  }

  console.log('✅ Subscription updated in database');
}

async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  
  console.log('🗑️ Subscription deleted:', subscription.id);
  
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

  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('❌ Failed to delete subscription:', error);
    throw error;
  }

  console.log('✅ Subscription marked as canceled in database');
}

async function handlePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  
  console.log('💳 Payment failed for invoice:', invoice.id);
  
  // Get subscription ID from line items
  let subscriptionId: string | null = null;
  
  if (invoice.lines && invoice.lines.data.length > 0) {
    // Check if any line item has a subscription
    const subscriptionLineItem = invoice.lines.data.find(item => item.subscription);
    if (subscriptionLineItem) {
      subscriptionId = subscriptionLineItem.subscription as string;
    }
  }
  
  if (!subscriptionId) {
    console.log('⚠️ No subscription found in invoice line items');
    return;
  }
  
  console.log('🔍 Found subscription in invoice:', subscriptionId);
  
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

  const { error } = await supabaseAdmin
    .from('user_subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('❌ Failed to update payment status:', error);
    throw error;
  }

  console.log('✅ Subscription marked as past_due');
}