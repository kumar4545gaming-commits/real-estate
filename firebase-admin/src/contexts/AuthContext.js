import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
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

  // Sign up function
  const signup = async (email, password, adminData) => {
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
  };

  // Sign in function
  const signin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
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

  // Get admin data
  const getAdminData = async (user) => {
    if (!user) return null;
    
    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      if (adminDoc.exists()) {
        return adminDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting admin data:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isUserAdmin = await isAdmin(user);
        if (isUserAdmin) {
          const adminInfo = await getAdminData(user);
          setCurrentUser(user);
          setAdminData(adminInfo);
        } else {
          setCurrentUser(null);
          setAdminData(null);
          await logout();
        }
      } else {
        setCurrentUser(null);
        setAdminData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    adminData,
    signup,
    signin,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
