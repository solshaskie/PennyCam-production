# PennyCam Production Setup

## 🚀 Quick Start Guide

### 1. Initial Setup
\`\`\`bash
cd c:\users\ashley\pennycam-production
npm install
\`\`\`

### 2. Copy Your Audio Files
Copy your MP3 files to the `public\sounds\` directory:
- `treat-dispense.mp3`
- `penny-meow.mp3` 
- `pspspsp.mp3`

### 3. Environment Configuration
Create `.env.local` with your Stripe keys:
\`\`\`bash
# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# App Configuration
NEXTAUTH_SECRET=your-random-secret-string-here
NEXTAUTH_URL=http://localhost:3000
\`\`\`

### 4. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

### 5. Open PennyCam
Navigate to: http://localhost:3000

## 📁 Project Structure
\`\`\`
c:\users\ashley\pennycam-production\
├── app/                    # Next.js 14 App Router pages
│   ├── page.tsx           # Home page
│   ├── base-station/      # Base station camera setup
│   ├── remote-viewer/     # Remote viewing interface
│   ├── account/           # Family & account management
│   ├── billing/           # Stripe subscription billing
│   ├── integrations/      # Smart home integrations
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── app-header.tsx    # PennyCam header with Penny's photo
│   ├── treat-dispenser.tsx # Treat dispenser with audio
│   └── stripe-checkout-button.tsx
├── lib/                  # Utility functions
│   ├── utils.ts         # General utilities
│   ├── stripe.ts        # Stripe configuration
│   └── audio-manager.ts # Audio management for MP3s
├── public/              # Static assets
│   ├── sounds/          # Your MP3 audio files
│   │   ├── treat-dispense.mp3
│   │   ├── penny-meow.mp3
│   │   └── pspspsp.mp3
│   ├── penny-icon.jpg   # Penny's photo
│   └── favicon.ico
└── .env.local          # Environment variables (create this)
\`\`\`

## 🎵 Audio Features
- **Treat Dispenser**: Plays treat-dispense.mp3 when giving treats
- **Cat Calling**: Plays pspspsp.mp3 for "pspspsps" sounds
- **Meow Sounds**: Plays penny-meow.mp3 for cat responses
- **Fallback Audio**: Synthetic sounds if MP3s fail to load

## 🔧 Testing Checklist
- [ ] MP3 files load successfully (check browser console)
- [ ] Treat dispenser plays audio when dispensing
- [ ] "Pspspsps" button plays cat-calling sound
- [ ] Meow button plays Penny's meow
- [ ] Camera streaming works on base station
- [ ] Remote viewer connects successfully
- [ ] Stripe test payments work

## 🚀 Deployment
When ready for production:
\`\`\`bash
npm run build
npm start
\`\`\`

Or deploy to Vercel:
\`\`\`bash
npm install -g vercel
vercel
\`\`\`

## 🐛 Troubleshooting

### Audio Not Playing
1. Check browser console for loading errors
2. Verify MP3 files are in `public/sounds/`
3. Test direct URLs: `http://localhost:3000https://hebbkx1anhila5yf.public.blob.vercel-storage.com/treat-dispense-xDJYPtEyBPzGBX74ljS8Ny6iFdA6Rc.mp3`
4. Click "🎵 Audio" button in treat dispenser to see status

### Camera Not Working
1. Allow camera permissions in browser
2. Check HTTPS requirement for production
3. Test on different browsers/devices

### Stripe Issues
1. Verify API keys in `.env.local`
2. Test with Stripe test cards
3. Check webhook configuration for production
\`\`\`

```plaintext file=".env.local.template"
# PennyCam Production Environment Variables
# Copy this file to .env.local and fill in your actual values

# Stripe Configuration (Test Mode)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
NEXTAUTH_SECRET=your-random-secret-string-here
NEXTAUTH_URL=http://localhost:3000

# Optional: Database (if you add one later)
# DATABASE_URL=postgresql://user:password@localhost:5432/pennycam

# Optional: Email Service (for notifications)
# SMTP_HOST=smtp.gmail.com
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# Production URLs (update when deploying)
# NEXTAUTH_URL=https://your-domain.vercel.app
