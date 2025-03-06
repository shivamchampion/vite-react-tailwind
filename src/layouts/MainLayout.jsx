import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import SiteHeader from '../components/common/SiteHeader';
import SiteFooter from '../components/common/SiteFooter';

/**
 * Main Layout component for public-facing pages.
 * Includes site header, footer, and main content area.
 * Passes openAuthModal function to child components via OutletContext
 */
const MainLayout = ({ openAuthModal }) => {
  // Debug log to verify the prop is being passed correctly
  console.log("MainLayout received openAuthModal:", openAuthModal);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Site Header */}
      <SiteHeader openAuthModal={openAuthModal} />
      
      {/* Main Content Area */}
      <main className="flex-grow">
        <Outlet context={{ openAuthModal }} />
      </main>
      
      {/* Site Footer */}
      <SiteFooter />
    </div>
  );
};

export default MainLayout;