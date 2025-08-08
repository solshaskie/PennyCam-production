"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Smartphone, Shield, Zap, Heart, Settings } from 'lucide-react'
import { AppHeader } from "@/components/app-header"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <AppHeader />

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Camera className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-xl">Home Base Station</CardTitle>
              <CardDescription className="text-gray-600">
                Set up your device at home to monitor Penny with live video and audio
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Link href="/base-station">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" size="lg">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Base Station
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-xl">Remote Viewer</CardTitle>
              <CardDescription className="text-gray-600">
                Connect from anywhere to watch live video and talk to Penny
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Link href="/remote-viewer">
                <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600" size="lg">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Connect Remotely
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
              <img 
                src="/penny-icon.jpg" 
                alt="Penny" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg?height=40&width=40&text=🐱'
                }}
              />
            </div>
            How PennyCam Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-bold shadow-lg">1</div>
              <h3 className="font-semibold mb-2">Setup Base Station</h3>
              <p className="text-sm text-gray-600">Position your device at home with camera access to monitor Penny's favorite spots</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-bold shadow-lg">2</div>
              <h3 className="font-semibold mb-2">Connect Remotely</h3>
              <p className="text-sm text-gray-600">Use the connection ID to access Penny's camera from your phone or computer</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 text-white rounded-xl flex items-center justify-center mx-auto mb-4 text-lg font-bold shadow-lg">3</div>
              <h3 className="font-semibold mb-2">Watch & Interact</h3>
              <p className="text-sm text-gray-600">Enjoy live video streaming and use push-to-talk to communicate with Penny</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/60 backdrop-blur rounded-xl p-4 text-center">
            <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Secure Connection</h3>
            <p className="text-xs text-gray-600">Private peer-to-peer streaming</p>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl p-4 text-center">
            <Zap className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Real-time Streaming</h3>
            <p className="text-xs text-gray-600">Low latency video and audio</p>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl p-4 text-center">
            <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Made for Penny</h3>
            <p className="text-xs text-gray-600">Designed with love for pets</p>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-xl p-4 text-center">
            <Settings className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Easy Setup</h3>
            <p className="text-xs text-gray-600">Ready in minutes</p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/account">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/60 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Account & Family</h3>
                <p className="text-xs text-gray-600">Manage subscriptions and family access</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/billing">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/60 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Upgrade to Pro</h3>
                <p className="text-xs text-gray-600">Advanced features and integrations</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/integrations">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer bg-white/60 backdrop-blur">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-1">Integrations</h3>
                <p className="text-xs text-gray-600">Connect with smart home and social apps</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
