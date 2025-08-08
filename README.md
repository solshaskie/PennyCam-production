# PennyCam - Remote Pet Monitoring 🐱

A Next.js application for monitoring pets remotely with camera streaming, motion detection, family sharing, and treat dispensing features.

![PennyCam Demo](https://img.shields.io/badge/Demo-Live-green?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

- **📹 Live Camera Streaming** - Real-time video monitoring with fallback simulation
- **🍪 Smart Treat Dispenser** - Remote treat dispensing with audio feedback
- **🎵 Audio System** - Real MP3 sounds with synthetic fallbacks
- **👥 Family Management** - Multi-user access with role-based permissions
- **💳 Stripe Integration** - Subscription billing for Pro features
- **🏠 Smart Home Integration** - Connect with Alexa, Google Home, and more
- **📱 Mobile Responsive** - Works perfectly on all devices
- **🔒 Secure Connection** - Private peer-to-peer streaming

## 🎯 Quick Start

### 1. Clone and Install
\`\`\`bash
git clone https://github.com/yourusername/pennycam.git
cd pennycam
npm install
\`\`\`

### 2. Environment Setup
Create \`.env.local\`:
\`\`\`bash
# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# App Configuration
NEXTAUTH_SECRET=your-random-secret-string-here
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

### 4. Open Application
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
pennycam/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx           # Home page
│   ├── base-station/      # Camera setup
│   ├── remote-viewer/     # Remote viewing
│   ├── account/           # Family management
│   ├── billing/           # Stripe subscriptions
│   ├── integrations/      # Smart home connections
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── app-header.tsx    # PennyCam header
│   ├── treat-dispenser.tsx # Treat system
│   └── stripe-checkout-button.tsx
├── lib/                  # Utilities
│   ├── utils.ts         # General utilities
│   ├── stripe.ts        # Payment processing
│   └── audio-manager.ts # Sound system
├── public/              # Static assets
│   ├── sounds/          # Audio files
│   │   ├── treat-dispense.mp3
│   │   ├── penny-meow.mp3
│   │   ├── pspspsp.mp3
│   │   └── cat-trilling.mp3
│   └── penny-icon.jpg   # Penny's photo
└── .env.local          # Environment variables
\`\`\`

## 🎵 Audio Features

- **🍪 Treat Dispensing** - Real MP3 sound when giving treats
- **👋 Cat Calling** - "Pspspsps" sounds to get attention
- **🐱 Meow Responses** - Penny's actual meow sounds
- **🎶 Cat Trilling** - Additional cat communication sounds
- **🔄 Fallback System** - Synthetic sounds if MP3s fail

## 🧪 Testing Features

### Stripe Integration
\`\`\`bash
# Test cards for development
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
\`\`\`

### Camera System
- **Live Mode**: Grants camera permission for real streaming
- **Simulated Mode**: Uses Penny's photo with breathing animation
- **Fallback**: Always works even without camera access

## 🚀 Deployment

### Deploy to Vercel (Recommended)
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Manual Build
\`\`\`bash
npm run build
npm start
\`\`\`

## 🔧 Configuration

### Environment Variables
- \`STRIPE_SECRET_KEY\` - Stripe secret key for payments
- \`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY\` - Stripe public key
- \`NEXTAUTH_SECRET\` - Random string for session security
- \`NEXTAUTH_URL\` - Your app's URL

### Audio Files
Place MP3 files in \`public/sounds/\`:
- \`treat-dispense.mp3\` - Treat dispensing sound
- \`penny-meow.mp3\` - Cat meow sound
- \`pspspsp.mp3\` - Cat calling sound
- \`cat-trilling.mp3\` - Cat trilling sound

## 📱 Pages Overview

- **🏠 Home** - Main navigation and app overview
- **📹 Base Station** - Camera setup and streaming
- **📱 Remote Viewer** - Connect and watch remotely
- **👥 Account** - Family member management
- **💳 Billing** - Subscription and payment management
- **🔌 Integrations** - Smart home connections
- **🔐 Auth** - Login and registration

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Payments**: Stripe
- **Audio**: HTML5 Audio + Web Audio API
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🐛 Troubleshooting

### Audio Not Playing
1. Check browser console for loading errors
2. Verify MP3 files are in \`public/sounds/\`
3. Test direct URLs: \`http://localhost:3000https://hebbkx1anhila5yf.public.blob.vercel-storage.com/treat-dispense-xDJYPtEyBPzGBX74ljS8Ny6iFdA6Rc.mp3\`
4. Click "🎵 Audio" button in treat dispenser for status

### Camera Not Working
1. Allow camera permissions in browser
2. Check HTTPS requirement for production
3. Test on different browsers/devices
4. Simulated mode always works as fallback

### Stripe Issues
1. Verify API keys in \`.env.local\`
2. Test with Stripe test cards
3. Check webhook configuration for production

## 📄 License

MIT License - feel free to use this project for your own pet monitoring needs!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review browser console for errors
3. Test in incognito mode
4. Open an issue on GitHub

---

Made with ❤️ for Penny and all the pets who deserve monitoring! 🐱
\`\`\`

```plaintext file=".gitignore"
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
Thumbs.db
