import React, { 
  createContext, 
  useState, 
  useContext, 
  useEffect 
} from 'react';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from 'firebase/firestore';
import { auth, db } from '../services/firebase/config';

// Create AuthContext
export const AuthContext = createContext();

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear Error
  const clearError = () => setError(null);

  // Create User Document in Firestore
  const createUserDocument = async (user, additionalData = {}) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    
    try {
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        const { displayName, email, photoURL } = user;
        const createdAt = new Date();

        await setDoc(userRef, {
          uid: user.uid,
          displayName: displayName || additionalData.name,
          email,
          photoURL,
          createdAt,
          role: 'user',
          connectsBalance: 15, // Default connects
          ...additionalData
        });
      }

      return userRef;
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  };

  // Registration
  const register = async (email, password, name) => {
    clearError();
    
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        password
      );
      
      // Update profile with name
      await updateProfile(userCredential.user, { displayName: name });
      
      // Create user document in Firestore
      await createUserDocument(userCredential.user, { name });
      
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Login
  const login = async (email, password) => {
    clearError();
    
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        email, 
        password
      );
      return userCredential.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Social Logins
  const loginGoogle = async () => {
    clearError();
    
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      await createUserDocument(result.user);
      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const loginFacebook = async () => {
    clearError();
    
    try {
      const result = await signInWithPopup(auth, new FacebookAuthProvider());
      await createUserDocument(result.user);
      return result.user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    clearError();
    
    try {
      await signOut(auth);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Password Reset
  const resetPassword = async (email) => {
    clearError();
    
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Authentication State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
          
          setCurrentUser(user);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setError(error.message);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Context Value
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
    logout,
    resetPassword,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to Use Authentication Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};