#!/bin/bash

echo "🚀 Deploying Firebase Storage Rules..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "   npm install -g firebase-tools"
    echo "   firebase login"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please run:"
    echo "   firebase login"
    exit 1
fi

# Deploy storage rules
echo "📤 Deploying storage rules..."
firebase deploy --only storage

if [ $? -eq 0 ]; then
    echo "✅ Storage rules deployed successfully!"
    echo "🔗 You can now test image uploads in your admin panel."
else
    echo "❌ Failed to deploy storage rules."
    echo "💡 Try running: firebase deploy --only storage"
fi

