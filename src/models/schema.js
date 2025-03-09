// src/models/schema.js
/**
 * Business Options Firestore Database Schema
 * 
 * This file defines the structure and validation rules for all collections in the Firestore database.
 * Use these schema definitions for type checking and to ensure consistency across the application.
 * 
 * @version 2.0.0
 * @last-updated 2025-03-09
 */

import { LISTING_TYPES, LISTING_STATUS, PLAN_TYPES, USER_ROLES, PAYMENT_STATUS, MESSAGE_STATUS } from './constants';

// ===== BASE SCHEMAS =====

/**
 * Base schema with common fields for all documents
 * @type {Object}
 */
export const BaseSchema = {
  id: String,             // Document ID (UUID v4)
  createdAt: Date,        // Creation timestamp
  updatedAt: Date,        // Last update timestamp
  createdBy: String,      // User ID who created the document
  updatedBy: String,      // User ID who last updated the document
  isDeleted: Boolean      // Soft delete flag (default: false)
};

/**
 * Base User schema
 * @type {Object}
 */
export const UserSchema = {
  ...BaseSchema,
  
  // Authentication
  uid: String,            // Firebase Auth UID (reference for queries)
  email: String,          // Email address (required)
  emailVerified: Boolean, // Email verification status (default: false)
  phoneNumber: String,    // Phone number (optional)
  phoneVerified: Boolean, // Phone verification status (default: false)
  
  // Profile
  displayName: String,    // Display name (required)
  firstName: String,      // First name (required)
  lastName: String,       // Last name (required)
  profileImage: {         // Profile image
    url: String,          // Image URL
    path: String,         // Storage path
    uploadedAt: Date      // Upload timestamp
  },
  bio: String,            // Short bio/description (optional)
  
  // Location
  location: {
    address: String,      // Street address (optional)
    city: String,         // City (required for business listings)
    state: String,        // State/Province (required for business listings)
    pincode: String,      // PIN/Postal code (required for business listings)
    country: String,      // Country (default: "India")
    coordinates: {        // GeoPoint for map display
      latitude: Number,   // Latitude
      longitude: Number   // Longitude
    }
  },
  
  // Account status
  status: String,         // 'active', 'suspended', 'disabled'
  lastLogin: Date,        // Last login timestamp
  accountCompleteness: Number, // Profile completion percentage (0-100)
  
  // Role & permissions
  role: String,           // User role (from USER_ROLES)
  permissions: Array,     // Array of permission strings
  
  // Subscription
  currentPlan: {
    id: String,           // Plan ID
    name: String,         // Plan name
    type: String,         // Plan type (from PLAN_TYPES)
    startDate: Date,      // Start date
    endDate: Date,        // End date
    autoRenew: Boolean,   // Auto-renewal setting
    status: String        // 'active', 'expired', 'cancelled'
  },
  
  // Resources
  connectsBalance: Number, // Available connects for contacting listings
  connectsHistory: Array,  // History of connect usage
  
  // Activity data
  listings: Array,         // IDs of listings created by this user
  favorites: Array,        // IDs of favorited listings
  recentSearches: Array,   // Recent search queries with timestamps
  recentlyViewed: Array,   // Recently viewed listings with timestamps
  contactedListings: Array, // Listings contacted with timestamps
  
  // Preferences & settings
  preferences: {
    notifications: {
      email: Boolean,      // Email notifications enabled
      push: Boolean,       // Push notifications enabled
      sms: Boolean,        // SMS notifications enabled
    },
    newsletter: Boolean,   // Newsletter subscription
    marketingEmails: Boolean, // Marketing emails opt-in
    darkMode: Boolean,     // UI theme preference
    language: String       // UI language preference
  },
  
  // Tracking & analytics
  analytics: {
    referredBy: String,    // Referral source
    signupSource: String,  // Source of signup (direct, google, etc.)
    acquisitionChannel: String, // Acquisition channel
    deviceTokens: Array,   // FCM tokens for push notifications
    lastActive: Date,      // Last active timestamp
    sessionCount: Number   // Number of sessions
  },
  
  // Business information (for business owners)
  businessInfo: {
    companyName: String,   // Company name
    role: String,          // Role in company
    gstNumber: String,     // GST number
    panNumber: String,     // PAN number
    registrationNumber: String, // Company registration number
    websiteUrl: String,    // Company website URL
    socialProfiles: {      // Social media profiles
      linkedin: String,
      facebook: String,
      twitter: String,
      instagram: String
    }
  },
  
  // KYC & verification
  verification: {
    identityVerified: Boolean,   // Identity verified
    identityDocument: {          // Identity document
      type: String,              // Aadhaar, PAN, etc.
      number: String,            // Document number
      verifiedAt: Date,          // Verification timestamp
      verifiedBy: String,        // Admin/system that verified
      status: String,            // Verification status
      notes: String              // Verification notes
    },
    businessVerified: Boolean,   // Business verified
    businessDocuments: Array     // Business verification documents
  },
  
  // Additional timestamps
  emailVerifiedAt: Date,  // Email verification timestamp
  phoneVerifiedAt: Date,  // Phone verification timestamp
  suspendedAt: Date,      // Account suspension timestamp
  suspensionReason: String // Reason for suspension
};

/**
 * Base listing schema (common fields for all listing types)
 * @type {Object}
 */
