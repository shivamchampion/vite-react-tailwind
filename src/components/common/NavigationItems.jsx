import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { isRouteActive } from '../../utils/navigationHelpers';

/**
 * Navigation Item Component
 * Renders a navigation link with consistent styling
 */
export const NavItem = ({ 
  to, 
  href, 
  iconName, 
  icon, 
  children, 
  className = "", 
  onClick, 
  active 
}) => {
  // Determine if the item is active based on the prop or className
  const isActive = active || className.includes('text-indigo-700');

  // Get the appropriate icon component
  const IconComponent = iconName ? Icons[iconName] : null;
  const displayIcon = icon || (IconComponent ? <IconComponent className="w-4 h-4" /> : null);

  // Base class for both link types
  const baseClass = `flex items-center font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${
    isActive
      ? 'text-indigo-700 bg-white shadow-sm'
      : 'text-gray-700 hover:text-indigo-700'
  } ${className}`;

  // Handle item click with event stopping
  const handleItemClick = (e) => {
    if (onClick) {
      onClick(e);
      e.stopPropagation(); // Prevent event bubbling
    }
  };

  // Use Link for internal navigation, anchor for external links
  if (to) {
    return (
      <Link
        to={to}
        className={baseClass}
        onClick={handleItemClick}
      >
        {displayIcon && <span className="flex-shrink-0">{displayIcon}</span>}
        <span className={displayIcon ? "ml-1.5" : ""}>{children}</span>
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={baseClass}
      onClick={handleItemClick}
    >
      {displayIcon && <span className="flex-shrink-0">{displayIcon}</span>}
      <span className={displayIcon ? "ml-1.5" : ""}>{children}</span>
    </a>
  );
};

/**
 * Mobile Menu Item Component
 * Renders a navigation item optimized for mobile display
 */
export const MobileMenuItem = ({ to, href, iconName, icon, children, onClick, active }) => {
  // Get the appropriate icon component
  const IconComponent = iconName ? Icons[iconName] : null;
  const displayIcon = icon || (IconComponent ? <IconComponent className="w-5 h-5" /> : null);

  // Calculate base class
  const baseClass = `flex items-center px-3 py-2.5 rounded-md text-sm ${
    active
      ? 'bg-indigo-50 text-indigo-700 font-medium'
      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
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
        {displayIcon && (
          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-2">
            {displayIcon}
          </span>
        )}
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
      {displayIcon && (
        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-2">
          {displayIcon}
        </span>
      )}
      <span>{children}</span>
    </a>
  );
};