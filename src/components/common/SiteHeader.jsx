import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@heroui/react";
import {
  ChevronDown,
  Menu,
  X,
  Building,
  TrendingUp,
  Lightbulb,
  Users,
  Globe,
  Info,
  BookOpen,
  User,
  Briefcase,
  BarChart3,
  Award,
  LineChart,
  Search,
  HelpCircle,
  MessageSquare,
  Mail,
  ChevronRight,
  Home,
  LogOut,
  Settings
} from "lucide-react";
import { useAuth } from '../../contexts/AuthContext';
import { APP_ROUTES } from '../../utils/constants';
import {
  isRouteActive,
  isCompanyTabActive,
  isResourcesTabActive,
  getNavigationGroups
} from '../../utils/navigationHelpers';

/**
 * Simple Logout Confirmation Dialog Component
 * 
 * A simplified dialog specifically for logout confirmation
 */
const LogoutConfirmationDialog = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  // Prevent clicks on the modal from closing it
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-4"
        onClick={stopPropagation}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-yellow-100 py-3 px-4 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Log Out
          </h3>
          <button
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mr-4">
              <LogOut size={24} />
            </div>
            <div>
              <p className="text-gray-500">
                Are you sure you want to log out of your account?
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className={`w-full sm:w-auto sm:ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-white font-medium sm:text-sm hover:bg-yellow-700 focus:outline-none ${isLoading ? 'opacity-70 cursor-not-allowed bg-yellow-400' : ''
              }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Logging out...' : 'Log Out'}
          </button>
          <button
            type="button"
            className="mt-3 sm:mt-0 w-full sm:w-auto sm:ml-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 font-medium sm:text-sm hover:bg-gray-50 focus:outline-none"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Navigation Item component for consistent styling across different navigation areas
 */
const NavItem = ({ to, href, icon, children, className = "", onClick, active }) => {
  // Determine if the item is active based on the prop or className
  const isActive = active || className.includes('text-indigo-700');

  // Base class for both link types
  const baseClass = `flex items-center font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${isActive
    ? 'text-indigo-700 bg-white shadow-sm'
    : 'text-gray-700 hover:text-indigo-700'
    } ${className}`;

  // Use Link for internal navigation, anchor for external links
  if (to) {
    return (
      <Link
        to={to}
        className={baseClass}
        onClick={onClick}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        <span className={icon ? "ml-1.5" : ""}>{children}</span>
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={baseClass}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className={icon ? "ml-1.5" : ""}>{children}</span>
    </a>
  );
};

/**
 * Dropdown menu item component
 */
const DropdownItem = ({ to, href, icon, children, onClick, active }) => {
  // Base class with conditionally applied active state
  const baseClass = `flex items-center px-4 py-3 text-sm transition-all duration-200 border-l-2 ${active
    ? 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-500'
    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 border-transparent hover:border-indigo-500'
    }`;

  if (to) {
    return (
      <Link
        to={to}
        className={baseClass}
        onClick={onClick}
      >
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-3">
          {icon}
        </span>
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={baseClass}
    >
      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-3">
        {icon}
      </span>
      <span>{children}</span>
    </a>
  );
}

/**
 * Mobile menu item component with active state
 */
const MobileMenuItem = ({ to, href, icon, children, onClick, active }) => {
  // Calculate base class
  const baseClass = `flex items-center px-3 py-2.5 rounded-md text-sm ${active
    ? 'bg-indigo-50 text-indigo-700 font-medium'
    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
    }`;

  if (to) {
    return (
      <Link
        to={to}
        className={baseClass}
        onClick={onClick}
      >
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-2">
          {icon}
        </span>
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={baseClass}
    >
      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-2">
        {icon}
      </span>
      <span>{children}</span>
    </a>
  );
};

/**
 * Resources dropdown menu component
 */
const ResourcesDropdown = ({ isOpen, resourcesItems, onItemClick, currentPath }) => (
  <div className="absolute left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 overflow-hidden">
    <div className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
      <h3 className="text-sm font-medium text-indigo-800">Platform Resources</h3>
      <p className="text-xs text-indigo-600 mt-0.5">Helpful guides to maximize your experience</p>
    </div>
    <div className="py-1">
      {resourcesItems.map((item) => (
        <DropdownItem
          key={item.name}
          to={item.to}
          href={item.href}
          icon={item.icon}
          onClick={onItemClick}
          active={item.to && isRouteActive(currentPath, item.to)}
        >
          {item.name}
        </DropdownItem>
      ))}
    </div>
    <div className="mt-1 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100">
      <Link to="/all-resources" className="text-xs text-indigo-700 hover:text-indigo-900 font-medium flex items-center">
        View all resources
        <ChevronRight size={14} className="ml-1" />
      </Link>
    </div>
  </div>
)

/**
 * Company dropdown menu component
 */
const CompanyDropdown = ({ isOpen, companyItems, onItemClick, currentPath }) => (
  <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
    <div className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
      <h3 className="text-sm font-medium text-indigo-800">Our Company</h3>
    </div>
    <div className="py-1">
      {companyItems.map((item) => (
        <DropdownItem
          key={item.name}
          to={item.to}
          href={item.href}
          icon={item.icon}
          onClick={onItemClick}
          active={item.to && isRouteActive(currentPath, item.to)}
        >
          {item.name}
        </DropdownItem>
      ))}
    </div>
  </div>
)

/**
 * Desktop navigation component
 */
const DesktopNavigation = ({
  mainNavItems,
  resourcesOpen,
  setResourcesOpen,
  companyOpen,
  setCompanyOpen,
  resourcesRef,
  companyRef,
  resourcesItems,
  companyItems,
  closeDropdowns,
  currentPath
}) => {
  // Check if resources or company tabs should be active
  const isResourcesActive = isResourcesTabActive(currentPath);
  const isCompanyActive = isCompanyTabActive(currentPath);

  return (
    <nav className="flex items-center space-x-1">
      {mainNavItems.map((item) => (
        <NavItem
          key={item.name}
          to={item.to}
          href={item.href}
          icon={item.icon}
          className={item.active ? 'text-indigo-700 bg-white shadow-sm' : ''}
        >
          {item.name}
        </NavItem>
      ))}

      {/* Resources Dropdown */}
      <div className="relative" ref={resourcesRef}>
        <button
          className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${resourcesOpen || isResourcesActive ? 'text-indigo-700 bg-white shadow-sm' : ''
            }`}
          onClick={() => {
            setResourcesOpen(!resourcesOpen);
            setCompanyOpen(false);
          }}
        >
          <BookOpen className="w-4 h-4 flex-shrink-0" />
          <span className="ml-1.5">Resources</span>
          <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
        </button>

        {resourcesOpen && (
          <ResourcesDropdown
            isOpen={resourcesOpen}
            resourcesItems={resourcesItems}
            onItemClick={closeDropdowns}
            currentPath={currentPath}
          />
        )}
      </div>

      {/* Company Dropdown */}
      <div className="relative" ref={companyRef}>
        <button
          className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${companyOpen || isCompanyActive ? 'text-indigo-700 bg-white shadow-sm' : ''
            }`}
          onClick={() => {
            setCompanyOpen(!companyOpen);
            setResourcesOpen(false);
          }}
        >
          <Info className="w-4 h-4 flex-shrink-0" />
          <span className="ml-1.5">Company</span>
          <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${companyOpen ? 'rotate-180' : ''}`} />
        </button>

        {companyOpen && (
          <CompanyDropdown
            isOpen={companyOpen}
            companyItems={companyItems}
            onItemClick={closeDropdowns}
            currentPath={currentPath}
          />
        )}
      </div>
    </nav>
  );
}
/**
 * Mobile navigation menu component
 */
