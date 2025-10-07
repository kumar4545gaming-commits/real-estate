# Manual Firestore Setup Guide

Since Firebase CLI installation requires permissions, here's a manual setup guide to get your Firestore database connected.

## Step 1: Verify Firebase Project

### Check if your Firebase project exists:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Look for project: `real-estate-5b606`
3. If it doesn't exist, create a new one

### Create new Firebase project (if needed):
1. Click "Create a project"
2. Enter project name: "real-estate-app"
3. Enable Google Analytics (optional)
4. Create project

## Step 2: Enable Firestore Database

### In Firebase Console:
1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database (choose closest to your users)
5. Click "Done"

## Step 3: Get Firebase Configuration

### Get your project's configuration:
1. In Firebase Console, click the gear icon (Settings)
2. Scroll down to "Your apps"
3. Click the web app icon (`</>`)
4. Register app with nickname: "real-estate-web"
5. Copy the configuration object

### Update your configuration files:
Replace the configuration in both:
- `src/firebase.js`
- `admin-panel/src/firebase.js`

Example configuration:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Set Up Firestore Rules

### In Firebase Console:
1. Go to "Firestore Database"
2. Click on "Rules" tab
3. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read and write access to properties collection
    match /properties/{document} {
      allow read, write: if true;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. Click "Publish"

## Step 5: Test the Connection

### Open the test file:
1. Open `test-firestore-connection.html` in your browser
2. Click "Test Connection" button
3. Check the results in the log

### Expected results:
- ✅ Firestore connection successful!
- Found 0 properties in database

## Step 6: Test Your Application

### Test the admin panel:
1. Start your React app: `npm start`
2. Go to admin panel
3. Click "Add New Property"
4. Fill in the form and save
5. Check browser console for success message

### Test the public site:
1. Go to the main Properties page
2. Verify properties load from Firestore
3. Check browser console for any errors

## Step 7: Troubleshooting

### Common Issues:

#### 1. "Permission denied" error:
- Check Firestore rules in Firebase Console
- Ensure rules allow read/write access to properties collection
- Publish the rules after making changes

#### 2. "Network error" or "Connection failed":
- Check internet connection
- Verify Firebase project is active
- Check if Firestore is enabled in Firebase Console

#### 3. "Invalid configuration" error:
- Verify all config values are correct
- Check if project ID matches Firebase Console
- Ensure API key is valid

#### 4. Properties not appearing:
- Check browser console for errors
- Verify Firestore rules are published
- Test with the HTML test file first

### Debug Steps:
1. Open browser console (F12)
2. Look for Firebase-related errors
3. Check network tab for failed requests
4. Test with the HTML test file

## Step 8: Alternative Setup (Quick Start)

If you want to get started quickly with a new project:

### 1. Create new Firebase project:
- Go to Firebase Console
- Create project: "real-estate-app"
- Enable Firestore in test mode

### 2. Get configuration:
- Copy the web app configuration
- Update both firebase.js files

### 3. Set up rules:
- Go to Firestore Database → Rules
- Use the rules provided above
- Publish the rules

### 4. Test:
- Open test-firestore-connection.html
- Test connection and write operations
- Verify everything works

## Step 9: Production Considerations

### For production deployment:
1. Update Firestore rules to require authentication
2. Set up Firebase Authentication
3. Implement proper security rules
4. Test thoroughly before going live

### Security rules for production:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /properties/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Quick Test Commands

### Test your setup:
```bash
# Open the test file in browser
open test-firestore-connection.html

# Or start your React app
npm start
```

### Check Firebase Console:
1. Go to https://console.firebase.google.com/
2. Select your project
3. Go to Firestore Database
4. Check if data appears when you add properties

## Need Help?

If you're still having issues:
1. Check the browser console for specific error messages
2. Verify your Firebase project is active
3. Ensure Firestore is enabled in Firebase Console
4. Test with the HTML test file first
5. Make sure Firestore rules are published

The most common issue is that Firestore rules are not properly configured or published. Make sure to:
1. Set up the rules in Firebase Console
2. Click "Publish" to deploy the rules
3. Test the connection with the HTML test file