export const BaseListingSchema = {
  ...BaseSchema,
  
  // Core fields
  type: String,             // Listing type (from LISTING_TYPES)
  name: String,             // Listing title/name (required)
  slug: String,             // URL-friendly slug (auto-generated)
  description: String,      // Full description (required)
  shortDescription: String, // Brief summary (required, max 150 chars)
  headline: String,         // Short headline or tagline (optional)
  
  // Media
  media: {
    featuredImage: {       // Main image for cards
      url: String,         // Image URL
      path: String,        // Storage path
      alt: String,         // Alt text
      width: Number,       // Image width
      height: Number       // Image height
    },
    galleryImages: Array,  // Array of image objects
    videos: Array,         // Array of video objects
    documents: Array       // Array of document objects
  },
  
  // Location
  location: {
    country: String,      // Country (default: "India")
    state: String,        // State (required)
    city: String,         // City (required)
    address: String,      // Full address (optional)
    landmark: String,     // Nearby landmark (optional)
    pincode: String,      // Postal/ZIP code (required)
    coordinates: {        // GeoPoint for map display
      latitude: Number,   // Latitude
      longitude: Number   // Longitude
    },
    displayLocation: String // Formatted location for display
  },
  
  // Contact information
  contactInfo: {
    email: String,        // Contact email (required)
    phone: String,        // Contact phone (required)
    alternatePhone: String, // Alternative phone (optional)
    website: String,      // Website URL (optional)
    contactName: String,  // Name of contact person (required)
    designation: String,  // Job title of contact person (optional)
    preferredContactMethod: String, // Preferred method (email/phone)
    availableHours: String, // Hours available for contact
    socialMedia: {        // Social media links
      facebook: {
        url: String,
        handle: String,
        verified: Boolean
      },
      twitter: {
        url: String,
        handle: String,
        verified: Boolean
      },
      instagram: {
        url: String,
        handle: String,
        verified: Boolean
      },
      linkedin: {
        url: String,
        handle: String,
        verified: Boolean
      }
    }
  },
  
  // URL and SEO
  seo: {
    title: String,        // SEO title
    description: String,  // SEO description
    keywords: Array,      // SEO keywords
    ogImage: String       // Open Graph image URL
  },
  urlHash: String,        // Unique URL hash for short links
  
  // Ratings and verification
  rating: {
    average: Number,      // Average rating (0-10)
    count: Number,        // Number of ratings
    distribution: Object  // Distribution of ratings (1-5 stars)
  },
  reviewCount: Number,    // Number of reviews
  verified: Boolean,      // Verification status
  verificationDetails: {
    verifiedAt: Date,     // Verification timestamp
    verifiedBy: String,   // Admin who verified
    documents: Array,     // Verification documents
    notes: String         // Verification notes
  },
  featured: Boolean,      // Featured/promoted status
  featuredUntil: Date,    // Featured until date
  
  // Subscription and status
  plan: String,           // Subscription plan (from PLAN_TYPES)
  status: String,         // Listing status (from LISTING_STATUS)
  statusReason: String,   // Reason for current status
  statusHistory: Array,   // History of status changes
  
  // Ownership
  ownerId: String,        // User ID of listing owner
  ownerName: String,      // Name of listing owner
  ownerType: String,      // 'user' or 'admin'
  ownership: {
    transferable: Boolean, // Is ownership transferable?
    transferHistory: Array // History of ownership transfers
  },
  
  // Classification
  industries: Array,      // Industry IDs & names
  subIndustries: Array,   // Sub-industry IDs & names
  tags: Array,            // Searchable tags
  attributes: Object,     // Structured attributes
  
  // Analytics
  analytics: {
    viewCount: Number,    // Number of views
    uniqueViewCount: Number, // Number of unique views
    contactCount: Number, // Number of contact requests
    favoriteCount: Number, // Number of times favorited
    lastViewed: Date,     // Last viewed timestamp
    averageTimeOnPage: Number, // Average time spent viewing
    conversionRate: Number, // Contact conversion rate
    searchAppearances: Number, // Times appeared in search results
    referrers: Object     // Traffic sources
  },
  
  // Display settings
  displaySettings: {
    highlight: Boolean,   // Highlight in listings
    badge: String,        // Special badge ("New", "Hot", etc.)
    pageOrder: Number,    // Display order for featured listings
    showContactInfo: Boolean, // Show contact info publicly
    showAnalytics: Boolean // Show analytics publicly
  },
  
  // Admin management
  adminNotes: String,     // Internal notes for admins
  qualityScore: Number,   // Calculated quality score (0-100)
  flaggedCount: Number,   // Number of times flagged by users
  flags: Array,           // Flag reasons
  
  // Additional settings
  settings: {
    allowComments: Boolean, // Allow comments/reviews
    allowSharing: Boolean,  // Allow social sharing
    hideFromSearch: Boolean // Hide from search results
  },
  
  // Timestamps
  publishedAt: Date,      // Publication date
  expiresAt: Date,        // Expiration date
  lastPromotedAt: Date    // Last promotion date
};

/**
 * Business listing schema
 * @type {Object}
 */
