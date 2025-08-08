// Stripe configuration and utilities
import Stripe from 'stripe'

// Initialize Stripe (server-side)
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// Product and Price IDs (created in Stripe Dashboard)
export const STRIPE_PRODUCTS = {
  PRO_MONTHLY: 'price_pro_monthly_299', // $2.99/month
  PRO_YEARLY: 'price_pro_yearly_2999',  // $29.99/year
  FAMILY_MONTHLY: 'price_family_monthly_999', // $9.99/month
  FAMILY_YEARLY: 'price_family_yearly_9999',  // $99.99/year
}

// Create a checkout session for subscription
export async function createCheckoutSession({
  priceId,
  customerId,
  successUrl,
  cancelUrl,
}: {
  priceId: string
  customerId?: string
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true, // Enable discount codes
    billing_address_collection: 'required',
  })

  return session
}

// Create a customer in Stripe
export async function createStripeCustomer({
  email,
  name,
  userId,
}: {
  email: string
  name: string
  userId: string
}) {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      userId, // Link to your app's user ID
    },
  })

  return customer
}

// Cancel a subscription
export async function cancelSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true, // Cancel at end of billing period
  })

  return subscription
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  return subscription
}
