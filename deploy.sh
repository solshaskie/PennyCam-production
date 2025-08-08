#!/bin/bash

echo "🚀 PennyCam Deployment Script"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git branch -M main
fi

# Add all files
echo "📦 Adding files to Git..."
git add .

# Commit changes
echo "💾 Committing changes..."
read -p "Enter commit message (or press Enter for default): " commit_message
if [ -z "$commit_message" ]; then
    commit_message="Deploy PennyCam with all features"
fi
git commit -m "$commit_message"

# Check if remote exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Setting up GitHub remote..."
    read -p "Enter your GitHub repository URL (e.g., https://github.com/username/pennycam.git): " repo_url
    git remote add origin "$repo_url"
fi

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
if command -v vercel &> /dev/null; then
    vercel --prod
else
    echo "⚠️ Vercel CLI not found. Installing..."
    npm install -g vercel
    vercel --prod
fi

echo "✅ Deployment complete!"
echo ""
echo "🎉 Your PennyCam app should now be live!"
echo "📱 Check your Vercel dashboard for the live URL"
echo "🔧 Don't forget to add your environment variables in Vercel dashboard"
