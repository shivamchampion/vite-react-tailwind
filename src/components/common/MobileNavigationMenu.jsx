import React from 'react';
import { Button } from "@heroui/react";
import { Briefcase, BookOpen, Info } from 'lucide-react';
import { MobileMenuItem } from './NavigationItems';
import { isRouteActive } from '../../utils/navigationHelpers';

/**
 * Mobile Navigation Menu Component
 * Renders a full screen menu for mobile devices
 */
export const MobileNavigationMenu = ({ 
  navItems, 
  resourcesItems, 
  companyItems, 
  onItemClick, 
  currentPath 
}) => {
  return (
    <div className="xl:hidden bg-white border-t border-gray-200 shadow-lg block">
      <div className="px-4 pt-2 pb-6 space-y-1">
        {/* Become an Advisor button at top for small screens only */}
        <div className="md:hidden pt-2 pb-2">
          <Button
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-sm hover:shadow-md items-center text-sm flex justify-center"
            variant="flat"
          >
            <Briefcase className="w-4 h-4 mr-1.5" />
            <span>Become an Advisor</span>
          </Button>
        </div>

        {/* Main Navigation Items */}
        <div className="py-2">
          <div className="flex items-center px-3 py-2 text-indigo-700 font-medium">
            <span>Explore Opportunities</span>
          </div>
          <div className="ml-4 pl-4 border-l-2 border-indigo-100">
            {navItems.map((item) => (
              <MobileMenuItem
                key={item.name}
                to={item.to}
                href={item.href}
                iconName={item.iconName}
                onClick={onItemClick}
                active={item.active}
              >
                {item.name}
              </MobileMenuItem>
            ))}
          </div>
        </div>

        {/* Resources Section */}
        <div className="py-2">
          <div className="flex items-center px-3 py-2 text-indigo-700 font-medium">
            <BookOpen className="w-5 h-5 mr-2" />
            <span>Resources</span>
          </div>
          <div className="ml-4 pl-4 border-l-2 border-indigo-100">
            {resourcesItems?.map((item) => (
              <MobileMenuItem
                key={item.name}
                to={item.to}
                href={item.href}
                icon={item.icon}
                onClick={onItemClick}
                active={item.to && isRouteActive(currentPath, item.to)}
              >
                {item.name}
              </MobileMenuItem>
            )) || <div>No resources available</div>}
          </div>
        </div>

        {/* Company Section */}
        <div className="py-2">
          <div className="flex items-center px-3 py-2 text-indigo-700 font-medium">
            <Info className="w-5 h-5 mr-2" />
            <span>Company</span>
          </div>
          <div className="ml-4 pl-4 border-l-2 border-indigo-100">
            {companyItems?.map((item) => (
              <MobileMenuItem
                key={item.name}
                to={item.to}
                href={item.href}
                icon={item.icon}
                onClick={onItemClick}
                active={item.to && isRouteActive(currentPath, item.to)}
              >
                {item.name}
              </MobileMenuItem>
            )) || <div>No company items available</div>}
          </div>
        </div>
      </div>
    </div>
  );
};