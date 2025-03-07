import React, { useState, Suspense, useRef, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building,
  User,
  MessageSquare,
  Settings,
  PlusCircle,
  Layers,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Briefcase,
  Shield,
  Bell,
  CreditCard
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { APP_ROUTES } from '../utils/constants';

/**
 * Simple Logout Confirmation Dialog Component
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
            className="mt-3 sm:mt-0 w-full sm:w-auto sm:ml-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm"
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
 * DashboardLayout Component
 * Layout for authenticated dashboard pages with improved styling
 */
function DashboardLayout() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { userProfile, signout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [entityMenuOpen, setEntityMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Refs for dropdown menus (for detecting clicks outside)
  const userDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Safe access to user profile data
  const displayName = userProfile?.displayName || 'User';
  const userInitial = displayName[0]?.toUpperCase() || 'U';

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
  // Check if a route is active
  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  // Check if a route is part of an active section
  const isActiveSection = (sectionPath) => {
    return location.pathname.includes(sectionPath);
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
// Main Navigation Items
const menuItems = [
  {
    label: 'Dashboard',
    icon: <Home size={20} />,
    path: APP_ROUTES.DASHBOARD.ROOT,
    active: isActiveRoute(APP_ROUTES.DASHBOARD.ROOT)
  },
  {
    label: 'My Entities',
    icon: <Building size={20} />,
    path: APP_ROUTES.DASHBOARD.ENTITIES,
    active: isActiveSection('entities'),
    submenu: [
      {
        label: 'All Entities',
        path: APP_ROUTES.DASHBOARD.ENTITIES,
        active: isActiveRoute(APP_ROUTES.DASHBOARD.ENTITIES)
      },
      {
        label: 'Add New Entity',
        path: APP_ROUTES.DASHBOARD.ADD_ENTITY,
        active: isActiveRoute(APP_ROUTES.DASHBOARD.ADD_ENTITY)
      }
    ]
  },
  {
    label: 'Connects',
    icon: <Layers size={20} />,
    path: APP_ROUTES.DASHBOARD.CONNECTS,
    active: isActiveRoute(APP_ROUTES.DASHBOARD.CONNECTS)
  },
  {
    label: 'Messages',
    icon: <MessageSquare size={20} />,
    path: APP_ROUTES.DASHBOARD.MESSAGES,
    active: isActiveRoute(APP_ROUTES.DASHBOARD.MESSAGES)
  }
];

// Account Management Items
const accountManagementItems = [
  {
    label: 'Security',
    icon: <Shield size={20} />,
    path: `${APP_ROUTES.DASHBOARD.SETTINGS}#security`,
    active: isActiveSection('security')
  },
  {
    label: 'Notification Preferences',
    icon: <Bell size={20} />,
    path: `${APP_ROUTES.DASHBOARD.SETTINGS}#notifications`,
    active: isActiveSection('notifications')
  },
  {
    label: 'Billing & Subscription',
    icon: <CreditCard size={20} />,
    path: `${APP_ROUTES.DASHBOARD.SETTINGS}#billing`,
    active: isActiveSection('billing')
  }
];
const UserDropdown = () => (
  <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
    {/* User Profile Header */}
    <div className="py-4 px-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
      <div className="flex items-center">
        <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white mr-3">
          {userInitial}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-indigo-800">{displayName}</h3>
          <p className="text-xs text-indigo-600">{userProfile?.email}</p>
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="py-2">
      <h4 className="px-4 text-xs font-medium text-gray-500 mb-2">Quick Actions</h4>
      
      <Link 
        to={APP_ROUTES.DASHBOARD.PROFILE} 
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
        onClick={() => setUserDropdownOpen(false)}
      >
        <User size={16} className="mr-3 text-indigo-500" />
        Edit Profile
      </Link>
      
      <Link 
        to={APP_ROUTES.DASHBOARD.SETTINGS} 
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
        onClick={() => setUserDropdownOpen(false)}
      >
        <Settings size={16} className="mr-3 text-indigo-500" />
        Account Settings
      </Link>
      
      <button 
        onClick={handleLogoutClick}
        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        <LogOut size={16} className="mr-3 text-red-500" />
        Logout
      </button>
    </div>
  </div>
);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <div className="border-b border-gray-200 bg-gradient-to-r from-white via-white via-55% to-indigo-50">
          <div className="max-w-[2560px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12">
            <div className="flex items-center justify-between h-16 lg:h-18">
              {/* Logo and Mobile Menu Toggle */}
              <div className="flex items-center">
                <button
                  className="mr-4 text-indigo-600 hover:text-indigo-800 md:hidden focus:outline-none"
                  onClick={toggleSidebar}
                >
                  <Menu size={24} />
                </button>
                <Link to={APP_ROUTES.HOME} className="flex items-center">
                  <img src="/src/logo.png" alt="Business Options Logo" className="h-8 sm:h-10 md:h-12" />
                </Link>
              </div>

              {/* Center area - can be used for breadcrumbs or other elements in the future */}
              <div className="hidden md:flex"></div>

              {/* User Menu - Right */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 ${userDropdownOpen ? 'text-indigo-700 bg-white shadow-sm' : ''}`}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white mr-2">
                    {userInitial}
                  </div>
                  <span className="hidden md:block">{displayName}</span>
                  <ChevronDown className={`ml-1.5 w-4 h-4 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && <UserDropdown />}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block w-64 bg-gradient-to-br from-white to-indigo-50 border-r border-gray-200 fixed inset-y-16 left-0 z-20 overflow-y-auto transition-all lg:h-18">
          <nav className="py-6 px-4">
            {/* User info section at top of sidebar */}
            <div className="mb-6 pb-6 border-b border-indigo-100">
              <div className="flex items-center px-3 py-3 bg-white rounded-lg shadow-sm">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white mr-3">
                  {userInitial}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{displayName}</p>
                  <p className="text-xs text-indigo-600">Dashboard</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {menuItems.map((item, index) => (
                <div key={index}>
                  {item.submenu ? (
                    <div className="space-y-1 mb-2">
                      <button
                        className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-xl transition-all duration-200 ${item.active
                            ? 'text-white bg-gradient-to-r from-indigo-600 to-indigo-700 font-medium shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800'
                            : 'text-gray-700 hover:bg-white hover:shadow-sm hover:text-indigo-600'
                          }`}
                        onClick={() => setEntityMenuOpen(!entityMenuOpen)}
                      >
                        <div className="flex items-center">
                          <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg mr-3 ${item.active ? 'text-indigo-100 bg-indigo-700' : 'text-indigo-600 bg-white shadow-sm'
                            }`}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {entityMenuOpen ? (
                          <ChevronDown size={16} className={item.active ? "text-indigo-100" : ""} />
                        ) : (
                          <ChevronRight size={16} className={item.active ? "text-indigo-100" : ""} />
                        )}
                      </button>

                      {entityMenuOpen && (
                        <div className="ml-10 mt-1 space-y-1 bg-white rounded-lg p-2 shadow-sm">
                          {item.submenu.map((subitem, subindex) => (
                            <Link
                              key={subindex}
                              to={subitem.path}
                              className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${subitem.active
                                  ? 'text-white bg-gradient-to-r from-indigo-500 to-indigo-600 font-medium shadow-sm'
                                  : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                                }`}
                            >
                              {subitem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${item.active
                          ? 'text-white bg-gradient-to-r from-indigo-600 to-indigo-700 font-medium shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-indigo-800'
                          : 'text-gray-700 hover:bg-white hover:shadow-sm hover:text-indigo-600'
                        }`}
                    >
                      <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg mr-3 ${item.active ? 'text-indigo-100 bg-indigo-700' : 'text-indigo-600 bg-white shadow-sm'
                        }`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-indigo-100">
              <Link
                to={APP_ROUTES.DASHBOARD.ADD_ENTITY}
                className="flex items-center px-4 py-3 text-white bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200"
              >
                <PlusCircle size={18} className="mr-2" />
                <span>Create New Entity</span>
              </Link>

              <Link
                to={APP_ROUTES.HOME}
                className="flex items-center px-4 py-3 mt-3 text-gray-700 bg-white hover:bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                <Home size={18} className="mr-2" />
                <span>Back to Homepage</span>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Mobile sidebar */}
        {/* Mobile Sidebar */}
{sidebarOpen && (
  <div className="fixed inset-0 z-40 md:hidden">
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
    <div className="relative flex flex-col w-full max-w-xs h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b bg-gradient-to-r from-indigo-600 to-indigo-700">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-indigo-600 mr-3">
            {userInitial}
          </div>
          <div>
            <h2 className="text-lg font-medium text-white">{displayName}</h2>
            <p className="text-xs text-indigo-100">Dashboard Menu</p>
          </div>
        </div>
        <button onClick={toggleSidebar} className="text-white hover:text-indigo-200 focus:outline-none">
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-indigo-50 to-white">
        <nav>
          {/* Main Navigation Section */}
          <div className="space-y-3 mb-6">
            <div className="px-3 py-2 text-indigo-700 font-medium">
              Main Navigation
            </div>
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.submenu ? (
                  <div className="space-y-1">
                    <button
                      className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-xl transition-all ${
                        item.active
                          ? 'text-white bg-gradient-to-r from-indigo-600 to-indigo-700 font-medium shadow-md'
                          : 'text-gray-700 hover:bg-white hover:shadow-sm hover:text-indigo-600'
                      }`}
                      onClick={() => setEntityMenuOpen(!entityMenuOpen)}
                    >
                      <div className="flex items-center">
                        <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg mr-3 ${
                          item.active ? 'text-indigo-100 bg-indigo-700' : 'text-indigo-600 bg-white shadow-sm'
                        }`}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      {entityMenuOpen ? (
                        <ChevronDown size={16} className={item.active ? "text-indigo-100" : ""} />
                      ) : (
                        <ChevronRight size={16} className={item.active ? "text-indigo-100" : ""} />
                      )}
                    </button>
                    
                    {entityMenuOpen && (
                      <div className="ml-10 mt-1 space-y-1 bg-white rounded-lg p-2 shadow-sm">
                        {item.submenu.map((subitem, subindex) => (
                          <Link
                            key={subindex}
                            to={subitem.path}
                            className={`block px-4 py-2 rounded-lg text-sm transition-colors duration-200 ${
                              subitem.active
                                ? 'text-white bg-gradient-to-r from-indigo-500 to-indigo-600 font-medium shadow-sm'
                                : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                            }`}
                            onClick={toggleSidebar}
                          >
                            {subitem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                      item.active
                        ? 'text-white bg-gradient-to-r from-indigo-600 to-indigo-700 font-medium shadow-md'
                        : 'text-gray-700 hover:bg-white hover:shadow-sm hover:text-indigo-600'
                    }`}
                    onClick={toggleSidebar}
                  >
                    <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg mr-3 ${
                      item.active ? 'text-indigo-100 bg-indigo-700' : 'text-indigo-600 bg-white shadow-sm'
                    }`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Account Management Section */}
          <div className="mt-6 pt-6 border-t border-indigo-100 space-y-3">
            <div className="px-3 py-2 text-indigo-700 font-medium">
              Account Management
            </div>
            {accountManagementItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  item.active
                    ? 'text-white bg-gradient-to-r from-indigo-600 to-indigo-700 font-medium shadow-md'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm hover:text-indigo-600'
                }`}
                onClick={toggleSidebar}
              >
                <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg mr-3 ${
                  item.active ? 'text-indigo-100 bg-indigo-700' : 'text-indigo-600 bg-white shadow-sm'
                }`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  </div>
)}
        {/* Main content */}
        <main className="flex-1 md:ml-64 p-6">
          <Suspense fallback={
            <div className="flex justify-center items-center h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <LogoutConfirmationDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        isLoading={logoutLoading}
      />
    </div>
  );
}

export default DashboardLayout;