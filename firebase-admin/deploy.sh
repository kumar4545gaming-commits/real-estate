#!/bin/bash

# Deploy Admin Panel to Firebase Hosting
echo "🚀 Deploying Admin Panel to Firebase Hosting..."

# Build the project
echo "📦 Building admin panel..."
npm run build

# Deploy to Firebase
echo "🌐 Deploying to Firebase..."
npx firebase-tools deploy --only hosting

echo "✅ Admin panel deployed successfully!"
echo "🔗 Your admin panel is now live at: https://real-estate-5b606.web.app"
echo "🔐 Login with: admin@realestate.com / admin123"
