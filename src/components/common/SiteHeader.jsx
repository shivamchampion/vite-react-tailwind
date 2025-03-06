import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  PlusCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { APP_ROUTES } from '../../utils/constants';

/**
 * Authentication buttons component
 */
const AuthButtons = ({
  isAuthenticated,
  currentUser,
  openAuthModal,
  userRef,
  userOpen,
  setUserOpen,
  userItems,
  handleLogout,
  showMobileMenu,
  setShowMobileMenu
}) => {
  const navigate = useNavigate();

  // Handle login button click
  const handleLoginClick = () => {
    if (typeof openAuthModal === 'function') {
      openAuthModal('login');
    } else {
      console.error("openAuthModal is not a function");
    }
  };

  // Handle register button click
  const handleRegisterClick = () => {
    if (typeof openAuthModal === 'function') {
      openAuthModal('register');
    } else {
      console.error("openAuthModal is not a function");
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-3 ml-auto">
      {/* Become an Advisor - visible on medium and large screens */}
      <Button
        className="hidden md:flex bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md items-center text-xs lg:text-sm whitespace-nowrap"
        variant="flat"
        onClick={() => navigate("/become-advisor")}
      >
        <Briefcase className="w-3.5 h-3.5 lg:w-4 lg:h-4 mr-1 lg:mr-1.5" />
        <span>Become an Advisor</span>
      </Button>

      <div className="hidden md:block h-8 w-[1px] bg-gray-200 mx-1"></div>

      {isAuthenticated ? (
        <>
          {/* User Profile Button */}
          <div className="relative" ref={userRef}>
            <button
              className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200 items-center text-xs sm:text-sm flex whitespace-nowrap px-2 sm:px-3 py-2 rounded"
              onClick={() => setUserOpen(!userOpen)}
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
              <span>{currentUser?.displayName || 'User'}</span>
              <ChevronDown className={`ml-1 w-3 h-3 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
            </button>

            {userOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                <div className="py-2 px-4 border-b border-gray-100">
                  <p className="font-medium text-gray-800">{currentUser?.displayName || 'User'}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email || ''}</p>
                </div>
                <div className="py-1">
                  {userItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                      onClick={() => setUserOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    to="/dashboard/add-entity"
                    className="block w-full text-left px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-medium"
                    onClick={() => setUserOpen(false)}
                  >
                    + Add New Listing
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      handleLogout();
                      setUserOpen(false);
                    }}
                  >
                    <span className="flex items-center">
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Login Button */}
          <button
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200 text-xs sm:text-sm px-2 sm:px-3 py-2 rounded flex items-center"
            onClick={handleLoginClick}
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5" />
            <span>Login</span>
          </button>

          {/* Register Button */}
          <button
            className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md text-xs sm:text-sm px-2 sm:px-3 py-2 rounded flex items-center"
            onClick={handleRegisterClick}
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 md:hidden" />
            <span>Register</span>
          </button>
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
};

/**
 * Desktop navigation component
 */
const DesktopNavigation = ({
  mainNavItems,
  resourcesOpen,
  setResourcesOpen,
  companyOpen,
  setCompanyOpen,
  userOpen,
  setUserOpen,
  resourcesRef,
  companyRef,
  userRef,
  resourcesItems,
  companyItems,
  userItems,
  isAuthenticated,
  onLogout,
  currentUser
}) => (
  <nav className="flex items-center space-x-1">
    {mainNavItems.map((item) => (
      <NavItem key={item.name} href={item.href} icon={item.icon}>
        {item.name}
      </NavItem>
    ))}

    {/* Resources Dropdown */}
    <div className="relative" ref={resourcesRef}>
      <button
        className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${resourcesOpen ? 'text-indigo-700 bg-white shadow-sm' : ''}`}
        onClick={() => {
          setResourcesOpen(!resourcesOpen);
          setCompanyOpen(false);
          if (setUserOpen) setUserOpen(false);
        }}
      >
        <BookOpen className="w-4 h-4 flex-shrink-0" />
        <span className="ml-1.5">Resources</span>
        <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
      </button>

      {resourcesOpen && (
        <div className="absolute left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 overflow-hidden">
          <div className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
            <h3 className="text-sm font-medium text-indigo-800">Platform Resources</h3>
            <p className="text-xs text-indigo-600 mt-0.5">Helpful guides to maximize your experience</p>
          </div>
          <div className="py-1">
            {resourcesItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 border-l-2 border-transparent hover:border-indigo-500"
              >
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-3">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
          <div className="mt-1 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100">
            <Link to="/all-resources" className="text-xs text-indigo-700 hover:text-indigo-900 font-medium flex items-center">
              View all resources
              <ChevronRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>
      )}
    </div>

    {/* Company Dropdown */}
    <div className="relative" ref={companyRef}>
      <button
        className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${companyOpen ? 'text-indigo-700 bg-white shadow-sm' : ''}`}
        onClick={() => {
          setCompanyOpen(!companyOpen);
          setResourcesOpen(false);
          if (setUserOpen) setUserOpen(false);
        }}
      >
        <Info className="w-4 h-4 flex-shrink-0" />
        <span className="ml-1.5">Company</span>
        <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${companyOpen ? 'rotate-180' : ''}`} />
      </button>

      {companyOpen && (
        <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
            <h3 className="text-sm font-medium text-indigo-800">Our Company</h3>
          </div>
          <div className="py-1">
            {companyItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 border-l-2 border-transparent hover:border-indigo-500"
              >
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-3">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* My Account Dropdown (only when authenticated) */}
    {isAuthenticated && (
      <div className="relative" ref={userRef}>
        <button
          className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${userOpen ? 'text-indigo-700 bg-white shadow-sm' : ''}`}
          onClick={() => {
            setUserOpen(!userOpen);
            setResourcesOpen(false);
            setCompanyOpen(false);
          }}
        >
          <User className="w-4 h-4 flex-shrink-0" />
          <span className="ml-1.5">{currentUser?.displayName || 'My Account'}</span>
          <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
        </button>

        {userOpen && (
          <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
            <div className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
              <h3 className="text-sm font-medium text-indigo-800">My Account</h3>
              <p className="text-xs text-gray-500 mt-0.5">{currentUser?.email || ''}</p>
            </div>
            <div className="py-1">
              {userItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 border-l-2 border-transparent hover:border-indigo-500"
                >
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-3">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              ))}
              <Link
                to="/dashboard/add-entity"
                className="flex items-center px-4 py-3 text-sm text-indigo-600 font-medium hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 border-l-2 border-transparent hover:border-indigo-500"
              >
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-3">
                  <PlusCircle size={16} />
                </span>
                <span>Add New Listing</span>
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={onLogout}
                className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 border-l-2 border-transparent hover:border-red-500"
              >
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-red-600 bg-red-100 rounded-md mr-3">
                  <LogOut size={16} />
                </span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    )}
  </nav>
);

/**
 * Mobile navigation menu component
 */
const MobileNavMenu = ({
  isOpen,
  mainNavItems,
  resourcesItems,
  companyItems,
  userItems,
  isAuthenticated,
  onLogout,
  openAuthModal,
  setMobileMenuOpen
}) => (
  <div className={`xl:hidden bg-white border-t border-gray-200 shadow-lg animate-slideDown ${isOpen ? 'block' : 'hidden'}`}>
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
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-3 py-2.5 text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-2">
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* User Account Section (when authenticated) */}
      {isAuthenticated ? (
        <div className="py-2">
          <div className="flex items-center px-3 py-2 text-indigo-700 font-medium">
            <User className="w-5 h-5 mr-2" />
            <span>My Account</span>
          </div>
          <div className="ml-4 pl-4 border-l-2 border-indigo-100">
            {userItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-3 py-2.5 text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-2">
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            ))}
            <Link
              to="/dashboard/add-entity"
              className="flex items-center px-3 py-2.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-md text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-2">
                <PlusCircle size={16} />
              </span>
              <span>Add New Listing</span>
            </Link>
            <button
              onClick={() => {
                onLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center w-full text-left px-3 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md text-sm"
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-red-600 bg-red-100 rounded-md mr-2">
                <LogOut size={16} />
              </span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="py-2 space-y-2">
          <button
            className="w-full bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200 py-2 px-4 rounded flex items-center justify-center"
            onClick={() => {
              if (typeof openAuthModal === 'function') {
                openAuthModal('login');
                setMobileMenuOpen(false);
              }
            }}
          >
            <User className="w-4 h-4 mr-1.5" />
            <span>Login</span>
          </button>

          <button
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md py-2 px-4 rounded flex items-center justify-center"
            onClick={() => {
              if (typeof openAuthModal === 'function') {
                openAuthModal('register');
                setMobileMenuOpen(false);
              }
            }}
          >
            <User className="w-4 h-4 mr-1.5" />
            <span>Register</span>
          </button>
        </div>
      )}

      {/* Resources Section */}
      <div className="py-2">
        <div className="flex items-center px-3 py-2 text-indigo-700 font-medium">
          <BookOpen className="w-5 h-5 mr-2" />
          <span>Resources</span>
        </div>
        <div className="ml-4 pl-4 border-l-2 border-indigo-100">
          {resourcesItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-3 py-2.5 text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-2">
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
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
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-3 py-2.5 text-gray-700 hover:text-indigo-700 hover:bg-indigo-50 rounded-md text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-2">
                {item.icon}
              </span>
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/**
 * Secondary navigation for xl screens
 */
const SecondaryNavigation = ({
  mainNavItems,
  resourcesRef,
  companyRef,
  userRef,
  resourcesOpen,
  setResourcesOpen,
  companyOpen,
  setCompanyOpen,
  userOpen,
  setUserOpen,
  isAuthenticated,
  currentUser
}) => (
  <div className="hidden xl:block 2xl:hidden border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-white to-indigo-50">
    <div className="max-w-[2560px] mx-auto px-8 xl:px-12">
      <div className="flex items-center justify-center h-12">
        <nav className="flex items-center space-x-2">
          {mainNavItems.map((item) => (
            <NavItem key={item.name} href={item.href} icon={item.icon} className="px-4">
              {item.name}
            </NavItem>
          ))}

          {/* Resources Dropdown */}
          <div className="relative" ref={resourcesRef}>
            <button
              className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-4 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${resourcesOpen ? 'text-indigo-700 bg-white shadow-sm' : ''}`}
              onClick={() => {
                setResourcesOpen(!resourcesOpen);
                setCompanyOpen(false);
                if (setUserOpen) setUserOpen(false);
              }}
            >
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              <span className="ml-1.5">Resources</span>
              <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Company Dropdown */}
          <div className="relative" ref={companyRef}>
            <button
              className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-4 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${companyOpen ? 'text-indigo-700 bg-white shadow-sm' : ''}`}
              onClick={() => {
                setCompanyOpen(!companyOpen);
                setResourcesOpen(false);
                if (setUserOpen) setUserOpen(false);
              }}
            >
              <Info className="w-4 h-4 flex-shrink-0" />
              <span className="ml-1.5">Company</span>
              <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${companyOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* User Dropdown (only when authenticated) */}
          {isAuthenticated && userRef && (
            <div className="relative" ref={userRef}>
              <button
                className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-4 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${userOpen ? 'text-indigo-700 bg-white shadow-sm' : ''}`}
                onClick={() => {
                  setUserOpen(!userOpen);
                  setResourcesOpen(false);
                  setCompanyOpen(false);
                }}
              >
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="ml-1.5">{currentUser?.displayName || 'My Account'}</span>
                <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${userOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          )}
        </nav>
      </div>
    </div>
  </div>
);

/**
 * Main site header component with responsive navigation
 */
const SiteHeader = ({ openAuthModal }) => {
  // Authentication state
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State for mobile menu and dropdowns
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  // Refs for dropdown menus (for detecting clicks outside)
  const resourcesRef = useRef(null);
  const companyRef = useRef(null);
  const userRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
        setResourcesOpen(false);
      }
      if (companyRef.current && !companyRef.current.contains(event.target)) {
        setCompanyOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log("Logging out user");
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Resources dropdown items
  const resourcesItems = [
    { name: "How to List Your Business", href: "/guides/list-business", icon: <Briefcase size={16} /> },
    { name: "How to Find Investments", href: "/guides/find-investments", icon: <Search size={16} /> },
    { name: "How to Value Your Business", href: "/tools/valuation", icon: <BarChart3 size={16} /> },
    { name: "Platform Guide", href: "/platform-guide", icon: <HelpCircle size={16} /> },
    { name: "Success Stories", href: "/success-stories", icon: <Award size={16} /> },
    { name: "Market Insights", href: "/market-insights", icon: <LineChart size={16} /> }
  ];

  // Company dropdown items
  const companyItems = [
    { name: "About Us", href: "/about", icon: <Info size={16} /> },
    { name: "Our Team", href: "/team", icon: <Users size={16} /> },
    { name: "Testimonials", href: "/testimonials", icon: <MessageSquare size={16} /> },
    { name: "Contact Us", href: "/contact", icon: <Mail size={16} /> }
  ];

  // User dropdown items
  const userItems = [
    { name: "Dashboard", href: "/dashboard", icon: <Home size={16} /> },
    { name: "My Profile", href: "/dashboard/profile", icon: <User size={16} /> },
    { name: "My Listings", href: "/dashboard/my-entities", icon: <Building size={16} /> },
    { name: "Settings", href: "/dashboard/settings", icon: <HelpCircle size={16} /> },
  ];

  // Main navigation items
  const mainNavItems = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
    { name: "Businesses", href: "/businesses", icon: <Building className="w-4 h-4" /> },
    { name: "Franchises", href: "/franchises", icon: <TrendingUp className="w-4 h-4" /> },
    { name: "Startups", href: "/startups", icon: <Lightbulb className="w-4 h-4" /> },
    { name: "Investors", href: "/investors", icon: <Users className="w-4 h-4" /> },
    { name: "Digital Assets", href: "/digital-assets", icon: <Globe className="w-4 h-4" /> }
  ];

  // Ensure openAuthModal is properly wrapped
  const handleOpenAuthModal = (tab) => {
    if (typeof openAuthModal === 'function') {
      openAuthModal(tab);
    } else {
      console.error("openAuthModal is not a function:", openAuthModal);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* Main header row */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-white via-white to-indigo-50">
        <div className="max-w-[2560px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center mr-2 sm:mr-4">
              <Link to="/">
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
                userOpen={userOpen}
                setUserOpen={setUserOpen}
                resourcesRef={resourcesRef}
                companyRef={companyRef}
                userRef={userRef}
                resourcesItems={resourcesItems}
                companyItems={companyItems}
                userItems={userItems}
                isAuthenticated={isAuthenticated}
                onLogout={handleLogout}
                currentUser={currentUser}
              />
            </div>

            {/* Auth Buttons */}
            <AuthButtons
              showMobileMenu={mobileMenuOpen}
              setShowMobileMenu={setMobileMenuOpen}
              isAuthenticated={isAuthenticated}
              currentUser={currentUser}
              openAuthModal={handleOpenAuthModal}
              userRef={userRef}
              userOpen={userOpen}
              setUserOpen={setUserOpen}
              userItems={userItems}
              handleLogout={handleLogout}
            />
          </div>
        </div>
      </div>

      {/* Secondary Navigation Row - Only visible on xl screens */}
      <SecondaryNavigation
        mainNavItems={mainNavItems}
        resourcesRef={resourcesRef}
        companyRef={companyRef}
        userRef={userRef}
        resourcesOpen={resourcesOpen}
        setResourcesOpen={setResourcesOpen}
        companyOpen={companyOpen}
        setCompanyOpen={setCompanyOpen}
        userOpen={userOpen}
        setUserOpen={setUserOpen}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
      />

      {/* Mobile/Tablet Menu */}
      <MobileNavMenu
        isOpen={mobileMenuOpen}
        mainNavItems={mainNavItems}
        resourcesItems={resourcesItems}
        companyItems={companyItems}
        userItems={userItems}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        openAuthModal={handleOpenAuthModal}
        setMobileMenuOpen={setMobileMenuOpen}
      />
    </header>
  );
};

/**
 * Navigation Item component for consistent styling across different navigation areas
 */
const NavItem = ({ href, icon, children, className = "", onClick = undefined }) => {
  const content = (
    <>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className={icon ? "ml-1.5" : ""}>{children}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${className}`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={href}
      className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${className}`}
    >
      {content}
    </Link>
  );
};

export default SiteHeader;