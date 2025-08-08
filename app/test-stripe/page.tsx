"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, CheckCircle, XCircle, Loader2, CreditCard } from 'lucide-react'
import Link from "next/link"
import { AppHeader } from "@/components/app-header"

export default function TestStripePage() {
  const [testResults, setTestResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testStripeConnection = async () => {
    setLoading(true)
    setTestResults(null)

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          plan: 'pro', 
          billing: 'monthly' 
        }),
      })

      const data = await response.json()
      
      setTestResults({
        success: response.ok,
        status: response.status,
        data: data,
        timestamp: new Date().toLocaleString()
      })
    } catch (error: any) {
      setTestResults({
        success: false,
        error: error.message,
        timestamp: new Date().toLocaleString()
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        <AppHeader subtitle="Stripe Integration Test" />
        
        <div className="flex items-center justify-center mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Stripe Integration Test</CardTitle>
            <CardDescription>
              Test your Stripe API keys and checkout functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Button 
                onClick={testStripeConnection}
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Test Stripe Connection
                  </>
                )}
              </Button>
            </div>

            {testResults && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${
                  testResults.success 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {testResults.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-semibold ${
                      testResults.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {testResults.success ? 'Connection Successful!' : 'Connection Failed'}
                    </span>
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <div>
                      <strong>Status:</strong> {testResults.status || 'Error'}
                    </div>
                    <div>
                      <strong>Timestamp:</strong> {testResults.timestamp}
                    </div>
                    
                    {testResults.success && testResults.data && (
                      <div className="mt-3 p-3 bg-white rounded border">
                        <strong>Response Data:</strong>
                        <pre className="text-xs mt-1 overflow-x-auto">
                          {JSON.stringify(testResults.data, null, 2)}
                        </pre>
                      </div>
                    )}
                    
                    {testResults.error && (
                      <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
                        <strong>Error:</strong> {testResults.error}
                      </div>
                    )}
                  </div>
                </div>

                {testResults.success && (
                  <div className="text-center">
                    <Badge variant="default" className="bg-green-500 text-white">
                      ✅ Your Stripe integration is working correctly!
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2">
                      You can now process payments in PennyCam
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Environment Check:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>STRIPE_SECRET_KEY (server-side only)</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link href="/billing">
                <Button variant="outline" className="bg-white/80 backdrop-blur">
                  Go to Billing Page
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
