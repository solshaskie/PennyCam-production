"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Gift, Volume2, Cookie, Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { audioManager } from '@/lib/audio-manager'

interface TreatDispenserProps {
  isConnected: boolean
  onTreatDispensed?: () => void
}

interface AudioStatus {
  treat: 'loading' | 'loaded' | 'error'
  meow: 'loading' | 'loaded' | 'error'
  pspspsp: 'loading' | 'loaded' | 'error'
  trilling: 'loading' | 'loaded' | 'error'
}

interface AudioTestResult {
  accessible: boolean
  size?: number
  contentType?: string
  error?: string
}

export function TreatDispenser({ isConnected, onTreatDispensed }: TreatDispenserProps) {
  const [treatsRemaining, setTreatsRemaining] = useState(12)
  const [isDispensing, setIsDispensing] = useState(false)
  const [lastDispensed, setLastDispensed] = useState<Date | null>(null)
  const [audioStatus, setAudioStatus] = useState<AudioStatus>({
    treat: 'loading',
    meow: 'loading',
    pspspsp: 'loading',
    trilling: 'loading'
  })
  const [showAudioDebug, setShowAudioDebug] = useState(false)
  const [audioTestResults, setAudioTestResults] = useState<{[key: string]: AudioTestResult}>({})

  useEffect(() => {
    // Test and load audio files on component mount
    const loadAudio = async () => {
      console.log('🎵 Starting to load PennyCam audio files...')
      
      const audioFiles = [
        { url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/treat-dispense-xDJYPtEyBPzGBX74ljS8Ny6iFdA6Rc.mp3', name: 'treat' },
        { url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/penny-meow-8CWVStCD9H2G2TnpSyBhnBc5UKp9AM.mp3', name: 'meow' },
        { url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pspspsp-2piWHTEZ8qL60DmISTsS1fVdhHmInp.mp3', name: 'pspspsp' },
        { url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cat-trilling-22VMjI12R7Kd9Cer0lIeJ5LIvV5KTj.mp3', name: 'trilling' }
      ]

      // First, test if the URLs are accessible
      const testResults: {[key: string]: AudioTestResult} = {}
      for (const { url, name } of audioFiles) {
        console.log(`🧪 Testing ${name} audio file...`)
        testResults[name] = await audioManager.testAudioUrl(url)
      }
      setAudioTestResults(testResults)

      // Then try to load the audio files
      for (const { url, name } of audioFiles) {
        try {
          setAudioStatus(prev => ({ ...prev, [name]: 'loading' }))
          
          // Only try to load if the URL test passed
          if (testResults[name].accessible) {
            await audioManager.loadAudio(url, name)
            setAudioStatus(prev => ({ ...prev, [name]: 'loaded' }))
            console.log(`✅ ${name} audio loaded successfully`)
          } else {
            console.warn(`⚠️ Skipping ${name} - URL not accessible: ${testResults[name].error}`)
            setAudioStatus(prev => ({ ...prev, [name]: 'error' }))
          }
        } catch (error: any) {
          console.error(`❌ Failed to load ${name} audio:`, error)
          setAudioStatus(prev => ({ ...prev, [name]: 'error' }))
        }
      }

      // Log final audio status
      const audioInfo = audioManager.getAudioInfo()
      console.log('🎵 Final audio status:', audioInfo)
    }
    
    loadAudio()
  }, [])

  const dispenseTreat = async () => {
    if (!isConnected || treatsRemaining <= 0 || isDispensing) return

    setIsDispensing(true)
    
    try {
      // Play treat dispensing sound
      if (audioStatus.treat === 'loaded') {
        console.log('🍪 Playing real treat dispense MP3')
        await audioManager.playSound('treat', 0.6)
      } else {
        console.log('🍪 Playing synthetic treat sound (MP3 not available)')
        audioManager.generateTreatSound()
      }

      // Simulate treat dispensing delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTreatsRemaining(prev => prev - 1)
      setLastDispensed(new Date())
      onTreatDispensed?.()
      
      // Show success feedback
      alert('🍪 Treat dispensed for Penny!')
      
    } catch (error) {
      console.error('Failed to dispense treat:', error)
      alert('❌ Failed to dispense treat. Please try again.')
    } finally {
      setIsDispensing(false)
    }
  }

  const callPenny = async () => {
    if (!isConnected) return

    try {
      if (audioStatus.pspspsp === 'loaded') {
        console.log('👋 Playing real pspspsp MP3')
        await audioManager.playSound('pspspsp', 0.5)
      } else {
        console.log('👋 Playing synthetic pspspsp sound (MP3 not available)')
        audioManager.generatePspspspSound()
      }
      
      alert('👋 "Pspspsps" - Calling Penny!')
    } catch (error) {
      console.error('Failed to play pspspsp sound:', error)
    }
  }

  const playMeow = async () => {
    try {
      if (audioStatus.meow === 'loaded') {
        console.log('🐱 Playing real meow MP3')
        await audioManager.playSound('meow', 0.7)
      } else {
        console.log('🐱 Playing synthetic meow sound (MP3 not available)')
        audioManager.generateMeowSound()
      }
      
      alert('🐱 Playing Penny\'s meow sound!')
    } catch (error) {
      console.error('Failed to play meow sound:', error)
    }
  }

  const playTrilling = async () => {
    try {
      if (audioStatus.trilling === 'loaded') {
        console.log('🐱 Playing cat trilling MP3')
        await audioManager.playSound('trilling', 0.6)
      } else {
        console.log('🐱 Playing synthetic trilling sound (MP3 not available)')
        audioManager.generateMeowSound() // Fallback to meow
      }
      
      alert('🐱 Playing cat trilling sound!')
    } catch (error) {
      console.error('Failed to play trilling sound:', error)
    }
  }

  const getStatusIcon = (status: 'loading' | 'loaded' | 'error') => {
    switch (status) {
      case 'loading': return <Loader2 className="w-3 h-3 animate-spin" />
      case 'loaded': return <CheckCircle className="w-3 h-3 text-green-600" />
      case 'error': return <XCircle className="w-3 h-3 text-red-600" />
    }
  }

  const allAudioLoaded = Object.values(audioStatus).every(status => status === 'loaded')
  const anyAudioError = Object.values(audioStatus).some(status => status === 'error')

  return (
    <Card className="bg-white/80 backdrop-blur border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Cookie className="w-5 h-5 text-orange-500" />
            Treat Dispenser
            <Badge variant="outline" className={`ml-auto ${treatsRemaining > 5 ? 'bg-green-100 text-green-700' : treatsRemaining > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
              {treatsRemaining} left
            </Badge>
          </CardTitle>
          <Button
            onClick={() => setShowAudioDebug(!showAudioDebug)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            🎵 Audio
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audio Debug Panel */}
        {showAudioDebug && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 text-xs">
            <h4 className="font-semibold mb-2">🎵 Audio Status:</h4>
            <div className="space-y-2">
              {Object.entries(audioStatus).map(([name, status]) => (
                <div key={name} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="capitalize">{name} MP3:</span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(status)}
                      <span className="capitalize">{status}</span>
                    </div>
                  </div>
                  
                  {/* Show test results */}
                  {audioTestResults[name] && (
                    <div className="ml-2 text-xs text-gray-600">
                      {audioTestResults[name].accessible ? (
                        <div className="text-green-600">
                          ✅ File accessible ({audioTestResults[name].contentType})
                          {audioTestResults[name].size && ` - ${Math.round(audioTestResults[name].size! / 1024)}KB`}
                        </div>
                      ) : (
                        <div className="text-red-600">
                          ❌ {audioTestResults[name].error}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {allAudioLoaded && (
              <div className="mt-2 text-green-600 font-semibold">
                ✅ All MP3 files loaded successfully!
              </div>
            )}
            {anyAudioError && (
              <div className="mt-2 text-orange-600 font-semibold">
                ⚠️ Some MP3s failed - using synthetic sounds as fallback
              </div>
            )}
            
            {/* File location help */}
            <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
              <div className="text-blue-800 font-semibold mb-1">📁 Expected file locations:</div>
              <div className="text-blue-700 space-y-1">
                <div>• publichttps://hebbkx1anhila5yf.public.blob.vercel-storage.com/treat-dispense-xDJYPtEyBPzGBX74ljS8Ny6iFdA6Rc.mp3</div>
                <div>• publichttps://hebbkx1anhila5yf.public.blob.vercel-storage.com/penny-meow-8CWVStCD9H2G2TnpSyBhnBc5UKp9AM.mp3</div>
                <div>• publichttps://hebbkx1anhila5yf.public.blob.vercel-storage.com/pspspsp-2piWHTEZ8qL60DmISTsS1fVdhHmInp.mp3</div>
                <div>• publichttps://hebbkx1anhila5yf.public.blob.vercel-storage.com/cat-trilling-22VMjI12R7Kd9Cer0lIeJ5LIvV5KTj.mp3</div>
              </div>
            </div>
          </div>
        )}

        {/* Treat Dispenser */}
        <div className="text-center">
          <Button
            onClick={dispenseTreat}
            disabled={!isConnected || treatsRemaining <= 0 || isDispensing}
            className={`w-full h-16 text-lg font-bold shadow-lg ${
              isDispensing 
                ? 'bg-orange-400 animate-pulse' 
                : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600'
            }`}
          >
            {isDispensing ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Dispensing Treat...
              </>
            ) : (
              <>
                <Gift className="w-6 h-6 mr-3" />
                Give Penny a Treat! 🍪
              </>
            )}
          </Button>
          
          {lastDispensed && (
            <p className="text-xs text-gray-500 mt-2">
              Last treat: {lastDispensed.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Audio Controls */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={callPenny}
            disabled={!isConnected}
            variant="outline"
            className="bg-white/80 backdrop-blur shadow-sm hover:bg-purple-50"
            size="sm"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Pspspsps 👋
            {audioStatus.pspspsp === 'loaded' && <span className="ml-1 text-green-600">🎵</span>}
          </Button>
          
          <Button
            onClick={playMeow}
            variant="outline"
            className="bg-white/80 backdrop-blur shadow-sm hover:bg-pink-50"
            size="sm"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Meow 🐱
            {audioStatus.meow === 'loaded' && <span className="ml-1 text-green-600">🎵</span>}
          </Button>
        </div>

        {/* Additional Audio Controls */}
        <div className="grid grid-cols-1 gap-3">
          <Button
            onClick={playTrilling}
            variant="outline"
            className="bg-white/80 backdrop-blur shadow-sm hover:bg-blue-50"
            size="sm"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Cat Trilling 🎵
            {audioStatus.trilling === 'loaded' && <span className="ml-1 text-green-600">🎵</span>}
          </Button>
        </div>

        {/* Status */}
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center justify-between">
            <span>Connection:</span>
            <Badge variant={isConnected ? "default" : "secondary"} className="text-xs">
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Dispenser:</span>
            <Badge variant={treatsRemaining > 0 ? "default" : "destructive"} className="text-xs">
              {treatsRemaining > 0 ? 'Ready' : 'Empty'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Audio:</span>
            <Badge variant={allAudioLoaded ? "default" : anyAudioError ? "secondary" : "outline"} className="text-xs">
              {allAudioLoaded ? 'MP3 Ready' : anyAudioError ? 'Fallback' : 'Loading...'}
            </Badge>
          </div>
        </div>

        {treatsRemaining <= 3 && treatsRemaining > 0 && (
          <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-200">
            ⚠️ Running low on treats! Only {treatsRemaining} remaining.
          </div>
        )}

        {treatsRemaining === 0 && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
            🚫 Treat dispenser is empty. Please refill to continue giving Penny treats.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
