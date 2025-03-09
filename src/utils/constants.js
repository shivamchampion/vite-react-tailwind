// Update your constants.js file to rename ENTITY_TYPES to LISTING_TYPES and update paths
export const LISTING_TYPES = {
  BUSINESS: 'business',
  FRANCHISE: 'franchise',
  STARTUP: 'startup',
  INVESTOR: 'investor',
  DIGITAL_ASSET: 'digital_asset'
};

// Update routes in your APP_ROUTES
export const APP_ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    RESET_PASSWORD: '/reset-password'
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    PROFILE: '/dashboard/profile',
    LISTINGS: '/dashboard/listings', // Changed from ENTITIES
    ADD_LISTING: '/dashboard/add-listing', // Changed from ADD_ENTITY
    EDIT_LISTING: '/dashboard/edit-listing', // Changed from EDIT_ENTITY
    CONNECTS: '/dashboard/connects',
    MESSAGES: '/dashboard/messages',
    SETTINGS: '/dashboard/settings',
    SAVED_SEARCHES: '/dashboard/saved-searches', // New route
    FAVORITES: '/dashboard/favorites', // New route
    RECENTLY_VIEWED: '/dashboard/recently-viewed', // New route
    ANALYTICS: '/dashboard/analytics' // New route
  },
  MARKETPLACE: {
    BUSINESS: '/marketplace/business',
    FRANCHISE: '/marketplace/franchise',
    STARTUP: '/marketplace/startup',
    INVESTOR: '/marketplace/investor',
    DIGITAL_ASSET: '/marketplace/digital-asset',
    DETAIL: '/marketplace/detail',
    SEARCH: '/marketplace/search'
  },
  STATIC: {
    ABOUT: '/about',
    CONTACT: '/contact',
    PRIVACY: '/privacy',
    TERMS: '/terms',
    FAQ: '/faq',
    HOW_IT_WORKS: '/how-it-works'
  }
};

// Make sure plan types are consistently named
export const PLAN_TYPES = {
  BASIC: 'basic',
  ADVANCED: 'advanced',
  PREMIUM: 'premium',
  PLATINUM: 'platinum'
};

// Plan features remain the same
export const PLAN_FEATURES = {
  basic: {
    name: 'Basic',
    price: 999,
    connectsIncluded: 15,
    featuredListing: false,
    analytics: false,
    supportLevel: 'Basic'
  },
  advanced: {
    name: 'Advanced',
    price: 1999,
    connectsIncluded: 30,
    featuredListing: true,
    analytics: false,
    supportLevel: 'Standard'
  },
  premium: {
    name: 'Premium',
    price: 3999,
    connectsIncluded: 60,
    featuredListing: true,
    analytics: true,
    supportLevel: 'Priority'
  },
  platinum: {
    name: 'Platinum',
    price: 7999,
    connectsIncluded: 150,
    featuredListing: true,
    analytics: true,
    supportLevel: 'Dedicated'
  }
};

// Common locations in India
export const INDIAN_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Surat',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot',
  'Varanasi',
  'Srinagar',
  'Aurangabad',
  'Dhanbad',
  'Amritsar',
  'Chandigarh',
  'Coimbatore',
  'Guwahati',
  'Kochi',
  'Pan India' // For businesses operating nationwide
];