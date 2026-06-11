// supabase/functions/stripe-webhook/index.ts
// Receives Stripe webhook events and updates the profiles table

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14'

serve(async (req: Request) => {
  // ── 1. Only accept POST ──────────────────────────────────
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  // ── 2. Verify webhook signature ──────────────────────────
  const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')!
  const STRIPE_SECRET_KEY     = Deno.env.get('STRIPE_SECRET_KEY')!
  const SUPABASE_URL          = Deno.env.get('SUPABASE_URL')!
  const SUPABASE_SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' })

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // ── 3. Handle the event ──────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const userId            = session.client_reference_id   // Supabase user ID
    const stripeCustomerId  = session.customer as string
    const stripeSubId       = session.subscription as string

    if (!userId) {
      console.error('No client_reference_id on session:', session.id)
      return new Response('Missing client_reference_id', { status: 400 })
    }

    // ── 4. Update profiles table ─────────────────────────
    const _supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    const { error } = await _supabase
      .from('profiles')
      .update({
        is_paid:                true,
        paid_at:                new Date().toISOString(),
        stripe_customer_id:     stripeCustomerId,
        stripe_subscription_id: stripeSubId,
      })
      .eq('id', userId)

    if (error) {
      console.error('Supabase update error:', error.message)
      return new Response('Database update failed', { status: 500 })
    }

    console.log(`✅ User ${userId} marked as paid`)
  }

  // Acknowledge receipt of all other event types
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
