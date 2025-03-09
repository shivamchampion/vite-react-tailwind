import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase/config'; // Correct import path

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  
  // Clear any auth errors
  const clearAuthError = () => setAuthError(null);
  
  // Sign in with email and password
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      setAuthError(error.message);
      throw error;
    }
  };
  
  // Create a new user with email and password
  const register = async (email, password, displayName) => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email,
        displayName,
        createdAt: new Date(),
        plan: "Basic", // Default plan
        completedProfile: false
      });
      
      return userCredential.user;
    } catch (error) {
      console.error("Registration error:", error);
      setAuthError(error.message);
      throw error;
    }
  };
  
  // Sign out
  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      setAuthError(error.message);
      throw error;
    }
  };
  
  // Reset password
  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset error:", error);
      setAuthError(error.message);
      throw error;
    }
  };
  
  // Fetch user profile data from Firestore
  const fetchUserProfile = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUserProfile(userDoc.data());
      } else {
        console.log("No user profile found for:", uid);
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
    }
  };
  
  // Listen for auth state changes
  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? user.email : "No user");
      setCurrentUser(user);
      
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);
  
  // Context value
  const value = {
    currentUser,
    userProfile,
    isAuthenticated: !!currentUser,
    loading,
    authError,
    clearAuthError,
    login,
    register,
    logout,
    resetPassword,
    fetchUserProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;