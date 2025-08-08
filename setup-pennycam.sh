#!/bin/bash

echo "🚀 Setting up PennyCam project..."

# Create project directory
mkdir -p pennycam
cd pennycam

# Initialize Node.js project
npm init -y

echo "📦 Installing dependencies..."

# Install main dependencies
npm install next@14.0.0 react react-dom typescript @types/node @types/react @types/react-dom

# Install UI dependencies  
npm install @radix-ui/react-switch @radix-ui/react-dropdown-menu @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react stripe

# Install dev dependencies
npm install -D tailwindcss postcss autoprefixer eslint eslint-config-next

# Initialize Tailwind
npx tailwindcss init -p

echo "📁 Creating folder structure..."

# Create folder structure
mkdir -p app/{auth,account,billing,integrations,base-station,remote-viewer,api/{create-checkout,webhooks/stripe}}
mkdir -p components/ui
mkdir -p lib
mkdir -p public

echo "✅ Project structure created!"
echo "📝 Next steps:"
echo "1. Copy files from v0 code blocks into the folders"
echo "2. Create .env.local with your Stripe keys"
echo "3. Run 'npm run dev' to start development"

# Create basic package.json scripts
npm pkg set scripts.dev="next dev"
npm pkg set scripts.build="next build" 
npm pkg set scripts.start="next start"
npm pkg set scripts.lint="next lint"

echo "🎉 PennyCam setup complete!"
