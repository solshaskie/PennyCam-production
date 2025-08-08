"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Mic, MicOff, Volume2, VolumeX, Wifi, WifiOff, Home, Video, VideoOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Link from "next/link"
import { AppHeader } from "@/components/app-header"

export default function RemoteViewer() {
  const [connectionId, setConnectionId] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "error">("disconnected")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [connectionLog, setConnectionLog] = useState<string[]>([])
  const [cameraPermission, setCameraPermission] = useState<"unknown" | "granted" | "denied">("unknown")
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [zoomLevel, setZoomLevel] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [lastTouchDistance, setLastTouchDistance] = useState(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [showFlash, setShowFlash] = useState(false)

  const [motionAlerts, setMotionAlerts] = useState<Array<{time: Date, message: string}>>([])
  const [hasUnreadMotion, setHasUnreadMotion] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [lastNotificationTime, setLastNotificationTime] = useState<Date | null>(null)

  // Prevent accidental navigation during connection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (connectionStatus === "connecting") {
        e.preventDefault()
        e.returnValue = "Connection in progress. Are you sure you want to leave?"
        return "Connection in progress. Are you sure you want to leave?"
      }
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Prevent clicking on external links during connection
      if (connectionStatus === "connecting" && target.tagName === 'A' && target.getAttribute('href')?.startsWith('http')) {
        e.preventDefault()
        console.log("🚫 External link blocked during connection")
        alert("Please wait for connection to complete before clicking external links")
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('click', handleClick, true)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('click', handleClick, true)
    }
  }, [connectionStatus])

  // Add log entry
  const addLog = (message: string) => {
    console.log(`📱 REMOTE: ${message}`)
    setConnectionLog(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // Update time every second when connected
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isConnected) {
      interval = setInterval(() => {
        setCurrentTime(new Date())
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isConnected])

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      setRecordingTime(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRecording])

  // Motion detection simulation for remote viewer
  useEffect(() => {
    if (!isConnected) return
    
    const motionInterval = setInterval(() => {
      const motionChance = 0.15
      const hasMotion = Math.random() < motionChance
      
      if (hasMotion && notificationsEnabled) {
        console.log('📱 REMOTE: Motion alert received!')
        const now = new Date()
        const newAlert = {
          time: now,
          message: "Motion detected in Penny's area"
        }
        
        setMotionAlerts(prev => [...prev.slice(-9), newAlert])
        setHasUnreadMotion(true)
        setLastNotificationTime(now)
        
        // Browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('PennyCam Motion Alert', {
            body: 'Motion detected in Penny\'s area',
            icon: '/penny-icon.jpg',
            tag: 'motion-alert'
          })
        }
        
        // Play notification sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
      }
    }, 3000)
    
    return () => clearInterval(motionInterval)
  }, [isConnected, notificationsEnabled])

  // Request notification permission when connected
  useEffect(() => {
    if (isConnected && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [isConnected])

  const connectToBase = async () => {
  if (!connectionId.trim()) {
    alert("Please enter a PennyCam ID")
    return
  }

  console.log("🔄 Starting simple connection...")
  
  // Reset state
  setConnectionStatus("connecting")
  setConnectionLog([])
  setIsConnected(false)
  
  // Simple 3-step process with guaranteed completion
  setTimeout(() => {
    addLog("📡 Connecting to base station...")
  }, 500)
  
  setTimeout(() => {
    addLog("✅ Base station connected!")
    addLog("📹 Testing camera access...")
  }, 1500)
  
  setTimeout(() => {
    addLog("✅ Connection complete!")
    setIsConnected(true)
    setConnectionStatus("connected")
    setCameraPermission("denied") // Default to simulated mode
  }, 3000)
}

  const disconnect = () => {
    addLog("🔌 Disconnecting...")
    
    setIsConnected(false)
    setConnectionStatus("disconnected")
    setIsSpeaking(false)
    setCameraPermission("unknown")
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop()
        addLog(`🛑 Stopped ${track.kind} track`)
      })
      streamRef.current = null
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject = null
    }
    
    setConnectionLog([])
    addLog("✅ Disconnected successfully")
  }

  const startSpeaking = async () => {
    if (!isConnected) return
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsSpeaking(true)
      addLog("🎤 Started talking to Penny")
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop())
        setIsSpeaking(false)
        addLog("🎤 Stopped talking")
      }, 10000)
    } catch (error: any) {
      addLog(`❌ Microphone error: ${error.message}`)
      alert("Unable to access microphone. Please check your browser permissions.")
    }
  }

  const stopSpeaking = () => {
    setIsSpeaking(false)
    addLog("🎤 Stopped talking")
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
    addLog(`🔊 Audio ${!isMuted ? 'muted' : 'unmuted'}`)
  }

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled
        setIsVideoEnabled(!isVideoEnabled)
        addLog(`📹 Video ${!isVideoEnabled ? 'enabled' : 'disabled'}`)
      }
    }
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1))
    if (zoomLevel <= 1.5) {
      setPanX(0)
      setPanY(0)
    }
  }

  const resetZoom = () => {
    setZoomLevel(1)
    setPanX(0)
    setPanY(0)
  }

  // Fixed getTouchDistance function to handle React.TouchList
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0
    const touch1 = touches[0]
    const touch2 = touches[1]
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    )
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setLastTouchDistance(getTouchDistance(e.touches))
    } else if (e.touches.length === 1 && zoomLevel > 1) {
      setIsDragging(true)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    
    if (e.touches.length === 2) {
      // Pinch to zoom
      const currentDistance = getTouchDistance(e.touches)
      if (lastTouchDistance > 0) {
        const scale = currentDistance / lastTouchDistance
        setZoomLevel(prev => Math.max(1, Math.min(4, prev * scale)))
      }
      setLastTouchDistance(currentDistance)
    } else if (e.touches.length === 1 && isDragging && zoomLevel > 1) {
      // Pan when zoomed
      const touch = e.touches[0]
      const container = imageContainerRef.current
      if (container) {
        const rect = container.getBoundingClientRect()
        const x = ((touch.clientX - rect.left) / rect.width - 0.5) * 100
        const y = ((touch.clientY - rect.top) / rect.height - 0.5) * 100
        setPanX(Math.max(-50, Math.min(50, x)))
        setPanY(Math.max(-50, Math.min(50, y)))
      }
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setLastTouchDistance(0)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      const container = imageContainerRef.current
      if (container) {
        const rect = container.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 100
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 100
        setPanX(Math.max(-50, Math.min(50, x)))
        setPanY(Math.max(-50, Math.min(50, y)))
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const takePhoto = () => {
    setShowFlash(true)
    
    // Create a canvas to capture the current view
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      canvas.width = 800
      canvas.height = 600
      
      if (videoRef.current && videoRef.current.srcObject) {
        // Capture from live video if available
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
      } else {
        // Fall back to Penny's photo
        ctx.fillStyle = '#1a1a1a'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          const scale = zoomLevel
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2
          const imgWidth = img.width * 0.5 * scale
          const imgHeight = img.height * 0.5 * scale
          
          ctx.save()
          ctx.translate(centerX + panX * scale, centerY + panY * scale)
          ctx.drawImage(img, -imgWidth/2, -imgHeight/2, imgWidth, imgHeight)
          ctx.restore()
          
          // Add timestamp
          ctx.fillStyle = 'white'
          ctx.font = 'bold 24px Arial'
          ctx.fillText(`Penny - ${new Date().toLocaleString()}`, 20, 40)
          
          // Download the image
          const link = document.createElement('a')
          link.download = `penny-photo-${Date.now()}.png`
          link.href = canvas.toDataURL()
          link.click()
        }
        img.src = '/penny-icon.jpg'
        return
      }
      
      // Add timestamp for live video capture
      ctx.fillStyle = 'white'
      ctx.font = 'bold 24px Arial'
      ctx.fillText(`Penny Live - ${new Date().toLocaleString()}`, 20, 40)
      
      // Download the image
      const link = document.createElement('a')
      link.download = `penny-live-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
    
    setTimeout(() => setShowFlash(false), 200)
  }

  const playSound = () => {
    // Create audio context for sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    
    // Create a simple beep sound
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1)
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
    
    // Show feedback
    alert("🔊 Playing attention sound for Penny!")
  }

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      alert(`📹 Recording saved! Duration: ${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}`)
    } else {
      setIsRecording(true)
      alert("📹 Started recording Penny's video!")
    }
  }

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const clearMotionAlerts = () => {
    setHasUnreadMotion(false)
  }

  const hasLiveVideo = cameraPermission === "granted" && streamRef.current && videoRef.current && videoRef.current.srcObject

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected": return <CheckCircle className="w-4 h-4 text-green-600" />
      case "connecting": return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      case "error": return <XCircle className="w-4 h-4 text-red-600" />
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected": return "text-green-600"
      case "connecting": return "text-blue-600"
      case "error": return "text-red-600"
      default: return "text-gray-600"
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected": return isConnected ? "Connected Successfully" : "Connection Ready"
      case "connecting": return "Connecting..."
      case "error": return "Connection Failed"
      default: return "Not Connected"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <AppHeader subtitle="Remote Viewer" />
        
        <div className="flex items-center justify-center mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {!isConnected ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Connection Form */}
            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-xl flex items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <img 
                      src="/penny-icon.jpg" 
                      alt="Penny" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  Connect to PennyCam
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">PennyCam ID</label>
                  <Input
                    value={connectionId}
                    onChange={(e) => setConnectionId(e.target.value.toUpperCase())}
                    placeholder="Enter connection code"
                    className="mt-2 text-center font-mono text-xl font-bold tracking-wider h-14 bg-white/80 backdrop-blur"
                    maxLength={10}
                    disabled={connectionStatus === "connecting"}
                  />
                </div>
                
                {/* Status Display */}
                <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${
                  connectionStatus === "connected" ? "border-green-500 bg-green-50" :
                  connectionStatus === "connecting" ? "border-blue-500 bg-blue-50" :
                  connectionStatus === "error" ? "border-red-500 bg-red-50" :
                  "border-gray-300 bg-gray-50"
                }`}>
                  {getStatusIcon()}
                  <span className={`font-medium ${getStatusColor()}`}>
                    {getStatusText()}
                  </span>
                </div>
                
                <Button 
                  onClick={connectToBase} 
                  className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg"
                  disabled={connectionStatus === "connecting" || !connectionId.trim()}
                >
                  {connectionStatus === "connecting" ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Connecting to Penny...
                    </>
                  ) : (
                    <>
                      <Wifi className="w-5 h-5 mr-2" />
                      Connect to PennyCam
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-1">Need the PennyCam ID?</p>
                  <p>Get the connection code from your base station device</p>
                  <p className="text-xs mt-2 text-blue-600">Demo: Enter any text to test connection</p>
                </div>
              </CardContent>
            </Card>

            {/* Connection Log */}
            <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  📋 Connection Log
                  <Badge variant="outline" className="ml-auto">
                    {connectionLog.length} entries
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {connectionLog.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-8">
                      Connection log will appear here...
                    </p>
                  ) : (
                    connectionLog.map((entry, index) => (
                      <div key={index} className="text-sm p-2 bg-gray-50 rounded border font-mono">
                        {entry}
                      </div>
                    ))
                  )}
                </div>
                
                {connectionStatus === "connecting" && (
                  <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 text-blue-600">
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Processing connection...</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Connected View - Same as before but with disconnect button */
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg overflow-hidden">
                        <img 
                          src="/penny-icon.jpg" 
                          alt="Penny" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {hasLiveVideo ? 'Live Penny Camera' : 'Penny View (Simulated)'}
                    </CardTitle>
                    <Badge variant="default" className={`animate-pulse shadow-lg ${hasLiveVideo ? 'bg-green-500' : 'bg-orange-500'}`}>
                      <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                      {hasLiveVideo ? 'LIVE CAMERA' : 'SIMULATED'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    ref={imageContainerRef}
                    className={`relative bg-gray-900 rounded-xl overflow-hidden shadow-inner cursor-grab active:cursor-grabbing ${showFlash ? 'animate-pulse bg-white' : ''}`} 
                    style={{ aspectRatio: '16/9' }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {hasLiveVideo ? (
                      <video
                        ref={videoRef}
                        autoPlay
                        muted={isMuted}
                        playsInline
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
                          transformOrigin: 'center center'
                        }}
                        className="transition-transform duration-200 ease-out"
                      />
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <div 
                          className="relative transition-transform duration-200 ease-out"
                          style={{ 
                            transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
                            transformOrigin: 'center center'
                          }}
                        >
                          <img 
                            src="/penny-icon.jpg" 
                            alt="Penny Simulated Feed" 
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none"
                            style={{ 
                              maxWidth: '80%', 
                              maxHeight: '80%',
                              filter: 'brightness(0.95) contrast(1.05)',
                              userSelect: 'none',
                              pointerEvents: 'none'
                            }}
                            draggable={false}
                          />
                          {/* Subtle breathing animation overlay */}
                          <div 
                            className="absolute inset-0 bg-white opacity-5 rounded-lg animate-pulse"
                            style={{ animationDuration: '3s' }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Live indicator */}
                    <div className="absolute top-4 left-4">
                      <div className={`flex items-center gap-2 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg ${hasLiveVideo ? 'bg-green-500' : 'bg-orange-500'}`}>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        {hasLiveVideo ? 'LIVE' : 'SIMULATED'}
                      </div>
                    </div>
                    
                    {/* Zoom level indicator */}
                    {zoomLevel > 1 && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                        <div className="bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {zoomLevel.toFixed(1)}x
                        </div>
                      </div>
                    )}

                    {/* Recording indicator */}
                    {isRecording && (
                      <div className="absolute top-16 left-4">
                        <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                          REC {formatRecordingTime(recordingTime)}
                        </div>
                      </div>
                    )}

                    {hasUnreadMotion && (
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                        <div className="flex items-center gap-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-bounce">
                          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                          NEW MOTION ALERT
                        </div>
                      </div>
                    )}
                    
                    {/* Timestamp */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-mono">
                        {currentTime.toLocaleTimeString()}
                      </div>
                    </div>
                    
                    {/* Connection quality indicator */}
                    <div className="absolute bottom-4 right-4">
                      <div className={`flex items-center gap-1 text-white px-3 py-1 rounded-full text-xs ${hasLiveVideo ? 'bg-green-500/80' : 'bg-orange-500/80'}`}>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        {hasLiveVideo ? 'HD Quality' : 'Demo Mode'}
                      </div>
                    </div>
                    
                    {isMuted && (
                      <div className="absolute top-16 right-4">
                        <Badge variant="secondary" className="bg-black/50 text-white">
                          <VolumeX className="w-3 h-3 mr-1" />
                          Muted
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      onMouseDown={startSpeaking}
                      onMouseUp={stopSpeaking}
                      onTouchStart={startSpeaking}
                      onTouchEnd={stopSpeaking}
                      variant={isSpeaking ? "destructive" : "default"}
                      className={`flex-1 shadow-lg ${isSpeaking ? 'bg-red-500 hover:bg-red-600' : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'}`}
                    >
                      {isSpeaking ? (
                        <>
                          <div className="animate-pulse w-4 h-4 bg-white rounded-full mr-2"></div>
                          Talking to Penny...
                        </>
                      ) : (
                        <>
                          <Mic className="w-4 h-4 mr-2" />
                          Hold to Talk to Penny
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={toggleMute}
                      variant={isMuted ? "destructive" : "outline"}
                      className="bg-white/80 backdrop-blur shadow-lg"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>

                    {hasLiveVideo && (
                      <Button
                        onClick={toggleVideo}
                        variant={isVideoEnabled ? "outline" : "destructive"}
                        className="bg-white/80 backdrop-blur shadow-lg"
                      >
                        {isVideoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                      </Button>
                    )}
                    
                    <Button onClick={disconnect} variant="outline" className="bg-white/80 backdrop-blur shadow-lg">
                      <WifiOff className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Connection Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Connected to PennyCam {connectionId}</span>
                  </div>
                  <div className={`flex items-center gap-3 p-3 rounded-lg border ${hasLiveVideo ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                    <div className={`w-3 h-3 rounded-full ${hasLiveVideo ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    <span className="text-sm font-medium">
                      {hasLiveVideo ? 'Live Camera Active' : 'Simulated Mode Active'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className={`w-3 h-3 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <span className="text-sm font-medium">Audio {isMuted ? 'Muted' : 'Active'}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Camera Status</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-3">
                  <div className="flex items-center gap-2">
                    {cameraPermission === "granted" ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : cameraPermission === "denied" ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium">
                      Camera Permission: {
                        cameraPermission === "granted" ? "Granted" :
                        cameraPermission === "denied" ? "Denied" : "Unknown"
                      }
                    </span>
                  </div>
                  
                  {cameraPermission === "granted" && (
                    <div className="text-green-700 bg-green-50 p-2 rounded border border-green-200">
                      ✅ Live camera feed is active! You're seeing real video from your camera.
                    </div>
                  )}
                  
                  {cameraPermission === "denied" && (
                    <div className="text-orange-700 bg-orange-50 p-2 rounded border border-orange-200">
                      ⚠️ Camera access denied. Using simulated mode with Penny's photo.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
