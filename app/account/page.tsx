"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Home, Crown, Users, CreditCard, Gift, Settings, Check, Plus, Trash2, Mail, Phone, Calendar, Shield, LogOut, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Link from "next/link"
import { AppHeader } from "@/components/app-header"

interface FamilyMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'viewer'
  subscription: 'free' | 'pro' | 'gifted'
  lastActive: Date
  devices: number
}

export default function AccountPage() {
  const [currentPlan, setCurrentPlan] = useState<'free' | 'pro' | 'family'>('free')
  const [isOwner] = useState(true) // This would come from authentication
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'You (Account Owner)',
      email: 'you@example.com',
      role: 'owner',
      subscription: 'free',
      lastActive: new Date(),
      devices: 2
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'admin',
      subscription: 'gifted',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      devices: 1
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'viewer',
      subscription: 'free',
      lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      devices: 1
    }
  ])

  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [showInviteForm, setShowInviteForm] = useState(false)

  // Stripe test functionality
  const [stripeTestResult, setStripeTestResult] = useState<any>(null)
  const [stripeTestLoading, setStripeTestLoading] = useState(false)

  const testStripeConnection = async () => {
    setStripeTestLoading(true)
    setStripeTestResult(null)

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
      
      setStripeTestResult({
        success: response.ok,
        status: response.status,
        data: data,
        timestamp: new Date().toLocaleString()
      })
    } catch (error: any) {
      setStripeTestResult({
        success: false,
        error: error.message,
        timestamp: new Date().toLocaleString()
      })
    } finally {
      setStripeTestLoading(false)
    }
  }

  const upgradeMember = (memberId: string, newSubscription: 'pro' | 'gifted') => {
    setFamilyMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, subscription: newSubscription }
        : member
    ))
  }

  const removeMember = (memberId: string) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== memberId))
  }

  const inviteMember = () => {
    if (newMemberEmail) {
      const newMember: FamilyMember = {
        id: Date.now().toString(),
        name: newMemberEmail.split('@')[0],
        email: newMemberEmail,
        role: 'viewer',
        subscription: 'free',
        lastActive: new Date(),
        devices: 0
      }
      setFamilyMembers(prev => [...prev, newMember])
      setNewMemberEmail('')
      setShowInviteForm(false)
    }
  }

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case 'pro': return 'bg-purple-500'
      case 'gifted': return 'bg-pink-500'
      default: return 'bg-gray-400'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-500'
      case 'admin': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <AppHeader subtitle="Account & Family Management" />
        
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          {/* Master Owner Controls */}
          {isOwner && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                <Crown className="w-3 h-3 mr-1" />
                Account Owner
              </Badge>
              <Link href="/auth">
                <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Current Plan */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Your Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg">
                  <div className="text-2xl font-bold text-gray-700 mb-2">
                    {currentPlan === 'free' ? 'Free Plan' : 
                     currentPlan === 'pro' ? 'PennyCam Pro' : 'Family Plan'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {currentPlan === 'free' ? 'Basic features included' :
                     currentPlan === 'pro' ? '$2.99/month' : '$9.99/month'}
                  </div>
                </div>

                {currentPlan === 'free' && isOwner && (
                  <div className="space-y-3">
                    <Link href="/billing">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Pro
                      </Button>
                    </Link>
                    <Link href="/billing">
                      <Button variant="outline" className="w-full bg-white/80 backdrop-blur">
                        <Users className="w-4 h-4 mr-2" />
                        Family Plan
                      </Button>
                    </Link>
                  </div>
                )}

                {currentPlan !== 'free' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded border border-green-200">
                      <Check className="w-4 h-4" />
                      <span>Active subscription</span>
                    </div>
                    {isOwner && (
                      <Link href="/billing">
                        <Button variant="outline" size="sm" className="w-full">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Manage Billing
                        </Button>
                      </Link>
                    )}
                  </div>
                )}

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Free: Basic monitoring</p>
                  <p>• Pro: Advanced integrations</p>
                  <p>• Family: Pro for up to 6 members</p>
                </div>
              </CardContent>
            </Card>

            {/* Stripe Test Card */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0 shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-600" />
                  Test Stripe Integration
                </CardTitle>
                <CardDescription>
                  Verify your payment system is working
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={testStripeConnection}
                  disabled={stripeTestLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                  size="sm"
                >
                  {stripeTestLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Test Stripe Connection
                    </>
                  )}
                </Button>

                {stripeTestResult && (
                  <div className={`p-3 rounded-lg border-2 text-sm ${
                    stripeTestResult.success 
                      ? 'border-green-500 bg-green-50 text-green-800' 
                      : 'border-red-500 bg-red-50 text-red-800'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {stripeTestResult.success ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span className="font-semibold">
                        {stripeTestResult.success ? 'Success!' : 'Failed'}
                      </span>
                    </div>
                    
                    {stripeTestResult.success ? (
                      <p>✅ Your Stripe integration is working!</p>
                    ) : (
                      <p>❌ {stripeTestResult.error || 'Connection failed'}</p>
                    )}
                  </div>
                )}

                <div className="text-xs text-gray-600">
                  <p>💡 This tests your API keys without charging money</p>
                </div>
              </CardContent>
            </Card>

            {/* Master Owner Privileges */}
            {isOwner && (
              <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-0 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-yellow-600" />
                    Owner Privileges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm space-y-2">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Full billing control</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Add/remove family members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Gift Pro subscriptions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>View all usage analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Transfer ownership</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isOwner && (
                  <>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Gift className="w-4 h-4 mr-2" />
                      Gift Pro to Someone
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Invite Link
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Usage Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Family Members Management */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Family & Friends ({familyMembers.length}/6)
                  </CardTitle>
                  {isOwner && (
                    <Button 
                      onClick={() => setShowInviteForm(!showInviteForm)}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Invite
                    </Button>
                  )}
                </div>
                <CardDescription>
                  {isOwner ? 'Manage who can access PennyCam and their subscription levels' : 'View family members with PennyCam access'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {showInviteForm && isOwner && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-3">Invite New Member</h4>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter email address"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={inviteMember} size="sm">
                        Send Invite
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {familyMembers.map(member => (
                    <div key={member.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold flex items-center gap-2">
                              {member.name}
                              <Badge variant="outline" className={`text-xs text-white ${getRoleColor(member.role)}`}>
                                {member.role}
                              </Badge>
                              <Badge variant="outline" className={`text-xs text-white ${getSubscriptionColor(member.subscription)}`}>
                                {member.subscription}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-4">
                              <span>{member.email}</span>
                              <span>•</span>
                              <span>{member.devices} devices</span>
                              <span>•</span>
                              <span>Active {member.lastActive.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        {member.role !== 'owner' && isOwner && (
                          <div className="flex items-center gap-2">
                            {member.subscription === 'free' && (
                              <>
                                <Button
                                  onClick={() => upgradeMember(member.id, 'gifted')}
                                  size="sm"
                                  variant="outline"
                                  className="bg-pink-50 border-pink-300 text-pink-700 hover:bg-pink-100"
                                >
                                  <Gift className="w-3 h-3 mr-1" />
                                  Gift Pro
                                </Button>
                                <Button
                                  onClick={() => upgradeMember(member.id, 'pro')}
                                  size="sm"
                                  className="bg-purple-500 hover:bg-purple-600 text-white"
                                >
                                  <Crown className="w-3 h-3 mr-1" />
                                  Upgrade
                                </Button>
                              </>
                            )}
                            {member.subscription === 'gifted' && (
                              <Badge variant="outline" className="bg-pink-100 text-pink-700 border-pink-300">
                                <Gift className="w-3 h-3 mr-1" />
                                Gifted by You
                              </Badge>
                            )}
                            <Button
                              onClick={() => removeMember(member.id)}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Billing & Gifting */}
            {isOwner && (
              <Card className="bg-white/80 backdrop-blur border-0 shadow-lg mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Billing & Gifting Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">💳 Individual Pro</h4>
                      <p className="text-sm text-purple-700 mb-3">$2.99/month per person</p>
                      <p className="text-xs text-purple-600">Perfect for single users who want advanced features</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">👨‍👩‍👧‍👦 Family Plan</h4>
                      <p className="text-sm text-blue-700 mb-3">$9.99/month for 6 members</p>
                      <p className="text-xs text-blue-600">Best value for families - Pro features for everyone</p>
                    </div>
                    <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <h4 className="font-semibold text-pink-800 mb-2">🎁 Gift Subscriptions</h4>
                      <p className="text-sm text-pink-700 mb-3">You pay, they enjoy</p>
                      <p className="text-xs text-pink-600">Gift Pro to specific family members individually</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Usage Statistics */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle>Family Usage Overview</CardTitle>
            <CardDescription>
              See how your family is using PennyCam across all devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {familyMembers.reduce((sum, member) => sum + member.devices, 0)}
                </div>
                <div className="text-sm text-blue-700">Total Devices</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {familyMembers.filter(m => m.subscription !== 'free').length}
                </div>
                <div className="text-sm text-green-700">Pro Members</div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-200">
                <div className="text-2xl font-bold text-pink-600 mb-1">
                  {familyMembers.filter(m => m.subscription === 'gifted').length}
                </div>
                <div className="text-sm text-pink-700">Gifted Subscriptions</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {familyMembers.filter(m => 
                    new Date().getTime() - m.lastActive.getTime() < 24 * 60 * 60 * 1000
                  ).length}
                </div>
                <div className="text-sm text-purple-700">Active Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
