# 🎯 Firebase Terminal Options Guide

## Step 1: Firebase Login
```bash
npx firebase-tools login
```

**What happens:**
- Opens your browser automatically
- Login with your Google account
- Grant permissions to Firebase CLI
- Return to terminal when complete

## Step 2: Initialize Main Website
```bash
cd /Users/bhuvanaa/Documents/my-react-app
npx firebase-tools init
```

**Select these options in order:**

1. **"Which Firebase features do you want to set up for this directory?"**
   - ✅ **Hosting: Configure files for Firebase Hosting**
   - Press **Space** to select, then **Enter**

2. **"Please select an option:"**
   - ✅ **Use an existing project**
   - Press **Enter**

3. **"Select a default Firebase project for this directory:"**
   - ✅ **real-estate-5b606**
   - Press **Enter**

4. **"What do you want to use as your public directory?"**
   - Type: **build**
   - Press **Enter**

5. **"Configure as a single-page app (rewrite all urls to /index.html)?"**
   - ✅ **Yes**
   - Press **Enter**

6. **"Set up automatic builds and deploys with GitHub?"**
   - ✅ **No**
   - Press **Enter**

7. **"File build/index.html already exists. Overwrite?"**
   - ✅ **No**
   - Press **Enter**

## Step 3: Deploy Main Website
```bash
npx firebase-tools deploy --only hosting
```

**Select:**
- **"What do you want to deploy?"**
  - ✅ **Hosting**
  - Press **Enter**

## Step 4: Initialize Admin Panel
```bash
cd firebase-admin
npx firebase-tools init
```

**Select these options in order:**

1. **"Which Firebase features do you want to set up for this directory?"**
   - ✅ **Hosting: Configure files for Firebase Hosting**
   - Press **Space** to select, then **Enter**

2. **"Please select an option:"**
   - ✅ **Use an existing project**
   - Press **Enter**

3. **"Select a default Firebase project for this directory:"**
   - ✅ **real-estate-5b606**
   - Press **Enter**

4. **"What do you want to use as your public directory?"**
   - Type: **build**
   - Press **Enter**

5. **"Configure as a single-page app (rewrite all urls to /index.html)?"**
   - ✅ **Yes**
   - Press **Enter**

6. **"Set up automatic builds and deploys with GitHub?"**
   - ✅ **No**
   - Press **Enter**

7. **"File build/index.html already exists. Overwrite?"**
   - ✅ **No**
   - Press **Enter**

## Step 5: Deploy Admin Panel
```bash
npx firebase-tools deploy --only hosting
```

**Select:**
- **"What do you want to deploy?"**
  - ✅ **Hosting**
  - Press **Enter**

## 🎉 After Deployment

Your applications will be live at:
- **Main Website:** `https://real-estate-5b606.web.app`
- **Admin Panel:** `https://real-estate-5b606.web.app`
- **Admin Login:** admin@realestate.com / admin123

## 📝 Quick Reference

**Key selections to remember:**
- ✅ **Use an existing project**
- ✅ **real-estate-5b606** (your project)
- ✅ **build** (public directory)
- ✅ **Yes** (single-page app)
- ✅ **No** (GitHub integration)
- ✅ **No** (overwrite index.html)
- ✅ **Hosting** (deploy option)

## 🚀 Ready to Deploy!

Follow these exact selections and your real estate website will be live! 🌟
