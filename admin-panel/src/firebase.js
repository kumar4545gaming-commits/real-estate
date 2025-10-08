import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCq1LY1j9QEU2dPIaFFzu3zU6VwaZVuraI",
  authDomain: "real-estate-5b606.firebaseapp.com",
  projectId: "real-estate-5b606",
  storageBucket: "real-estate-5b606.firebasestorage.app",
  messagingSenderId: "87544104037",
  appId: "1:87544104037:web:89a2c6543c14a8eac0b28c",
  measurementId: "G-1F48MC8DY1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;














