// Webhook to handle Stripe events (payments, cancellations, etc.)
import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed':
      // Payment successful - activate subscription
      const session = event.data.object as Stripe.Checkout.Session
      console.log('Payment successful:', session.id)
      
      // Update user's subscription status in your database
      // await updateUserSubscription(session.customer, session.subscription)
      break

    case 'customer.subscription.updated':
      // Subscription changed (upgrade/downgrade)
      const subscription = event.data.object as Stripe.Subscription
      console.log('Subscription updated:', subscription.id)
      break

    case 'customer.subscription.deleted':
      // Subscription canceled
      const canceledSub = event.data.object as Stripe.Subscription
      console.log('Subscription canceled:', canceledSub.id)
      
      // Downgrade user to free plan in your database
      break

    case 'invoice.payment_failed':
      // Payment failed - notify user
      const failedInvoice = event.data.object as Stripe.Invoice
      console.log('Payment failed:', failedInvoice.id)
      
      // Send email notification to user
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
