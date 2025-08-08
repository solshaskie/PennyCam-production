"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Mic, MicOff, Video, VideoOff, Wifi, Home } from 'lucide-react'
import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { TreatDispenser } from "@/components/treat-dispenser"

export default function BaseStation() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isMicEnabled, setIsMicEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [connectionId, setConnectionId] = useState("")
  const [debugInfo, setDebugInfo] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    // Generate a simple connection ID
    setConnectionId(Math.random().toString(36).substring(2, 8).toUpperCase())
  }, [])

  const startStreaming = async () => {
    try {
      console.log("Attempting to access camera...")
      setDebugInfo("Requesting camera access...")
      
      setIsStreaming(true)
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      console.log("Camera access successful!")
      setDebugInfo("Camera access granted, setting up video...")
      
      if (videoRef.current) {
        console.log("Setting srcObject on video element")
        videoRef.current.srcObject = stream
        
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded")
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log("Video playing successfully")
                setDebugInfo("PennyCam is now streaming!")
              })
              .catch(err => {
                console.error("Play failed:", err)
                setDebugInfo(`Play failed: ${err.message}`)
              })
          }
        }
        
        videoRef.current.play().catch(err => {
          console.log("Immediate play failed, waiting for metadata:", err.message)
        })
      }
      
      streamRef.current = stream
      
      const videoTracks = stream.getVideoTracks()
      const audioTracks = stream.getAudioTracks()
      
      console.log(`Got ${videoTracks.length} video tracks and ${audioTracks.length} audio tracks`)
      
      if (audioTracks.length === 0) {
        setIsMicEnabled(false)
      }
      
    } catch (error: any) {
      console.error("Camera access failed:", error)
      setDebugInfo(`Camera access failed: ${error.message}`)
      setIsStreaming(false)
      
      try {
        console.log("Trying video-only fallback...")
        setDebugInfo("Trying video-only fallback...")
        setIsStreaming(true)
        
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = videoStream
          videoRef.current.play().catch(console.error)
        }
        
        streamRef.current = videoStream
        setIsMicEnabled(false)
        setDebugInfo("Video-only mode active")
        
      } catch (videoError: any) {
        console.error("Video-only fallback also failed:", videoError)
        setDebugInfo(`All attempts failed: ${videoError.message}`)
        setIsStreaming(false)
      }
    }
  }

  const stopStreaming = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsStreaming(false)
    setDebugInfo("")
  }

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !isMicEnabled
        setIsMicEnabled(!isMicEnabled)
      } else {
        alert("No microphone available. Audio access may have been denied.")
      }
    }
  }

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled
        setIsVideoEnabled(!isVideoEnabled)
      } else {
        alert("No camera available.")
      }
    }
  }

  useEffect(() => {
    if (isStreaming && streamRef.current && videoRef.current && !videoRef.current.srcObject) {
      console.log("Connecting existing stream to video element")
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(console.error)
      setDebugInfo("Stream connected to video element")
    }
  }, [isStreaming])

  const handleTreatDispensed = () => {
    console.log("🍪 Treat dispensed from base station!")
    // In a real implementation, this would trigger the physical dispenser
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <AppHeader subtitle="Base Station" />
        
        <div className="flex items-center justify-center mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg overflow-hidden">
                    <img 
                      src="/penny-icon.jpg" 
                      alt="Penny" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  Penny's Live Camera Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                {debugInfo && (
                  <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-lg text-sm border border-blue-200">
                    <strong>Status:</strong> {debugInfo}
                  </div>
                )}
                
                <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-inner" style={{ aspectRatio: '16/9' }}>
                  {isStreaming ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      playsInline
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onLoadedData={() => {
                        console.log("Video data loaded")
                        setDebugInfo("Video data loaded successfully")
                      }}
                      onPlay={() => {
                        console.log("Video started playing")
                        setDebugInfo("PennyCam is live!")
                      }}
                      onError={(e) => {
                        console.error("Video error:", e)
                        setDebugInfo("Video playback error")
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white" style={{ minHeight: '300px' }}>
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 opacity-75 shadow-lg">
                          <img 
                            src="/penny-icon.jpg" 
                            alt="Penny" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-lg font-medium">PennyCam not active</p>
                        <p className="text-sm opacity-75">Click "Start Streaming" to watch Penny</p>
                      </div>
                    </div>
                  )}
                  
                  {isStreaming && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse shadow-lg">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 inline-block"></div>
                        PENNY LIVE
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  {!isStreaming ? (
                    <Button onClick={startStreaming} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
                      <Video className="w-4 h-4 mr-2" />
                      Start PennyCam
                    </Button>
                  ) : (
                    <Button onClick={stopStreaming} variant="destructive" className="flex-1 shadow-lg">
                      <VideoOff className="w-4 h-4 mr-2" />
                      Stop Streaming
                    </Button>
                  )}
                  
                  <Button
                    onClick={toggleVideo}
                    variant={isVideoEnabled ? "outline" : "destructive"}
                    disabled={!isStreaming}
                    className="bg-white/80 backdrop-blur shadow-lg"
                  >
                    {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    onClick={toggleMic}
                    variant={isMicEnabled ? "outline" : "destructive"}
                    disabled={!isStreaming}
                    className="bg-white/80 backdrop-blur shadow-lg"
                  >
                    {isMicEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="w-5 h-5" />
                  Connection Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">PennyCam ID</label>
                  <div className="mt-2 p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl font-mono text-xl text-center font-bold tracking-wider shadow-inner">
                    {connectionId}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Share this ID to connect remotely to Penny
                  </p>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-pink-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-medium">
                    {isStreaming ? 'PennyCam Active' : 'Not Streaming'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Treat Dispenser */}
            <TreatDispenser 
              isConnected={isStreaming} 
              onTreatDispensed={handleTreatDispensed}
            />

            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Penny Care Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Position camera to capture Penny's favorite spots</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Keep treat dispenser filled for remote rewards</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Share the PennyCam ID with your remote device</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Test audio levels and treat dispenser before leaving</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
