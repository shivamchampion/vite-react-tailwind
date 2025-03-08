import React, { useRef, useEffect } from 'react';
import { NavItem } from './NavigationItems';
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
  // Refs for dropdown containers
  const resourcesRef = useRef(null);
  const companyRef = useRef(null);

  // Check if Resources or Company sections are active based on current path
  const isResourcesActive = isResourcesTabActive(currentPath);
  const isCompanyActive = isCompanyTabActive(currentPath);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Resources dropdown click outside detection
      if (
        resourcesRef.current && 
        !resourcesRef.current.contains(event.target) && 
        dropdownStates.resources
      ) {
        toggleDropdown('resources');
      }

      // Company dropdown click outside detection
      if (
        companyRef.current && 
        !companyRef.current.contains(event.target) && 
        dropdownStates.company
      ) {
        toggleDropdown('company');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownStates, toggleDropdown]);

  return (
    <div className="flex items-center space-x-1">
      {/* Main Navigation Links */}
      {navItems.map((item) => (
        <NavItem
          key={item.name}
          to={item.to}
          href={item.href}
          iconName={item.iconName}
          active={item.active}
        >
          {item.name}
        </NavItem>
      ))}

      {/* Resources Dropdown */}
      <div 
        ref={resourcesRef} 
        className="relative"
        onClick={(e) => e.stopPropagation()} // Stop event bubbling
      >
        <button
          type="button"
          className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${
            dropdownStates.resources || isResourcesActive ? 'text-indigo-700 bg-white shadow-sm' : ''
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown('resources');
          }}
          aria-expanded={dropdownStates.resources}
        >
          <BookOpen className="w-4 h-4 flex-shrink-0" />
          <span className="ml-1.5">Resources</span>
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
          />
        )}
      </div>

      {/* Company Dropdown */}
      <div 
        ref={companyRef} 
        className="relative"
        onClick={(e) => e.stopPropagation()} // Stop event bubbling
      >
        <button
          type="button"
          className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${
            dropdownStates.company || isCompanyActive ? 'text-indigo-700 bg-white shadow-sm' : ''
          }`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown('company');
          }}
          aria-expanded={dropdownStates.company}
        >
          <Info className="w-4 h-4 flex-shrink-0" />
          <span className="ml-1.5">Company</span>
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
          />
        )}
      </div>
    </div>
  );
};