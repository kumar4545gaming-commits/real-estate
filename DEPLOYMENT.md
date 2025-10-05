# 🚀 Firebase Deployment Guide

## Prerequisites

✅ Firebase CLI installed (using npx)
✅ Firebase project created: `real-estate-5b606`
✅ Both applications built and tested locally

## 🎯 Deployment Steps

### 1. Login to Firebase

```bash
npx firebase-tools login
```

### 2. Initialize Firebase in Main Website

```bash
cd /Users/bhuvanaa/Documents/my-react-app
npx firebase-tools init
```

**Select:**
- ✅ Use existing project: `real-estate-5b606`
- ✅ Hosting: Configure files for Firebase Hosting
- ✅ Public directory: `build`
- ✅ Single-page app: `Yes`
- ✅ Overwrite index.html: `No`

### 3. Initialize Firebase in Admin Panel

```bash
cd /Users/bhuvanaa/Documents/my-react-app/firebase-admin
npx firebase-tools init
```

**Select:**
- ✅ Use existing project: `real-estate-5b606`
- ✅ Hosting: Configure files for Firebase Hosting
- ✅ Public directory: `build`
- ✅ Single-page app: `Yes`
- ✅ Overwrite index.html: `No`

### 4. Deploy Main Website

```bash
cd /Users/bhuvanaa/Documents/my-react-app

# Build the project
npm run build

# Deploy to Firebase
npx firebase-tools deploy --only hosting
```

**Your main website will be live at:**
- 🔗 **URL:** `https://real-estate-5b606.web.app`
- 🌐 **Custom Domain:** Can be configured in Firebase Console

### 5. Deploy Admin Panel

```bash
cd /Users/bhuvanaa/Documents/my-react-app/firebase-admin

# Build the project
npm run build

# Deploy to Firebase
npx firebase-tools deploy --only hosting
```

**Your admin panel will be live at:**
- 🔗 **URL:** `https://real-estate-5b606.web.app` (same domain, different path)
- 🔐 **Login:** admin@realestate.com / admin123

## 🔧 Alternative: Use Deployment Scripts

### Quick Deploy Main Website
```bash
cd /Users/bhuvanaa/Documents/my-react-app
./deploy.sh
```

### Quick Deploy Admin Panel
```bash
cd /Users/bhuvanaa/Documents/my-react-app/firebase-admin
./deploy.sh
```

## 🌐 Firebase Console Configuration

### 1. Set Up Custom Domains (Optional)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `real-estate-5b606`
3. Go to **Hosting** section
4. Click **Add custom domain**
5. Follow the verification process

### 2. Configure Multiple Sites (Recommended)

For better organization, you can create separate hosting sites:

```bash
# Create separate hosting sites
npx firebase-tools hosting:sites:create main-website
npx firebase-tools hosting:sites:create admin-panel
```

## 📱 Production URLs

After deployment, your applications will be available at:

### Main Website
- **URL:** `https://real-estate-5b606.web.app`
- **Features:** Property listings, search, real-time updates

### Admin Panel
- **URL:** `https://real-estate-5b606.web.app/admin` (if using subdirectory)
- **Login:** admin@realestate.com / admin123
- **Features:** Property management, analytics, user management

## 🔄 Continuous Deployment

### Automatic Deployments with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Build
      run: npm run build
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        channelId: live
        projectId: real-estate-5b606
```

## 🛠️ Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Firebase Login Issues**
   ```bash
   npx firebase-tools logout
   npx firebase-tools login
   ```

3. **Deployment Fails**
   ```bash
   # Check Firebase project
   npx firebase-tools projects:list
   
   # Use correct project
   npx firebase-tools use real-estate-5b606
   ```

### Environment Variables

For production, set these environment variables:

```bash
# In Firebase Console > Project Settings > General
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=real-estate-5b606.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=real-estate-5b606
REACT_APP_FIREBASE_STORAGE_BUCKET=real-estate-5b606.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=87544104037
REACT_APP_FIREBASE_APP_ID=1:87544104037:web:89a2c6543c14a8eac0b28c
```

## 🎉 Success!

Once deployed, you'll have:

- ✅ **Main Website** - Live with real-time property updates
- ✅ **Admin Panel** - Secure property management
- ✅ **Firebase Backend** - Scalable database and authentication
- ✅ **CDN** - Fast global content delivery
- ✅ **SSL** - Secure HTTPS connections
- ✅ **Analytics** - Built-in performance monitoring

Your real estate website is now live and ready for production! 🚀
