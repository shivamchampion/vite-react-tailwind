import React, { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import SiteHeader from '../components/common/SiteHeader';
import SiteFooter from '../components/common/SiteFooter';
import AuthModal from '../components/auth/AuthModal';

/**
 * MainLayout Component
 * Main layout for public-facing pages with header and footer
 */
function MainLayout() {
  // State for auth modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Function to open the auth modal with specified tab
  const openAuthModal = (tab = 'login') => {
    setActiveTab(tab);
    setAuthModalOpen(true);
  };

  // Function to close the auth modal
  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header with Auth Modal Control */}
      <SiteHeader openAuthModal={openAuthModal} />
      
      {/* Main Content */}
      <main className="flex-grow">
        <Suspense fallback={
          <div className="flex justify-center items-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        }>
          <Outlet context={{ openAuthModal }} />
        </Suspense>
      </main>
      
      {/* Footer */}
      <SiteFooter />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={closeAuthModal} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

export default MainLayout;