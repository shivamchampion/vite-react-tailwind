import React, { useRef, useEffect } from 'react';
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

  // Render link or anchor based on prop
  const renderLink = (linkProps) => {
    const { children: linkChildren, ...rest } = linkProps;
    return to ? (
      <Link 
        {...rest} 
        to={to} 
        className={baseClass}
      >
        {icon && (
          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-3">
            {icon}
          </span>
        )}
        <span>{linkChildren}</span>
      </Link>
    ) : (
      <a 
        {...rest} 
        href={href} 
        className={baseClass}
      >
        {icon && (
          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-3">
            {icon}
          </span>
        )}
        <span>{linkChildren}</span>
      </a>
    );
  };

  // Handle item click with comprehensive event stopping
  const handleClick = (e) => {
    // Prevent event from bubbling up
    e.stopPropagation();
    
    // Call onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  return renderLink({ 
    children, 
    onClick: handleClick,
    'data-dropdown-item': 'true' 
  });
};

/**
 * Main Dropdown Menu Component
 * Renders a dropdown menu with the appropriate styling based on type
 */
export const DropdownMenu = ({ 
  type, 
  items, 
  onItemClick, 
  currentPath, 
  className = '',
  onClose 
}) => {
  const dropdownRef = useRef(null);

  // Add event listener to handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if the click was outside the dropdown
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        // Ensure the click wasn't on the dropdown trigger
        !event.target.closest('[aria-expanded="true"]')
      ) {
        onClose && onClose();
      }
    };

    // Add event listener to document
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Safety check
  if (!items || items.length === 0) {
    console.warn(`No items provided for ${type} dropdown`);
    return null;
  }

  return (
    <div 
      ref={dropdownRef}
      className={`absolute ${type === 'company' ? 'right-0' : 'left-0'} 
        mt-1 bg-white rounded-lg shadow-xl border border-gray-100 
        overflow-hidden z-[9999] min-w-[16rem] ${className}`}
      onClick={(e) => {
        // Prevent clicks inside dropdown from closing it
        e.stopPropagation();
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
            onClick={(e) => {
              e.stopPropagation();
              if (onItemClick) onItemClick(e);
            }}
          >
            View all resources
            <ChevronRight size={14} className="ml-1" />
          </Link>
        </div>
      )}
    </div>
  );
};