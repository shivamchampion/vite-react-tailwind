import React, { useState, useMemo, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { createRouter } from './router';
import AuthModal from './components/auth/AuthModal';
import { useAuth } from './contexts/AuthContext';

/**
 * Main App component
 * Manages auth state and router configuration
 */
function App() {
  // Auth modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  // Get auth context with current user
  const { currentUser, userProfile, loading } = useAuth();
  
  // Function to open auth modal with specified tab
  const openAuthModal = (tab = 'login') => {
    console.log("Opening auth modal with tab:", tab);
    setActiveTab(tab);
    setAuthModalOpen(true);
  };
  
  // Close auth modal
  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Create memoized router to prevent unnecessary re-renders
  const router = useMemo(() => {
    console.log("Creating router with user:", currentUser?.uid || 'no user');
    return createRouter({
      user: currentUser,
      openAuthModal,
      closeAuthModal
    });
  }, [currentUser]);
  
  // When in initial loading state, show minimal UI
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block animate-spin h-8 w-8 border-t-2 border-b-2 border-indigo-600 rounded-full"></div>
        <span className="ml-3 text-gray-700">Loading...</span>
      </div>
    );
  }
  
  return (
    <>
      {/* Router Provider */}
      <RouterProvider router={router} />
      
      {/* Auth Modal - Rendered at the app level */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={closeAuthModal} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
    </>
  );
}

export default App;