export const BusinessListingSchema = {
  ...BaseListingSchema,
  
  // Business essentials
  essentials: {
    businessType: String,   // Type of business (retail, service, etc.)
    entityType: String,     // Legal entity type (Pvt Ltd, LLP, etc.)
    establishedYear: Number, // Year established
    registrationNumber: String, // Business registration number
    gstNumber: String,      // GST number
    panNumber: String,      // PAN number
    licenses: Array,        // Business licenses
    certifications: Array,  // Business certifications
    awards: Array,          // Business awards
  },
  
  // Team & operations
  operations: {
    employees: {
      count: Number,        // Number of employees
      fullTime: Number,     // Full-time employees
      partTime: Number,     // Part-time employees
      contractual: Number   // Contractual employees
    },
    businessHours: {        // Operating hours
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String }
    },
    locations: Array,       // Multiple locations if applicable
    serviceAreas: Array,    // Areas served
    operationalYears: Number, // Years in operation
    seasonality: String,    // Business seasonality 
  },
  
  // Financial information
  financials: {
    annualRevenue: {
      amount: Number,        // Amount
      currency: String,      // Currency (default: "INR")
      period: String,        // Period (e.g., "FY 2024-25")
      verified: Boolean      // Verified by platform
    },
    monthlyRevenue: {
      amount: Number,
      currency: String,
      trend: String          // "increasing", "stable", "decreasing"
    },
    profitMargin: {
      percentage: Number,    // Percentage
      trend: String          // Trend
    },
    ebitda: {
      amount: Number,        // Amount
      currency: String,      // Currency
      margin: Number         // Margin percentage
    },
    expenses: {
      rent: { amount: Number, currency: String },
      payroll: { amount: Number, currency: String },
      utilities: { amount: Number, currency: String },
      marketing: { amount: Number, currency: String },
      other: { amount: Number, currency: String },
      total: { amount: Number, currency: String }
    },
    financialHealth: String, // Assessment of financial health
    financialTrend: String,  // "growing", "stable", "declining"
    financialDocuments: Array, // Financial document references
    revenueStreams: Array,   // Revenue stream breakdown
  },
  
  // Assets
  assets: {
    inventory: {
      included: Boolean,     // Is inventory included in sale?
      value: { amount: Number, currency: String },
      description: String,   // Description of inventory
      lastValuationDate: Date // Last valuation date
    },
    equipment: {
      included: Boolean,     // Is equipment included?
      value: { amount: Number, currency: String },
      description: String,   // Description of equipment
      condition: String,     // Condition of equipment
      agingYears: Number     // Age of equipment in years
    },
    intellectualProperty: {
      included: Boolean,     // Is IP included?
      types: Array,          // Types of IP (patents, trademarks, etc.)
      description: String,   // Description of IP
      value: { amount: Number, currency: String }
    },
    realEstate: {
      included: Boolean,     // Is real estate included?
      owned: Boolean,        // Is property owned?
      leased: Boolean,       // Is property leased?
      details: String,       // Details about the property
      lease: {
        expiryDate: Date,    // Lease expiry date
        monthlyRent: { amount: Number, currency: String },
        transferable: Boolean, // Is lease transferable?
        terms: String        // Lease terms
      },
      value: { amount: Number, currency: String } // Property value
    },
    digitalAssets: {
      included: Boolean,     // Digital assets included?
      website: Boolean,      // Website included?
      socialMediaAccounts: Boolean, // Social media accounts?
      customerDatabase: Boolean, // Customer database?
      description: String    // Description of digital assets
    },
    keyAssets: Array         // List of key assets
  },
  
  // Sale information
  sale: {
    askingPrice: {
      amount: Number,        // Asking price amount
      currency: String,      // Currency (default: "INR")
      formattedPrice: String, // Formatted price for display
      priceJustification: String, // Justification for price
      priceMultiple: Number  // Multiple of yearly earnings
    },
    reasonForSelling: String, // Reason for selling
    sellingUrgency: String,  // Urgency level
    negotiable: Boolean,     // Is price negotiable?
    sellerFinancing: {
      available: Boolean,    // Seller financing available?
      details: String,       // Financing details
      terms: String          // Financing terms
    },
    trainingAndSupport: {
      trainingPeriod: String, // Training period offered
      supportIncluded: Boolean, // Post-sale support included?
      supportDetails: String  // Support details
    },
    nonCompete: {
      included: Boolean,     // Non-compete agreement?
      terms: String,         // Terms of non-compete
      duration: String,      // Duration of non-compete
      geographicScope: String // Geographic scope
    },
    saleTerms: String,       // Additional sale terms
    confidentiality: {
      nda: Boolean,          // NDA required?
      disclosureProcess: String, // Disclosure process
      restrictedInfo: String  // Restricted information
    }
  },
  
  // Market & competition
  market: {
    targetMarket: String,    // Target market description
    marketSize: String,      // Market size
    marketShare: String,     // Estimated market share
    marketTrend: String,     // Market trend
    competitors: {
      major: Array,          // Major competitors
      competitive_advantage: Array, // Competitive advantages
      barriers_to_entry: Array // Barriers to entry
    },
    industryOutlook: String, // Industry outlook
    seasonality: String,     // Market seasonality
    regulations: Array,      // Key regulations affecting business
    threats: Array,          // Market threats
    opportunities: Array     // Market opportunities
  },
  
  // Customers & sales
  customers: {
    customerBase: String,    // Description of customer base
    customerDemographics: Object, // Customer demographics
    keyAccounts: Array,      // Key accounts/clients
    contractStatus: {
      contractsInPlace: Boolean, // Customer contracts?
      transferable: Boolean, // Transferable to new owner?
      averageDuration: String // Average contract duration
    },
    customerConcentration: {
      topCustomerPercentage: Number, // % from top customer
      top5CustomerPercentage: Number, // % from top 5 customers
      diversificationLevel: String // Low, Medium, High
    },
    customerAcquisition: {
      channels: Array,       // Acquisition channels
      cost: { amount: Number, currency: String }, // CAC
      strategy: String       // Acquisition strategy
    },
    customerRetention: {
      rate: Number,          // Retention rate
      strategy: String,      // Retention strategy
      loyaltyPrograms: Boolean // Loyalty programs?
    },
    salesCycle: {
      length: String,        // Sales cycle length
      stages: Array,         // Sales cycle stages
      conversionRate: Number // Lead-to-sale conversion rate
    }
  },
  
  // Growth & potential
  growth: {
    historicalGrowth: {
      rate: Number,          // Historical growth rate
      period: String,        // Period (e.g., "Last 3 years")
      trend: String          // Growth trend
    },
    growthDrivers: Array,    // Key growth drivers
    expansionOpportunities: Array, // Expansion opportunities
    improvementAreas: Array, // Areas for improvement
    untappedMarkets: Array,  // Untapped markets
    growthHurdles: Array,    // Obstacles to growth
    futureProjections: {
      projectedGrowth: Number, // Projected growth rate
      basisForProjection: String, // Basis for projection
      scenarios: Object      // Different growth scenarios
    }
  },
  
  // Business risks
  risks: {
    operationalRisks: Array, // Operational risks
    financialRisks: Array,   // Financial risks
    marketRisks: Array,      // Market risks
    legalRisks: Array,       // Legal risks
    keyPersonDependencies: Boolean, // Key person risks?
    supplierDependencies: Boolean, // Supplier dependencies?
    riskMitigationStrategies: Array // Risk mitigation strategies
  },
  
  // Transition plan
  transition: {
    ownerInvolvement: {
      current: String,       // Current owner involvement
      postSale: String,      // Post-sale involvement
      transitionPeriod: String // Transition period
    },
    keyStaffRetention: {
      managementTeam: {
        staying: Boolean,    // Is management team staying?
        details: String      // Details on who's staying
      },
      keyEmployees: {
        staying: Boolean,    // Are key employees staying?
        details: String      // Details on who's staying
      }
    },
    transitionChallenges: Array, // Potential transition challenges
    suggestedOnboardingPlan: String // Suggested onboarding plan
  },
  
  // Due diligence
  dueDiligence: {
    financialRecords: {
      available: Boolean,    // Financial records available?
      years: Number,         // Years of records available
      quality: String        // Quality of records
    },
    legalCompliance: {
      status: String,        // Compliance status
      pendingIssues: Array,  // Pending legal issues
      pastIssues: Array      // Past legal issues
    },
    taxCompliance: {
      status: String,        // Tax compliance status
      pendingIssues: Array,  // Pending tax issues
      pastIssues: Array      // Past tax issues
    },
    inspectionDetails: {
      process: String,       // Inspection process
      availability: String   // Availability for inspection
    }
  }
};

/**
 * Franchise listing schema
 * @type {Object}
 */
