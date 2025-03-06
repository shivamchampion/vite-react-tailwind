import React, { useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRouter } from './router';
import { useAuth } from './contexts/AuthContext';

/**
 * App Component
 * Main component that sets up the router based on authentication state
 */
function App() {
  const { isAuthenticated, loading } = useAuth();
  
  // Create router with current auth state
  const router = useMemo(() => createRouter(isAuthenticated), [isAuthenticated]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }
  
  return <RouterProvider router={router} />;
}

export default App;