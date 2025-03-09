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
  // Normalize paths by removing trailing slashes
  currentPath = currentPath.replace(/\/$/, '');
  pattern = pattern.replace(/\/$/, '');

  // Exact match
  if (currentPath === pattern) return true;
  
  // Starts with pattern (for nested routes)
  if (pattern !== '/' && currentPath.startsWith(pattern)) return true;
  
  // Additional specific route checks
  const specificRouteChecks = [
    // Handle routes with similar patterns
    { base: APP_ROUTES.MARKETPLACE.ROOT, matches: [
      APP_ROUTES.MARKETPLACE.BUSINESS,
      APP_ROUTES.MARKETPLACE.FRANCHISE,
      APP_ROUTES.MARKETPLACE.STARTUP,
      APP_ROUTES.MARKETPLACE.INVESTOR,
      APP_ROUTES.MARKETPLACE.DIGITAL_ASSET
    ]},
    { base: APP_ROUTES.STATIC.ROOT, matches: [
      APP_ROUTES.STATIC.ABOUT,
      APP_ROUTES.STATIC.CONTACT,
      APP_ROUTES.STATIC.PRIVACY,
      APP_ROUTES.STATIC.TERMS,
      APP_ROUTES.STATIC.FAQ,
      APP_ROUTES.STATIC.HOW_IT_WORKS
    ]}
  ];

  // Check for specific route group matches
  for (const group of specificRouteChecks) {
    if (group.matches.some(route => route === pattern && currentPath.startsWith(group.base))) {
      return true;
    }
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

// Export as default
export default {
  isRouteActive,
  isCompanyTabActive,
  isResourcesTabActive,
  getNavigationGroups
};