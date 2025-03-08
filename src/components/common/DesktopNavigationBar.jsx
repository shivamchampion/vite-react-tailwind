import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DropdownMenu } from './DropdownMenu';
import { BookOpen, Info, ChevronDown } from 'lucide-react';
import { isResourcesTabActive, isCompanyTabActive } from '../../utils/navigationHelpers';

/**
 * Main Desktop Navigation Bar
 * Renders main navigation links and dropdowns for desktop size
 */
export const DesktopNavigationBar = ({
  navItems,
  resourcesItems,
  companyItems,
  dropdownStates,
  toggleDropdown,
  closeAllDropdowns,
  currentPath
}) => {
  // Check if Resources or Company sections are active based on current path
  const isResourcesActive = isResourcesTabActive(currentPath);
  const isCompanyActive = isCompanyTabActive(currentPath);

  // Handler for dropdown button clicks
  const handleDropdownClick = (dropdownName) => (e) => {
    e.stopPropagation(); // Prevent event from bubbling up
    toggleDropdown(dropdownName);
  };

  return (
    <div className="flex items-center space-x-1">
      {/* Main Navigation Links */}
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.to}
          className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${
            item.active 
              ? 'text-indigo-700 bg-white shadow-sm' 
              : 'hover:text-indigo-700'
          }`}
        >
          {item.name}
        </Link>
      ))}

      {/* Resources Dropdown */}
      <div className="relative">
        <button
          type="button"
          className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${
            dropdownStates.resources || isResourcesActive 
              ? 'text-indigo-700 bg-white shadow-sm' 
              : 'hover:text-indigo-700'
          }`}
          onClick={handleDropdownClick('resources')}
          aria-expanded={dropdownStates.resources}
        >
          <BookOpen className="w-4 h-4 flex-shrink-0 mr-1.5" />
          <span>Resources</span>
          <ChevronDown 
            className={`ml-1.5 w-4 h-4 transition-transform ${
              dropdownStates.resources ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Resources Dropdown Menu */}
        {dropdownStates.resources && (
          <DropdownMenu
            type="resources"
            items={resourcesItems}
            onItemClick={closeAllDropdowns}
            currentPath={currentPath}
            onClose={() => toggleDropdown('resources')}
          />
        )}
      </div>

      {/* Company Dropdown */}
      <div className="relative">
        <button
          type="button"
          className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${
            dropdownStates.company || isCompanyActive 
              ? 'text-indigo-700 bg-white shadow-sm' 
              : 'hover:text-indigo-700'
          }`}
          onClick={handleDropdownClick('company')}
          aria-expanded={dropdownStates.company}
        >
          <Info className="w-4 h-4 flex-shrink-0 mr-1.5" />
          <span>Company</span>
          <ChevronDown 
            className={`ml-1.5 w-4 h-4 transition-transform ${
              dropdownStates.company ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Company Dropdown Menu */}
        {dropdownStates.company && (
          <DropdownMenu
            type="company"
            items={companyItems}
            onItemClick={closeAllDropdowns}
            currentPath={currentPath}
            onClose={() => toggleDropdown('company')}
          />
        )}
      </div>
    </div>
  );
};