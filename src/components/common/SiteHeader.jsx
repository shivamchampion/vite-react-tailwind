import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { APP_ROUTES } from '../../utils/constants';
import { getNavigationGroups } from '../../utils/navigationHelpers';

// Import components from separate files
import { DesktopNavigationBar } from './DesktopNavigationBar';
import { SecondaryNavigationBar } from './SecondaryNavigationBar';
import { MobileNavigationMenu } from './MobileNavigationMenu';
import { HeaderAuthButtons } from './HeaderAuthButtons';
import { LogoutConfirmDialog } from './LogoutConfirmDialog';

/**
 * Main site header component - orchestrates all navigation components
 */
const SiteHeader = ({ openAuthModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, signout } = useAuth();

  // Get the current path for active tab highlighting
  const currentPath = location.pathname;

  // Create refs for dropdowns in all navigation bars
  const desktopResourcesRef = useRef(null);
  const desktopCompanyRef = useRef(null);
  const secondaryResourcesRef = useRef(null);
  const secondaryCompanyRef = useRef(null);
  const userDropdownRef = useRef(null);

  // State for dropdowns
  const [dropdownStates, setDropdownStates] = useState({
    resources: false,
    company: false,
    userMenu: false
  });
  
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for logout confirmation
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Get navigation items data
  const { resourcesItems, companyItems } = getNavigationGroups();

  // Define main navigation items
  const mainNavItems = [
    {
      name: "Home",
      to: APP_ROUTES.HOME,
      active: currentPath === APP_ROUTES.HOME
    },
    {
      name: "Businesses",
      to: APP_ROUTES.MARKETPLACE.BUSINESS,
      active: currentPath === APP_ROUTES.MARKETPLACE.BUSINESS
    },
    {
      name: "Franchises",
      to: APP_ROUTES.MARKETPLACE.FRANCHISE,
      active: currentPath === APP_ROUTES.MARKETPLACE.FRANCHISE
    },
    {
      name: "Startups",
      to: APP_ROUTES.MARKETPLACE.STARTUP,
      active: currentPath === APP_ROUTES.MARKETPLACE.STARTUP
    },
    {
      name: "Investors",
      to: APP_ROUTES.MARKETPLACE.INVESTOR,
      active: currentPath === APP_ROUTES.MARKETPLACE.INVESTOR
    },
    {
      name: "Digital Assets",
      to: APP_ROUTES.MARKETPLACE.DIGITAL_ASSET,
      active: currentPath === APP_ROUTES.MARKETPLACE.DIGITAL_ASSET
    }
  ];

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setDropdownStates({
      resources: false,
      company: false,
      userMenu: false
    });
  };

  // Toggle a specific dropdown - improved version
  const toggleDropdown = (name) => {
    setDropdownStates(prevState => {
      const newState = { ...prevState };
      
      // Close other dropdowns
      Object.keys(newState).forEach(key => {
        if (key !== name) newState[key] = false;
      });
      
      // Toggle the specific dropdown
      newState[name] = !prevState[name];
      
      return newState;
    });
  };

  // Handle clicks outside dropdowns - centralized in the parent component
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if clicking inside any dropdown content or toggle buttons
      const isInsideDropdown = (
        // Desktop dropdowns
        (desktopResourcesRef.current && desktopResourcesRef.current.contains(event.target)) ||
        (desktopCompanyRef.current && desktopCompanyRef.current.contains(event.target)) ||
        // Secondary dropdowns
        (secondaryResourcesRef.current && secondaryResourcesRef.current.contains(event.target)) ||
        (secondaryCompanyRef.current && secondaryCompanyRef.current.contains(event.target)) ||
        // User dropdown
        (userDropdownRef.current && userDropdownRef.current.contains(event.target)) ||
        // Check if clicking inside any dropdown menu
        event.target.closest('.dropdown-menu')
      );

      if (!isInsideDropdown) {
        closeAllDropdowns();
      }
    };

    // Use capture phase to ensure handler runs before others
    document.addEventListener('mousedown', handleOutsideClick, true);
    
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick, true);
    };
  }, []);

  // Close dropdowns when location changes
  useEffect(() => {
    closeAllDropdowns();
    setMobileMenuOpen(false);
  }, [currentPath]);

  // Handle logout button click
  const handleLogoutClick = () => {
    setDropdownStates(prev => ({ ...prev, userMenu: false }));
    setShowLogoutConfirm(true);
  };

  // Perform logout
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await signout();
      navigate(APP_ROUTES.HOME);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLogoutLoading(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm">
      {/* Main header row */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-white via-white via-55% to-indigo-50">
        <div className="max-w-[2560px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center mr-2 sm:mr-4">
              <Link to={APP_ROUTES.HOME}>
                <img src="/src/logo.png" alt="Business Options Logo" className="h-8 sm:h-10 md:h-12" />
              </Link>
            </div>

            {/* Desktop Navigation - visible on 2xl screens */}
            <div className="hidden 2xl:flex items-center space-x-1 mx-4 flex-grow justify-center">
              <DesktopNavigationBar
                navItems={mainNavItems}
                resourcesItems={resourcesItems}
                companyItems={companyItems}
                dropdownStates={dropdownStates}
                toggleDropdown={toggleDropdown}
                closeAllDropdowns={closeAllDropdowns}
                currentPath={currentPath}
                resourcesRef={desktopResourcesRef}
                companyRef={desktopCompanyRef}
              />
            </div>

            {/* Auth Buttons */}
            <HeaderAuthButtons
              isAuthenticated={!!currentUser}
              userProfile={userProfile}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              openAuthModal={openAuthModal}
              handleLogoutClick={handleLogoutClick}
              userDropdownOpen={dropdownStates.userMenu}
              toggleUserDropdown={() => toggleDropdown('userMenu')}
              userDropdownRef={userDropdownRef}
            />
          </div>
        </div>
      </div>

      {/* Secondary Navigation Row - Only visible on xl screens */}
      <SecondaryNavigationBar
        navItems={mainNavItems}
        resourcesItems={resourcesItems}
        companyItems={companyItems}
        dropdownStates={dropdownStates}
        toggleDropdown={toggleDropdown}
        closeAllDropdowns={closeAllDropdowns}
        currentPath={currentPath}
        resourcesRef={secondaryResourcesRef}
        companyRef={secondaryCompanyRef}
      />

      {/* Mobile/Tablet Menu */}
      {mobileMenuOpen && (
        <MobileNavigationMenu
          navItems={mainNavItems}
          resourcesItems={resourcesItems}
          companyItems={companyItems}
          onItemClick={() => setMobileMenuOpen(false)}
          currentPath={currentPath}
        />
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <LogoutConfirmDialog
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
          isLoading={logoutLoading}
        />
      )}
    </header>
  );
};

export default SiteHeader;