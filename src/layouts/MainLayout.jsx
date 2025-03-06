import React from 'react';
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
  // Ensure openAuthModal is a function
  const handleOpenAuthModal = (tab) => {
    if (typeof openAuthModal === 'function') {
      openAuthModal(tab);
    } else {
      console.error("openAuthModal is not a function:", openAuthModal);
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
  return {
    openAuthModal: context?.openAuthModal || (() => console.warn('Auth modal context not available'))
  };
};

export default MainLayout;