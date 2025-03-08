import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DropdownMenu } from './DropdownMenu';
import { BookOpen, Info, ChevronDown } from 'lucide-react';
import { isResourcesTabActive, isCompanyTabActive } from '../../utils/navigationHelpers';

/**
 * Secondary Navigation Bar for xl screens
 * Provides duplicate navigation for specific screen sizes
 */
export const SecondaryNavigationBar = ({
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Resources dropdown click outside detection
      if (
        dropdownStates.resources && 
        resourcesRef.current && 
        !resourcesRef.current.contains(event.target)
      ) {
        toggleDropdown('resources');
      }

      // Company dropdown click outside detection
      if (
        dropdownStates.company &&
        companyRef.current && 
        !companyRef.current.contains(event.target)
      ) {
        toggleDropdown('company');
      }
    };

    // Use capture phase to ensure this runs before other click handlers
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [dropdownStates, toggleDropdown]);

  return (
    <div className="hidden xl:block 2xl:hidden border-b border-gray-200 bg-gradient-to-r from-indigo-50 via-white to-indigo-50">
      <div className="max-w-[2560px] mx-auto px-8 xl:px-12">
        <div className="flex items-center justify-center h-12">
          <nav className="flex items-center space-x-2">
            {/* Main Navigation Links */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.to}
                className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-4 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${
                  item.active 
                    ? 'text-indigo-700 bg-white shadow-sm' 
                    : 'hover:text-indigo-700'
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Resources Dropdown */}
            <div 
              ref={resourcesRef} 
              className="relative z-50"
            >
              <button
                type="button"
                className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-4 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${
                  dropdownStates.resources || isResourcesActive 
                    ? 'text-indigo-700 bg-white shadow-sm' 
                    : 'hover:text-indigo-700'
                }`}
                onClick={() => toggleDropdown('resources')}
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
                />
              )}
            </div>

            {/* Company Dropdown */}
            <div 
              ref={companyRef} 
              className="relative z-50"
            >
              <button
                type="button"
                className={`flex items-center text-gray-700 hover:text-indigo-700 font-medium px-4 py-2 rounded-md hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap ${
                  dropdownStates.company || isCompanyActive 
                    ? 'text-indigo-700 bg-white shadow-sm' 
                    : 'hover:text-indigo-700'
                }`}
                onClick={() => toggleDropdown('company')}
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
                />
              )}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};