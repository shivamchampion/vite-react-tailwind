/**
 * Navigation Helper Functions
 * 
 * Utility functions to assist with navigation-related functionality
 */

import React from 'react';
import { APP_ROUTES } from './constants';
import { 
  Info, 
  Mail, 
  HelpCircle, 
  LineChart,
  BookOpen,
  FileText,
  Shield
} from 'lucide-react';

/**
 * Check if the current path matches a route pattern
 */
export const isRouteActive = (currentPath, pattern) => {
  // Exact match
  if (currentPath === pattern) {
    return true;
  }
  
  // Pattern with trailing slash
  if (pattern.endsWith('/') && currentPath === pattern.slice(0, -1)) {
    return true;
  }
  
  // Pattern without trailing slash
  if (!pattern.endsWith('/') && currentPath === `${pattern}/`) {
    return true;
  }
  
  // Check if current path is a sub-route of the pattern
  if (pattern !== '/' && currentPath.startsWith(pattern + '/')) {
    return true;
  }
  
  return false;
};

/**
 * Check if company dropdown item is active
 */
export const isCompanyTabActive = (currentPath) => {
  const companyRoutes = [
    APP_ROUTES.STATIC.ABOUT,
    APP_ROUTES.STATIC.CONTACT,
    APP_ROUTES.STATIC.FAQ
  ];
  
  return companyRoutes.some(route => isRouteActive(currentPath, route));
};

/**
 * Check if resources dropdown item is active
 */
export const isResourcesTabActive = (currentPath) => {
  const resourcesRoutes = [
    APP_ROUTES.STATIC.HOW_IT_WORKS,
    APP_ROUTES.STATIC.TERMS,
    APP_ROUTES.STATIC.PRIVACY,
    '/guides',
    '/market-insights'
  ];
  
  return resourcesRoutes.some(route => isRouteActive(currentPath, route));
};

/**
 * Group navigation items by type for easy access
 */
export const getNavigationGroups = () => {
  // Company dropdown items
  const companyItems = [
    { 
      name: "About Us", 
      to: APP_ROUTES.STATIC.ABOUT, 
      icon: <Info size={16} /> 
    },
    { 
      name: "Contact Us", 
      to: APP_ROUTES.STATIC.CONTACT, 
      icon: <Mail size={16} /> 
    },
    {
      name: "FAQ",
      to: APP_ROUTES.STATIC.FAQ,
      icon: <HelpCircle size={16} />
    }
  ];
  
  // Resources dropdown items
  const resourcesItems = [
    {
      name: "How It Works",
      to: APP_ROUTES.STATIC.HOW_IT_WORKS,
      icon: <HelpCircle size={16} />
    },
    { 
      name: "Market Insights", 
      to: "/market-insights", 
      icon: <LineChart size={16} /> 
    },
    { 
      name: "Guides", 
      to: "/guides", 
      icon: <BookOpen size={16} /> 
    },
    { 
      name: "Terms of Service", 
      to: APP_ROUTES.STATIC.TERMS, 
      icon: <FileText size={16} /> 
    },
    { 
      name: "Privacy Policy", 
      to: APP_ROUTES.STATIC.PRIVACY, 
      icon: <Shield size={16} /> 
    }
  ];
  
  return {
    companyItems,
    resourcesItems
  };
};