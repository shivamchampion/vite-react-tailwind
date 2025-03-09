import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { isRouteActive } from '../../utils/navigationHelpers';

/**
 * Dropdown Menu Item Component
 * Handles individual menu items within dropdowns
 */
export const DropdownMenuItem = ({ to, href, icon, children, onClick, active }) => {
    const navigate = useNavigate();

    // Base class with conditional active state
    const baseClass = `flex items-center px-4 py-3 text-sm transition-all duration-200 border-l-2 cursor-pointer ${active
        ? 'bg-indigo-50 text-indigo-700 border-l-2 border-indigo-500'
        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 border-transparent hover:border-indigo-500'
        }`;

    // Handle item click
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Prioritize 'to' prop for navigation
        if (to) {
            navigate(to);
        } else if (href) {
            // If href is external, use window.location
            window.location.href = href;
        }

        // Call additional onClick if provided
        if (onClick) {
            onClick(e);
        }
    };

    return (
        <div
        className={baseClass}
        role="menuitem"
        tabIndex={0}
        aria-label={typeof children === 'string' ? children : undefined}
        onClick={handleClick}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick(e);
            }
        }}
    >
        {icon && (
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-indigo-600 bg-indigo-100 rounded-md mr-3">
                {icon}
            </span>
        )}
        <span>{children}</span>
    </div>
    );
};

/**
 * Main Dropdown Menu Component
 */
export const DropdownMenu = ({
    type,
    items,
    onItemClick,
    currentPath,
    className = '',
    onClose,
    id
}) => {
    const location = useLocation();

    // Safety check
    if (!items || items.length === 0) {
        console.warn(`No items provided for ${type} dropdown`);
        return null;
    }

    return (
        <div
            className={`dropdown-menu absolute ${type === 'company' ? 'right-0' : 'left-0'} 
                mt-1 bg-white rounded-lg shadow-xl border border-gray-100 
                overflow-hidden min-w-[16rem] ${className}`}
            style={{
                zIndex: 9999,  // Ensure high z-index
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby={`${type}-menu-button`}
            id={id}
            onClick={(e) => e.stopPropagation()}
        >
            {/* Dropdown header */}
            <div className="py-2 px-3 bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-100">
                <h3 className="text-sm font-medium text-indigo-800">
                    {type === 'resources' ? 'Platform Resources' : 'Our Company'}
                </h3>
                {type === 'resources' ? (
                    <p className="text-xs text-indigo-600 mt-0.5">
                        Helpful guides to maximize your experience
                    </p>
                ) : (
                    <p className="text-xs text-indigo-600 mt-0.5">
                        Learn about who we are and what we do
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
                        active={item.to ? isRouteActive(location.pathname, item.to) : false}
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
                            e.preventDefault();
                            e.stopPropagation();
                            if (onItemClick) onItemClick();
                            navigate("/all-resources");
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