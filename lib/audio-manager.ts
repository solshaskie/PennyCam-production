// Simplified audio management for PennyCam sounds with better error handling
export class AudioManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map()
  private loadingPromises: Map<string, Promise<void>> = new Map()

  constructor() {
    console.log('🔊 AudioManager initialized')
  }

  async loadAudio(url: string, name: string): Promise<void> {
    // Prevent duplicate loading
    if (this.loadingPromises.has(name)) {
      return this.loadingPromises.get(name)!
    }

    const loadPromise = this.loadAudioFile(url, name)
    this.loadingPromises.set(name, loadPromise)
    
    return loadPromise
  }

  private async loadAudioFile(url: string, name: string): Promise<void> {
    try {
      console.log(`🎵 Loading audio file: ${name} from ${url}`)
      
      // Create HTML5 Audio element (simpler than Web Audio API)
      const audio = new Audio()
      
      // Set up promise to wait for loading
      const loadPromise = new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error(`Audio loading timeout for ${name}`))
        }, 10000) // 10 second timeout

        audio.oncanplaythrough = () => {
          clearTimeout(timeout)
          console.log(`✅ Audio "${name}" loaded successfully (${audio.duration?.toFixed(2) || 'unknown'}s)`)
          this.audioCache.set(name, audio)
          resolve()
        }

        audio.onerror = (e) => {
          clearTimeout(timeout)
          console.error(`❌ Audio loading error for ${name}:`, e)
          reject(new Error(`Failed to load audio: ${name}`))
        }

        audio.onabort = () => {
          clearTimeout(timeout)
          reject(new Error(`Audio loading aborted: ${name}`))
        }
      })

      // Start loading
      audio.preload = 'auto'
      audio.src = url
      audio.load()

      await loadPromise
      
    } catch (error: any) {
      console.error(`❌ Failed to load audio ${name} from ${url}:`, error)
      throw error
    }
  }

  async playSound(name: string, volume: number = 0.5): Promise<void> {
    const audio = this.audioCache.get(name)
    if (!audio) {
      console.error(`Audio ${name} not loaded`)
      return
    }

    try {
      // Clone the audio element to allow overlapping plays
      const audioClone = audio.cloneNode() as HTMLAudioElement
      audioClone.volume = Math.max(0, Math.min(1, volume))
      
      // Play the sound
      const playPromise = audioClone.play()
      
      if (playPromise !== undefined) {
        await playPromise
        console.log(`🔊 Playing sound: ${name} at volume ${volume}`)
      }
    } catch (error) {
      console.error(`Failed to play sound ${name}:`, error)
      // Don't throw - just log the error
    }
  }

  // Check if audio is loaded
  isAudioLoaded(name: string): boolean {
    return this.audioCache.has(name)
  }

  // Get loaded audio info
  getAudioInfo(): { [key: string]: { duration: number, loaded: boolean } } {
    const info: { [key: string]: { duration: number, loaded: boolean } } = {}
    
    this.audioCache.forEach((audio, name) => {
      info[name] = {
        duration: audio.duration || 0,
        loaded: true
      }
    })
    
    return info
  }

  // Test if a URL is accessible
  async testAudioUrl(url: string): Promise<{ accessible: boolean, size?: number, contentType?: string, error?: string }> {
    try {
      console.log(`🧪 Testing audio URL: ${url}`)
      const response = await fetch(url, { method: 'HEAD' })
      
      if (!response.ok) {
        return {
          accessible: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        }
      }
      
      const contentType = response.headers.get('content-type') || 'unknown'
      const contentLength = response.headers.get('content-length')
      const size = contentLength ? parseInt(contentLength) : undefined
      
      console.log(`✅ Audio URL accessible: ${contentType}, ${size ? `${size} bytes` : 'size unknown'}`)
      
      return {
        accessible: true,
        size,
        contentType
      }
    } catch (error: any) {
      console.error(`❌ Audio URL test failed:`, error)
      return {
        accessible: false,
        error: error.message
      }
    }
  }

  // Generate synthetic sounds if MP3s aren't available
  generateTreatSound(): void {
    console.log('🎵 Playing synthetic treat sound')
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Happy treat dispensing sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2)
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.4)
    } catch (error) {
      console.error('Failed to generate synthetic treat sound:', error)
    }
  }

  generateMeowSound(): void {
    console.log('🎵 Playing synthetic meow sound')
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Cat meow approximation
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(500, audioContext.currentTime + 0.2)
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.5)
      
      gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.7)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.7)
    } catch (error) {
      console.error('Failed to generate synthetic meow sound:', error)
    }
  }

  generatePspspspSound(): void {
    console.log('🎵 Playing synthetic pspspsp sound')
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      // Create multiple short bursts for "pspspsps"
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          try {
            const noise = audioContext.createBufferSource()
            const gainNode = audioContext.createGain()
            
            // Create white noise buffer
            const bufferSize = audioContext.sampleRate * 0.1
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate)
            const output = buffer.getChannelData(0)
            
            for (let j = 0; j < bufferSize; j++) {
              output[j] = Math.random() * 2 - 1
            }
            
            noise.buffer = buffer
            noise.connect(gainNode)
            gainNode.connect(audioContext.destination)
            
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08)
            
            noise.start(audioContext.currentTime)
            noise.stop(audioContext.currentTime + 0.08)
          } catch (error) {
            console.error('Failed to generate pspspsp burst:', error)
          }
        }, i * 150)
      }
    } catch (error) {
      console.error('Failed to generate synthetic pspspsp sound:', error)
    }
  }
}

// Global audio manager instance
export const audioManager = new AudioManager()
