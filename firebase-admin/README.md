# Firebase Admin Panel - Real Estate Management

A modern, Firebase-powered admin panel for managing your real estate website with real-time updates, authentication, and property management.

## 🔥 Firebase Features

- **Real-time Database** - Instant updates across all devices
- **Authentication** - Secure admin login with Firebase Auth
- **File Storage** - Property image uploads to Firebase Storage
- **Hosting** - Deploy both admin panel and main site
- **Security Rules** - Granular access control

## 🚀 Quick Start

### 1. Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication, Firestore, and Storage

2. **Get Firebase Config**
   - Go to Project Settings > General
   - Add a web app and copy the config

3. **Update Configuration**
   ```javascript
   // src/firebase.js
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

### 2. Install Dependencies

```bash
cd firebase-admin
npm install
```

### 3. Start Development

```bash
npm start
```

### 4. Access Admin Panel

- **URL:** http://localhost:3000
- **Login:** Create admin account or use demo credentials

## 🛠️ Firebase Configuration

### Authentication Setup

1. **Enable Email/Password Authentication**
   - Go to Authentication > Sign-in method
   - Enable Email/Password provider

2. **Create Admin User**
   ```javascript
   // In Firebase Console or programmatically
   // Email: admin@example.com
   // Password: admin123
   ```

### Firestore Database Structure

```javascript
// Collections:
admins/
  - {uid}/
    - name: "Admin Name"
    - email: "admin@example.com"
    - role: "admin" | "super-admin"
    - isActive: true
    - createdAt: timestamp

properties/
  - {propertyId}/
    - title: "Property Title"
    - description: "Property Description"
    - price: 5000000
    - location: {
        address: "Full Address"
        city: "City"
        state: "State"
        pincode: "123456"
      }
    - propertyType: "apartment" | "villa" | "plot" | "commercial"
    - status: "ongoing" | "pre-launch" | "ready-to-move" | "sold"
    - bedrooms: 3
    - bathrooms: 2
    - area: 1200
    - images: [
        {url: "image-url", alt: "alt-text", isPrimary: true}
      ]
    - amenities: ["Swimming Pool", "Gym", "Parking"]
    - isFeatured: true
    - isActive: true
    - createdBy: "admin-uid"
    - createdAt: timestamp
    - updatedAt: timestamp
```

### Security Rules

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin rules
    match /admins/{adminId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == adminId;
    }
    
    // Property rules
    match /properties/{propertyId} {
      allow read: if true; // Public read for main site
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
  }
}
```

## 🔗 Connecting to Main Site

### 1. Shared Firebase Project

Both your main site and admin panel use the same Firebase project:

```javascript
// In your main site
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### 2. Real-time Property Updates

```javascript
// In your main site - listen for property changes
import { collection, onSnapshot } from 'firebase/firestore';

const propertiesRef = collection(db, 'properties');
const unsubscribe = onSnapshot(propertiesRef, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added') {
      // New property added
    }
    if (change.type === 'modified') {
      // Property updated
    }
    if (change.type === 'removed') {
      // Property deleted
    }
  });
});
```

### 3. API Integration

```javascript
// Example: Get properties for main site
import { collection, getDocs, query, where } from 'firebase/firestore';

const getFeaturedProperties = async () => {
  const q = query(
    collection(db, 'properties'),
    where('isFeatured', '==', true),
    where('isActive', '==', true)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
```

## 📱 Features

### Admin Panel
- ✅ **Dashboard** - Statistics and overview
- ✅ **Property Management** - Add, edit, delete properties
- ✅ **Image Upload** - Firebase Storage integration
- ✅ **Real-time Updates** - Instant sync across devices
- ✅ **Authentication** - Secure admin login
- ✅ **Responsive Design** - Mobile-friendly interface

### Main Site Integration
- ✅ **Real-time Property Listings** - Auto-update when admin changes
- ✅ **Image Optimization** - Firebase Storage CDN
- ✅ **Search & Filter** - Query Firestore directly
- ✅ **Performance** - Fast loading with Firebase

## 🚀 Deployment

### 1. Build for Production

```bash
npm run build
```

### 2. Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Deploy
firebase deploy
```

### 3. Environment Variables

```bash
# For production
REACT_APP_FIREBASE_API_KEY=your-production-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## 🔧 Customization

### Adding New Features

1. **New Pages** - Add components in `src/pages/`
2. **New Collections** - Add to Firestore and create contexts
3. **New Auth Roles** - Update security rules and auth context
4. **Styling** - Modify `src/App.css` and use Tailwind classes

### Database Schema

```javascript
// Example: Adding user management
users/
  - {uid}/
    - name: "User Name"
    - email: "user@example.com"
    - phone: "+1234567890"
    - preferences: {...}
    - createdAt: timestamp

// Example: Adding inquiries
inquiries/
  - {inquiryId}/
    - propertyId: "property-id"
    - userId: "user-id"
    - message: "Inquiry message"
    - status: "pending" | "responded" | "closed"
    - createdAt: timestamp
```

## 🛡️ Security

### Authentication
- Firebase Auth handles all authentication
- JWT tokens for secure API calls
- Role-based access control

### Database Security
- Firestore security rules
- Admin-only write access
- Public read for properties

### File Storage
- Firebase Storage security rules
- Image optimization and CDN
- Secure file uploads

## 📊 Analytics

### Firebase Analytics
- User behavior tracking
- Property view analytics
- Admin panel usage stats

### Performance Monitoring
- Real-time performance metrics
- Error tracking and reporting
- Database query optimization

## 🆘 Troubleshooting

### Common Issues

1. **Firebase Config Error**
   - Check your Firebase configuration
   - Ensure all required services are enabled

2. **Authentication Issues**
   - Verify Firebase Auth is enabled
   - Check security rules

3. **Database Connection**
   - Verify Firestore is enabled
   - Check security rules

4. **File Upload Issues**
   - Verify Storage is enabled
   - Check storage security rules

### Support

- Check Firebase Console for errors
- Review browser console for client-side issues
- Verify all environment variables are set

## 🎯 Next Steps

1. **Set up Firebase project** with proper configuration
2. **Configure authentication** for both sites
3. **Deploy to Firebase Hosting** for production
4. **Add more features** like user management, analytics
5. **Optimize performance** with Firebase CDN and caching

Your Firebase-powered admin panel is now ready to manage your real estate website with real-time updates and secure authentication!
