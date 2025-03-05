/**
 * Application Constants
 */

// Entity Types
export const ENTITY_TYPES = {
    BUSINESS: 'business',
    FRANCHISE: 'franchise',
    STARTUP: 'startup',
    INVESTOR: 'investor',
    DIGITAL_ASSET: 'digital_asset'
  };
  
  // Plan Types
  export const PLAN_TYPES = {
    BASIC: 'basic',
    ADVANCED: 'advanced',
    PREMIUM: 'premium',
    PLATINUM: 'platinum'
  };
  
  // Plan Features
  export const PLAN_FEATURES = {
    [PLAN_TYPES.BASIC]: {
      name: 'Basic',
      price: 499,
      durationDays: 30,
      connectsIncluded: 15,
      featuredListing: false,
      analytics: false,
      supportLevel: 'email',
      description: 'Starter plan for small businesses',
      color: 'gray'
    },
    [PLAN_TYPES.ADVANCED]: {
      name: 'Advanced',
      price: 999,
      durationDays: 30,
      connectsIncluded: 30,
      featuredListing: false,
      analytics: true,
      supportLevel: 'email',
      description: 'More visibility and features for growing businesses',
      color: 'blue'
    },
    [PLAN_TYPES.PREMIUM]: {
      name: 'Premium',
      price: 1999,
      durationDays: 30,
      connectsIncluded: 60,
      featuredListing: true,
      analytics: true,
      supportLevel: 'priority',
      description: 'Enhanced visibility with priority features',
      color: 'purple'
    },
    [PLAN_TYPES.PLATINUM]: {
      name: 'Platinum',
      price: 4999,
      durationDays: 30,
      connectsIncluded: 150,
      featuredListing: true,
      analytics: true,
      supportLevel: 'dedicated',
      description: 'Maximum visibility and dedicated support',
      color: 'gold'
    }
  };
  
  // User Roles
  export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
  };
  
  // Entity Status
  export const ENTITY_STATUS = {
    ACTIVE: 'active',
    PENDING: 'pending',
    INACTIVE: 'inactive',
    REJECTED: 'rejected'
  };
  
  // Business Categories
  export const BUSINESS_CATEGORIES = [
    'Food & Beverage',
    'Retail',
    'Manufacturing',
    'Technology',
    'Healthcare',
    'Education',
    'Services',
    'Hospitality',
    'Real Estate',
    'Financial Services',
    'Automotive',
    'Entertainment',
    'Construction',
    'Agriculture',
    'Transportation',
    'Energy'
  ];
  
  // Investment Categories
  export const INVESTMENT_CATEGORIES = [
    'Seed',
    'Early Stage',
    'Growth',
    'Late Stage',
    'Acquisition',
    'Angel Investing',
    'Venture Capital',
    'Private Equity',
    'Real Estate',
    'Debt Financing'
  ];
  
  // Digital Asset Categories
  export const DIGITAL_ASSET_CATEGORIES = [
    'Website',
    'Mobile App',
    'SaaS Platform',
    'E-commerce Store',
    'Blog',
    'Domain Name',
    'Content Site',
    'Social Media Account',
    'Online Marketplace',
    'Digital Product'
  ];
  
  // Locations (Indian Cities)
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
    'Vadodara',
    'Patna',
    'Ghaziabad',
    'Ludhiana',
    'Coimbatore',
    'Agra',
    'Madurai',
    'Nashik',
    'Faridabad',
    'Meerut',
    'Rajkot',
    'Varanasi',
    'Srinagar',
    'Other'
  ];
  
  // API Routes
  export const API_ROUTES = {
    AUTH: {
      REGISTER: '/api/auth/register',
      LOGIN: '/api/auth/login',
      LOGOUT: '/api/auth/logout',
      RESET_PASSWORD: '/api/auth/reset-password',
      VERIFY_EMAIL: '/api/auth/verify-email',
      LINKEDIN: '/api/auth/linkedin',
      WHATSAPP_OTP: '/api/auth/whatsapp-otp',
      VERIFY_WHATSAPP_OTP: '/api/auth/verify-whatsapp-otp'
    },
    ENTITIES: {
      CREATE: '/api/entities/create',
      UPDATE: '/api/entities/update',
      DELETE: '/api/entities/delete',
      GET: '/api/entities/get',
      SEARCH: '/api/entities/search'
    },
    PLANS: {
      GET: '/api/plans/get',
      PURCHASE: '/api/plans/purchase'
    },
    CONNECTS: {
      GET: '/api/connects/get',
      PURCHASE: '/api/connects/purchase',
      USE: '/api/connects/use'
    }
  };
  
  // Application Routes
  export const APP_ROUTES = {
    HOME: '/',
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email'
    },
    DASHBOARD: {
      ROOT: '/dashboard',
      PROFILE: '/dashboard/profile',
      ENTITIES: '/dashboard/entities',
      ADD_ENTITY: '/dashboard/entities/add',
      EDIT_ENTITY: '/dashboard/entities/edit',
      CONNECTS: '/dashboard/connects',
      MESSAGES: '/dashboard/messages',
      SETTINGS: '/dashboard/settings'
    },
    MARKETPLACE: {
      ROOT: '/marketplace',
      BUSINESS: '/marketplace/business',
      FRANCHISE: '/marketplace/franchise',
      STARTUP: '/marketplace/startup',
      INVESTOR: '/marketplace/investor',
      DIGITAL_ASSET: '/marketplace/digital-asset',
      DETAIL: '/marketplace/detail'
    },
    STATIC: {
      ABOUT: '/about',
      CONTACT: '/contact',
      PRIVACY: '/privacy-policy',
      TERMS: '/terms',
      FAQ: '/faq',
      HOW_IT_WORKS: '/how-it-works'
    }
  };
  
  export default {
    ENTITY_TYPES,
    PLAN_TYPES,
    PLAN_FEATURES,
    USER_ROLES,
    ENTITY_STATUS,
    BUSINESS_CATEGORIES,
    INVESTMENT_CATEGORIES,
    DIGITAL_ASSET_CATEGORIES,
    INDIAN_CITIES,
    API_ROUTES,
    APP_ROUTES
  };