export const FranchiseListingSchema = {
  ...BaseListingSchema,
  
  // Franchise details
  franchiseDetails: {
    franchiseType: String,  // Type of franchise
    franchiseBrand: String, // Brand name
    establishedYear: Number, // Year brand was established
    totalOutlets: Number,   // Total number of outlets
    totalFranchisees: Number, // Total number of franchisees
    companyOwnedUnits: Number, // Company-owned units
    countryOfOrigin: String, // Country of origin
    industryStanding: String, // Position in industry
    franchiseStartYear: Number, // When franchising started
    awards: Array           // Awards & recognitions
  },
  
  // Investment details
  investment: {
    investmentRange: {
      min: { amount: Number, currency: String },
      max: { amount: Number, currency: String },
      formattedRange: String // Formatted range for display
    },
    franchiseFee: {
      amount: Number,
      currency: String,
      refundable: Boolean,
      paymentTerms: String
    },
    royaltyFee: {
      percentage: Number,
      structure: String,     // Flat, tiered, etc.
      frequency: String      // Monthly, quarterly, etc.
    },
    marketingFee: {
      percentage: Number,
      structure: String,
      utilization: String    // How marketing fees are used
    },
    estimatedTotalInvestment: {
      amount: Number,
      currency: String,
      breakdown: Object      // Breakdown of total investment
    },
    ongoingFees: Array,      // Other ongoing fees
    additionalInvestmentNeeds: String, // Additional investment
    workingCapitalRequirement: {
      amount: Number,
      currency: String,
      duration: String       // Duration working capital covers
    }
  },
  
  // Terms and conditions
  terms: {
    contractDuration: {
      years: Number,
      renewalOption: Boolean
    },
    renewalTerms: {
      available: Boolean,
      fee: { amount: Number, currency: String },
      conditions: String
    },
    terminationConditions: String, // Termination conditions
    transferRights: {
      transferable: Boolean,
      transferFee: { amount: Number, currency: String },
      conditions: String
    },
    territoryRights: {
      exclusive: Boolean,
      protectionRadius: String,
      restrictions: String
    },
    spaceRequirement: {
      minArea: String,
      maxArea: String,
      location: String       // Location requirements
    },
    proprietaryInformation: {
      duration: String,
      restrictions: String
    }
  },
  
  // Support offered
  support: {
    initialSupport: {
      trainingProvided: Boolean,
      trainingDuration: String,
      trainingLocation: String,
      trainingContent: Array,
      siteSelection: Boolean,
      constructionSupport: Boolean,
      grandOpeningSupport: Boolean
    },
    ongoingSupport: {
      fieldSupport: {
        available: Boolean,
        frequency: String,
        details: String
      },
      marketingSupport: {
        available: Boolean,
        materials: Array,
        campaigns: Array,
        details: String
      },
      operationalSupport: {
        available: Boolean,
        manuals: Boolean,
        helpdesk: Boolean,
        details: String
      },
      trainingUpdates: {
        available: Boolean,
        frequency: String,
        format: String
      }
    },
    technology: {
      proprietarySystems: Boolean,
      softwareProvided: Array,
      techSupport: String
    },
    supplyChain: {
      supplierNetwork: Boolean,
      mandatoryPurchases: Array,
      inventoryManagement: String
    }
  },
  
  // Expansion and locations
  expansion: {
    currentMarkets: Array,   // Current markets
    targetMarkets: Array,    // Target expansion markets
    expansionStrategy: String, // Expansion strategy
    internationalPresence: Array, // International locations
    priorityLocations: Array, // Priority locations for expansion
    locationCriteria: {
      demographics: Array,   // Demographic requirements
      traffic: String,       // Traffic requirements
      proximityFactors: Array, // Proximity requirements
      zoningSuitability: Array // Suitable zoning
    }
  },
  
  // Performance metrics
  performance: {
    salesData: {
      averageUnitSales: { amount: Number, currency: String },
      salesGrowth: String,   // Sales growth rate
      topUnitSales: { amount: Number, currency: String },
      salesMaturityPeriod: String // Time to reach mature sales
    },
    profitability: {
      averageProfitMargin: String, // Average profit margin
      breakEvenPeriod: String, // Average break-even period
      paybackPeriod: String,  // Average investment payback period
      returnOnInvestment: String // Average ROI
    },
    unitEconomics: {
      costStructure: Object, // Typical cost structure
      revenueStreams: Object // Revenue streams breakdown
    },
    successRate: {
      percentProfitable: String, // % of units profitable
      unitClosureRate: String,  // Unit closure rate
      failureFactors: Array     // Common failure factors
    },
    benchmarks: {
      industry: String,      // Industry benchmarks
      topPerformers: String  // Top performer metrics
    }
  },
  
  // Franchisee requirements
  requirements: {
    financial: {
      netWorth: { amount: Number, currency: String },
      liquidCapital: { amount: Number, currency: String },
      financingOptions: Array // Available financing options
    },
    experience: {
      industryExperience: String, // Required industry experience
      businessExperience: String, // Required business experience
      skills: Array          // Required skills
    },
    personal: {
      ownerOperatorRequired: Boolean, // Owner-operator required?
      timeCommitment: String, // Expected time commitment
      values: Array,         // Value alignment
      personality: Array     // Personality traits sought
    },
    legalRequirements: {
      backgroundCheck: Boolean, // Background check required?
      creditCheck: Boolean,   // Credit check required?
      legalStatus: String     // Legal status requirements
    },
    additionalRequirements: Array // Additional requirements
  },
  
  // Franchise operations
  operations: {
    businessModel: {
      description: String,   // Business model description
      keySuccessFactors: Array, // Key success factors
      usp: String            // Unique selling proposition
    },
    systemComplexity: String, // System complexity
    staffingRequirements: {
      typical: Number,       // Typical staff size
      roles: Array,          // Common roles
      hiringSupport: Boolean // Hiring support provided?
    },
    operatingHours: {
      typical: String,       // Typical operating hours
      flexibility: String    // Flexibility in hours
    },
    seasonality: {
      seasonal: Boolean,     // Is business seasonal?
      peakPeriods: Array,    // Peak periods
      strategies: Array      // Seasonality strategies
    },
    multiUnitOpportunities: {
      available: Boolean,    // Multi-unit opportunities?
      discounts: String,     // Multi-unit discounts
      requirements: String   // Multi-unit requirements
    }
  },
  
  // Success stories
  successStories: Array,    // Success stories
  
  // Franchise community
  community: {
    franchiseeNetworking: {
      events: Array,         // Networking events
      platforms: Array,      // Communication platforms
      frequency: String      // Interaction frequency
    },
    franchiseeCouncil: {
      exists: Boolean,       // Franchisee council exists?
      influence: String,     // Level of influence
      structure: String      // Council structure
    },
    testimonials: Array      // Franchisee testimonials
  },
  
  // Legal aspects
  legal: {
    disclosureDocument: {
      available: Boolean,    // FDD available?
      lastUpdated: Date      // Last update date
    },
    litigationHistory: {
      exists: Boolean,       // Litigation history exists?
      summary: String        // Summary of litigation history
    },
    registrationStatus: {
      states: Array,         // Registered states
      international: Array   // International registrations
    }
  }
};

/**
 * Investor listing schema
 * @type {Object}
 */
