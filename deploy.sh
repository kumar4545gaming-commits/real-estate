#!/bin/bash

# Deploy Main Website to Firebase Hosting
echo "🚀 Deploying Main Website to Firebase Hosting..."

# Build the project
echo "📦 Building main website..."
npm run build

# Deploy to Firebase
echo "🌐 Deploying to Firebase..."
npx firebase-tools deploy --only hosting

echo "✅ Main website deployed successfully!"
echo "🔗 Your website is now live at: https://real-estate-5b606.web.app"
