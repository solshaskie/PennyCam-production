"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Home, Smartphone, Cloud, Bell, Camera, Share2, Database, Zap, Settings, Check, ExternalLink, Lightbulb } from 'lucide-react'
import Link from "next/link"
import { AppHeader } from "@/components/app-header"

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: 'cloud' | 'notifications' | 'smart-home' | 'social' | 'storage'
  connected: boolean
  premium?: boolean
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Automatically backup Penny photos and videos to Dropbox',
      icon: <Cloud className="w-6 h-6" />,
      category: 'storage',
      connected: false
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: 'Save recordings and photos to your Google Drive',
      icon: <Database className="w-6 h-6" />,
      category: 'storage',
      connected: true
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get motion alerts and updates in your Slack workspace (requires PennyCam Pro subscription)',
      icon: <Bell className="w-6 h-6" />,
      category: 'notifications',
      connected: false,
      premium: true
    },
    {
      id: 'discord',
      name: 'Discord',
      description: 'Receive Penny updates in your Discord server',
      icon: <Bell className="w-6 h-6" />,
      category: 'notifications',
      connected: false
    },
    {
      id: 'alexa',
      name: 'Amazon Alexa',
      description: 'Control PennyCam with voice commands via Alexa (requires PennyCam Pro subscription)',
      icon: <Smartphone className="w-6 h-6" />,
      category: 'smart-home',
      connected: false,
      premium: true
    },
    {
      id: 'google-home',
      name: 'Google Home',
      description: 'Ask Google about Penny\'s activity and status',
      icon: <Smartphone className="w-6 h-6" />,
      category: 'smart-home',
      connected: false
    },
    {
      id: 'smartthings',
      name: 'Samsung SmartThings',
      description: 'Integrate with SmartThings hub and automate smart home devices based on Penny\'s activity',
      icon: <Home className="w-6 h-6" />,
      category: 'smart-home',
      connected: false
    },
    {
      id: 'philips-hue',
      name: 'Philips Hue',
      description: 'Control smart lights based on Penny\'s activity - turn on lights when motion detected or create mood lighting',
      icon: <Lightbulb className="w-6 h-6" />,
      category: 'smart-home',
      connected: false
    },
    {
      id: 'lifx',
      name: 'LIFX',
      description: 'Automate LIFX smart bulbs to respond to Penny\'s movements and create custom lighting scenes',
      icon: <Lightbulb className="w-6 h-6" />,
      category: 'smart-home',
      connected: false
    },
    {
      id: 'nanoleaf',
      name: 'Nanoleaf',
      description: 'Create dynamic light patterns and effects with Nanoleaf panels when Penny is active (requires PennyCam Pro)',
      icon: <Lightbulb className="w-6 h-6" />,
      category: 'smart-home',
      connected: false,
      premium: true
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Share Penny\'s adorable moments to your Facebook timeline and stories',
      icon: <Share2 className="w-6 h-6" />,
      category: 'social',
      connected: false
    },
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Share cute Penny moments directly to Instagram Stories (requires PennyCam Pro subscription)',
      icon: <Share2 className="w-6 h-6" />,
      category: 'social',
      connected: false,
      premium: true
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      description: 'Tweet Penny\'s adorable photos automatically',
      icon: <Share2 className="w-6 h-6" />,
      category: 'social',
      connected: false
    },
    {
      id: 'ifttt',
      name: 'IFTTT',
      description: 'Create custom automations with If This Then That (requires PennyCam Pro for advanced triggers)',
      icon: <Zap className="w-6 h-6" />,
      category: 'cloud',
      connected: false,
      premium: true
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect PennyCam to 5000+ apps and services (requires PennyCam Pro subscription)',
      icon: <Zap className="w-6 h-6" />,
      category: 'cloud',
      connected: false,
      premium: true
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', name: 'All Integrations', count: integrations.length },
    { id: 'storage', name: 'Cloud Storage', count: integrations.filter(i => i.category === 'storage').length },
    { id: 'notifications', name: 'Notifications', count: integrations.filter(i => i.category === 'notifications').length },
    { id: 'smart-home', name: 'Smart Home', count: integrations.filter(i => i.category === 'smart-home').length },
    { id: 'social', name: 'Social Media', count: integrations.filter(i => i.category === 'social').length },
    { id: 'cloud', name: 'Automation', count: integrations.filter(i => i.category === 'cloud').length }
  ]

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, connected: !integration.connected }
        : integration
    ))
  }

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === selectedCategory)

  const connectedCount = integrations.filter(i => i.connected).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <AppHeader subtitle="Integrations" />
        
        <div className="flex items-center justify-center mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{integrations.length}</div>
              <div className="text-sm text-gray-600">Available Integrations</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{connectedCount}</div>
              <div className="text-sm text-gray-600">Connected Services</div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{integrations.filter(i => i.premium).length}</div>
              <div className="text-sm text-gray-600">PennyCam Pro Features</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-lg sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Integrations Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-4">
              {filteredIntegrations.map(integration => (
                <Card key={integration.id} className="bg-white/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                          integration.connected 
                            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' 
                            : 'bg-gradient-to-br from-gray-400 to-gray-500 text-white'
                        }`}>
                          {integration.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {integration.name}
                            {integration.premium && (
                              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                                PRO
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {integration.category.replace('-', ' ')}
                            </Badge>
                            {integration.connected && (
                              <Badge variant="default" className="bg-green-500 text-xs">
                                <Check className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Switch
                        checked={integration.connected}
                        onCheckedChange={() => toggleIntegration(integration.id)}
                        disabled={integration.premium && !integration.connected}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-sm text-gray-600 mb-4">
                      {integration.description}
                    </CardDescription>
                    
                    {integration.connected ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Check className="w-4 h-4" />
                          <span>Successfully connected</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Settings className="w-4 h-4 mr-2" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {integration.premium && (
                          <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded border border-purple-200">
                            💎 PennyCam Pro required - Upgrade to unlock this integration
                          </div>
                        )}
                        <Button 
                          className="w-full" 
                          size="sm"
                          disabled={integration.premium}
                          onClick={() => toggleIntegration(integration.id)}
                        >
                          {integration.premium ? 'Upgrade to PennyCam Pro' : 'Connect'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredIntegrations.length === 0 && (
              <Card className="bg-white/80 backdrop-blur border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No integrations found</h3>
                  <p className="text-gray-600">Try selecting a different category</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* PennyCam Pro Info */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              PennyCam Pro Subscription
            </CardTitle>
            <CardDescription>
              Unlock advanced integrations and premium features for enhanced pet monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-purple-800 mb-3">What's Included:</h4>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Advanced voice control with Alexa
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Professional notifications via Slack
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Instagram Stories integration
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Advanced automation with IFTTT & Zapier
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-600" />
                    Premium smart lighting with Nanoleaf
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-center p-6 bg-white/60 rounded-lg border border-purple-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">$2.99</div>
                  <div className="text-sm text-purple-700 mb-4">per month</div>
                  <Link href="/billing">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Integrations */}
        <Card className="bg-white/80 backdrop-blur border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Popular Integration Ideas
            </CardTitle>
            <CardDescription>
              Here are some popular ways PennyCam users connect their pet monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">🏠 Complete Smart Home</h4>
                <p className="text-sm text-blue-700">Connect SmartThings + Google Home + Philips Hue to automate lights and get voice updates about Penny</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">🔔 Free Alert System</h4>
                <p className="text-sm text-green-700">Use Discord + Facebook to get motion alerts and share updates without any subscription fees</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">💎 Pro Social Sharing</h4>
                <p className="text-sm text-purple-700">Upgrade to Pro for Instagram Stories + Slack notifications + advanced IFTTT automations</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Smart Lighting</h4>
                <p className="text-sm text-yellow-700">Use Philips Hue + LIFX (free) or upgrade to Pro for advanced Nanoleaf light patterns</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
