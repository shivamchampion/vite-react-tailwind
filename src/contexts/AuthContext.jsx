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

// Custom hook to use the auth context - EXPORTED BEFORE AuthProvider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear error helper
  const clearError = () => setError(null);

  // Development mode helper to manually set user for testing
  const setDevelopmentUser = () => {
    if (process.env.NODE_ENV === 'development') {
      // Create a mock user for development purposes
      const mockUser = {
        uid: 'dev-user-123',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null
      };
      
      setCurrentUser(mockUser);
      
      // Also set a mock user profile
      const mockProfile = {
        uid: 'dev-user-123',
        displayName: 'Test User',
        email: 'test@example.com',
        connectsBalance: 15,
        role: 'user'
      };
      
      setUserProfile(mockProfile);
      setLoading(false);
      
      return true;
    }
    
    return false;
  };

  // Effect to listen to auth state changes
  useEffect(() => {
    // For development environment, we can use a mock user
    if (setDevelopmentUser()) {
      console.log("Development mode: Using mock user");
      return () => {}; // No cleanup needed for mock user
    }
    
    console.log("Setting up auth state listener");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user ? user.uid : "No user");
      setCurrentUser(user);
      
      if (user) {
        try {
          // Get extended user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
            console.log("User profile loaded:", userDoc.data());
          } else {
            console.warn('User document not found in Firestore');
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
      // In development mode, simulate registration
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating user registration:", { email, displayName });
        setDevelopmentUser();
        return { uid: 'dev-user-123', email, displayName };
      }
      
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
      // In development mode, simulate login
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating user login:", { email });
        setDevelopmentUser();
        return { uid: 'dev-user-123', email };
      }
      
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
      // In development mode, simulate Google login
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating Google login");
        setDevelopmentUser();
        return { uid: 'dev-user-123', email: 'test@example.com', displayName: 'Test User' };
      }
      
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
      // In development mode, simulate Facebook login
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating Facebook login");
        setDevelopmentUser();
        return { uid: 'dev-user-123', email: 'test@example.com', displayName: 'Test User' };
      }
      
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
      // In development mode, simulate LinkedIn login
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating LinkedIn login");
        setDevelopmentUser();
        return { uid: 'dev-user-123', email: 'test@example.com', displayName: 'Test User' };
      }
      
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
      // In development mode, simulate sending OTP
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating sending OTP to", phoneNumber);
        return { success: true, verificationId: 'mock-verification-id' };
      }
      
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
      // In development mode, simulate verifying OTP
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating OTP verification with code", code);
        setDevelopmentUser();
        return { uid: 'dev-user-123', phoneNumber: '+919876543210' };
      }
      
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
      // In development mode, simulate sending WhatsApp OTP
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating sending WhatsApp OTP to", phoneNumber);
        return { success: true, phoneNumber };
      }
      
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
      // In development mode, simulate verifying WhatsApp OTP
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating WhatsApp OTP verification for", phoneNumber, "with code", otp);
        setDevelopmentUser();
        return { success: true, phoneNumber };
      }
      
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
      // In development mode, simulate logout
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating logout");
        setCurrentUser(null);
        setUserProfile(null);
        return true;
      }
      
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
      // In development mode, simulate password reset
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating password reset for", email);
        return true;
      }
      
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
      // In development mode, simulate profile update
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating profile update with data:", data);
        setUserProfile(prev => ({ ...prev, ...data }));
        return true;
      }
      
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
      // In development mode, just return the current profile
      if (process.env.NODE_ENV === 'development') {
        console.log("Development mode: Simulating profile refresh");
        return userProfile;
      }
      
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
    logout: signout,  // Export as logout for consistency
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

export default AuthProvider;