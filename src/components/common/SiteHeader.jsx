import React, { useState, useRef, useEffect } from 'react';
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

  // State for dropdowns - separated for clarity
  const [dropdownStates, setDropdownStates] = useState({
    resources: false,
    company: false,
    userMenu: false
  });
  
  // State to prevent immediate auto-close of dropdowns
  const [preventAutoClose, setPreventAutoClose] = useState(false);

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
      iconName: "Home",
      active: currentPath === APP_ROUTES.HOME
    },
    {
      name: "Businesses",
      to: APP_ROUTES.MARKETPLACE.BUSINESS,
      iconName: "Building",
      active: currentPath === APP_ROUTES.MARKETPLACE.BUSINESS
    },
    {
      name: "Franchises",
      to: APP_ROUTES.MARKETPLACE.FRANCHISE,
      iconName: "TrendingUp",
      active: currentPath === APP_ROUTES.MARKETPLACE.FRANCHISE
    },
    {
      name: "Startups",
      to: APP_ROUTES.MARKETPLACE.STARTUP,
      iconName: "Lightbulb",
      active: currentPath === APP_ROUTES.MARKETPLACE.STARTUP
    },
    {
      name: "Investors",
      to: APP_ROUTES.MARKETPLACE.INVESTOR,
      iconName: "Users",
      active: currentPath === APP_ROUTES.MARKETPLACE.INVESTOR
    },
    {
      name: "Digital Assets",
      to: APP_ROUTES.MARKETPLACE.DIGITAL_ASSET,
      iconName: "Globe",
      active: currentPath === APP_ROUTES.MARKETPLACE.DIGITAL_ASSET
    }
  ];

  // Debug effect to monitor dropdown states
  useEffect(() => {
    console.log('Current dropdown states:', dropdownStates);
  }, [dropdownStates]);

  // Toggle a specific dropdown while closing others
  const toggleDropdown = (name) => {
    console.log(`Toggling dropdown: ${name}`, !dropdownStates[name]);
    
    // Set prevention flag to stop immediate closing
    setPreventAutoClose(true);
    
    // Use a callback to ensure we're working with the most current state
    setDropdownStates(prevState => {
      // If the dropdown is already open, close it
      if (prevState[name]) {
        return {
          ...prevState,
          [name]: false
        };
      }
      
      // Otherwise, close all dropdowns and open this one
      const allClosed = Object.keys(prevState).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});
      
      return {
        ...allClosed,
        [name]: true
      };
    });
    
    // Clear the prevention flag after a small delay
    setTimeout(() => {
      setPreventAutoClose(false);
    }, 50);
  };

  // Close all dropdowns
  const closeAllDropdowns = () => {
    setDropdownStates({
      resources: false,
      company: false,
      userMenu: false
    });
  };

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
      <div className="border-b border-gray-200 bg-gradient-to-r from-white via-white to-indigo-50">
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