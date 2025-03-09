import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  Building, 
  LayoutDashboard, 
  User, 
  LogOut, 
  MessageSquare, 
  Settings, 
  Heart, 
  Clock, 
  Search as SearchIcon, 
  BarChart2,
  Users, 
  Menu, 
  X,
  Bell,
  ChevronDown,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { APP_ROUTES } from '../utils/constants';

/**
 * DashboardLayout Component
 * Main layout wrapper for all dashboard pages
 */
function DashboardLayout() {
  const { currentUser, userProfile, signout } = useAuth(); // Updated from 'logout' to 'signout' to match your context
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate(APP_ROUTES.HOME);
    }
  }, [currentUser, navigate]);
  
  // Check if a route is active
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await signout(); // Using signout from your AuthContext
      navigate(APP_ROUTES.HOME);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Navigation menu items
  const menuItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: APP_ROUTES.DASHBOARD.ROOT,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.ROOT)
    },
    {
      label: 'My Listings',
      icon: <Building size={20} />,
      path: APP_ROUTES.DASHBOARD.LISTINGS,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.LISTINGS)
    },
    {
      label: 'Favorites',
      icon: <Heart size={20} />,
      path: APP_ROUTES.DASHBOARD.FAVORITES,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.FAVORITES)
    },
    {
      label: 'Recently Viewed',
      icon: <Clock size={20} />,
      path: APP_ROUTES.DASHBOARD.RECENTLY_VIEWED,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.RECENTLY_VIEWED)
    },
    {
      label: 'Saved Searches',
      icon: <SearchIcon size={20} />,
      path: APP_ROUTES.DASHBOARD.SAVED_SEARCHES,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.SAVED_SEARCHES)
    },
    {
      label: 'Analytics',
      icon: <BarChart2 size={20} />,
      path: APP_ROUTES.DASHBOARD.ANALYTICS,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.ANALYTICS)
    },
    {
      label: 'Messages',
      icon: <MessageSquare size={20} />,
      path: APP_ROUTES.DASHBOARD.MESSAGES,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.MESSAGES)
    },
    {
      label: 'Connects',
      icon: <Users size={20} />,
      path: APP_ROUTES.DASHBOARD.CONNECTS,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.CONNECTS)
    },
    {
      label: 'Profile',
      icon: <User size={20} />,
      path: APP_ROUTES.DASHBOARD.PROFILE,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.PROFILE)
    },
    {
      label: 'Settings',
      icon: <Settings size={20} />,
      path: APP_ROUTES.DASHBOARD.SETTINGS,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.SETTINGS)
    }
  ];

  // Placeholder notifications
  const notifications = [
    {
      id: 1,
      title: 'New message',
      description: 'You have a new message from a potential buyer',
      time: '5 minutes ago',
      unread: true
    },
    {
      id: 2,
      title: 'Listing view',
      description: 'Your "Coffee Shop" listing received 5 new views',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 3,
      title: 'Subscription',
      description: 'Your Premium subscription will expire in 3 days',
      time: '1 day ago',
      unread: false
    }
  ];
  
  // If not authenticated, the useEffect hook will handle redirection
  if (!currentUser || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
      
      {/* Mobile sidebar menu */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <Link to={APP_ROUTES.HOME} className="flex items-center">
              <img 
                src="/src/logo.png" 
                alt="Business Options Logo"
                className="h-8"
              />
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pt-5 pb-4">
            <nav className="mt-2 px-2 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`group flex items-center px-4 py-3 rounded-md text-sm font-medium ${
                    item.active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={`mr-3 ${item.active ? 'text-indigo-500' : 'text-gray-500 group-hover:text-gray-700'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Desktop sidebar (always visible on desktop) */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:w-64 md:bg-white md:border-r md:border-gray-200">
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <Link to={APP_ROUTES.HOME} className="flex items-center">
              <img 
                src="/src/logo.png" 
                alt="Business Options Logo"
                className="h-8"
              />
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <nav className="mt-6 px-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`group flex items-center px-4 py-3 rounded-md text-sm font-medium ${
                    item.active
                      ? 'bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={`mr-3 ${item.active ? 'text-indigo-500' : 'text-gray-500 group-hover:text-gray-700'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            {userProfile && (
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  {userProfile.profileImage ? (
                    <img 
                      src={userProfile.profileImage}
                      alt={userProfile.displayName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-indigo-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {userProfile.displayName || (userProfile.firstName && userProfile.lastName 
                      ? `${userProfile.firstName} ${userProfile.lastName}`
                      : currentUser.email)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userProfile.plan || 'Basic'} Plan
                  </p>
                </div>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="md:pl-64">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 flex justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
          </div>
          
          <div className="flex items-center space-x-4 ml-auto">
            <Link
              to={APP_ROUTES.DASHBOARD.ADD_LISTING}
              className="hidden sm:inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus size={16} className="mr-2" />
              Add Listing
            </Link>
            
            {/* Notifications dropdown */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 relative"
              >
                <Bell size={20} />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
              
              {notificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-2 px-4 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-gray-200">
                        {notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={`p-4 ${notification.unread ? 'bg-blue-50' : ''}`}
                          >
                            <div className="flex items-start">
                              <div className="ml-3 w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {notification.description}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                  {notification.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm text-gray-500">No new notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="py-2 px-4 border-t border-gray-200 text-center">
                    <Link
                      to="/notifications"
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                      onClick={() => setNotificationsOpen(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  {userProfile?.profileImage ? (
                    <img 
                      src={userProfile.profileImage}
                      alt={userProfile.displayName}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <User size={16} className="text-indigo-500" />
                  )}
                </div>
                <span className="hidden md:block">{userProfile?.displayName || 'Account'}</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
              
              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    <Link
                      to={APP_ROUTES.DASHBOARD.PROFILE}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to={APP_ROUTES.DASHBOARD.SETTINGS}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;