import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ListingProvider } from './contexts/ListingContext';
import './index.css';

// Check if environment variables are loaded correctly
if (!import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn(
    'Firebase configuration environment variables are missing. Make sure to create a .env.local file with the required variables.'
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ListingProvider>
        <App />
      </ListingProvider>
    </AuthProvider>
  </React.StrictMode>
);