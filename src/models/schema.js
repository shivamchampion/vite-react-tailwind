// src/models/schema.js
/**
 * Business Options Firestore Database Schema
 * 
 * This file defines the structure and validation rules for all collections in the Firestore database.
 * Use these schema definitions for type checking and to ensure consistency across the application.
 */

// ===== CONSTANTS =====

/**
 * Listing types
 * @type {Object}
 */
export const LISTING_TYPES = {
    BUSINESS: 'business',
    FRANCHISE: 'franchise',
    STARTUP: 'startup',
    INVESTOR: 'investor',
    DIGITAL_ASSET: 'digitalAsset'
  };
  
  /**
   * Listing status options
   * @type {Object}
   */
  export const LISTING_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    REJECTED: 'rejected',
    SOLD: 'sold',
    DRAFT: 'draft'
  };
  
  /**
   * Subscription plan types
   * @type {Object}
   */
  export const PLAN_TYPES = {
    FREE: 'Free',
    BASIC: 'Basic',
    PREMIUM: 'Premium',
    ADVANCED: 'Advanced',
    PLATINUM: 'Platinum'
  };
  
  /**
   * User roles
   * @type {Object}
   */
  export const USER_ROLES = {
    USER: 'user',
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    ADVISOR: 'advisor'
  };
  
  /**
   * Payment statuses
   * @type {Object}
   */
  export const PAYMENT_STATUS = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  };
  
  /**
   * Message statuses
   * @type {Object}
   */
  export const MESSAGE_STATUS = {
    UNREAD: 'unread',
    READ: 'read',
    DELETED: 'deleted'
  };
  
  // ===== COLLECTION SCHEMAS =====
  
  /**
   * User schema
   * @type {Object}
   */
  export const UserSchema = {
    // Basic info
    id: String,             // User ID (same as Firebase Auth UID)
    email: String,          // Email address
    displayName: String,    // Full name for display
    firstName: String,      // First name
    lastName: String,       // Last name
    profileImage: String,   // Profile image URL
    phone: String,          // Phone number
    
    // Location
    address: String,        // Street address
    city: String,           // City
    state: String,          // State/Province
    pincode: String,        // Postal/ZIP code
    country: String,        // Country (default: India)
    
    // Account status
    isEmailVerified: Boolean, // Email verification status
    isPhoneVerified: Boolean, // Phone verification status
    status: String,         // 'active', 'suspended', etc.
    
    // Timestamps
    createdAt: Date,        // Account creation date
    updatedAt: Date,        // Last update date
    lastLogin: Date,        // Last login date
    
    // Role & subscription
    role: String,           // User role (user, admin, etc.)
    plan: String,           // Current subscription plan
    subscription: {         // Active subscription details
      id: String,           // Subscription ID
      planId: String,       // Plan ID
      startDate: Date,      // Start date
      endDate: Date,        // End date
      autoRenew: Boolean    // Auto-renewal setting
    },
    connectsBalance: Number, // Available connects for contacting listings
    
    // Activity data
    listings: Array,        // IDs of listings created by this user
    favorites: Array,       // IDs of favorited listings
    recentlyViewed: Array,  // Recently viewed listings with timestamps
    contactedListings: Array, // Listings contacted with timestamps
    
    // Settings
    notificationsEnabled: Boolean, // Push notification setting
    isProfileComplete: Boolean,    // Profile completion status
    
    // Tracking & analytics
    referredBy: String,     // Referral source
    signupSource: String,   // Source of signup (direct, google, etc.)
    deviceTokens: Array     // FCM tokens for push notifications
  };
  
  /**
   * Base listing schema (common fields for all listing types)
   * @type {Object}
   */
  export const BaseListingSchema = {
    // Core fields
    id: String,             // Listing ID
    type: String,           // Listing type (business, franchise, etc.)
    name: String,           // Listing title/name
    description: String,    // Full description
    shortDescription: String, // Brief summary
    
    // Media
    images: Array,          // Array of image URLs
    featuredImage: String,  // Main image for cards
    
    // Location
    location: {
      country: String,      // Country (default: India)
      state: String,        // State
      city: String,         // City
      address: String,      // Full address (optional)
      pincode: String,      // Postal/ZIP code
      coordinates: Object,  // GeoPoint (lat/long)
      displayLocation: String // Formatted location for display
    },
    
    // Contact information
    contactInfo: {
      email: String,        // Contact email
      phone: String,        // Contact phone
      website: String,      // Website URL
      contactName: String,  // Name of contact person
      designation: String,  // Job title of contact person
      socialMedia: Object   // Social media links
    },
    
    // URL and identification
    hash: String,           // Unique URL hash
    
    // Ratings and verification
    rating: Number,         // Average rating (0-10)
    reviewCount: Number,    // Number of reviews
    verified: Boolean,      // Verification status
    featured: Boolean,      // Featured/promoted status
    
    // Subscription and status
    plan: String,           // Subscription plan
    status: String,         // Listing status (active, pending, etc.)
    
    // Timestamps
    createdAt: Date,        // Creation date
    updatedAt: Date,        // Last update date
    
    // Ownership
    ownerId: String,        // User ID of listing owner
    createdBy: String,      // 'user' or 'admin'
    
    // Classification
    industries: Array,      // Industry IDs
    subIndustryId: String,  // Legacy field for primary sub-industry
    subIndustries: Array,   // Sub-industry IDs
    tags: Array,            // Searchable tags
    
    // Analytics
    viewCount: Number,      // Number of views
    contactCount: Number,   // Number of contact requests
    
    // Miscellaneous
    documents: Array,       // Associated documents (brochures, etc.)
    pageOrder: Number,      // Display order for featured listings
    headline: String        // Short headline or tagline
  };
  
  /**
   * Business listing schema
   * @type {Object}
   */
  export const BusinessListingSchema = {
    ...BaseListingSchema,   // Inherit base fields
    
    // Business-specific details
    businessType: String,   // Type of business
    entityType: String,     // Legal entity type
    establishedYear: Number, // Year established
    employees: String,      // Number of employees
    
    // Financial information
    financials: {
      annualSales: String,  // Annual revenue
      ebitda: String,       // EBITDA
      ebitdaMargin: String, // EBITDA margin percentage
      grossIncome: String,  // Gross income
      inventoryValue: String, // Value of inventory
      rentals: String       // Rental costs
    },
    
    // Assets
    inventory: {
      included: Boolean,    // Is inventory included in sale?
      value: String         // Value of inventory
    },
    realEstate: {
      included: Boolean,    // Is real estate included?
      owned: Boolean,       // Is property owned?
      leased: Boolean,      // Is property leased?
      details: String       // Details about the property
    },
    
    // Sale information
    sale: {
      reasonForSelling: String, // Reason for selling
      askingPrice: String,  // Asking price
      negotiable: Boolean,  // Is price negotiable?
      sellerFinancing: Boolean, // Seller financing available?
      trainingPeriod: String // Training period offered
    },
    
    // Operations
    expenses: {
      rent: String,         // Rent expenses
      payroll: String,      // Payroll expenses
      utilities: String,    // Utilities expenses
      marketing: String,    // Marketing expenses
      other: String         // Other expenses
    },
    businessHours: Object,  // Operating hours
    
    // Additional details
    features: Array,        // Key features/selling points
    assets: Array,          // Key assets included
    opportunities: Array,   // Growth opportunities
    competitors: String,    // Information about competitors
    customerBase: String,   // Information about customer base
    monthlyVisitors: Number, // Monthly visitors (if applicable)
    avgTicketPrice: String, // Average ticket/transaction size
    operatingMargin: String, // Operating margin percentage
    businessPitch: String   // Business pitch or unique selling proposition
  };
  
  /**
   * Franchise listing schema
   * @type {Object}
   */
  export const FranchiseListingSchema = {
    ...BaseListingSchema,   // Inherit base fields
    
    // Franchise details
    franchiseType: String,  // Type of franchise
    franchiseBrand: String, // Brand name
    establishedYear: Number, // Year brand was established
    totalOutlets: Number,   // Total number of outlets
    totalFranchisees: Number, // Total number of franchisees
    
    // Investment details
    investment: {
      investmentRange: String, // Investment range
      franchiseFee: String,  // Franchise fee
      royaltyFee: String,    // Royalty fee
      marketingFee: String,  // Marketing fee
      estimatedTotalInvestment: String // Total investment needed
    },
    
    // Terms and conditions
    terms: {
      contractDuration: String, // Duration of contract
      renewalOptions: String,   // Renewal options
      spaceRequirement: String, // Space requirements
      exclusiveTerritory: Boolean // Exclusive territory?
    },
    
    // Support offered
    support: {
      trainingProvided: Boolean, // Is training provided?
      trainingDetails: String,   // Training details
      ongoingSupport: Array,     // Ongoing support offered
      marketingSupport: Array,   // Marketing support
      operationalSupport: Array  // Operational support
    },
    
    // Expansion and locations
    expansionLocations: Array, // Target expansion locations
    preferredLocations: Array, // Preferred locations
    
    // Performance metrics
    performance: {
      successStories: String,    // Success stories
      breakEvenPeriod: String,   // Average break-even period
      profitPotential: String,   // Profit potential
      monthlySales: String,      // Projected monthly sales
      profitMargin: String       // Average profit margin
    },
    
    // Requirements
    requirements: {
      requiredExperience: String,    // Required experience
      requiredNetWorth: String,      // Required net worth
      requiredLiquidCapital: String, // Required liquid capital
      additionalRequirements: Array  // Additional requirements
    },
    
    // Additional details
    unitDetails: {
      totalUnits: Number,      // Total units
      companyOwned: Number,    // Company-owned units
      franchiseeOwned: Number  // Franchisee-owned units
    },
    
    // More franchise-specific fields
    businessModel: String,     // Business model description
    offering: String,          // What's being offered
    agreementAvailable: Boolean, // Is franchise agreement available?
    termDuration: String,      // Term duration
    termRenewable: Boolean,    // Is term renewable?
    opportunities: String,     // Opportunities
    assistance: String,        // Assistance provided
    howToOwn: String,          // How to own this franchise
    benefits: String,          // Benefits of the franchise
    formats: Array             // Franchise formats
  };
  
  /**
   * Investor listing schema
   * @type {Object}
   */
  export const InvestorListingSchema = {
    ...BaseListingSchema,   // Inherit base fields
    
    // Investor details
    investorType: String,   // Type of investor
    
    // Investment details
    investment: {
      minInvestment: String,    // Minimum investment
      maxInvestment: String,    // Maximum investment
      totalFundsAvailable: String, // Total funds available
      averageInvestment: String,   // Average investment
      typicalRound: Array,      // Typical investment rounds
      stake: String,            // Expected equity stake
      purchasingMin: String,    // Minimum purchasing amount
      purchasingMax: String     // Maximum purchasing amount
    },
    
    // Focus areas
    focus: {
      sectorsOfInterest: Array, // Sectors of interest
      investmentStage: Array,   // Investment stages
      geographicFocus: Array    // Geographic focus
    },
    
    // Portfolio
    portfolio: {
      pastInvestments: Array,   // Past investments
      successStories: String,   // Success stories
      totalInvestments: Number, // Total investments made
      activeInvestments: Number, // Active investments
      exits: Number             // Number of exits
    },
    
    // Investment process
    process: {
      investmentCriteria: Array,  // Investment criteria
      investmentProcess: String,  // Investment process
      dueDigiligencePeriod: String, // Due diligence period
      initialResponseTime: String, // Initial response time
      decisionTimeline: String    // Decision timeline
    },
    
    // Terms
    terms: {
      expectedReturn: String,   // Expected return
      exitTimeframe: String,    // Exit timeframe
      equityRange: String,      // Equity range
      boardSeat: Boolean        // Requires board seat?
    },
    
    // Value add
    value: {
      additionalValue: Array,   // Additional value offered
      mentorship: Boolean,      // Offers mentorship?
      networkAccess: Boolean,   // Offers network access?
      strategicPartnerships: Boolean // Offers strategic partnerships?
    },
    
    // Company details (if institutional investor)
    company: {
      name: String,             // Company name
      website: String,          // Company website
      about: String,            // About company
      designation: String       // Designation in company
    },
    
    // Additional details
    factors: String,            // Investment factors
    businessProof: String,      // Business proof
    investorPlan: String,       // Investor plan
    preferredLocations: Array   // Preferred locations for investment
  };
  
  /**
   * Startup listing schema
   * @type {Object}
   */
  export const StartupListingSchema = {
    ...BaseListingSchema,   // Inherit base fields
    
    // Startup details
    startupStage: String,   // Current stage (idea, MVP, etc.)
    foundedYear: Number,    // Year founded
    founderInfo: Array,     // Founder information
    teamSize: Number,       // Team size
    
    // Funding
    funding: {
      fundingRaised: String,    // Funding raised so far
      currentValuation: String, // Current valuation
      investmentSeeking: String, // Investment being sought
      equityOffered: String,    // Equity offered
      previousInvestors: Array, // Previous investors
      fundingRounds: Array      // Previous funding rounds
    },
    
    // Business model
    business: {
      revenueModel: String,     // Revenue model
      businessModel: String,    // Business model
      marketSize: String,       // Market size
      targetMarket: String,     // Target market
      competitiveAdvantage: Array // Competitive advantages
    },
    
    // Traction
    traction: {
      users: String,            // Number of users
      customers: String,        // Number of customers
      growth: String,           // Growth rate
      arr: String,              // Annual recurring revenue
      mrr: String               // Monthly recurring revenue
    },
    
    // Financials
    financials: {
      burnRate: String,         // Burn rate
      runway: String,           // Runway
      revenueToDate: String     // Revenue to date
    },
    
    // Resources
    resources: {
      pitchDeck: Object,        // Pitch deck
      demoUrl: String,          // Demo URL
      appLinks: Object          // App links
    },
    
    // Intellectual property
    intellectualProperty: {
      patents: Boolean,         // Has patents?
      trademarks: Boolean,      // Has trademarks?
      copyrights: Boolean,      // Has copyrights?
      details: String           // IP details
    },
    
    // Additional details
    metrics: Array,             // Key metrics
    exitStrategy: Array,        // Exit strategy
    challengesAndRisks: Array   // Challenges and risks
  };
  
  /**
   * Digital asset listing schema
   * @type {Object}
   */
  export const DigitalAssetListingSchema = {
    ...BaseListingSchema,   // Inherit base fields
    
    // Asset details
    assetType: String,      // Type of digital asset
    platform: String,       // Platform/technology
    technologyStack: Array, // Technology stack
    launchedYear: Number,   // Year launched
    
    // Financial information
    financials: {
      monthlySales: String,     // Monthly sales
      monthlyProfit: String,    // Monthly profit
      yearlyRevenue: String,    // Yearly revenue
      yearlyProfit: String,     // Yearly profit
      profitMargin: String,     // Profit margin
      revenueGrowth: String     // Revenue growth
    },
    
    // Traffic and analytics
    traffic: {
      monthlyTraffic: String,   // Monthly traffic
      trafficSources: Object,   // Traffic sources
      conversionRate: String,   // Conversion rate
      bounceRate: String,       // Bounce rate
      pageViews: String         // Page views
    },
    
    // Operations
    operations: {
      monetizationMethods: Array, // Monetization methods
      automationLevel: String,    // Level of automation
      timeRequirement: String,    // Time required to manage
      teamsAndStaff: String,      // Teams and staff
      operatingCosts: String      // Operating costs
    },
    
    // Assets included
    assets: {
      includedAssets: Array,    // Assets included
      contentAmount: String,    // Amount of content
      customSoftware: Boolean,  // Custom software?
      proprietaryTech: Boolean  // Proprietary technology?
    },
    
    // Sale information
    sale: {
      reasonForSelling: String,   // Reason for selling
      askingPrice: String,        // Asking price
      returnOnInvestment: String, // ROI
      paybackPeriod: String,      // Payback period
      analyticsAccess: Boolean,   // Analytics access provided?
      transferDetails: String,    // Transfer details
      escrowService: Boolean      // Escrow service available?
    },
    
    // Customer information
    customers: {
      customerBase: String,       // Customer base
      customerRetention: String,  // Customer retention
      lifetimeValue: String,      // Customer lifetime value
      acquisitionCost: String     // Customer acquisition cost
    },
    
    // Growth potential
    growth: {
      growthOpportunities: Array, // Growth opportunities
      competitiveLandscape: String, // Competitive landscape
      untappedMarkets: Array,     // Untapped markets
      potentialPartners: Array    // Potential partners
    }
  };
  
  /**
   * Plan schema
   * @type {Object}
   */
  export const PlanSchema = {
    id: String,             // Plan ID
    name: String,           // Plan name
    planType: String,       // Plan type (FREE, BASIC, etc.)
    description: String,    // Plan description
    price: Number,          // Price
    currency: String,       // Currency (default: INR)
    duration: String,       // Duration text (e.g., "3 months")
    durationMonths: Number, // Duration in months
    connectsPerMonth: Number, // Connects given per month
    featuredListings: Number, // Number of featured listings allowed
    detailsView: Number,    // Number of detailed views allowed
    responseView: Number,   // Number of response views allowed
    showStats: Boolean,     // Show statistics?
    features: Array,        // Plan features
    createdAt: Date,        // Creation date
    updatedAt: Date,        // Last update date
    status: Boolean,        // Plan status
    displayOrder: Number    // Display order
  };
  
  /**
   * User subscription schema
   * @type {Object}
   */
  export const UserSubscriptionSchema = {
    id: String,             // Subscription ID
    userId: String,         // User ID
    planId: String,         // Plan ID
    planType: String,       // Plan type
    typeId: String,         // Type ID (for specific listing)
    typeName: String,       // Type name
    sentCount: Number,      // Number of messages sent
    respondCount: Number,   // Number of responses
    revealedCount: Number,  // Number of contacts revealed
    startDate: Date,        // Subscription start date
    endDate: Date,          // Subscription end date
    status: String,         // Subscription status
    createdAt: Date,        // Creation date
    updatedAt: Date         // Last update date
  };
  
  /**
   * Invoice schema
   * @type {Object}
   */
  export const InvoiceSchema = {
    id: String,             // Invoice ID
    userId: String,         // User ID
    orderId: String,        // Order ID
    transactionId: String,  // Transaction ID
    planId: String,         // Plan ID
    type: String,           // Invoice type
    amount: Number,         // Invoice amount
    taxes: Number,          // Taxes
    discount: Number,       // Discount
    total: Number,          // Total amount
    currency: String,       // Currency
    paymentStatus: String,  // Payment status
    paymentMethod: String,  // Payment method
    items: Array,           // Invoice items
    createdAt: Date,        // Creation date
    paidAt: Date            // Payment date
  };
  
  /**
   * Review schema
   * @type {Object}
   */
  export const ReviewSchema = {
    id: String,             // Review ID
    listingId: String,      // Listing ID
    userId: String,         // User ID
    userName: String,       // User name
    userPhoto: String,      // User photo
    rating: Number,         // Rating (0-5)
    title: String,          // Review title
    text: String,           // Review text
    createdAt: Date,        // Creation date
    updatedAt: Date,        // Last update date
    helpful: Number,        // Number of helpful votes
    reported: Boolean,      // Reported status
    reportReason: String,   // Reason for report
    response: Object,       // Owner's response
    verified: Boolean       // Verified purchase
  };
  
  /**
   * Chatroom schema
   * @type {Object}
   */
  export const ChatroomSchema = {
    id: String,             // Chatroom ID
    participants: Array,    // User IDs of participants
    listingId: String,      // Related listing ID
    listingName: String,    // Listing name
    listingType: String,    // Listing type
    urlType: String,        // URL type (legacy)
    lastMessage: Object,    // Last message details
    createdAt: Date,        // Creation date
    updatedAt: Date,        // Last update date
    status: String          // Status
  };
  
  /**
   * Message schema
   * @type {Object}
   */
  export const MessageSchema = {
    id: String,             // Message ID
    sender: String,         // Sender user ID
    recipient: String,      // Recipient user ID
    text: String,           // Message text
    createdAt: Date,        // Creation date
    status: String,         // Message status
    type: String,           // Message type
    attachment: Object      // Attachment details
  };
  
  /**
   * Category schema
   * @type {Object}
   */
  export const CategorySchema = {
    id: String,             // Category ID
    name: String,           // Category name
    slug: String,           // URL slug
    status: Boolean,        // Status
    subIndustries: Array    // Sub-categories
  };
  
  /**
   * Transaction schema
   * @type {Object}
   */
  export const TransactionSchema = {
    id: String,             // Transaction ID
    userId: String,         // User ID
    type: String,           // Transaction type
    amount: Number,         // Amount
    currency: String,       // Currency
    status: String,         // Status
    gatewayResponse: Object, // Payment gateway response
    metadata: Object,       // Additional metadata
    createdAt: Date,        // Creation date
    updatedAt: Date         // Last update date
  };
  
  /**
   * Notification schema
   * @type {Object}
   */
  export const NotificationSchema = {
    id: String,             // Notification ID
    userId: String,         // User ID
    title: String,          // Notification title
    message: String,        // Notification message
    type: String,           // Notification type
    read: Boolean,          // Read status
    data: Object,           // Additional data
    createdAt: Date,        // Creation date
    link: String            // Notification link
  };
  
  // Export all schemas
  export default {
    // Constants
    LISTING_TYPES,
    LISTING_STATUS,
    PLAN_TYPES,
    USER_ROLES,
    PAYMENT_STATUS,
    MESSAGE_STATUS,
    
    // Schemas
    UserSchema,
    BaseListingSchema,
    BusinessListingSchema,
    FranchiseListingSchema,
    InvestorListingSchema,
    StartupListingSchema,
    DigitalAssetListingSchema,
    PlanSchema,
    UserSubscriptionSchema,
    InvoiceSchema,
    ReviewSchema,
    ChatroomSchema,
    MessageSchema,
    CategorySchema,
    TransactionSchema,
    NotificationSchema
  };