import React, { useState, Suspense } from 'react';
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
  Home
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { APP_ROUTES } from '../utils/constants';

/**
 * DashboardLayout Component
 * Layout for authenticated dashboard pages
 */
function DashboardLayout() {
  const { userProfile, signout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [entityMenuOpen, setEntityMenuOpen] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signout();
      navigate(APP_ROUTES.HOME);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if a route is active
  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Menu items configuration
  const menuItems = [
    {
      label: 'Dashboard',
      icon: <Home size={20} />,
      path: APP_ROUTES.DASHBOARD.ROOT,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.ROOT)
    },
    {
      label: 'My Profile',
      icon: <User size={20} />,
      path: APP_ROUTES.DASHBOARD.PROFILE,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.PROFILE)
    },
    {
      label: 'My Entities',
      icon: <Building size={20} />,
      path: APP_ROUTES.DASHBOARD.ENTITIES,
      active: location.pathname.includes('entities'),
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
      label: 'My Connects',
      icon: <Layers size={20} />,
      path: APP_ROUTES.DASHBOARD.CONNECTS,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.CONNECTS)
    },
    {
      label: 'Messages',
      icon: <MessageSquare size={20} />,
      path: APP_ROUTES.DASHBOARD.MESSAGES,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.MESSAGES)
    },
    {
      label: 'Settings',
      icon: <Settings size={20} />,
      path: APP_ROUTES.DASHBOARD.SETTINGS,
      active: isActiveRoute(APP_ROUTES.DASHBOARD.SETTINGS)
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            className="mr-4 text-gray-500 md:hidden" 
            onClick={toggleSidebar}
          >
            <Menu size={24} />
          </button>
          <Link to={APP_ROUTES.HOME} className="text-xl font-bold text-blue-600">
            BusinessOptions
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center">
            <span className="text-sm text-gray-600 mr-2">
              {userProfile?.displayName || 'User'}
            </span>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {userProfile?.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
          <Link to={APP_ROUTES.DASHBOARD.ADD_ENTITY} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm flex items-center">
            <PlusCircle size={16} className="mr-1" />
            <span className="hidden md:inline">Add Entity</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 py-6 px-4">
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.submenu ? (
                    <div className="space-y-1">
                      <button
                        className={`w-full flex items-center justify-between px-4 py-2 text-left rounded-md ${
                          item.active
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setEntityMenuOpen(!entityMenuOpen)}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                        </div>
                        {entityMenuOpen ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </button>
                      
                      {entityMenuOpen && (
                        <ul className="pl-10 space-y-1">
                          {item.submenu.map((subitem, subindex) => (
                            <li key={subindex}>
                              <Link
                                to={subitem.path}
                                className={`block px-4 py-2 rounded-md text-sm ${
                                  subitem.active
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {subitem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-md ${
                        item.active
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
              
              <li className="pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <LogOut size={20} />
                  <span className="ml-3">Logout</span>
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleSidebar}></div>
            <div className="relative flex flex-col w-full max-w-xs h-full bg-white">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-medium">Menu</h2>
                <button onClick={toggleSidebar} className="text-gray-500">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                <nav>
                  <ul className="space-y-2">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        {item.submenu ? (
                          <div className="space-y-1">
                            <button
                              className={`w-full flex items-center justify-between px-4 py-2 text-left rounded-md ${
                                item.active
                                  ? 'text-blue-600 bg-blue-50'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                              onClick={() => setEntityMenuOpen(!entityMenuOpen)}
                            >
                              <div className="flex items-center">
                                {item.icon}
                                <span className="ml-3">{item.label}</span>
                              </div>
                              {entityMenuOpen ? (
                                <ChevronDown size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                            </button>
                            
                            {entityMenuOpen && (
                              <ul className="pl-10 space-y-1">
                                {item.submenu.map((subitem, subindex) => (
                                  <li key={subindex}>
                                    <Link
                                      to={subitem.path}
                                      className={`block px-4 py-2 rounded-md text-sm ${
                                        subitem.active
                                          ? 'text-blue-600 bg-blue-50'
                                          : 'text-gray-700 hover:bg-gray-100'
                                      }`}
                                      onClick={toggleSidebar}
                                    >
                                      {subitem.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          <Link
                            to={item.path}
                            className={`flex items-center px-4 py-2 rounded-md ${
                              item.active
                                ? 'text-blue-600 bg-blue-50'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={toggleSidebar}
                          >
                            {item.icon}
                            <span className="ml-3">{item.label}</span>
                          </Link>
                        )}
                      </li>
                    ))}
                    
                    <li className="pt-4 mt-4 border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-md"
                      >
                        <LogOut size={20} />
                        <span className="ml-3">Logout</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 p-6">
          <Suspense fallback={
            <div className="flex justify-center items-center h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;