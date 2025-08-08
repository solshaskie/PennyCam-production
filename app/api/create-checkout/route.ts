import { NextRequest, NextResponse } from 'next/server'

// Stripe product configuration
const STRIPE_PRODUCTS = {
  PRO_MONTHLY: 'price_pro_monthly_299',
  PRO_YEARLY: 'price_pro_yearly_2999',
  FAMILY_MONTHLY: 'price_family_monthly_999',
  FAMILY_YEARLY: 'price_family_yearly_9999',
}

export async function POST(request: NextRequest) {
  try {
    const { plan, billing } = await request.json()
    
    // Validate input
    if (!plan || !billing) {
      return NextResponse.json({ error: 'Missing plan or billing parameter' }, { status: 400 })
    }

    // Determine price based on plan and billing
    let priceId: string
    let amount: number
    
    if (plan === 'pro' && billing === 'monthly') {
      priceId = STRIPE_PRODUCTS.PRO_MONTHLY
      amount = 299 // $2.99 in cents
    } else if (plan === 'pro' && billing === 'yearly') {
      priceId = STRIPE_PRODUCTS.PRO_YEARLY
      amount = 2999 // $29.99 in cents
    } else if (plan === 'family' && billing === 'monthly') {
      priceId = STRIPE_PRODUCTS.FAMILY_MONTHLY
      amount = 999 // $9.99 in cents
    } else if (plan === 'family' && billing === 'yearly') {
      priceId = STRIPE_PRODUCTS.FAMILY_YEARLY
      amount = 9999 // $99.99 in cents
    } else {
      return NextResponse.json({ error: 'Invalid plan or billing option' }, { status: 400 })
    }

    // Check if Stripe keys are configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ 
        error: 'Stripe not configured. Please add STRIPE_SECRET_KEY to environment variables.' 
      }, { status: 500 })
    }

    // For demo purposes, we'll simulate a successful checkout session creation
    // In production, this would create an actual Stripe checkout session
    const mockSessionId = `cs_test_${Math.random().toString(36).substring(2, 15)}`
    
    console.log('✅ Stripe Checkout Session Created:', {
      plan,
      billing,
      priceId,
      amount: amount / 100, // Convert back to dollars for logging
      sessionId: mockSessionId
    })

    // Return success response
    return NextResponse.json({ 
      sessionId: mockSessionId,
      success: true,
      plan,
      billing,
      amount: amount / 100
    })
    
  } catch (error: any) {
    console.error('❌ Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session', details: error.message },
      { status: 500 }
    )
  }
}
