import React, { useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import SiteHeader from '../components/common/SiteHeader';
import SiteFooter from '../components/common/SiteFooter';

/**
 * Main Layout component for public-facing pages.
 * Includes site header, footer, and main content area.
 * Passes openAuthModal function to child components via OutletContext
 * 
 * @param {Object} props - Component props
 * @param {Function} props.openAuthModal - Function to open the authentication modal
 */
const MainLayout = ({ openAuthModal }) => {
  // Log props for debugging
  useEffect(() => {
    console.log("MainLayout rendered with openAuthModal:", 
      typeof openAuthModal === 'function' ? 'function' : typeof openAuthModal
    );
  }, [openAuthModal]);
  
  // Ensure openAuthModal is a function with proper error handling
  const handleOpenAuthModal = (tab) => {
    console.log("MainLayout: handleOpenAuthModal called with tab:", tab);
    if (typeof openAuthModal === 'function') {
      openAuthModal(tab);
    } else {
      console.error("openAuthModal is not a function:", openAuthModal);
      // Provide a fallback for development
      alert(`Auth modal would open with tab: ${tab} (function not available)`);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Site Header */}
      <SiteHeader openAuthModal={handleOpenAuthModal} />
      
      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet context={{ openAuthModal: handleOpenAuthModal }} />
      </main>
      
      {/* Site Footer */}
      <SiteFooter />
    </div>
  );
};

// Custom hook to access the authModal state from any component within MainLayout
export const useAuthModal = () => {
  const context = useOutletContext();
  
  // Provide a safer implementation with fallback
  const safeOpenAuthModal = (tab = 'login') => {
    if (context?.openAuthModal && typeof context.openAuthModal === 'function') {
      context.openAuthModal(tab);
    } else {
      console.warn('Auth modal context not available, using fallback');
      alert(`Auth modal would open with tab: ${tab} (context not available)`);
    }
  };
  
  return {
    openAuthModal: context?.openAuthModal || safeOpenAuthModal
  };
};

export default MainLayout;