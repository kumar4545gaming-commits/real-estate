#!/bin/bash

echo "🚀 Starting Firebase Deployment Process..."
echo ""

# Check if Firebase CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js first."
    exit 1
fi

echo "📋 Step 1: Firebase Login"
echo "You need to run: npx firebase-tools login"
echo "This will open your browser for authentication."
echo ""
read -p "Press Enter after you've completed the Firebase login..."

echo ""
echo "📦 Step 2: Building Main Website..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Main website built successfully!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo ""
echo "🌐 Step 3: Deploying Main Website..."
npx firebase-tools deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Main website deployed successfully!"
    echo "🔗 Your website is live at: https://real-estate-5b606.web.app"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi

echo ""
echo "📦 Step 4: Building Admin Panel..."
cd firebase-admin
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Admin panel built successfully!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

echo ""
echo "🌐 Step 5: Deploying Admin Panel..."
npx firebase-tools deploy --only hosting

if [ $? -eq 0 ]; then
    echo "✅ Admin panel deployed successfully!"
    echo "🔗 Your admin panel is live at: https://real-estate-5b606.web.app"
    echo "🔐 Login with: admin@realestate.com / admin123"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi

echo ""
echo "🎉 Deployment Complete!"
echo "📱 Main Website: https://real-estate-5b606.web.app"
echo "🔧 Admin Panel: https://real-estate-5b606.web.app"
echo "🔐 Admin Login: admin@realestate.com / admin123"