const MobileNavMenu = ({ isOpen, mainNavItems, resourcesItems, companyItems, onItemClick, currentPath }) => (
  <div className={`xl:hidden bg-white border-t border-gray-200 shadow-lg ${isOpen ? 'block' : 'hidden'}`}>
    <div className="px-4 pt-2 pb-6 space-y-1">
      {/* Become an Advisor button at top for small screens only */}
      <div className="md:hidden pt-2 pb-2">
        <Button
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md items-center text-sm flex justify-center"
          variant="flat"
        >
          <Briefcase className="w-4 h-4 mr-1.5" />
          <span>Become an Advisor</span>
        </Button>
      </div>

      {/* Main Navigation Items */}
      <div className="py-2">
        <div className="flex items-center px-3 py-2 text-indigo-700 font-medium">
          <span>Explore Opportunities</span>
        </div>
        <div className="ml-4 pl-4 border-l-2 border-indigo-100">
          {mainNavItems.map((item) => (
            <MobileMenuItem
              key={item.name}
              to={item.to}
              href={item.href}
              icon={item.icon}
              onClick={onItemClick}
              active={item.active}
            >
              {item.name}
            </MobileMenuItem>
          ))}
        </div>
      </div>

      {/* Resources Section */}
      <div className="py-2">
        <div className="flex items-center px-3 py-2 text-indigo-700 font-medium">
          <BookOpen className="w-5 h-5 mr-2" />
          <span>Resources</span>
        </div>
        <div className="ml-4 pl-4 border-l-2 border-indigo-100">
          {resourcesItems.map((item) => (
            <MobileMenuItem
              key={item.name}
              to={item.to}
              href={item.href}
              icon={item.icon}
              onClick={onItemClick}
              active={item.to && isRouteActive(currentPath, item.to)}
            >
              {item.name}
            </MobileMenuItem>
          ))}
        </div>
      </div>

      {/* Company Section */}
      <div className="py-2">
        <div className="flex items-center px-3 py-2 text-indigo-700 font-medium">
          <Info className="w-5 h-5 mr-2" />
          <span>Company</span>
        </div>
        <div className="ml-4 pl-4 border-l-2 border-indigo-100">
          {companyItems.map((item) => (
            <MobileMenuItem
              key={item.name}
              to={item.to}
              href={item.href}
              icon={item.icon}
              onClick={onItemClick}
              active={item.to && isRouteActive(currentPath, item.to)}
            >
              {item.name}
            </MobileMenuItem>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/**
 * User profile dropdown component
 */
const UserDropdown = ({ isOpen, userProfile, handleLogoutClick }) => (
  <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
    <div className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
      <h3 className="text-sm font-medium text-indigo-800">Your Account</h3>
    </div>
    <div className="py-1">
      <DropdownItem to={APP_ROUTES.DASHBOARD.ROOT} icon={<User size={16} />}>
        Dashboard
      </DropdownItem>
      <DropdownItem to={APP_ROUTES.DASHBOARD.PROFILE} icon={<User size={16} />}>
        Profile
      </DropdownItem>
      <DropdownItem to={APP_ROUTES.DASHBOARD.SETTINGS} icon={<Settings size={16} />}>
        Settings
      </DropdownItem>
      <button
        onClick={handleLogoutClick}
        className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-indigo-50 hover:text-red-700 transition-all duration-200 border-l-2 border-transparent hover:border-red-500"
      >
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-red-600 bg-red-100 rounded-md mr-3">
          <LogOut size={16} />
        </span>
        <span>Logout</span>
      </button>
    </div>
  </div>
);

/**
 * Authentication buttons component
 */
const AuthButtons = ({
  showMobileMenu,
  setShowMobileMenu,
  isAuthenticated,
  userProfile,
  openAuthModal,
  handleLogoutClick,
  userDropdownOpen,
  setUserDropdownOpen,
  userDropdownRef
}) => (
  <div className="flex items-center gap-1 sm:gap-3 ml-auto">
    {/* Become an Advisor - visible on medium and large screens */}
    <Button
      className="hidden md:flex bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md items-center text-xs lg:text-sm whitespace-nowrap"
      variant="flat"
    >
      <Briefcase className="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-1 lg:mr-1.5" />
      <span>Become an Advisor</span>
    </Button>

    <div className="hidden md:block h-8 w-[1px] bg-gray-200 mx-1"></div>

    {isAuthenticated ? (
      <div className="relative" ref={userDropdownRef}>
        <button
          className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 ${userDropdownOpen ? 'text-indigo-700 bg-white shadow-sm' : ''}`}
          onClick={() => setUserDropdownOpen(!userDropdownOpen)}
        >
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white mr-2">
            {userProfile?.displayName?.[0]?.toUpperCase() || 'U'}
          </div>
          <span className="hidden md:block">{userProfile?.displayName || 'User'}</span>
          <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {userDropdownOpen && (
          <UserDropdown
            isOpen={userDropdownOpen}
            userProfile={userProfile}
            handleLogoutClick={handleLogoutClick}
          />
        )}
      </div>
    ) : (
      <>
        {/* Login Button */}
        <Button
          className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200 items-center text-xs sm:text-sm flex whitespace-nowrap px-2 sm:px-3"
          variant="flat"
          onClick={() => openAuthModal('login')}
        >
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
          <span>Login</span>
        </Button>

        {/* Register Button */}
        <Button
          className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3"
          onClick={() => openAuthModal('register')}
        >
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 md:hidden" />
          <span>Register</span>
        </Button>
      </>
    )}

    {/* Mobile/Tablet Menu Button - visible on 2xl screens and below */}
    <button
      type="button"
      className="2xl:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 focus:outline-none ml-1"
      onClick={() => setShowMobileMenu(!showMobileMenu)}
    >
      <span className="sr-only">Open main menu</span>
      {showMobileMenu ? (
        <X className="block h-6 w-6" aria-hidden="true" />
      ) : (
        <Menu className="block h-6 w-6" aria-hidden="true" />
      )}
    </button>
  </div>
);
/**
 * Secondary navigation for xl screens
 */
const SecondaryNavigation = ({
  mainNavItems,
  resourcesRef,
  companyRef,
  resourcesOpen,
  setResourcesOpen,
  companyOpen,
  setCompanyOpen,
  resourcesItems,
  companyItems,
  closeDropdowns,
  currentPath
}) => {
  // Check if resources or company tabs should be active
  const isResourcesActive = isResourcesTabActive(currentPath);
  const isCompanyActive = isCompanyTabActive(currentPath);

  return (
    <div className="hidden xl:block 2xl:hidden border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-white to-indigo-50">
      <div className="max-w-[2560px] mx-auto px-8 xl:px-12">
        <div className="flex items-center justify-center h-12">
          <nav className="flex items-center space-x-2">
            {mainNavItems.map((item) => (
              <NavItem
                key={item.name}
                to={item.to}
                href={item.href}
                icon={item.icon}
                className="px-4"
                active={item.active}
              >
                {item.name}
              </NavItem>
            ))}

            {/* Resources Dropdown */}
            <div className="relative" ref={resourcesRef}>
              <button
                className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-4 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${resourcesOpen || isResourcesActive ? 'text-indigo-700 bg-white shadow-sm' : ''
                  }`}
                onClick={() => {
                  setResourcesOpen(!resourcesOpen);
                  setCompanyOpen(false);
                }}
              >
                <BookOpen className="w-4 h-4 flex-shrink-0" />
                <span className="ml-1.5">Resources</span>
                <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>

              {resourcesOpen && (
                <ResourcesDropdown
                  isOpen={resourcesOpen}
                  resourcesItems={resourcesItems}
                  onItemClick={closeDropdowns}
                  currentPath={currentPath}
                />
              )}
            </div>

            {/* Company Dropdown */}
            <div className="relative" ref={companyRef}>
              <button
                className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-4 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${companyOpen || isCompanyActive ? 'text-indigo-700 bg-white shadow-sm' : ''
                  }`}
                onClick={() => {
                  setCompanyOpen(!companyOpen);
                  setResourcesOpen(false);
                }}
              >
                <Info className="w-4 h-4 flex-shrink-0" />
                <span className="ml-1.5">Company</span>
                <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${companyOpen ? 'rotate-180' : ''}`} />
              </button>

              {companyOpen && (
                <CompanyDropdown
                  isOpen={companyOpen}
                  companyItems={companyItems}
                  onItemClick={closeDropdowns}
                  currentPath={currentPath}
                />
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

/**
 * Main site header component with responsive navigation
 */
const SiteHeader = ({ openAuthModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile, signout } = useAuth();

  // State for mobile menu and dropdowns
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // State for logout confirmation dialog
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  // Refs for dropdown menus (for detecting clicks outside)
  const resourcesRef = useRef(null);
  const companyRef = useRef(null);
  const userDropdownRef = useRef(null);

  // Get the current path for active tab highlighting
  const currentPath = location.pathname;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
        setResourcesOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target)) {
        setCompanyOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show logout confirmation dialog
  const handleLogoutClick = () => {
    setUserDropdownOpen(false); // Close the dropdown first
    setShowLogoutConfirm(true); // Then show the confirmation dialog
  };

  // Handle actual logout after confirmation
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

  // Close all dropdowns
  const closeDropdowns = () => {
    setResourcesOpen(false);
    setCompanyOpen(false);
    setUserDropdownOpen(false);
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };



  // Get navigation groups from helper
  const { resourcesItems, companyItems } = getNavigationGroups();

  // Main navigation items - using your existing categories plus Home
  const mainNavItems = [
    {
      name: "Home",
      to: APP_ROUTES.HOME,
      icon: <Home className="w-4 h-4" />,
      active: isRouteActive(currentPath, APP_ROUTES.HOME)
    },
    {
      name: "Businesses",
      to: APP_ROUTES.MARKETPLACE.BUSINESS,
      icon: <Building className="w-4 h-4" />,
      active: isRouteActive(currentPath, APP_ROUTES.MARKETPLACE.BUSINESS)
    },
    {
      name: "Franchises",
      to: APP_ROUTES.MARKETPLACE.FRANCHISE,
      icon: <TrendingUp className="w-4 h-4" />,
      active: isRouteActive(currentPath, APP_ROUTES.MARKETPLACE.FRANCHISE)
    },
    {
      name: "Startups",
      to: APP_ROUTES.MARKETPLACE.STARTUP,
      icon: <Lightbulb className="w-4 h-4" />,
      active: isRouteActive(currentPath, APP_ROUTES.MARKETPLACE.STARTUP)
    },
    {
      name: "Investors",
      to: APP_ROUTES.MARKETPLACE.INVESTOR,
      icon: <Users className="w-4 h-4" />,
      active: isRouteActive(currentPath, APP_ROUTES.MARKETPLACE.INVESTOR)
    },
    {
      name: "Digital Assets",
      to: APP_ROUTES.MARKETPLACE.DIGITAL_ASSET,
      icon: <Globe className="w-4 h-4" />,
      active: isRouteActive(currentPath, APP_ROUTES.MARKETPLACE.DIGITAL_ASSET)
    }
  ];
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
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
              <DesktopNavigation
                mainNavItems={mainNavItems}
                resourcesOpen={resourcesOpen}
                setResourcesOpen={setResourcesOpen}
                companyOpen={companyOpen}
                setCompanyOpen={setCompanyOpen}
                resourcesRef={resourcesRef}
                companyRef={companyRef}
                resourcesItems={resourcesItems}
                companyItems={companyItems}
                closeDropdowns={closeDropdowns}
                currentPath={currentPath}
              />
            </div>

            {/* Auth Buttons */}
            <AuthButtons
              showMobileMenu={mobileMenuOpen}
              setShowMobileMenu={setMobileMenuOpen}
              isAuthenticated={!!currentUser}
              userProfile={userProfile}
              openAuthModal={openAuthModal}
              handleLogoutClick={handleLogoutClick}
              userDropdownOpen={userDropdownOpen}
              setUserDropdownOpen={setUserDropdownOpen}
              userDropdownRef={userDropdownRef}
            />
          </div>
        </div>
      </div>


      {/* Secondary Navigation Row - Only visible on xl screens */}
      <SecondaryNavigation
        mainNavItems={mainNavItems}
        resourcesRef={resourcesRef}
        companyRef={companyRef}
        resourcesOpen={resourcesOpen}
        setResourcesOpen={setResourcesOpen}
        companyOpen={companyOpen}
        setCompanyOpen={setCompanyOpen}
        resourcesItems={resourcesItems}
        companyItems={companyItems}
        closeDropdowns={closeDropdowns}
        currentPath={currentPath}
      />
      {/* Mobile/Tablet Menu */}
      <MobileNavMenu
        isOpen={mobileMenuOpen}
        mainNavItems={mainNavItems}
        resourcesItems={resourcesItems}
        companyItems={companyItems}
        onItemClick={closeMobileMenu}
        currentPath={currentPath}
      />

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <LogoutConfirmationDialog
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