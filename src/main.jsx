import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { EntityProvider } from './contexts/EntityContext';
import { verifyFirebaseConfig } from './utils/verifyConfig';
import './index.css';

// Verify Firebase configuration
const configVerified = verifyFirebaseConfig();

if (!configVerified) {
  console.error('❌ Firebase configuration is invalid. Please check your .env file.');
}

// Check if environment variables are loaded correctly
const checkEnvironmentVariables = () => {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_PROJECT_ID'
  ];

  const missingVars = requiredVars.filter(
    varName => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn('⚠️ Missing environment variables:', missingVars);
    return false;
  }
  return true;
};

// Render root with fallback mechanism
const renderRoot = () => {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  if (!checkEnvironmentVariables()) {
    root.render(
      <React.StrictMode>
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8 bg-white rounded-lg shadow-xl">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Configuration Error</h1>
            <p className="text-gray-700 mb-6">
              Please configure your environment variables to run the application.
            </p>
            <pre className="bg-gray-100 p-4 rounded text-left">
              Check your .env.local file for:
              - VITE_FIREBASE_API_KEY
              - VITE_FIREBASE_PROJECT_ID
            </pre>
          </div>
        </div>
      </React.StrictMode>
    );
    return;
  }

  root.render(
    <React.StrictMode>
      <AuthProvider>
        <EntityProvider>
          <App />
        </EntityProvider>
      </AuthProvider>
    </React.StrictMode>
  );
};

renderRoot();