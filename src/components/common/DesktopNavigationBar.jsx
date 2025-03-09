import React from 'react';
import { Link } from 'react-router-dom';
import { DropdownMenu } from './DropdownMenu';
import { BookOpen, Info, ChevronDown } from 'lucide-react';
import { isResourcesTabActive, isCompanyTabActive } from '../../utils/navigationHelpers';

export const DesktopNavigationBar = ({
  navItems,
  resourcesItems,
  companyItems,
  dropdownStates,
  toggleDropdown,
  closeAllDropdowns,
  currentPath,
  resourcesRef,
  companyRef
}) => {
  const isResourcesActive = isResourcesTabActive(currentPath);
  const isCompanyActive = isCompanyTabActive(currentPath);

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
      <div ref={resourcesRef} className="relative z-50">
        <button
          type="button"
          className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
            dropdownStates.resources || isResourcesActive
              ? 'text-indigo-700 bg-white shadow-sm'
              : 'hover:text-indigo-700'
          }`}
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown('resources');
          }}
          aria-expanded={dropdownStates.resources}
          id="desktop-resources-menu-button"
          aria-haspopup="menu"
          aria-controls="resources-dropdown-menu"
        >
          <BookOpen className="w-4 h-4 flex-shrink-0 mr-1.5" />
          <span>Resources</span>
          <ChevronDown
            className={`ml-1.5 w-4 h-4 transition-transform ${
              dropdownStates.resources ? 'rotate-180' : ''
            }`}
          />
        </button>

        {dropdownStates.resources && (
          <DropdownMenu
            type="resources"
            items={resourcesItems}
            onItemClick={closeAllDropdowns}
            currentPath={currentPath}
            onClose={() => toggleDropdown('resources')}
            className="resources-dropdown"
            id="resources-dropdown-menu"
          />
        )}
      </div>

      {/* Company Dropdown */}
      <div ref={companyRef} className="relative z-50">
        <button
          type="button"
          className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-3 py-2 rounded-md transition-all duration-200 whitespace-nowrap ${
            dropdownStates.company || isCompanyActive
              ? 'text-indigo-700 bg-white shadow-sm'
              : 'hover:text-indigo-700'
          }`}
          onClick={(e) => {
            e.preventDefault();
            toggleDropdown('company');
          }}
          aria-expanded={dropdownStates.company}
          id="desktop-company-menu-button"
          aria-haspopup="menu"
          aria-controls="company-dropdown-menu"
        >
          <Info className="w-4 h-4 flex-shrink-0 mr-1.5" />
          <span>Company</span>
          <ChevronDown
            className={`ml-1.5 w-4 h-4 transition-transform ${
              dropdownStates.company ? 'rotate-180' : ''
            }`}
          />
        </button>

        {dropdownStates.company && (
          <DropdownMenu
            type="company"
            items={companyItems}
            onItemClick={closeAllDropdowns}
            currentPath={currentPath}
            onClose={() => toggleDropdown('company')}
            className="company-dropdown"
            id="company-dropdown-menu"
          />
        )}
      </div>
    </div>
  );
};