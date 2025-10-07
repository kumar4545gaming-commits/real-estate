import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign up function
  const signup = async (email, password, adminData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create admin document in Firestore
      await setDoc(doc(db, 'admins', user.uid), {
        ...adminData,
        role: 'admin',
        isActive: true,
        createdAt: new Date()
      });
      
      return userCredential;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Sign in function
  const signin = async (email, password) => {
    try {
      setError(null);
      console.log('Attempting to sign in with:', email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful:', result.user);
      return { success: true, user: result.user };
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  // Sign out function
  const logout = () => {
    return signOut(auth);
  };

  // Check if user is admin
  const isAdmin = async (user) => {
    if (!user) return false;
    
    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      return adminDoc.exists() && adminDoc.data().isActive;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // For now, allow any authenticated user to access the dashboard
        // You can add admin checks later if needed
        setCurrentUser(user);
        setAdminData({
          name: user.displayName || 'Admin User',
          email: user.email,
          role: 'admin'
        });
      } else {
        setCurrentUser(null);
        setAdminData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    currentUser,
    adminData,
    signup,
    signin,
    logout,
    isAdmin,
    loading,
    error,
    isAuthenticated: !!currentUser,
    clearError,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
