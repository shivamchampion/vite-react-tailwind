import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { isRouteActive } from '../../utils/navigationHelpers';

/**
 * Dropdown Menu Item Component
 * Handles individual menu items within dropdowns
 */
export const DropdownMenuItem = ({ to, href, icon, children, onClick, active }) => {
  // Base class with conditional active state
  const baseClass = `flex items-center px-4 py-3 text-sm transition-all duration-200 border-l-2 ${
    active
      ? 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-500'
      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 border-transparent hover:border-indigo-500'
  }`;

  // Handle item click with event stopping
  const handleItemClick = (e) => {
    if (onClick) {
      onClick(e);
      e.stopPropagation(); // Prevent event bubbling
    }
  };

  if (to) {
    return (
      <Link
        to={to}
        className={baseClass}
        onClick={handleItemClick}
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
      onClick={handleItemClick}
    >
      <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-3">
        {icon}
      </span>
      <span>{children}</span>
    </a>
  );
};

/**
 * Main Dropdown Menu Component
 * Renders a dropdown menu with the appropriate styling based on type
 */
export const DropdownMenu = ({ type, items, onItemClick, currentPath, className = '' }) => {
  // Debug output
  console.log(`Rendering ${type} dropdown with ${items?.length || 0} items`);
  
  // Safety check
  if (!items || items.length === 0) {
    console.warn(`No items provided for ${type} dropdown`);
    return null;
  }

  // Determine position and styling based on type
  const position = type === 'company' ? 'right-0' : 'left-0';
  
  return (
    <div 
      className={`absolute ${position} mt-1 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 ${className}`}
      style={{ 
        minWidth: type === 'resources' ? '18rem' : '16rem',
        display: 'block', // Force display
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Dropdown header */}
      <div className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
        <h3 className="text-sm font-medium text-indigo-800">
          {type === 'resources' ? 'Platform Resources' : 'Our Company'}
        </h3>
        {type === 'resources' && (
          <p className="text-xs text-indigo-600 mt-0.5">
            Helpful guides to maximize your experience
          </p>
        )}
      </div>
      
      {/* Dropdown items */}
      <div className="py-1">
        {items.map((item) => (
          <DropdownMenuItem
            key={item.name}
            to={item.to}
            href={item.href}
            icon={item.icon}
            onClick={onItemClick}
            active={item.to && isRouteActive(currentPath, item.to)}
          >
            {item.name}
          </DropdownMenuItem>
        ))}
      </div>
      
      {/* Dropdown footer (resources only) */}
      {type === 'resources' && (
        <div className="mt-1 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100">
          <Link 
            to="/all-resources" 
            className="text-xs text-indigo-700 hover:text-indigo-900 font-medium flex items-center"
            onClick={onItemClick}
          >
            View all resources
            <ChevronRight size={14} className="ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
};