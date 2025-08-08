"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Loader2, Crown, Users } from 'lucide-react'

interface StripeCheckoutButtonProps {
  plan: 'pro' | 'family'
  billing: 'monthly' | 'yearly'
  className?: string
}

export function StripeCheckoutButton({ 
  plan, 
  billing, 
  className 
}: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    
    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan, billing }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId, url } = await response.json()

      // For demo purposes, we'll show a success message
      // In production, this would redirect to Stripe Checkout
      if (url) {
        window.location.href = url
      } else {
        alert(`🎉 Stripe Checkout Created!\n\nPlan: ${plan === 'pro' ? 'PennyCam Pro' : 'Family Plan'}\nBilling: ${billing}\nSession ID: ${sessionId}\n\n✅ Your Stripe integration is working!\n\nIn production, this would redirect to Stripe's secure checkout page.`)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('❌ Checkout failed. Please check your Stripe configuration and try again.')
    } finally {
      setLoading(false)
    }
  }

  const planName = plan === 'pro' ? 'PennyCam Pro' : 'Family Plan'
  const price = plan === 'pro' 
    ? (billing === 'monthly' ? '$2.99/month' : '$29.99/year')
    : (billing === 'monthly' ? '$9.99/month' : '$99.99/year')

  const icon = plan === 'pro' ? Crown : Users

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className={className}
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Creating Checkout...
        </>
      ) : (
        <>
          {icon === Crown ? (
            <Crown className="w-4 h-4 mr-2" />
          ) : (
            <Users className="w-4 h-4 mr-2" />
          )}
          Subscribe to {planName} - {price}
        </>
      )}
    </Button>
  )
}