export const InvestorListingSchema = {
  ...BaseListingSchema,
  
  // Investor details
  investorDetails: {
    investorType: String,   // Type of investor
    establishedYear: Number, // Year established (if organization)
    investmentPhilosophy: String, // Investment philosophy
    experience: {
      years: Number,        // Years of investment experience
      backgroundSummary: String // Background summary
    }
  },
  
  // Investment details
  investment: {
    capacity: {
      minInvestment: { amount: Number, currency: String },
      maxInvestment: { amount: Number, currency: String },
      totalFundsAvailable: { amount: Number, currency: String }
    },
    preferences: {
      averageInvestment: { amount: Number, currency: String },
      typicalRounds: Array,  // Seed, Series A, etc.
      leadInvestor: Boolean, // Willing to lead rounds?
      coinvestors: Array,    // Preferred co-investors
      stakeSought: {
        min: Number,         // Min stake sought (%)
        max: Number,         // Max stake sought (%)
        controlling: Boolean // Seeks controlling stake?
      }
    },
    timing: {
      investmentTimeline: String, // Investment timeline
      holdingPeriod: String, // Expected holding period
      exitStrategy: Array    // Preferred exit strategies
    }
  },
  
  // Focus areas
  focus: {
    industries: {
      primary: Array,        // Primary industries of interest
      secondary: Array,      // Secondary industries
      excluded: Array        // Industries explicitly avoided
    },
    businessStage: {
      preferred: Array,      // Preferred business stages
      excluded: Array        // Stages explicitly avoided
    },
    investmentStage: Array,  // Preferred investment stages
    businessCriteria: {
      size: Array,           // Business size preferences
      profitability: String, // Profitability requirements
      growthRate: String,    // Growth rate preferences
      otherCriteria: Array   // Other business criteria
    },
    geographicFocus: Array   // Geographic focus
  },
  
  // Portfolio
  portfolio: {
    overview: {
      totalInvestments: Number, // Total investments made
      activeInvestments: Number, // Active investments
      exits: Number,          // Number of exits
      successRate: String     // Success rate
    },
    highlights: Array,        // Portfolio highlights
    pastInvestments: Array,   // Past investments
    currentInvestments: Array, // Current investments
    successStories: Array,    // Success stories
    sectorDistribution: Object // Portfolio sector distribution
  },
  
  // Investment process
  process: {
    overview: {
      approach: String,       // Investment approach
      stages: Array,          // Investment process stages
      timeline: String        // Typical timeline
    },
    screening: {
      initialCriteria: Array, // Initial screening criteria
      dealSources: Array,     // Deal sources
      initialResponseTime: String // Initial response time
    },
    evaluation: {
      dueDiligence: {
        process: String,      // Due diligence process
        focusAreas: Array,    // Due diligence focus areas
        timeline: String      // Due diligence timeline
      },
      decisionMaking: {
        process: String,      // Decision-making process
        keyFactors: Array,    // Key decision factors
        committees: Array     // Decision committees
      }
    },
    postInvestment: {
      involvement: {
        level: String,        // Level of involvement
        boardPosition: Boolean, // Requires board position?
        reportingRequirements: Array // Reporting requirements
      },
      support: Array          // Post-investment support
    }
  },
  
  // Terms
  terms: {
    valuation: {
      approach: String,       // Valuation approach
      metrics: Array          // Valuation metrics
    },
    structure: {
      preferred: Array,       // Preferred deal structures
      terms: Array,           // Common deal terms
      conditions: Array       // Common conditions
    },
    returns: {
      targetROI: String,      // Target ROI
      expectedMultiple: String, // Expected multiple
      paybackPeriod: String   // Expected payback period
    }
  },
  
  // Value add
  valueAdd: {
    expertise: Array,         // Areas of expertise
    network: {
      industry: Array,        // Industry connections
      financiers: Array,      // Financial connections
      strategic: Array        // Strategic connections
    },
    resources: {
      mentorship: Boolean,    // Offers mentorship?
      operationalSupport: Boolean, // Operational support?
      strategicGuidance: Boolean // Strategic guidance?
    },
    additionalValue: Array    // Additional value offered
  },
  
  // Team
  team: {
    keyMembers: Array,        // Key team members
    advisors: Array,          // Advisors
    operatingPartners: Array  // Operating partners
  },
  
  // For institutional investors
  institution: {
    type: String,             // Type of institution
    aum: { amount: Number, currency: String }, // Assets under management
    fundDetails: {
      fundName: String,       // Fund name
      fundSize: { amount: Number, currency: String },
      vintageYear: Number,    // Vintage year
      fundLife: String,       // Fund life
      investmentPeriod: String // Investment period
    },
    backers: Array,           // Fund backers/LPs
    governance: String,       // Governance structure
    regulatoryApprovals: Array // Regulatory approvals
  },
  
  // Track record
  trackRecord: {
    performanceMetrics: {
      irr: String,            // Internal rate of return
      moic: String,           // Multiple on invested capital
      winRate: String         // Win rate
    },
    investmentHistory: Array, // Investment history summary
    benchmarks: Object        // Performance vs benchmarks
  }
};

/**
 * Startup listing schema
 * @type {Object}
 */
export const StartupListingSchema = {
  ...BaseListingSchema,
  
  // Startup details
  startupDetails: {
    stage: String,            // Current stage (idea, MVP, etc.)
    foundedDate: Date,        // Foundation date
    launchDate: Date,         // Product launch date
    registeredName: String,   // Registered company name
    registrationType: String, // Company registration type
    registrationNumber: String, // Company registration number
    mission: String,          // Mission statement
    vision: String            // Vision statement
  },
  
  // Founders & team
  team: {
    founders: Array,          // Founder information
    keyTeamMembers: Array,    // Key team members
    advisors: Array,          // Advisors
    teamSize: {
      total: Number,          // Total team size
      fullTime: Number,       // Full-time employees
      partTime: Number,       // Part-time employees
      contractors: Number     // Contractors
    },
    hiringPlans: String,      // Hiring plans
    organizationStructure: String // Organization structure
  },
  
  // Product & technology
  product: {
    overview: String,         // Product overview
    stage: String,            // Product stage
    uniqueSellingPoints: Array, // USPs
    intellectualProperty: {
      patents: {
        filed: Array,         // Filed patents
        granted: Array,       // Granted patents
        pending: Array        // Pending patents
      },
      trademarks: Array,      // Trademarks
      copyrights: Array,      // Copyrights
      tradesecrets: Boolean   // Trade secrets exist?
    },
    technology: {
      stack: Array,           // Technology stack
      innovations: Array,     // Key innovations
      developmentRoadmap: Array // Development roadmap
    },
    productScreenshots: Array, // Product screenshots
    demoUrl: String,          // Demo URL
    appLinks: {
      android: String,        // Android app link
      ios: String,            // iOS app link
      web: String             // Web app link
    }
  },
  
  // Market & business model
  market: {
    overview: {
      targetMarket: String,   // Target market
      problemStatement: String, // Problem being solved
      solutionStatement: String, // Solution offered
      marketSize: {
        tam: { amount: Number, currency: String }, // Total addressable market
        sam: { amount: Number, currency: String }, // Serviceable available market
        som: { amount: Number, currency: String }  // Serviceable obtainable market
      }
    },
    competition: {
      directCompetitors: Array, // Direct competitors
      indirectCompetitors: Array, // Indirect competitors
      competitiveAdvantages: Array, // Competitive advantages
      barriers: Array         // Barriers to entry
    },
    businessModel: {
      revenueStreams: Array,  // Revenue streams
      pricingModel: String,   // Pricing model
      customerAcquisition: {
        strategy: String,     // Customer acquisition strategy
        channels: Array,      // Acquisition channels
        cac: { amount: Number, currency: String } // Customer acquisition cost
      },
      partnerships: Array     // Key partnerships
    },
    goToMarket: {
      strategy: String,       // Go-to-market strategy
      timeline: String,       // Go-to-market timeline
      milestones: Array       // Go-to-market milestones
    }
  },
  
  // Traction & metrics
  traction: {
    userMetrics: {
      totalUsers: Number,     // Total users
      activeUsers: {
        daily: Number,        // Daily active users
        monthly: Number       // Monthly active users
      },
      userGrowth: String,     // User growth rate
      retentionRate: String,  // User retention rate
      churnRate: String       // User churn rate
    },
    financialMetrics: {
      revenue: {
        arr: { amount: Number, currency: String }, // Annual recurring revenue
        mrr: { amount: Number, currency: String }, // Monthly recurring revenue
        growth: String        // Revenue growth rate
      },
      unitEconomics: {
        cac: { amount: Number, currency: String }, // Customer acquisition cost
        ltv: { amount: Number, currency: String }, // Lifetime value
        paybackPeriod: String // CAC payback period
      }
    },
    keyMilestones: Array,     // Key milestones achieved
    productMetrics: {
      engagement: String,     // User engagement metrics
      conversion: String,     // Conversion metrics
      nps: Number             // Net promoter score
    },
    socialProof: {
      customerTestimonials: Array, // Customer testimonials
      mediaFeatures: Array,   // Media features
      awards: Array           // Awards & recognitions
    }
  },
  
  // Funding & financials
  funding: {
    history: {
      totalRaised: { amount: Number, currency: String }, // Total funding raised
      rounds: Array,          // Previous funding rounds
      investors: Array,       // Previous investors
      latestValuation: { amount: Number, currency: String } // Latest valuation
    },
    current: {
      raising: Boolean,       // Currently raising?
      targetAmount: { amount: Number, currency: String }, // Target amount
      preMoney: { amount: Number, currency: String }, // Pre-money valuation
      equity: String,         // Equity offered
      minimumInvestment: { amount: Number, currency: String }, // Minimum investment
      usageOfFunds: Array,    // Usage of funds
      closingDate: Date       // Expected closing date
    },
    financials: {
      currentRunway: String,  // Current runway
      burnRate: { amount: Number, currency: String }, // Monthly burn rate
      breakEvenPoint: String, // Break-even point
      projections: {
        revenue: Array,       // Revenue projections
        expenses: Array,      // Expense projections
        profitability: String // Path to profitability
      }
    },
    resources: {
      pitchDeck: {
        url: String,          // Pitch deck URL
        password: String      // Pitch deck password
      },
      financialModel: {
        url: String,          // Financial model URL
        password: String      // Financial model password
      },
      additionalDocuments: Array // Additional documents
    }
  },
  
  // Growth & strategy
  growth: {
    strategy: {
      shortTerm: Array,       // Short-term strategies
      mediumTerm: Array,      // Medium-term strategies
      longTerm: Array         // Long-term strategies
    },
    expansionPlans: {
      product: String,        // Product expansion plans
      geographic: String,     // Geographic expansion plans
      market: String          // Market expansion plans
    },
    scalability: {
      factors: Array,         // Scalability factors
      challenges: Array       // Scaling challenges
    },
    keyRisks: Array,          // Key risks
    mitigationStrategies: Array // Risk mitigation strategies
  },
  
  // Exit strategy
  exitStrategy: {
    potentialAcquirers: Array, // Potential acquirers
    ipo: {
      considered: Boolean,    // IPO considered?
      timeline: String        // IPO timeline
    },
    alternativeExits: Array,  // Alternative exit strategies
    expectedTimeframe: String // Expected exit timeframe
  }
};

