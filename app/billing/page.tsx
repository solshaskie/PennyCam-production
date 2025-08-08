"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Home, Crown, Users, Check, Shield } from 'lucide-react'
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { StripeCheckoutButton } from "@/components/stripe-checkout-button"

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'family'>('pro')
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = {
    pro: {
      name: 'PennyCam Pro',
      monthlyPrice: 2.99,
      annualPrice: 29.99,
      features: [
        'Advanced integrations (Slack, Alexa, Instagram)',
        'Premium smart lighting (Nanoleaf)',
        'Advanced automation (IFTTT, Zapier)',
        'Priority customer support',
        'Unlimited cloud storage'
      ]
    },
    family: {
      name: 'Family Plan',
      monthlyPrice: 9.99,
      annualPrice: 99.99,
      features: [
        'Everything in Pro plan',
        'Up to 6 family members',
        'Individual member management',
        'Family usage analytics',
        'Shared photo albums',
        'Multi-device support'
      ]
    }
  }

  const currentPlan = plans[selectedPlan]
  const price = isAnnual ? currentPlan.annualPrice : currentPlan.monthlyPrice
  const savings = isAnnual ? (currentPlan.monthlyPrice * 12 - currentPlan.annualPrice) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <AppHeader subtitle="Subscription & Billing" />
        
        <div className="flex items-center justify-center mb-6">
          <Link href="/account">
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur">
              <Home className="w-4 h-4 mr-2" />
              Back to Account
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Choose Your Plan
                </CardTitle>
                <CardDescription>
                  Select the perfect plan for your pet monitoring needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Annual/Monthly Toggle */}
                <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                    Monthly
                  </span>
                  <Switch
                    checked={isAnnual}
                    onCheckedChange={setIsAnnual}
                  />
                  <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                    Annual
                  </span>
                  {isAnnual && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700 ml-2">
                      Save 17%
                    </Badge>
                  )}
                </div>

                {/* Plan Options */}
                <div className="space-y-3">
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPlan === 'pro' 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan('pro')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Crown className="w-5 h-5 text-purple-500" />
                        <span className="font-semibold">PennyCam Pro</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-600">
                          ${isAnnual ? '29.99' : '2.99'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {isAnnual ? '/year' : '/month'}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Perfect for individual pet owners</p>
                  </div>

                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPlan === 'family' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan('family')}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="font-semibold">Family Plan</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                          BEST VALUE
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          ${isAnnual ? '99.99' : '9.99'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {isAnnual ? '/year' : '/month'}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Up to 6 family members - just $1.67 per person!</p>
                  </div>
                </div>

                {/* Features List */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3">{currentPlan.name} includes:</h4>
                  <ul className="space-y-2">
                    {currentPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stripe Checkout */}
          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Secure Checkout
                </CardTitle>
                <CardDescription>
                  Powered by Stripe - trusted by millions worldwide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{currentPlan.name}</span>
                    <span className="font-bold text-lg">${price}{isAnnual ? '/year' : '/month'}</span>
                  </div>
                  
                  {isAnnual && savings > 0 && (
                    <div className="flex justify-between items-center text-green-600 text-sm">
                      <span>Annual Savings</span>
                      <span className="font-semibold">-${savings.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Stripe Checkout Button */}
                <StripeCheckoutButton
                  plan={selectedPlan}
                  billing={isAnnual ? 'yearly' : 'monthly'}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                />

                {/* Security Features */}
                <div className="text-xs text-gray-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>🔒 256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>💳 PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>📱 Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>💝 7-day free trial</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accepted Payment Methods */}
            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Accepted Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">💳</div>
                    <div className="text-xs">Visa</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">💳</div>
                    <div className="text-xs">Mastercard</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">💳</div>
                    <div className="text-xs">Amex</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">🍎</div>
                    <div className="text-xs">Apple Pay</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">🟢</div>
                    <div className="text-xs">Google Pay</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">💙</div>
                    <div className="text-xs">PayPal</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">
                    💡 Stripe automatically shows the best payment options for your device and location
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
