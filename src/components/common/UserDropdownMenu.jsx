import React from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { APP_ROUTES } from '../../utils/constants';

/**
 * User Menu Item Component
 * Individual item in the user dropdown menu
 */
const UserMenuItem = ({ to, icon, children, onClick, className = '', danger = false }) => {
  const baseClass = `flex items-center px-4 py-3 text-sm ${
    danger 
      ? 'text-red-600 hover:bg-indigo-50 hover:text-red-700' 
      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
  } transition-all duration-200 border-l-2 border-transparent hover:border-${danger ? 'red' : 'indigo'}-500 ${className}`;

  return (
    <Link
      to={to}
      className={baseClass}
      onClick={onClick}
    >
      <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center ${
        danger 
          ? 'text-red-600 bg-red-100' 
          : 'text-indigo-600 bg-indigo-100'
      } rounded-md mr-3`}>
        {icon}
      </span>
      <span>{children}</span>
    </Link>
  );
};

/**
 * User Dropdown Menu Component
 * Displays user-related actions in a dropdown
 */
export const UserDropdownMenu = ({ userProfile, handleLogoutClick }) => {
  return (
    <div 
      className="absolute right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50"
      style={{ 
        minWidth: '16rem',
        display: 'block', // Force display
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* User Profile Header */}
      <div className="py-3 px-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center text-white mr-3">
            {userProfile?.displayName?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-indigo-800">{userProfile?.displayName || 'User'}</h3>
            <p className="text-xs text-indigo-600">{userProfile?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        <UserMenuItem to={APP_ROUTES.DASHBOARD.ROOT} icon={<User size={16} />}>
          Dashboard
        </UserMenuItem>
        
        <UserMenuItem to={APP_ROUTES.DASHBOARD.PROFILE} icon={<User size={16} />}>
          Profile
        </UserMenuItem>
        
        <UserMenuItem to={APP_ROUTES.DASHBOARD.SETTINGS} icon={<Settings size={16} />}>
          Settings
        </UserMenuItem>
        
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
};