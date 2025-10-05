# 🚀 Manual Deployment Steps

## ⚠️ Important: Firebase Login Required

The Firebase CLI requires interactive authentication. You need to run these commands manually in your terminal:

## Step 1: Firebase Login (Run in Terminal)

```bash
npx firebase-tools login
```

**What happens:**
1. Opens your browser
2. Asks you to login to Google account
3. Grants Firebase CLI permissions
4. Returns to terminal when complete

## Step 2: Initialize Main Website

```bash
cd /Users/bhuvanaa/Documents/my-react-app
npx firebase-tools init
```

**Select these options:**
- ✅ Use existing project: `real-estate-5b606`
- ✅ Hosting: Configure files for Firebase Hosting
- ✅ Public directory: `build`
- ✅ Single-page app: `Yes`
- ✅ Overwrite index.html: `No`

## Step 3: Deploy Main Website

```bash
npm run build
npx firebase-tools deploy --only hosting
```

## Step 4: Initialize Admin Panel

```bash
cd firebase-admin
npx firebase-tools init
```

**Select these options:**
- ✅ Use existing project: `real-estate-5b606`
- ✅ Hosting: Configure files for Firebase Hosting
- ✅ Public directory: `build`
- ✅ Single-page app: `Yes`
- ✅ Overwrite index.html: `No`

## Step 5: Deploy Admin Panel

```bash
npm run build
npx firebase-tools deploy --only hosting
```

## 🎉 After Deployment

Your applications will be live at:
- **Main Website:** `https://real-estate-5b606.web.app`
- **Admin Panel:** `https://real-estate-5b606.web.app`
- **Admin Login:** admin@realestate.com / admin123

## 🚀 Quick Commands to Copy-Paste

```bash
# 1. Login to Firebase
npx firebase-tools login

# 2. Main website
cd /Users/bhuvanaa/Documents/my-react-app
npx firebase-tools init
npm run build
npx firebase-tools deploy --only hosting

# 3. Admin panel
cd firebase-admin
npx firebase-tools init
npm run build
npx firebase-tools deploy --only hosting
```

## 🔧 Alternative: Use Deployment Script

If you prefer, you can also run:

```bash
cd /Users/bhuvanaa/Documents/my-react-app
./deploy-now.sh
```

This script will guide you through each step!
