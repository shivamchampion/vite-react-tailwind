import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Comprehensive Firebase Configuration Validation
const validateFirebaseConfig = (config) => {
  const requiredKeys = [
    'apiKey', 
    'authDomain', 
    'projectId', 
    'storageBucket', 
    'messagingSenderId', 
    'appId'
  ];

  return requiredKeys.every(key => config[key] && config[key].trim() !== '');
}

// Retrieve Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Determine if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Enhanced Firebase Initialization
const initializeFirebase = () => {
  let app;
  
  try {
    // Validate configuration
    if (!validateFirebaseConfig(firebaseConfig)) {
      console.error('❌ Invalid Firebase configuration');
      throw new Error('Firebase configuration is incomplete');
    }

    // Initialize Firebase app
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');

    // Initialize services
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);
    const functions = getFunctions(app);

    // Connect to emulators in development
    if (isDevelopment && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
      console.log('🚧 Connecting to Firebase Emulators');
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectStorageEmulator(storage, 'localhost', 9199);
      connectFunctionsEmulator(functions, 'localhost', 5001);
    }

    return { app, auth, db, storage, functions };

  } catch (error) {
    console.error('Firebase Initialization Error:', error);
    
    // Fallback mechanism
    return {
      app: null,
      auth: null,
      db: null,
      storage: null,
      functions: null
    };
  }
};

// Export initialized Firebase services
export const { app, auth, db, storage, functions } = initializeFirebase();

export default app;