/**
 * Digital asset listing schema
 * @type {Object}
 */
export const DigitalAssetListingSchema = {
  ...BaseListingSchema,
  
  // Asset details
  assetDetails: {
    assetType: String,       // Type of digital asset
    platform: String,        // Platform/technology
    niche: String,           // Specific niche
    founded: {
      date: Date,            // Foundation date
      age: String            // Age of asset
    },
    domainInfo: {
      domain: String,        // Domain name
      registrar: String,     // Domain registrar
      expiryDate: Date,      // Domain expiry date
      included: Boolean,     // Domain included in sale?
      domainAuthority: Number, // Domain authority
      domainRating: Number   // Domain rating
    }
  },
  
  // Technical details
  technical: {
    platform: String,        // Platform (WordPress, Shopify, etc.)
    hosting: {
      provider: String,      // Hosting provider
      plan: String,          // Hosting plan
      costPm: { amount: Number, currency: String }, // Monthly hosting cost
      included: Boolean,     // Hosting included in sale?
      expiryDate: Date       // Hosting expiry date
    },
    technology: {
      stack: Array,          // Technology stack
      frameworks: Array,     // Frameworks used
      cms: String,           // Content management system
      plugins: Array,        // Key plugins/extensions
      customDevelopment: Boolean // Custom development?
    },
    mobileResponsive: Boolean, // Mobile responsive?
    pagespeed: {
      mobile: Number,        // Mobile page speed score
      desktop: Number        // Desktop page speed score
    },
    security: {
      ssl: Boolean,          // SSL certificate?
      backup: String,        // Backup system
      vulnerabilities: Array // Known vulnerabilities
    }
  },
  
  // Content & assets
  content: {
    totalPages: Number,      // Total pages
    totalPosts: Number,      // Total posts/articles
    wordCount: Number,       // Total word count
    contentQuality: String,  // Content quality assessment
    contentFrequency: String, // Content update frequency
    uniqueContent: Boolean,  // Unique content?
    contentRights: String,   // Content rights
    mediaLibrary: {
      images: Number,        // Number of images
      videos: Number,        // Number of videos
      downloads: Number,     // Number of downloadable files
      licensed: Boolean      // Media properly licensed?
    }
  },
  
  // Traffic & analytics
  traffic: {
    overview: {
      monthlyVisitors: Number, // Monthly visitors
      monthlyPageviews: Number, // Monthly pageviews
      trafficTrend: String,  // Traffic trend
      trafficSources: Object // Traffic sources breakdown
    },
    demographics: {
      countries: Array,      // Top countries
      age: Object,           // Age breakdown
      gender: Object,        // Gender breakdown
      interests: Array       // User interests
    },
    behavior: {
      bounceRate: String,    // Bounce rate
      averageSessionDuration: String, // Avg. session duration
      pagesPerSession: Number, // Pages per session
      returnVisitors: String // Return visitor percentage
    },
    seo: {
      organicTraffic: Number, // Organic traffic
      keywordRankings: Number, // Number of ranking keywords
      topKeywords: Array,    // Top keywords
      backlinks: {
        total: Number,       // Total backlinks
        referring: Number,   // Referring domains
        quality: String      // Backlink quality
      }
    },
    verifications: {
      analyticsAccess: Boolean, // Analytics access provided?
      trafficProof: Array     // Traffic proof documents
    }
  },
  
  // Financial information
  financials: {
    revenue: {
      monthly: { amount: Number, currency: String }, // Monthly revenue
      annual: { amount: Number, currency: String },  // Annual revenue
      trend: String,         // Revenue trend
      sources: Object        // Revenue sources breakdown
    },
    expenses: {
      monthly: { amount: Number, currency: String }, // Monthly expenses
      breakdown: Object,     // Expense breakdown
      fixed: { amount: Number, currency: String },   // Fixed expenses
      variable: { amount: Number, currency: String } // Variable expenses
    },
    profit: {
      monthly: { amount: Number, currency: String }, // Monthly profit
      margin: String,        // Profit margin
      trend: String          // Profit trend
    },
    financial_history: {
      years: Number,         // Years of financial history
      verifications: Array   // Financial verification documents
    }
  },
  
  // Monetization
  monetization: {
    methods: Array,          // Monetization methods
    primary: String,         // Primary monetization method
    potential: Array,        // Potential monetization methods
    advertising: {
      networks: Array,       // Ad networks used
      averageCpm: String,    // Average CPM
      fillRate: String       // Fill rate
    },
    affiliate: {
      programs: Array,       // Affiliate programs
      conversionRate: String, // Conversion rate
      epc: String            // Earnings per click
    },
    ecommerce: {
      platform: String,      // E-commerce platform
      products: Number,      // Number of products
      aov: { amount: Number, currency: String }, // Average order value
      conversionRate: String // Conversion rate
    },
    subscriptions: {
      members: Number,       // Number of members/subscribers
      mrr: { amount: Number, currency: String }, // Monthly recurring revenue
      churnRate: String      // Churn rate
    }
  },
  
  // Operations
  operations: {
    workload: {
      hoursPerWeek: Number,  // Hours required per week
      tasks: Array           // Regular tasks
    },
    automation: {
      level: String,         // Level of automation
      systems: Array,        // Automation systems
      potential: String      // Automation potential
    },
    team: {
      required: Boolean,     // Team required?
      current: Array,        // Current team members
      transition: String     // Team transition plan
    },
    suppliers: {
      key: Array,            // Key suppliers
      relationships: String, // Supplier relationships
      agreements: Array      // Supplier agreements
    },
    processes: {
      documented: Boolean,   // Processes documented?
      manuals: Array,        // Operating manuals
      training: String       // Training materials
    }
  },
  
  // Users & customers
  users: {
    database: {
      size: Number,          // User database size
      quality: String,       // Database quality
      included: Boolean      // Database included in sale?
    },
    engagement: {
      email: {
        subscribers: Number, // Email subscribers
        openRate: String,    // Email open rate
        platform: String     // Email platform
      },
      social: {
        platforms: Object,   // Social media presence
        followers: Number,   // Total followers
        engagement: String   // Social engagement rate
      },
      community: {
        type: String,        // Community type
        members: Number,     // Community members
        activity: String     // Community activity level
      }
    },
    customers: {
      lifetime: String,      // Customer lifetime
      acquisition: String,   // Customer acquisition channels
      demographics: Object   // Customer demographics
    }
  },
  
  // Growth & potential
  potential: {
    growthOpportunities: Array, // Growth opportunities
    untappedMarkets: Array,  // Untapped markets
    revenueExpansion: Array, // Revenue expansion opportunities
    competitive: {
      landscape: String,     // Competitive landscape
      advantages: Array,     // Competitive advantages
      threats: Array         // Competitive threats
    },
    projections: {
      traffic: String,       // Traffic projections
      revenue: String,       // Revenue projections
      justification: String  // Projection justification
    }
  },
  
  // Sale information
  sale: {
    price: {
      asking: { amount: Number, currency: String }, // Asking price
      multiple: String,      // Price multiple
      justification: String, // Price justification
      negotiable: Boolean    // Price negotiable?
    },
    reason: String,          // Reason for selling
    included: Array,         // Items included in sale
    excluded: Array,         // Items excluded from sale
    process: {
      transfer: String,      // Transfer process
      timeline: String,      // Transfer timeline
      training: String,      // Training offered
      support: String        // Post-sale support
    },
    escrow: {
      recommended: Boolean,  // Escrow recommended?
      service: String        // Recommended escrow service
    }
  },
  
  // Verification & proof
  verification: {
    ownership: Array,        // Ownership proof
    revenue: Array,          // Revenue proof
    traffic: Array,          // Traffic proof
    accounts: Array,         // Access to accounts
    additionalProof: Array   // Additional proof available
  }
};

