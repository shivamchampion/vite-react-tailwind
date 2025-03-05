import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  PhoneAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { sendWhatsAppOTP } from '../../api/whatsapp';

// Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Create recaptcha verifier instance
const createRecaptchaVerifier = (containerId) => {
  return new RecaptchaVerifier(auth, containerId, {
    'size': 'invisible',
    'callback': (response) => {
      // reCAPTCHA solved, allow signInWithPhoneNumber.
      console.log('Captcha resolved');
    }
  });
};

// Register with email and password
const registerWithEmailPassword = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile
    await updateProfile(userCredential.user, {
      displayName
    });
    
    // Send email verification
    await sendEmailVerification(userCredential.user);
    
    // Create user document in Firestore
    await createUserDocument(userCredential.user, { displayName });
    
    return userCredential.user;
  } catch (error) {
    console.error('Error registering with email and password:', error);
    throw error;
  }
};

// Login with email and password
const loginWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in with email and password:', error);
    throw error;
  }
};

// Login with Google
const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(result.user);
    }
    return result.user;
  } catch (error) {
    console.error('Error logging in with Google:', error);
    throw error;
  }
};

// Login with Facebook
const loginWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(result.user);
    }
    return result.user;
  } catch (error) {
    console.error('Error logging in with Facebook:', error);
    throw error;
  }
};

// Custom LinkedIn login (needs backend implementation)
const loginWithLinkedIn = async (accessToken) => {
  // LinkedIn authentication requires a backend service for token exchange
  // This is a placeholder for the actual implementation
  try {
    const response = await fetch('/api/auth/linkedin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    });
    
    if (!response.ok) {
      throw new Error('LinkedIn authentication failed');
    }
    
    const data = await response.json();
    // The backend should respond with Firebase custom token
    // Then sign in with that token
    // This is simplified and requires proper backend implementation
    
    return data.user;
  } catch (error) {
    console.error('Error logging in with LinkedIn:', error);
    throw error;
  }
};

// Phone number authentication
const sendPhoneOTP = async (phoneNumber, containerId) => {
  try {
    const recaptchaVerifier = createRecaptchaVerifier(containerId);
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    // Save confirmation result to verify the code later
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    console.error('Error sending phone OTP:', error);
    throw error;
  }
};

// Verify phone OTP
const verifyPhoneOTP = async (code) => {
  try {
    const confirmationResult = window.confirmationResult;
    if (!confirmationResult) {
      throw new Error('No confirmation result found. Please send OTP first.');
    }
    
    const result = await confirmationResult.confirm(code);
    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(result.user);
    }
    
    return result.user;
  } catch (error) {
    console.error('Error verifying phone OTP:', error);
    throw error;
  }
};

// WhatsApp OTP login
const sendWhatsAppLoginOTP = async (phoneNumber) => {
  try {
    const result = await sendWhatsAppOTP(phoneNumber);
    return result;
  } catch (error) {
    console.error('Error sending WhatsApp OTP:', error);
    throw error;
  }
};

// Verify WhatsApp OTP
const verifyWhatsAppOTP = async (phoneNumber, otp) => {
  try {
    // This would need a backend implementation to verify the OTP
    // For now, this is a placeholder
    const response = await fetch('/api/auth/verify-whatsapp-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phoneNumber, otp }),
    });
    
    if (!response.ok) {
      throw new Error('WhatsApp OTP verification failed');
    }
    
    const data = await response.json();
    // The backend should handle creating a Firebase user if needed
    
    return data.user;
  } catch (error) {
    console.error('Error verifying WhatsApp OTP:', error);
    throw error;
  }
};

// Create user document in Firestore
const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    const { displayName, email, photoURL, phoneNumber } = user;
    const createdAt = new Date();
    
    try {
      await setDoc(userRef, {
        uid: user.uid,
        displayName,
        email,
        photoURL,
        phoneNumber,
        createdAt,
        role: 'user',
        entities: [],
        connectsBalance: 15, // Default connects balance
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user document:', error);
    }
  }
  
  return userRef;
};

// Update user profile
const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
    
    // If display name is being updated, also update Firebase auth profile
    if (data.displayName && auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: data.displayName,
        ...(data.photoURL && { photoURL: data.photoURL })
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Log out
const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Reset password
const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

// Get current user
const getCurrentUser = () => {
  return auth.currentUser;
};

export {
  registerWithEmailPassword,
  loginWithEmailPassword,
  loginWithGoogle,
  loginWithFacebook,
  loginWithLinkedIn,
  sendPhoneOTP,
  verifyPhoneOTP,
  sendWhatsAppLoginOTP,
  verifyWhatsAppOTP,
  createUserDocument,
  updateUserProfile,
  logout,
  resetPassword,
  getCurrentUser
};