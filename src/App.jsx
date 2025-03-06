import React, { useState, useMemo, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { createRouter } from './router';
import AuthModal from './components/auth/AuthModal';
import { useContext } from 'react';

// Create local useAuth hook to avoid import issues
const useAuth = () => useContext(AuthContext);

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
    console.log("App: openAuthModal called with tab:", tab);
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
      closeAuthModal,
      activeTab,
      setActiveTab
    });
  }, [currentUser, activeTab]);
  
  // Close modal automatically when user logs in
  useEffect(() => {
    if (currentUser && authModalOpen) {
      // Small delay to allow success message to be seen
      const timer = setTimeout(() => {
        setAuthModalOpen(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentUser, authModalOpen]);
  
  // Debug render
  console.log("App is rendering with authModalOpen:", authModalOpen, "activeTab:", activeTab, "user:", currentUser?.uid || 'none');
  
  // When in initial loading state, show minimal UI
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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