/**
 * Plan schema
 * @type {Object}
 */
export const PlanSchema = {
  ...BaseSchema,
  
  // Plan details
  name: String,              // Plan name
  type: String,              // Plan type (from PLAN_TYPES)
  description: String,       // Plan description
  shortDescription: String,  // Short description for cards
  features: Array,           // Plan features list
  
  // Pricing
  pricing: {
    amount: Number,          // Price amount
    currency: String,        // Currency (default: "INR")
    billingCycle: String,    // Monthly, Quarterly, Yearly
    discountedFrom: Number,  // Original price (if discounted)
    pricePerMonth: Number,   // Monthly equivalent price
    setupFee: Number,        // One-time setup fee
    trialDays: Number        // Free trial days
  },
  
  // Duration
  duration: {
    displayText: String,     // Duration text (e.g., "3 months")
    days: Number,            // Duration in days
    months: Number,          // Duration in months
  },
  
  // Resource limits
  limits: {
    connectsPerMonth: Number, // Connects given per month
    totalConnects: Number,    // Total connects for plan duration
    listings: {
      total: Number,          // Total listings allowed
      featured: Number,       // Featured listings allowed
      premium: Number,        // Premium listings allowed
      perType: Object         // Limits per listing type
    },
    views: {
      details: Number,        // Detail views allowed
      contacts: Number,       // Contact reveals allowed
      saved: Number           // Saved listings allowed
    }
  },
  
  // Display settings
  display: {
    color: String,           // Color for UI display
    icon: String,            // Icon name for UI display
    badge: String,           // Badge text (e.g. "Popular")
    order: Number,           // Display order in pricing page
    recommended: Boolean,    // Recommended plan flag
    highlight: Boolean       // Highlight in pricing page
  },
  
  // Availability
  availability: {
    isPublic: Boolean,       // Publicly available
    forUserTypes: Array,     // Available for user types
    forListingTypes: Array,  // Available for listing types
    limitedTime: Boolean,    // Limited time offer
    availableUntil: Date,    // Available until date
    maxSubscribers: Number   // Maximum subscribers
  },
  
  // Features & permissions
  permissions: {
    canMessage: Boolean,     // Can send messages
    canExport: Boolean,      // Can export data
    canAccessAdvancedSearch: Boolean, // Advanced search access
    canAccessReports: Boolean, // Reports access
    showAnalytics: Boolean,  // Show listing analytics
    hideAds: Boolean,        // Hide advertisements
    priority: {
      support: Boolean,      // Priority support
      visibility: Boolean,   // Priority in search results
      response: Boolean      // Priority response time
    }
  },
  
  // Additional benefits
  benefits: {
    consultationMinutes: Number, // Free consultation minutes
    additionalServices: Array, // Additional services included
    partnerDiscounts: Array  // Partner discounts
  },
  
  // Status
  status: Boolean,           // Plan status (active/inactive)
  
  // Tracking
  tracking: {
    subscribers: Number,     // Current subscribers
    viewCount: Number,       // Plan page views
    conversionRate: Number   // View-to-subscription rate
  }
};

/**
 * User subscription schema
 * @type {Object}
 */
