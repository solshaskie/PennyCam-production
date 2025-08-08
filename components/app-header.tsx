import { Heart } from 'lucide-react'

interface AppHeaderProps {
  subtitle?: string
}

export function AppHeader({ subtitle }: AppHeaderProps) {
  return (
    <div className="text-center mb-8 pt-8">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <img 
              src="/penny-icon.jpg" 
              alt="Penny the kitten" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Failed to load Penny image')
                // Fallback to a placeholder if the image fails to load
                e.currentTarget.src = '/placeholder.svg?height=64&width=64&text=🐱'
              }}
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
            <Heart className="w-3 h-3 text-white fill-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            PennyCam
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
          )}
        </div>
      </div>
      <p className="text-lg text-gray-600">Keep an eye on Penny and your furry friends, anywhere, anytime</p>
    </div>
  )
}
