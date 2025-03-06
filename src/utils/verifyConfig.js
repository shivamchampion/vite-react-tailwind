/**
 * Utility to verify Firebase configuration during app initialization
 */
export const verifyFirebaseConfig = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];

  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName] || import.meta.env[varName] === 'your-api-key-here'
  );

  if (missingVars.length > 0) {
    console.error('Firebase configuration is missing or using placeholder values:', missingVars);
    return false;
  }

  if (import.meta.env.DEV) {
    console.log('Firebase configuration loaded successfully.');
  }

  return true;
};

// Call this function in your main.jsx or App.jsx