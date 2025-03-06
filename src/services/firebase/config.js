import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Use environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if environment variables are loaded
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn('Firebase configuration is missing or incomplete. The app will use mock data in development mode.');
}

const isDevelopment = process.env.NODE_ENV === 'development';

// Initialize Firebase
let app;
try {
  // Only initialize Firebase if we have a valid config
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your-api-key-here') {
    app = initializeApp(firebaseConfig);
    console.log('Firebase initialized successfully');
  } else if (isDevelopment) {
    // For development without Firebase config, create a minimal config
    app = initializeApp({
      apiKey: "dev-mode-dummy-key",
      authDomain: "dev-mode.firebaseapp.com",
      projectId: "dev-mode",
      storageBucket: "dev-mode.appspot.com",
      messagingSenderId: "000000000000",
      appId: "dev-mode:app:id"
    });
    console.log('Firebase initialized with development placeholder config');
  } else {
    throw new Error('Firebase configuration is required in production');
  }
} catch (error) {
  console.error('Error initializing Firebase:', error);
  // Create a minimal app for development to prevent crashes
  if (isDevelopment) {
    app = initializeApp({
      apiKey: "dev-mode-dummy-key",
      authDomain: "dev-mode.firebaseapp.com",
      projectId: "dev-mode"
    }, 'fallback-instance');
    console.warn('Using fallback Firebase instance for development');
  }
}

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// Connect to emulators in development if specified in env vars
if (isDevelopment && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  try {
    // Auth emulator
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    
    // Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080);
    
    // Storage emulator
    connectStorageEmulator(storage, 'localhost', 9199);
    
    // Functions emulator
    connectFunctionsEmulator(functions, 'localhost', 5001);
    
    console.log('Connected to Firebase emulators successfully');
  } catch (error) {
    console.error('Error connecting to Firebase emulators:', error);
  }
}

// Export the Firebase services
export { auth, db, storage, functions };

export default app;