export const UserSubscriptionSchema = {
  ...BaseSchema,
  
  // Core subscription data
  userId: String,            // User ID
  planId: String,            // Plan ID
  planType: String,          // Plan type (from PLAN_TYPES)
  
  // Subscription status
  status: String,            // Active, Expired, Cancelled, Paused
  isActive: Boolean,         // Is currently active
  
  // Dates
  startDate: Date,           // Subscription start date
  endDate: Date,             // Subscription end date
  cancelledDate: Date,       // Cancellation date
  renewalDate: Date,         // Next renewal date
  
  // Payment details
  payment: {
    amount: Number,          // Amount paid
    currency: String,        // Currency
    paymentMethod: String,   // Payment method
    transactionId: String,   // Transaction ID
    invoiceId: String,       // Invoice ID
    autoRenew: Boolean,      // Auto-renewal enabled
    nextBillingDate: Date,   // Next billing date
    nextBillingAmount: Number // Next billing amount
  },
  
  // Subscription details
  details: {
    planName: String,        // Plan name at time of purchase
    planFeatures: Array,     // Plan features at time of purchase
    duration: String,        // Duration text
    durationDays: Number,    // Duration in days
    promoCode: String,       // Promotional code used
    discount: Number,        // Discount amount
    notes: String            // Subscription notes
  },
  
  // Resource usage
  usage: {
    connectsTotal: Number,   // Total connects allocated
    connectsUsed: Number,    // Connects used
    connectsRemaining: Number, // Connects remaining
    listingsTotal: Number,   // Total listings allowed
    listingsUsed: Number,    // Listings used
    contactsRevealed: Number, // Contacts revealed
    detailsViewed: Number    // Listing details viewed
  },
  
  // Specific listing type (if applicable)
  listingType: {
    typeId: String,          // Type ID (for specific listing)
    typeName: String,        // Type name
  },
  
  // History & logs
  history: {
    previousPlans: Array,    // Previous plans
    upgrades: Array,         // Upgrade history
    renewals: Array,         // Renewal history
    usageLogs: Array         // Usage logs
  }
};

/**
 * Review schema
 * @type {Object}
 */
export const ReviewSchema = {
  ...BaseSchema,
  
  // Core fields
  listingId: String,         // Listing ID
  userId: String,            // User ID
  
  // Rating
  rating: Number,            // Rating (1-5)
  verification: {
    verified: Boolean,       // Verified purchase/interaction
    verificationType: String, // Verification type
    verificationDate: Date   // Verification date
  },
  
  // Review content
  content: {
    title: String,           // Review title
    text: String,            // Review text
    pros: Array,             // Pros list
    cons: Array,             // Cons list
    recommendation: Boolean, // Would recommend?
    experience: String,      // Experience with business/listing
    photos: Array,           // Review photos
    media: Array             // Other media
  },
  
  // User metadata
  author: {
    name: String,            // User name
    photo: String,           // User photo
    verified: Boolean,       // Verified user
    previousReviews: Number, // Previous review count
    location: String         // User location
  },
  
  // Listing transaction details
  transaction: {
    date: Date,              // Transaction date
    type: String,            // Transaction type
    amount: { amount: Number, currency: String } // Transaction amount
  },
  
  // Visibility & moderation
  visibility: {
    isPublic: Boolean,       // Publicly visible
    featured: Boolean,       // Featured review
    status: String,          // Live, Pending, Rejected
    moderationNotes: String, // Moderation notes
    moderatedBy: String,     // Moderator ID
    moderatedAt: Date        // Moderation date
  },
  
  // Community engagement
  engagement: {
    helpfulCount: Number,    // Number of helpful votes
    unhelpfulCount: Number,  // Number of unhelpful votes
    reportCount: Number,     // Number of reports
    reportReasons: Array,    // Report reasons
    commentCount: Number,    // Number of comments
  },
  
  // Owner response
  ownerResponse: {
    text: String,            // Response text
    respondedBy: String,     // Responder ID
    respondedAt: Date,       // Response date
    edited: Boolean,         // Response edited?
    editedAt: Date           // Last edit date
  },
  
  // Update history
  history: {
    originalRating: Number,  // Original rating
    originalText: String,    // Original text
    editCount: Number,       // Number of edits
    lastEditedAt: Date       // Last edit date
  }
};

/**
 * Message schema
 * @type {Object}
 */
export const MessageSchema = {
  ...BaseSchema,
  
  // Message details
  chatroomId: String,        // Chatroom ID
  sender: String,            // Sender user ID
  senderName: String,        // Sender name
  recipient: String,         // Recipient user ID
  recipientName: String,     // Recipient name
  
  // Message content
  content: {
    text: String,            // Message text
    type: String,            // Text, Image, Document, System
    isForwarded: Boolean,    // Is forwarded message?
    quotedMessage: String,   // Quoted message ID
    mentions: Array,         // User mentions
    links: Array             // Links in message
  },
  
  // Message status
  status: {
    sent: Boolean,           // Successfully sent
    delivered: Boolean,      // Delivered to recipient
    read: Boolean,           // Read by recipient
    readAt: Date,            // Read timestamp
    deliveredAt: Date        // Delivery timestamp
  },
  
  // Rich content
  attachments: Array,        // Message attachments
  
  // Reference to listing
  listing: {
    id: String,              // Listing ID
    name: String,            // Listing name
    type: String,            // Listing type
  },
  
  // Message metadata
  metadata: {
    deviceInfo: String,      // Sender device info
    ipAddress: String,       // Sender IP address
    location: String,        // Sender location
    clientVersion: String    // Client app version
  },
  
  // Moderation
  moderation: {
    flagged: Boolean,        // Flagged for review
    flagReason: String,      // Flag reason
    moderationStatus: String, // Moderation status
    moderatedBy: String,     // Moderator ID
    moderatedAt: Date        // Moderation timestamp
  }
};

/**
 * Chatroom schema
 * @type {Object}
 */
export const ChatroomSchema = {
  ...BaseSchema,
  
  // Participants
  participants: Array,       // User IDs of participants
  participantDetails: Array, // Participant details objects
  
  // Listing reference
  listing: {
    id: String,              // Related listing ID
    name: String,            // Listing name
    type: String,            // Listing type
    image: String            // Listing image
  },
  
  // Chatroom status
  status: String,            // Active, Archived, Blocked
  
  // Last message
  lastMessage: {
    id: String,              // Last message ID
    text: String,            // Last message text
    sender: String,          // Last message sender
    timestamp: Date,         // Last message timestamp
    type: String             // Last message type
  },
  
  // Counters
  counters: {
    messageCount: Number,    // Total message count
    unreadCount: Object,     // Unread counts per user
    mediaCount: Number,      // Media message count
    offerCount: Number       // Offer message count
  },
  
  // Activity
  activity: {
    lastActive: Date,        // Last activity timestamp
    createdBy: String,       // User who initiated chat
    pinnedBy: Array          // Users who pinned this chat
  },
  
  // Connection lifecycle
  lifecycle: {
    connectionInitiated: Date, // Connection initiation date
    initialResponseTime: Number, // Initial response time (minutes)
    responseRate: Number,    // Response rate percentage
    averageResponseTime: Number, // Average response time (minutes)
    dealStage: String,       // Deal stage 
    lastEngagement: Date     // Last engagement date
  },
  
  // Metadata
  metadata: {
    initiatedFrom: String,   // Where chat was initiated from
    labels: Array,           // Organizational labels
    notes: Array,            // Admin/user notes
    tags: Array              // Tags
  }
};

// ===== EXPORTS =====

// Export all schemas
export default {
  // Base schemas
  BaseSchema,
  
  // User schemas
  UserSchema,
  
  // Listing schemas
  BaseListingSchema,
  BusinessListingSchema,
  FranchiseListingSchema,
  InvestorListingSchema,
  StartupListingSchema,
  DigitalAssetListingSchema,
  
  // Supporting schemas
  PlanSchema,
  UserSubscriptionSchema,
  ReviewSchema,
  MessageSchema,
  ChatroomSchema
};