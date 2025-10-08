# Firestore Connection Troubleshooting Guide

## Issue: Firestore Database Not Connected

### Step 1: Install Firebase CLI
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init firestore
```

### Step 2: Check Firebase Project Status
```bash
# List your Firebase projects
firebase projects:list

# Check current project
firebase use --add

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

### Step 3: Verify Firebase Configuration

#### Check if Firebase project exists:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Look for project: `real-estate-5b606`
3. If project doesn't exist, create a new one

#### Update Firebase Config (if needed):
```javascript
// Update src/firebase.js and admin-panel/src/firebase.js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 4: Test Firestore Connection

#### Create a test script:
```javascript
// test-firestore.js
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './src/firebase.js';

async function testConnection() {
  try {
    console.log('Testing Firestore connection...');
    
    // Test reading from properties collection
    const propertiesRef = collection(db, 'properties');
    const snapshot = await getDocs(propertiesRef);
    
    console.log('✅ Firestore connection successful!');
    console.log(`Found ${snapshot.size} properties`);
    
    return true;
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    return false;
  }
}

testConnection();
```

### Step 5: Common Issues and Solutions

#### Issue 1: "Firebase project not found"
**Solution:**
1. Create a new Firebase project
2. Update the configuration in both firebase.js files
3. Redeploy the application

#### Issue 2: "Permission denied"
**Solution:**
1. Deploy Firestore rules:
```bash
firebase deploy --only firestore:rules
```

2. Check rules in Firebase Console:
   - Go to Firestore Database
   - Click on "Rules" tab
   - Ensure rules allow read/write access

#### Issue 3: "Network error"
**Solution:**
1. Check internet connection
2. Verify Firebase project is active
3. Check if Firestore is enabled in Firebase Console

#### Issue 4: "Invalid configuration"
**Solution:**
1. Verify all config values are correct
2. Check if project ID matches Firebase Console
3. Ensure API key is valid

### Step 6: Manual Setup (Alternative)

If Firebase CLI is not available:

#### 1. Create Firebase Project:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "real-estate-app"
4. Enable Google Analytics (optional)
5. Create project

#### 2. Enable Firestore:
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database

#### 3. Get Configuration:
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web app" icon
4. Register app with a nickname
5. Copy the configuration object

#### 4. Update Configuration Files:
Replace the configuration in both:
- `src/firebase.js`
- `admin-panel/src/firebase.js`

### Step 7: Test the Connection

#### Run the test script:
```bash
node test-firestore.js
```

#### Expected output:
```
Testing Firestore connection...
✅ Firestore connection successful!
Found 0 properties
```

### Step 8: Deploy Firestore Rules

#### Create firestore.rules file:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /properties/{document} {
      allow read, write: if true;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

#### Deploy rules:
```bash
firebase deploy --only firestore:rules
```

### Step 9: Verify Everything Works

#### Test adding a property:
1. Open admin panel
2. Click "Add New Property"
3. Fill in the form
4. Click "Save Property"
5. Check browser console for success message

#### Test viewing properties:
1. Click "View All Properties"
2. Verify properties load from Firestore
3. Check browser console for any errors

### Step 10: Debug Common Errors

#### Error: "Firebase: Error (auth/network-request-failed)"
- Check internet connection
- Verify Firebase project is active
- Check if Firestore is enabled

#### Error: "Firebase: Error (firestore/permission-denied)"
- Deploy Firestore rules
- Check rules in Firebase Console
- Ensure rules allow read/write access

#### Error: "Firebase: Error (firestore/unavailable)"
- Check if Firestore is enabled in Firebase Console
- Verify project configuration
- Check network connectivity

### Step 11: Alternative Setup (Quick Fix)

If you want to get started quickly:

#### 1. Create a new Firebase project:
- Go to Firebase Console
- Create project: "real-estate-app"
- Enable Firestore in test mode

#### 2. Update configuration:
Replace the firebaseConfig in both files with your new project's config

#### 3. Test the connection:
Run the test script to verify connection

### Step 12: Production Setup

For production deployment:

#### 1. Update Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /properties/{document} {
      allow read: if true;
      allow write: if request.auth != null; // Require authentication
    }
  }
}
```

#### 2. Enable Authentication:
- Go to Firebase Console
- Enable Authentication
- Set up sign-in methods

#### 3. Deploy to production:
```bash
firebase deploy
```

## Quick Start Commands

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Test connection
node test-firestore.js
```

## Need Help?

If you're still having issues:
1. Check the browser console for specific error messages
2. Verify your Firebase project is active
3. Ensure Firestore is enabled in Firebase Console
4. Test with a simple Firestore operation first




