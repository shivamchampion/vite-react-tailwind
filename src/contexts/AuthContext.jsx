import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase/config';
import { 
  registerWithEmailPassword,
  loginWithEmailPassword,
  loginWithGoogle,
  loginWithFacebook,
  loginWithLinkedIn,
  sendPhoneOTP,
  verifyPhoneOTP,
  sendWhatsAppLoginOTP,
  verifyWhatsAppOTP,
  logout,
  resetPassword,
  updateUserProfile
} from '../services/firebase/auth';

// Create the auth context
export const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear error helper
  const clearError = () => setError(null);

  const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return null;
    
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        const { displayName, email, photoURL, phoneNumber } = user;
        const createdAt = new Date();
        
        const userData = {
          uid: user.uid,
          displayName: displayName || '',
          email: email || '',
          photoURL: photoURL || '',
          phoneNumber: phoneNumber || '',
          createdAt,
          updatedAt: createdAt,
          role: 'user',
          listings: [], // Changed from entities to listings
          connectsBalance: 15, // Default connects balance
          ...additionalData
        };
        
        await setDoc(userRef, userData);
        return userData;
      }
      
      return userDoc.data();
    } catch (error) {
      console.error('Error creating user document:', error);
      return null;
    }
  };

  // Effect to listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get extended user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          } else {
            // USER DOCUMENT NOT FOUND - Create it
            console.warn('User document not found in Firestore. Creating one...');
            const newUserData = await createUserDocument(user);
            setUserProfile(newUserData);
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });
  
    // Cleanup subscription
    return unsubscribe;
  }, []);
  // Register with email and password
  const register = async (email, password, displayName) => {
    clearError();
    setLoading(true);
    try {
      const user = await registerWithEmailPassword(email, password, displayName);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    clearError();
    setLoading(true);
    try {
      const user = await loginWithEmailPassword(email, password);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login with Google
  const loginGoogle = async () => {
    clearError();
    setLoading(true);
    try {
      const user = await loginWithGoogle();
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login with Facebook
  const loginFacebook = async () => {
    clearError();
    setLoading(true);
    try {
      const user = await loginWithFacebook();
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login with LinkedIn
  const loginLinkedIn = async (accessToken) => {
    clearError();
    setLoading(true);
    try {
      const user = await loginWithLinkedIn(accessToken);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Send Phone OTP
  const sendOtp = async (phoneNumber, containerId) => {
    clearError();
    setLoading(true);
    try {
      const result = await sendPhoneOTP(phoneNumber, containerId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify Phone OTP
  const verifyOtp = async (code) => {
    clearError();
    setLoading(true);
    try {
      const user = await verifyPhoneOTP(code);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Send WhatsApp OTP
  const sendWhatsAppOtp = async (phoneNumber) => {
    clearError();
    setLoading(true);
    try {
      const result = await sendWhatsAppLoginOTP(phoneNumber);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify WhatsApp OTP
  const verifyWhatsAppOtp = async (phoneNumber, otp) => {
    clearError();
    setLoading(true);
    try {
      const result = await verifyWhatsAppOTP(phoneNumber, otp);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const signout = async () => {
    clearError();
    try {
      await logout();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Reset password
  const passwordReset = async (email) => {
    clearError();
    setLoading(true);
    try {
      await resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (data) => {
    clearError();
    setLoading(true);
    try {
      await updateUserProfile(currentUser.uid, data);
      // Update local profile state
      setUserProfile(prev => ({ ...prev, ...data }));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get fresh user profile data
  const refreshUserProfile = async () => {
    if (!currentUser) return null;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile(userData);
        return userData;
      }
      return null;
    } catch (err) {
      console.error('Error refreshing user profile:', err);
      throw err;
    }
  };

  // Context value
  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    clearError,
    register,
    login,
    loginGoogle,
    loginFacebook,
    loginLinkedIn,
    sendOtp,
    verifyOtp,
    sendWhatsAppOtp,
    verifyWhatsAppOtp,
    signout,
    passwordReset,
    updateProfile,
    refreshUserProfile,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;