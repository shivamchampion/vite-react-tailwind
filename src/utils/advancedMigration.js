// src/utils/advancedMigration.js
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    writeBatch,
    serverTimestamp
} from 'firebase/firestore';

// For generating Firestore document IDs
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';

// Import schema constants
import {
    LISTING_TYPES,
    LISTING_STATUS,
    PLAN_TYPES,
    USER_ROLES,
    PAYMENT_STATUS,
    MESSAGE_STATUS
} from '../models/schema.js';

// Firebase configuration - replace with your credentials
const firebaseConfig = {
    apiKey: "AIzaSyCIC2IxG_vvDCZXM5I8zUzn19HsL3xeG7M",
    authDomain: "businessoptions-37882.firebaseapp.com",
    projectId: "businessoptions-37882",
    storageBucket: "businessoptions-37882.firebasestorage.app",
    messagingSenderId: "577090470778",
    appId: "1:577090470778:web:7ad3fcfa0d794fab5b8cc3",
    measurementId: "G-1SG0PVWLJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== ID MAPPING AND GENERATION =====

// Store ID mappings for reference across collections
const idMappings = {
    users: {},
    businesses: {},
    franchises: {},
    investors: {},
    industries: {},
    subIndustries: {},
    cities: {},
    states: {},
    plans: {},
    chatrooms: {},
    messages: {}
};

/**
 * Generate a Firestore document ID with prefix for easier debugging
 * @param {string} collection - Collection name for prefix 
 * @param {string|number} originalId - Original SQL ID or null for new ID
 * @returns {string} - Firebase document ID
 */
const generateDocId = (collection, originalId = null) => {
    // Create shorter prefix from collection name
    const prefix = collection.substring(0, 3);
    
    // Use nanoid for shorter IDs than UUID
    const uniqueId = nanoid(12);
    
    // For entirely new records, just return prefixed nanoid
    if (originalId === null) {
        return `${prefix}_${uniqueId}`;
    }
    
    // For existing records with originalId, store mapping
    const docId = `${prefix}_${uniqueId}`;
    
    // Store in mapping for lookup
    if (!idMappings[collection]) {
        idMappings[collection] = {};
    }
    idMappings[collection][originalId.toString()] = docId;
    
    return docId;
};

/**
 * Lookup new document ID for an entity based on original ID
 * @param {string} collection - Collection name
 * @param {string|number} originalId - Original SQL ID
 * @returns {string|null} - Mapped document ID or null if not found
 */
const lookupDocId = (collection, originalId) => {
    if (!originalId) return null;
    
    // Convert to string for consistency
    const id = originalId.toString();
    
    // Check if we have a mapping
    if (idMappings[collection] && idMappings[collection][id]) {
        return idMappings[collection][id];
    }
    
    console.warn(`No ID mapping found for ${collection}:${id}`);
    return null;
};

// ===== DATA FORMATTING UTILITIES =====

/**
 * Format text with specific casing
 * @param {string} text - Text to format
 * @param {string} casing - Desired casing (title, camel, pascal, snake, kebab)
 * @returns {string} - Formatted text
 */
const formatText = (text, casing = 'normal') => {
    if (!text) return '';
    
    // Clean text first
    let cleaned = text.toString().trim().replace(/\s+/g, ' ');
    
    switch (casing.toLowerCase()) {
        case 'title':
            // Title Case: Capitalize First Letter Of Each Word
            return cleaned.replace(/\b\w/g, char => char.toUpperCase());
            
        case 'camel':
            // camelCase: firstWordLowerCaseRestWordsCapitalized
            return cleaned.toLowerCase()
                .replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase());
            
        case 'pascal':
            // PascalCase: EachWordCapitalized
            return cleaned.toLowerCase()
                .replace(/(^|\s)([a-z])/g, (match, space, char) => char.toUpperCase())
                .replace(/\s/g, '');
            
        case 'snake':
            // snake_case: all_lowercase_with_underscores
            return cleaned.toLowerCase().replace(/\s+/g, '_');
            
        case 'kebab':
            // kebab-case: all-lowercase-with-hyphens
            return cleaned.toLowerCase().replace(/\s+/g, '-');
            
        case 'upper':
            // UPPERCASE
            return cleaned.toUpperCase();
            
        case 'lower':
            // lowercase
            return cleaned.toLowerCase();
            
        case 'sentence':
            // Sentence case. First letter capitalized.
            return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
            
        default:
            return cleaned;
    }
};

/**
 * Format a phone number with proper patterns
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
const formatPhone = (phone) => {
    if (!phone) return '';
    
    // Clean the phone number - keep only digits
    const cleaned = phone.toString().replace(/\D/g, '');
    
    // For India, expect 10 digits potentially with country code
    if (cleaned.length === 10) {
        // Format as: 999-999-9999
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
        // Format as: +1 999-999-9999
        return '+1 ' + cleaned.substring(1).replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
        // Format as: +91 99999-99999
        return '+91 ' + cleaned.substring(2).replace(/(\d{5})(\d{5})/, '$1-$2');
    }
    
    // Default return the cleaned number
    return cleaned;
};

/**
 * Format a currency value with proper symbols and terms
 * @param {number|string} amount - Amount to format
 * @param {string} format - Desired format (inr, usd, auto)
 * @returns {string} - Formatted currency
 */
const formatCurrency = (amount, format = 'inr') => {
    if (!amount) return '';
    
    // Convert to number
    let value = typeof amount === 'string' 
        ? parseFloat(amount.replace(/[^0-9.-]/g, '')) 
        : amount;
    
    if (isNaN(value) || value === 0) return '';
    
    switch (format.toLowerCase()) {
        case 'inr':
        case 'rupees':
            // Format as Indian currency with lakhs/crores
            if (value >= 10000000) {
                const crore = value / 10000000;
                return `₹${crore.toFixed(crore < 10 ? 2 : 0)} Crore`;
            } else if (value >= 100000) {
                const lakh = value / 100000;
                return `₹${lakh.toFixed(lakh < 10 ? 2 : 0)} Lakh`;
            } else {
                return new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                }).format(value);
            }
            
        case 'usd':
        case 'dollars':
            // Format as US dollars
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
            }).format(value);
            
        case 'auto':
        default:
            // Determine format by context - default to INR
            return formatCurrency(value, 'inr');
    }
};

/**
 * Format date into ISO format
 * @param {string|Date} date - Date to format
 * @returns {Date} - Formatted date object
 */
const formatDate = (date) => {
    if (!date) return new Date();
    
    try {
        // Handle SQL date/datetime strings and timestamps
        return new Date(date);
    } catch (error) {
        console.error(`Error formatting date: ${date}`, error);
        return new Date();
    }
};

/**
 * Ensure value is an array, splitting strings if needed
 * @param {*} value - Value to ensure is an array
 * @param {string} delimiter - Delimiter for splitting strings
 * @returns {Array} - Resulting array
 */
const ensureArray = (value, delimiter = ',') => {
    if (!value) return [];
    
    if (Array.isArray(value)) {
        return value.filter(Boolean);
    }
    
    if (typeof value === 'string') {
        return value.split(delimiter)
            .map(item => item.trim())
            .filter(Boolean);
    }
    
    return [value];
};

/**
 * Ensure value is boolean
 * @param {*} value - Value to convert to boolean
 * @returns {boolean} - Resulting boolean
 */
const ensureBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    
    if (typeof value === 'number') return value === 1;
    
    if (typeof value === 'string') {
        const lowered = value.toLowerCase();
        return lowered === 'true' || lowered === 'yes' || lowered === '1';
    }
    
    return Boolean(value);
};

/**
 * Ensure value is a number
 * @param {*} value - Value to convert to number
 * @returns {number|null} - Resulting number or null if invalid
 */
const ensureNumber = (value) => {
    if (value === null || value === undefined || value === '') return null;
    
    if (typeof value === 'number') return value;
    
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
};

/**
 * Convert HTML to plain text
 * @param {string} html - HTML content to convert
 * @returns {string} - Plain text
 */
const htmlToPlainText = (html) => {
    if (!html) return '';
    
    return html
        .replace(/<[^>]*>/g, ' ') // Remove HTML tags
        .replace(/\s+/g, ' ')     // Normalize whitespace
        .trim();                  // Trim whitespace
};

/**
 * Extract domain from URL
 * @param {string} url - URL to extract domain from
 * @returns {string} - Domain name or empty string
 */
const extractDomain = (url) => {
    if (!url) return '';
    
    try {
        // Add http:// if no protocol specified
        const fullUrl = url.startsWith('http') ? url : `http://${url}`;
        const hostname = new URL(fullUrl).hostname;
        return hostname.replace(/^www\./, '');
    } catch (error) {
        return url.trim();
    }
};

/**
 * Map status values to schema constants
 * @param {string|number} status - Original status
 * @param {string} type - Entity type
 * @returns {string} - Mapped status
 */
const mapStatusValue = (status, type = 'listing') => {
    if (type === 'listing') {
        // Map listing status
        if (status === 1 || status === '1' || status === 'active') return LISTING_STATUS.ACTIVE;
        if (status === 0 || status === '0' || status === 'inactive') return LISTING_STATUS.INACTIVE;
        if (status === 'pending') return LISTING_STATUS.PENDING;
        if (status === 'rejected') return LISTING_STATUS.REJECTED;
        if (status === 'sold') return LISTING_STATUS.SOLD;
        if (status === 'draft') return LISTING_STATUS.DRAFT;
        
        // Default to active
        return LISTING_STATUS.ACTIVE;
    }
    
    if (type === 'user') {
        // Map user status
        if (status === 1 || status === '1' || status === 'active') return 'active';
        if (status === 0 || status === '0' || status === 'inactive') return 'inactive';
        if (status === 'suspended') return 'suspended';
        
        // Default to active
        return 'active';
    }
    
    if (type === 'message') {
        // Map message status
        if (status === 0 || status === '0') return MESSAGE_STATUS.READ;
        if (status === 1 || status === '1') return MESSAGE_STATUS.UNREAD;
        if (status === 2 || status === '2') return MESSAGE_STATUS.DELETED;
        
        // Default to unread
        return MESSAGE_STATUS.UNREAD;
    }
    
    // Default: return as-is for other types
    return status;
};

/**
 * Generate a unique hash for URL slugs
 * @param {number} length - Length of hash
 * @returns {string} - Generated hash
 */
const generateUrlHash = (length = 8) => {
    return nanoid(length);
};

/**
 * Create a display location from city and state
 * @param {string} city - City name
 * @param {string} state - State name
 * @returns {string} - Formatted location string
 */
const formatLocation = (city, state, country = 'India') => {
    const parts = [];
    
    if (city) parts.push(city);
    if (state) parts.push(state);
    if (country && country !== 'India') parts.push(country);
    
    return parts.join(', ');
};

// ===== ENTITY MIGRATION FUNCTIONS =====

/**
 * Migrate users to Firestore
 * @param {Array} usersData - Array of user objects
 * @returns {Promise<Object>} - Object with mapping of old to new IDs
 */
export const migrateUsers = async (usersData) => {
    if (!usersData || !usersData.length) {
        console.log('No user data to migrate');
        return {};
    }
    
    console.log(`Migrating ${usersData.length} users...`);
    
    // Process users in batches to avoid Firestore write limits
    const batchSize = 500;
    const batches = Math.ceil(usersData.length / batchSize);
    
    for (let i = 0; i < batches; i++) {
        const batch = writeBatch(db);
        const currentBatch = usersData.slice(i * batchSize, (i + 1) * batchSize);
        
        for (const userData of currentBatch) {
            if (!userData.id) continue;
            
            // Generate a new document ID
            const docId = generateDocId('users', userData.id);
            const userRef = doc(db, 'users', docId);
            
            // Format full name
            let firstName = userData.f_name || '';
            let lastName = userData.l_name || '';
            let displayName = userData.full_name || `${firstName} ${lastName}`.trim();
            
            if (!displayName && userData.email) {
                // Use email username as fallback for display name
                displayName = userData.email.split('@')[0];
            }
            
            // Format dates
            const createdAt = userData.joining_date ? formatDate(userData.joining_date) : new Date();
            const updatedAt = new Date();
            
            // Transform user data to match schema
            const newUserData = {
                id: docId,
                email: userData.email || '',
                displayName: formatText(displayName, 'title'),
                firstName: formatText(firstName, 'title'),
                lastName: formatText(lastName, 'title'),
                profileImage: userData.profile_image || null,
                phone: formatPhone(userData.mobile),
                
                // Address information
                address: userData.address || '',
                city: formatText(userData.city_name, 'title') || '',
                state: formatText(userData.state, 'title') || '',
                pincode: userData.pincode || '',
                country: 'India',
                
                // Account status
                isEmailVerified: ensureBoolean(userData.is_email_verified),
                isPhoneVerified: ensureBoolean(userData.is_mobile_verified),
                status: mapStatusValue(userData.user_status, 'user'),
                
                // Timestamps
                createdAt: createdAt,
                updatedAt: updatedAt,
                lastLogin: userData.activate_date ? formatDate(userData.activate_date) : null,
                
                // Role & subscription
                role: userData.user_role === 'admin' ? USER_ROLES.ADMIN : USER_ROLES.USER,
                plan: PLAN_TYPES.FREE,
                
                // Initialize subscription data
                subscription: null,
                connectsBalance: 10, // Default connects balance
                
                // Initialize activity data
                listings: [],
                favorites: [],
                recentlyViewed: [],
                contactedListings: [],
                
                // Settings
                notificationsEnabled: true,
                isProfileComplete: Boolean(displayName && userData.mobile),
                
                // Tracking data
                referredBy: null,
                signupSource: userData.fb_uid ? 'facebook' : (userData.ga_uid ? 'google' : 'direct'),
                deviceTokens: []
            };
            
            batch.set(userRef, newUserData);
        }
        
        // Commit the batch
        await batch.commit();
        console.log(`Migrated users batch ${i + 1}/${batches}`);
    }
    
    console.log('User migration completed');
    return idMappings.users;
};

/**
 * Migrate categories (industries) to Firestore
 * @param {Array} industriesData - Array of industry objects 
 * @param {Array} subIndustriesData - Array of sub-industry objects
 * @returns {Promise<Object>} - Object with mappings for industries and sub-industries
 */
export const migrateCategories = async (industriesData, subIndustriesData) => {
    if ((!industriesData || !industriesData.length) && (!subIndustriesData || !subIndustriesData.length)) {
        console.log('No categories data to migrate');
        return {};
    }
    
    console.log(`Migrating ${industriesData?.length || 0} industries and ${subIndustriesData?.length || 0} sub-industries...`);
    
    // Process industries
    const industries = industriesData.map(industry => {
        if (!industry.id) return null;
        
        // Generate document ID
        const docId = generateDocId('industries', industry.id);
        
        return {
            id: docId,
            name: formatText(industry.name, 'title'),
            slug: industry.slug || formatText(industry.name, 'kebab'),
            status: ensureBoolean(industry.status)
        };
    }).filter(Boolean);
    
    // Process sub-industries
    const subIndustries = subIndustriesData.map(subIndustry => {
        if (!subIndustry.id || !subIndustry.industry_id) return null;
        
        // Generate document ID
        const docId = generateDocId('subIndustries', subIndustry.id);
        
        // Look up parent industry ID
        const industryId = lookupDocId('industries', subIndustry.industry_id);
        
        return {
            id: docId,
            name: formatText(subIndustry.name, 'title'),
            slug: subIndustry.slug || formatText(subIndustry.name, 'kebab'),
            industryId: industryId,
            status: ensureBoolean(subIndustry.status)
        };
    }).filter(Boolean);
    
    // Group sub-industries by industry
    const subIndustriesByIndustry = {};
    
    subIndustries.forEach(si => {
        if (!si.industryId || !si.status) return;
        
        if (!subIndustriesByIndustry[si.industryId]) {
            subIndustriesByIndustry[si.industryId] = [];
        }
        
        subIndustriesByIndustry[si.industryId].push(si);
    });
    
    // Combine industries with their sub-industries
    const enrichedIndustries = industries.map(industry => ({
        ...industry,
        subIndustries: subIndustriesByIndustry[industry.id] || []
    }));
    
    // Save to Firestore
    await setDoc(doc(db, 'categories', 'industries'), { 
        list: enrichedIndustries,
        updatedAt: new Date()
    });
    
    await setDoc(doc(db, 'categories', 'subIndustries'), { 
        list: subIndustries,
        updatedAt: new Date()
    });
    
    console.log('Categories migration completed');
    
    return {
        industries: idMappings.industries,
        subIndustries: idMappings.subIndustries
    };
};

/**
 * Migrate locations (states and cities) to Firestore
 * @param {Array} statesData - Array of state objects
 * @param {Array} citiesData - Array of city objects
 * @returns {Promise<Object>} - Object with mappings for states and cities
 */
export const migrateLocations = async (statesData, citiesData) => {
    if ((!statesData || !statesData.length) && (!citiesData || !citiesData.length)) {
        console.log('No locations data to migrate');
        return {};
    }
    
    console.log(`Migrating ${statesData?.length || 0} states and ${citiesData?.length || 0} cities...`);
    
    // Process states
    const states = statesData.map(state => {
        if (!state.id) return null;
        
        // Generate document ID
        const docId = generateDocId('states', state.id);
        
        return {
            id: docId,
            name: formatText(state.name, 'title'),
            countryId: '1', // Default to India
            countryName: 'India'
        };
    }).filter(Boolean);
    
    // Create a mapping of old to new state IDs
    const stateIdMap = {};
    statesData.forEach(state => {
        if (state.id) {
            stateIdMap[state.id] = lookupDocId('states', state.id);
        }
    });
    
    // Process cities
    const cities = citiesData.map(city => {
        if (!city.id || !city.state_id) return null;
        
        // Generate document ID
        const docId = generateDocId('cities', city.id);
        
        // Look up parent state ID and name
        const stateId = stateIdMap[city.state_id];
        const state = states.find(s => s.id === stateId);
        
        return {
            id: docId,
            name: formatText(city.name, 'title'),
            stateId: stateId,
            stateName: state ? state.name : '',
            isState: ensureBoolean(city.is_state),
            countryName: 'India'
        };
    }).filter(Boolean);
    
    // Group cities by state for location dropdown
    const citiesByState = {};
    
    cities.forEach(city => {
        if (!city.stateId) return;
        
        if (!citiesByState[city.stateId]) {
            citiesByState[city.stateId] = [];
        }
        
        citiesByState[city.stateId].push(city);
    });
    
    // Create India locations map
    const indiaLocations = {
        states: {}
    };
    
    states.forEach(state => {
        const stateCities = (citiesByState[state.id] || []).map(city => city.name);
        indiaLocations.states[state.name] = stateCities;
    });
    
    // Save to Firestore
    await setDoc(doc(db, 'locations', 'india'), {
        ...indiaLocations,
        updatedAt: new Date()
    });
    
    await setDoc(doc(db, 'locations', 'states'), {
        list: states,
        updatedAt: new Date()
    });
    
    await setDoc(doc(db, 'locations', 'cities'), {
        list: cities,
        updatedAt: new Date()
    });
    
    console.log('Locations migration completed');
    
    return {
        states: idMappings.states,
        cities: idMappings.cities
    };
};

/**
 * Migrate subscription plans to Firestore
 * @param {Array} plansData - Array of plan objects
 * @param {Array} planFeaturesData - Array of plan feature objects
 * @returns {Promise<Object>} - Object with mapping of plan IDs
 */
export const migratePlans = async (plansData, planFeaturesData) => {
    if ((!plansData || !plansData.length) && (!planFeaturesData || !planFeaturesData.length)) {
        console.log('No plans data to migrate');
        return {};
    }
    
    console.log(`Migrating ${plansData?.length || 0} plans...`);
    
    // Group features by plan
    const featuresByPlan = {};
    
    if (planFeaturesData && planFeaturesData.length) {
        planFeaturesData.forEach(feature => {
            if (!feature.plan_id) return;
            
            const planId = feature.plan_id.toString();
            
            if (!featuresByPlan[planId]) {
                featuresByPlan[planId] = [];
            }
            
            if (feature.status === 1 && feature.features_name) {
                featuresByPlan[planId].push(formatText(feature.features_name, 'sentence'));
            }
        });
    }
    
    // Create FREE plan (not in SQL data)
    const freeId = 'free';
    await setDoc(doc(db, 'plans', freeId), {
        id: freeId,
        name: 'Free Plan',
        planType: PLAN_TYPES.FREE,
        description: 'Basic access with limited features',
        price: 0,
        currency: 'INR',
        duration: 'Forever',
        durationMonths: 0,
        connectsPerMonth: 5,
        featuredListings: 0,
        detailsView: 2,
        responseView: 5,
        showStats: false,
        features: [
            'Create a basic profile',
            'Browse listings',
            'Limited messaging'
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
        status: true,
        displayOrder: 1
    });
    
    // Map plan types based on name
    const planTypeMap = {
        'basic': PLAN_TYPES.BASIC,
        'premium': PLAN_TYPES.PREMIUM,
        'advanced': PLAN_TYPES.ADVANCED,
        'platinum': PLAN_TYPES.PLATINUM
    };
    
    // Process each plan
    if (plansData && plansData.length) {
        for (const plan of plansData) {
            if (!plan.id) continue;
            
            // Generate document ID
            const docId = generateDocId('plans', plan.id);
            
            // Determine plan type from name
            const planName = (plan.name || '').toLowerCase();
            let planType = PLAN_TYPES.BASIC;
            
            if (planName.includes('premium')) planType = PLAN_TYPES.PREMIUM;
            else if (planName.includes('advanced')) planType = PLAN_TYPES.ADVANCED;
            else if (planName.includes('platinum')) planType = PLAN_TYPES.PLATINUM;
            else if (plan.plan_type) planType = planTypeMap[plan.plan_type.toLowerCase()] || PLAN_TYPES.BASIC;
            
            // Determine display order
            let displayOrder = 2; // Default for Basic
            if (planType === PLAN_TYPES.PREMIUM) displayOrder = 3;
            if (planType === PLAN_TYPES.ADVANCED) displayOrder = 4;
            if (planType === PLAN_TYPES.PLATINUM) displayOrder = 5;
            
            // Get features for this plan
            const features = featuresByPlan[plan.id.toString()] || [];
            
            await setDoc(doc(db, 'plans', docId), {
                id: docId,
                name: formatText(plan.name, 'title'),
                planType: planType,
                description: `${planType} membership with enhanced features`,
                price: ensureNumber(plan.amount) || 0,
                currency: 'INR',
                duration: `${plan.duration_months || 1} months`,
                durationMonths: ensureNumber(plan.duration_months) || 1,
                connectsPerMonth: ensureNumber(plan.send_limit) || 10,
                featuredListings: ensureNumber(plan.promotion_priority) || 0,
                detailsView: ensureNumber(plan.reveal_limit) || 5,
                responseView: ensureNumber(plan.response_limit) || 10,
                showStats: ensureBoolean(plan.show_stats),
                features: features,
                createdAt: new Date(),
                updatedAt: new Date(),
                status: ensureBoolean(plan.status),
                displayOrder: displayOrder
            });
        }
    }
    
    console.log('Plans migration completed');
    return idMappings.plans;
};

/**
 * Migrate user subscriptions to Firestore
 * @param {Array} userPlansData - Array of user plan objects
 * @returns {Promise<void>}
 */
export const migrateUserSubscriptions = async (userPlansData) => {
    if (!userPlansData || !userPlansData.length) {
        console.log('No user subscriptions to migrate');
        return;
    }
    
    console.log(`Migrating ${userPlansData.length} user subscriptions...`);
    
    // Process in batches
    const batchSize = 500;
    const batches = Math.ceil(userPlansData.length / batchSize);
    
    for (let i = 0; i < batches; i++) {
        const batch = writeBatch(db);
        const currentBatch = userPlansData.slice(i * batchSize, (i + 1) * batchSize);
        
        for (const userPlan of currentBatch) {
            if (!userPlan.user_id || !userPlan.plan_id) continue;
            
            // Look up new IDs
            const userId = lookupDocId('users', userPlan.user_id);
            const planId = lookupDocId('plans', userPlan.plan_id);
            
            // Skip if missing references
            if (!userId || !planId) {
                console.warn(`Skipping user subscription due to missing references: user_id=${userPlan.user_id}, plan_id=${userPlan.plan_id}`);
                continue;
            }
            
            // Generate subscription ID
            const subscriptionId = generateDocId('subscriptions', userPlan.id);
            
            // Get plan information
            let planType = PLAN_TYPES.BASIC;
            let planDoc;
            
            try {
                const planRef = doc(db, 'plans', planId);
                planDoc = await getDoc(planRef);
                
                if (planDoc.exists()) {
                    planType = planDoc.data().planType;
                }
            } catch (error) {
                console.error(`Error getting plan data for ID ${planId}:`, error);
            }
            
            // Calculate dates
            const activateDate = userPlan.plan_activate_date 
                ? formatDate(userPlan.plan_activate_date) 
                : new Date();
            
            const durationMonths = planDoc?.exists() 
                ? planDoc.data().durationMonths || 3 
                : 3;
            
            const endDate = new Date(activateDate);
            endDate.setMonth(endDate.getMonth() + durationMonths);
            
            // Create subscription document
            const subscriptionRef = doc(db, 'users', userId, 'subscriptions', subscriptionId);
            
            const subscriptionData = {
                id: subscriptionId,
                userId: userId,
                planId: planId,
                planType: planType,
                typeId: userPlan.type_id ? userPlan.type_id.toString() : null,
                typeName: userPlan.type_name || '',
                sentCount: ensureNumber(userPlan.sent_count) || 0,
                respondCount: ensureNumber(userPlan.respond_count) || 0,
                revealedCount: ensureNumber(userPlan.revealed_count) || 0,
                startDate: activateDate,
                endDate: endDate,
                status: userPlan.status === 1 ? 'active' : 'expired',
                createdAt: activateDate,
                updatedAt: new Date()
            };
            
            batch.set(subscriptionRef, subscriptionData);
            
            // Update user document if subscription is active
            if (userPlan.status === 1) {
                const userRef = doc(db, 'users', userId);
                
                batch.update(userRef, {
                    plan: planType,
                    subscription: {
                        id: subscriptionId,
                        planId: planId,
                        startDate: activateDate,
                        endDate: endDate,
                        autoRenew: false
                    },
                    connectsBalance: ensureNumber(planDoc?.exists() ? planDoc.data().connectsPerMonth : 10) || 10,
                    updatedAt: new Date()
                });
            }
        }
        
        // Commit the batch
        await batch.commit();
        console.log(`Migrated user subscriptions batch ${i + 1}/${batches}`);
    }
    
    console.log('User subscriptions migration completed');
};

/**
 * Migrate business listings to Firestore
 * @param {Array} businessesData - Array of business objects
 * @param {Array} businessMediaData - Array of business media objects
 * @returns {Promise<Object>} - Object with mapping of business IDs
 */
export const migrateBusinesses = async (businessesData, businessMediaData) => {
    if (!businessesData || !businessesData.length) {
        console.log('No business listings to migrate');
        return {};
    }
    
    console.log(`Migrating ${businessesData.length} business listings...`);
    
    // Group media by business
    const mediaByBusiness = {};
    
    if (businessMediaData && businessMediaData.length) {
        businessMediaData.forEach(media => {
            if (!media.business_id) return;
            
            const businessId = media.business_id.toString();
            
            if (!mediaByBusiness[businessId]) {
                mediaByBusiness[businessId] = [];
            }
            
            mediaByBusiness[businessId].push({
                url: media.url,
                orderNo: ensureNumber(media.order_no) || 0,
                type: media.type || 'image',
                status: ensureBoolean(media.status)
            });
        });
    }
    
    // Process in batches
    const batchSize = 400; // Smaller due to complexity
    const batches = Math.ceil(businessesData.length / batchSize);
    
    for (let i = 0; i < batches; i++) {
        const batch = writeBatch(db);
        const currentBatch = businessesData.slice(i * batchSize, (i + 1) * batchSize);
        
        for (const business of currentBatch) {
            if (!business.id) continue;
            
            // Generate document ID
            const docId = generateDocId('businesses', business.id);
            
            // Look up owner ID
            const ownerId = business.user_id ? lookupDocId('users', business.user_id) : null;
            
            // Look up location IDs
            const cityId = business.city_id ? lookupDocId('cities', business.city_id) : null;
            
            // Get location data
            let cityName = '';
            let stateName = '';
            let locationData;
            
            try {
                if (cityId) {
                    const citiesRef = doc(db, 'locations', 'cities');
                    const citiesDoc = await getDoc(citiesRef);
                    
                    if (citiesDoc.exists()) {
                        const citiesList = citiesDoc.data().list || [];
                        const cityData = citiesList.find(c => c.id === cityId);
                        
                        if (cityData) {
                            cityName = cityData.name;
                            stateName = cityData.stateName;
                        }
                    }
                }
            } catch (error) {
                console.error(`Error getting location data for business ${docId}:`, error);
            }
            
            // Look up sub-industry
            const subIndustryId = business.sub_industry_id 
                ? lookupDocId('subIndustries', business.sub_industry_id) 
                : null;
            
            // Get industry ID
            let industryId = null;
            
            if (subIndustryId) {
                try {
                    const subIndustriesRef = doc(db, 'categories', 'subIndustries');
                    const subIndustriesDoc = await getDoc(subIndustriesRef);
                    
                    if (subIndustriesDoc.exists()) {
                        const subIndustriesList = subIndustriesDoc.data().list || [];
                        const subIndustryData = subIndustriesList.find(si => si.id === subIndustryId);
                        
                        if (subIndustryData) {
                            industryId = subIndustryData.industryId;
                        }
                    }
                } catch (error) {
                    console.error(`Error getting industry ID for business ${docId}:`, error);
                }
            }
            
            // Get media
            const media = mediaByBusiness[business.id.toString()] || [];
            const images = media
                .filter(m => m.type === 'image' && m.status)
                .sort((a, b) => a.orderNo - b.orderNo)
                .map(m => m.url);
            
            // Prepare financials data with proper formatting
            const financials = {
                annualSales: business.annual_sales ? formatCurrency(business.annual_sales) : '',
                ebitda: business.ebitda ? formatCurrency(business.ebitda) : '',
                ebitdaMargin: business.ebitda_margin ? `${business.ebitda_margin}%` : '',
                grossIncome: business.gross_income ? formatCurrency(business.gross_income) : '',
                inventoryValue: business.inventory_value ? formatCurrency(business.inventory_value) : '',
                rentals: business.rentals ? formatCurrency(business.rentals) : ''
            };
            
            // Map status
            const status = mapStatusValue(business.status, 'listing');
            
            // Create formatted business document
            const businessData = {
                id: docId,
                type: LISTING_TYPES.BUSINESS,
                name: formatText(business.company_name || business.headline || `Business ${docId}`, 'title'),
                description: htmlToPlainText(business.introduction || business.summary || ''),
                shortDescription: htmlToPlainText(business.summary || '').substring(0, 200),
                headline: business.headline || '',
                
                // Media
                images: images,
                featuredImage: business.cover_image || (images.length > 0 ? images[0] : null),
                
                // Location
                location: {
                    country: 'India',
                    state: formatText(stateName, 'title'),
                    city: formatText(cityName, 'title'),
                    address: business.address || '',
                    pincode: business.pincode ? business.pincode.toString() : '',
                    displayLocation: formatLocation(cityName, stateName),
                    coordinates: null // No coordinates in original data
                },
                
                // Contact information
                contactInfo: {
                    email: business.contact_user_email || '',
                    phone: formatPhone(business.contact_user_mobile),
                    website: business.website || '',
                    contactName: formatText(business.contact_user_name, 'title') || '',
                    designation: formatText(business.contact_user_designation, 'title') || '',
                    socialMedia: {}
                },
                
                // URL and identification
                hash: business.hash || generateUrlHash(10),
                
                // Ratings and verification
                rating: 0, // Default rating
                reviewCount: 0, // Default review count
                verified: true, // Assume verified
                featured: ensureBoolean(business.is_hot),
                
                // Subscription and status
                plan: business.is_premium === 1 ? PLAN_TYPES.PREMIUM : PLAN_TYPES.BASIC,
                status: status,
                
                // Timestamps
                createdAt: business.date_posted ? formatDate(business.date_posted) : new Date(),
                updatedAt: business.date_updated ? formatDate(business.date_updated) : new Date(),
                
                // Ownership
                ownerId: ownerId,
                createdBy: business.createdby || 'user',
                
                // Classification
                industries: industryId ? [industryId] : [],
                subIndustryId: subIndustryId,
                subIndustries: subIndustryId ? [subIndustryId] : [],
                tags: [],
                
                // Analytics
                viewCount: 0,
                contactCount: 0,
                
                // Miscellaneous
                documents: [],
                pageOrder: ensureNumber(business.page_order) || 0,
                
                // Business-specific details
                businessType: business.business_type || '',
                entityType: business.entity_type || '',
                establishedYear: business.establish_year 
                    ? parseInt(business.establish_year.toString()) 
                    : null,
                employees: business.employee_count || '',
                
                // Financial information
                financials: financials,
                
                // Assets
                inventory: {
                    included: false,
                    value: financials.inventoryValue
                },
                realEstate: {
                    included: false,
                    owned: false,
                    leased: false,
                    details: ''
                },
                
                // Sale information
                sale: {
                    reasonForSelling: '',
                    askingPrice: business.gross_income 
                        ? formatCurrency(business.gross_income) 
                        : '₹1 Crore',
                    negotiable: true,
                    sellerFinancing: false,
                    trainingPeriod: ''
                },
                
                // Operations
                expenses: {
                    rent: '',
                    payroll: '',
                    utilities: '',
                    marketing: '',
                    other: ''
                },
                businessHours: null,
                
                // Additional details
                features: business.facilities 
                    ? ensureArray(business.facilities)
                    : [],
                assets: [],
                opportunities: [],
                competitors: '',
                customerBase: '',
                monthlyVisitors: 0,
                avgTicketPrice: '',
                operatingMargin: financials.ebitdaMargin,
                businessPitch: business.business_pitch || ''
            };
            
            // Add to batch
            batch.set(doc(db, 'listings', docId), businessData);
            
            // Update user's listings array if owner exists
            if (ownerId) {
                const userRef = doc(db, 'users', ownerId);
                batch.update(userRef, {
                    listings: serverTimestamp.arrayUnion(docId)
                });
            }
        }
        
        // Commit the batch
        await batch.commit();
        console.log(`Migrated businesses batch ${i + 1}/${batches}`);
    }
    
    console.log('Business listings migration completed');
    
    return idMappings.businesses;
};

/**
 * Migrate franchise listings to Firestore
 * @param {Array} franchiseData - Array of franchise objects
 * @param {Array} franchiseMediaData - Array of franchise media objects
 * @param {Array} franchiseFormatsData - Array of franchise format objects
 * @param {Array} franchiseLocationsData - Array of franchise location objects
 * @returns {Promise<Object>} - Object with mapping of franchise IDs
 */
export const migrateFranchises = async (
    franchiseData,
    franchiseMediaData,
    franchiseFormatsData,
    franchiseLocationsData
) => {
    if (!franchiseData || !franchiseData.length) {
        console.log('No franchise listings to migrate');
        return {};
    }
    
    console.log(`Migrating ${franchiseData.length} franchise listings...`);
    
    // Group media by franchise
    const mediaByFranchise = {};
    
    if (franchiseMediaData && franchiseMediaData.length) {
        franchiseMediaData.forEach(media => {
            if (!media.franchise_id) return;
            
            const franchiseId = media.franchise_id.toString();
            
            if (!mediaByFranchise[franchiseId]) {
                mediaByFranchise[franchiseId] = [];
            }
            
            mediaByFranchise[franchiseId].push({
                url: media.url,
                orderNo: ensureNumber(media.order_no) || 0,
                type: media.type || 'image',
                status: ensureBoolean(media.status)
            });
        });
    }
    
    // Group formats by franchise
    const formatsByFranchise = {};
    
    if (franchiseFormatsData && franchiseFormatsData.length) {
        franchiseFormatsData.forEach(format => {
            if (!format.franchise_id) return;
            
            const franchiseId = format.franchise_id.toString();
            
            if (!formatsByFranchise[franchiseId]) {
                formatsByFranchise[franchiseId] = [];
            }
            
            formatsByFranchise[franchiseId].push({
                name: formatText(format.name, 'title'),
                investmentMin: ensureNumber(format.invest_min) || 0,
                investmentMax: ensureNumber(format.invest_max) || 0,
                brandFee: ensureNumber(format.brand_fee) || 0,
                spaceMin: ensureNumber(format.space_min) || 0,
                spaceMax: ensureNumber(format.space_max) || 0,
                staffCount: ensureNumber(format.staff_count) || 0,
                monthlySales: ensureNumber(format.monthly_sales) || 0,
                profitMargin: ensureNumber(format.profit_margin) || 0,
                royaltyCommission: format.royalty_commission || '',
                status: ensureBoolean(format.status)
            });
        });
    }
    
    // Fetch cities data for mapping in location preferences
    const citiesRef = doc(db, 'locations', 'cities');
    let citiesList = [];
    
    try {
        const citiesDoc = await getDoc(citiesRef);
        if (citiesDoc.exists()) {
            citiesList = citiesDoc.data().list || [];
        }
    } catch (error) {
        console.error('Error fetching cities data:', error);
    }
    
    // Group locations by franchise
    const locationsByFranchise = {};
    
    if (franchiseLocationsData && franchiseLocationsData.length) {
        franchiseLocationsData.forEach(location => {
            if (!location.franchise_id || !location.city_id) return;
            
            const franchiseId = location.franchise_id.toString();
            const cityId = lookupDocId('cities', location.city_id);
            
            if (!locationsByFranchise[franchiseId]) {
                locationsByFranchise[franchiseId] = [];
            }
            
            // Find city data
            const cityData = citiesList.find(c => c.id === cityId);
            
            locationsByFranchise[franchiseId].push({
                cityId: cityId,
                city: cityData ? cityData.name : '',
                state: cityData ? cityData.stateName : '',
                status: ensureBoolean(location.status)
            });
        });
    }
    
    // Process in batches
    const batchSize = 400; // Smaller due to complexity
    const batches = Math.ceil(franchiseData.length / batchSize);
    
    for (let i = 0; i < batches; i++) {
        const batch = writeBatch(db);
        const currentBatch = franchiseData.slice(i * batchSize, (i + 1) * batchSize);
        
        for (const franchise of currentBatch) {
            if (!franchise.id) continue;
            
            // Generate document ID
            const docId = generateDocId('franchises', franchise.id);
            
            // Look up owner ID
            const ownerId = franchise.user_id ? lookupDocId('users', franchise.user_id) : null;
            
            // Look up headquarters location
            const headCityId = franchise.headquarter_city_id 
                ? lookupDocId('cities', franchise.headquarter_city_id) 
                : null;
            
            // Get headquarters location data
            let headCityName = '';
            let headStateName = '';
            
            if (headCityId) {
                const cityData = citiesList.find(c => c.id === headCityId);
                if (cityData) {
                    headCityName = cityData.name;
                    headStateName = cityData.stateName;
                }
            }
            
            // Look up sub-industry
            const subIndustryId = franchise.sub_industry_id 
                ? lookupDocId('subIndustries', franchise.sub_industry_id) 
                : null;
            
            // Get industry ID
            let industryId = null;
            
            if (subIndustryId) {
                try {
                    const subIndustriesRef = doc(db, 'categories', 'subIndustries');
                    const subIndustriesDoc = await getDoc(subIndustriesRef);
                    
                    if (subIndustriesDoc.exists()) {
                        const subIndustriesList = subIndustriesDoc.data().list || [];
                        const subIndustryData = subIndustriesList.find(si => si.id === subIndustryId);
                        
                        if (subIndustryData) {
                            industryId = subIndustryData.industryId;
                        }
                    }
                } catch (error) {
                    console.error(`Error getting industry ID for franchise ${docId}:`, error);
                }
            }
            
            // Get media
            const media = mediaByFranchise[franchise.id.toString()] || [];
            const images = media
                .filter(m => m.type === 'image' && m.status)
                .sort((a, b) => a.orderNo - b.orderNo)
                .map(m => m.url);
            
            // Get formats
            const formats = formatsByFranchise[franchise.id.toString()] || [];
            const activeFormats = formats.filter(f => f.status);
            
            // Get preferred locations
            const locations = locationsByFranchise[franchise.id.toString()] || [];
            const preferredLocations = locations
                .filter(loc => loc.status)
                .map(loc => ({
                    city: loc.city,
                    state: loc.state
                }));
            
            // Calculate investment range from formats
            let investmentRange = '';
            let franchiseFee = '';
            let royaltyFee = '';
            let marketingFee = '';
            
            if (activeFormats.length > 0) {
                const minInvest = Math.min(...activeFormats.map(f => f.investmentMin || 0));
                const maxInvest = Math.max(...activeFormats.map(f => f.investmentMax || 0));
                
                investmentRange = `${formatCurrency(minInvest)} - ${formatCurrency(maxInvest)}`;
                franchiseFee = formatCurrency(activeFormats[0].brandFee);
                royaltyFee = activeFormats[0].royaltyCommission 
                    ? `${activeFormats[0].royaltyCommission}%` 
                    : '';
            }
            
            // Map status
            const status = mapStatusValue(franchise.status, 'listing');
            
            // Create franchise document
            const franchiseData = {
                id: docId,
                type: LISTING_TYPES.FRANCHISE,
                name: formatText(franchise.brand_name, 'title') || `Franchise ${docId}`,
                description: htmlToPlainText(franchise.summary || ''),
                shortDescription: htmlToPlainText(franchise.products_services || '').substring(0, 200),
                headline: '',
                
                // Media
                images: images,
                featuredImage: franchise.brand_logo || (images.length > 0 ? images[0] : null),
                
                // Location
                location: {
                    country: 'India',
                    state: formatText(headStateName, 'title'),
                    city: formatText(headCityName, 'title'),
                    address: '',
                    pincode: '',
                    displayLocation: formatLocation(headCityName, headStateName),
                    coordinates: null
                },
                
                // Contact information
                contactInfo: {
                    email: franchise.official_email || '',
                    phone: formatPhone(franchise.mobile),
                    website: franchise.website || '',
                    contactName: formatText(franchise.authorized_person, 'title') || '',
                    designation: formatText(franchise.designation, 'title') || '',
                    socialMedia: {}
                },
                
                // URL and identification
                hash: franchise.hash || generateUrlHash(10),
                
                // Ratings and verification
                rating: 0,
                reviewCount: 0,
                verified: true,
                featured: ensureBoolean(franchise.is_hot),
                
                // Subscription and status
                plan: franchise.is_premium === 1 ? PLAN_TYPES.PREMIUM : PLAN_TYPES.BASIC,
                status: status,
                
                // Timestamps
                createdAt: franchise.date_created ? formatDate(franchise.date_created) : new Date(),
                updatedAt: franchise.date_updated ? formatDate(franchise.date_updated) : new Date(),
                
                // Ownership
                ownerId: ownerId,
                createdBy: franchise.createdby || 'user',
                
                // Classification
                industries: industryId ? [industryId] : [],
                subIndustryId: subIndustryId,
                subIndustries: subIndustryId ? [subIndustryId] : [],
                tags: [],
                
                // Analytics
                viewCount: 0,
                contactCount: 0,
                
                // Miscellaneous
                documents: [],
                pageOrder: ensureNumber(franchise.page_order) || 0,
                
                // Franchise-specific details
                franchiseType: franchise.type || '',
                franchiseBrand: formatText(franchise.brand_name, 'title') || '',
                establishedYear: franchise.establish_year 
                    ? parseInt(franchise.establish_year.toString()) 
                    : null,
                totalOutlets: ensureNumber(franchise.total_outlets) || 0,
                totalFranchisees: ensureNumber(franchise.total_franchise) || 0,
                
                // Investment details
                investment: {
                    investmentRange: investmentRange,
                    franchiseFee: franchiseFee,
                    royaltyFee: royaltyFee,
                    marketingFee: '',
                    estimatedTotalInvestment: investmentRange.split('-')[1]?.trim() || ''
                },
                
                // Terms and conditions
                terms: {
                    contractDuration: franchise.term_duration_year 
                        ? `${franchise.term_duration_year} years` 
                        : '',
                    renewalOptions: franchise.is_term_renewable === 1 ? 'Yes' : 'No',
                    spaceRequirement: activeFormats.length > 0 
                        ? `${activeFormats[0].spaceMin} - ${activeFormats[0].spaceMax} sq ft` 
                        : '',
                    exclusiveTerritory: true
                },
                
                // Support offered
                support: {
                    trainingProvided: true,
                    trainingDetails: '',
                    ongoingSupport: [],
                    marketingSupport: [],
                    operationalSupport: []
                },
                
                // Expansion and locations
                expansionLocations: preferredLocations,
                preferredLocations: preferredLocations,
                
                // Performance metrics
                performance: {
                    successStories: '',
                    breakEvenPeriod: '',
                    profitPotential: '',
                    monthlySales: activeFormats.length > 0 
                        ? formatCurrency(activeFormats[0].monthlySales) 
                        : '',
                    profitMargin: activeFormats.length > 0 
                        ? `${activeFormats[0].profitMargin}%` 
                        : ''
                },
                
                // Requirements
                requirements: {
                    requiredExperience: '',
                    requiredNetWorth: '',
                    requiredLiquidCapital: '',
                    additionalRequirements: []
                },
                
                // Additional details
                unitDetails: {
                    totalUnits: ensureNumber(franchise.total_outlets) || 0,
                    companyOwned: 0,
                    franchiseeOwned: ensureNumber(franchise.total_franchise) || 0
                },
                
                // More franchise-specific fields
                businessModel: franchise.business_model || '',
                offering: franchise.offering || '',
                agreementAvailable: ensureBoolean(franchise.is_agreement_available),
                termDuration: franchise.term_duration_year 
                    ? `${franchise.term_duration_year} years` 
                    : '',
                termRenewable: ensureBoolean(franchise.is_term_renewable),
                opportunities: franchise.opportunities || '',
                assistance: franchise.assistance || '',
                howToOwn: franchise.how_to_own || '',
                benefits: franchise.benefits || '',
                formats: activeFormats
            };
            
            // Add to batch
            batch.set(doc(db, 'listings', docId), franchiseData);
            
            // Update user's listings array if owner exists
            if (ownerId) {
                const userRef = doc(db, 'users', ownerId);
                batch.update(userRef, {
                    listings: serverTimestamp.arrayUnion(docId)
                });
            }
        }
        
        // Commit the batch
        await batch.commit();
        console.log(`Migrated franchises batch ${i + 1}/${batches}`);
    }
    
    console.log('Franchise listings migration completed');
    
    return idMappings.franchises;
};

/**
 * Migrate investor listings to Firestore
 * @param {Array} investorsData - Array of investor objects
 * @param {Array} investorSubIndustriesData - Array of investor-subindustry relation objects
 * @param {Array} investorLocationPreferenceData - Array of investor location preference objects
 * @returns {Promise<Object>} - Object with mapping of investor IDs
 */
export const migrateInvestors = async (
    investorsData,
    investorSubIndustriesData,
    investorLocationPreferenceData
) => {
    if (!investorsData || !investorsData.length) {
        console.log('No investor listings to migrate');
        return {};
    }
    
    console.log(`Migrating ${investorsData.length} investor listings...`);
    
    // Fetch cities and sub-industries data
    const citiesRef = doc(db, 'locations', 'cities');
    const subIndustriesRef = doc(db, 'categories', 'subIndustries');
    
    let citiesList = [];
    let subIndustriesList = [];
    
    try {
        const [citiesDoc, subIndustriesDoc] = await Promise.all([
            getDoc(citiesRef),
            getDoc(subIndustriesRef)
        ]);
        
        if (citiesDoc.exists()) {
            citiesList = citiesDoc.data().list || [];
        }
        
        if (subIndustriesDoc.exists()) {
            subIndustriesList = subIndustriesDoc.data().list || [];
        }
    } catch (error) {
        console.error('Error fetching reference data:', error);
    }
    
    // Group sub-industries by investor
    const subIndustriesByInvestor = {};
    
    if (investorSubIndustriesData && investorSubIndustriesData.length) {
        investorSubIndustriesData.forEach(relation => {
            if (!relation.investor_id || !relation.sub_industry_id) return;
            
            const investorId = relation.investor_id.toString();
            const subIndustryId = lookupDocId('subIndustries', relation.sub_industry_id);
            
            if (!subIndustryId) return;
            
            if (!subIndustriesByInvestor[investorId]) {
                subIndustriesByInvestor[investorId] = [];
            }
            
            if (relation.status === 1) {
                subIndustriesByInvestor[investorId].push(subIndustryId);
            }
        });
    }
    
    // Create mapping of sub-industry to industry
    const subIndustryToIndustryMap = {};
    subIndustriesList.forEach(si => {
        subIndustryToIndustryMap[si.id] = si.industryId;
    });
    
    // Group location preferences by investor
    const locationsByInvestor = {};
    
    if (investorLocationPreferenceData && investorLocationPreferenceData.length) {
        investorLocationPreferenceData.forEach(pref => {
            if (!pref.investor_id || !pref.city_id) return;
            
            const investorId = pref.investor_id.toString();
            const cityId = lookupDocId('cities', pref.city_id);
            
            if (!cityId) return;
            
            if (!locationsByInvestor[investorId]) {
                locationsByInvestor[investorId] = [];
            }
            
            if (pref.status === 1) {
                // Find city data
                const cityData = citiesList.find(c => c.id === cityId);
                
                if (cityData) {
                    locationsByInvestor[investorId].push({
                        city: cityData.name,
                        state: cityData.stateName
                    });
                }
            }
        });
    }
    
    // Process in batches
    const batchSize = 400;
    const batches = Math.ceil(investorsData.length / batchSize);
    
    for (let i = 0; i < batches; i++) {
        const batch = writeBatch(db);
        const currentBatch = investorsData.slice(i * batchSize, (i + 1) * batchSize);
        
        for (const investor of currentBatch) {
            if (!investor.id) continue;
            
            // Generate document ID
            const docId = generateDocId('investors', investor.id);
            
            // Look up owner ID
            const ownerId = investor.user_id ? lookupDocId('users', investor.user_id) : null;
            
            // Look up city
            const cityId = investor.city_id ? lookupDocId('cities', investor.city_id) : null;
            
            // Get location data
            let cityName = '';
            let stateName = '';
            
            if (cityId) {
                const cityData = citiesList.find(c => c.id === cityId);
                if (cityData) {
                    cityName = cityData.name;
                    stateName = cityData.stateName;
                }
            }
            
            // Get sub-industries
            const subIndustryIds = subIndustriesByInvestor[investor.id.toString()] || [];
            
            // Map sub-industries to industries
            const industryIds = [...new Set(
                subIndustryIds
                    .map(siId => subIndustryToIndustryMap[siId])
                    .filter(Boolean)
            )];
            
            // Get preferred locations
            const preferredLocations = locationsByInvestor[investor.id.toString()] || [];
            
            // Map status
            const status = mapStatusValue(investor.status, 'listing');
            
            // Create investor document
            const investorData = {
                id: docId,
                type: LISTING_TYPES.INVESTOR,
                name: formatText(investor.full_name, 'title') || `Investor ${docId}`,
                description: htmlToPlainText(investor.about_company || investor.about || ''),
                shortDescription: htmlToPlainText(investor.about || '').substring(0, 200),
                headline: investor.headline || '',
                
                // Media
                images: [],
                featuredImage: investor.cover_image || null,
                
                // Location
                location: {
                    country: 'India',
                    state: formatText(stateName, 'title'),
                    city: formatText(cityName, 'title'),
                    address: '',
                    pincode: '',
                    displayLocation: formatLocation(cityName, stateName),
                    coordinates: null
                },
                
                // Contact information
                contactInfo: {
                    email: investor.email || '',
                    phone: formatPhone(investor.mobile),
                    website: investor.company_website || '',
                    contactName: formatText(investor.full_name, 'title') || '',
                    designation: formatText(investor.designation, 'title') || '',
                    socialMedia: {
                        linkedin: investor.linkedin_profile || ''
                    }
                },
                
                // URL and identification
                hash: investor.hash || generateUrlHash(10),
                
                // Ratings and verification
                rating: 0,
                reviewCount: 0,
                verified: true,
                featured: ensureBoolean(investor.is_hot),
                
                // Subscription and status
                plan: investor.is_premium === 1 ? PLAN_TYPES.PREMIUM : PLAN_TYPES.BASIC,
                status: status,
                
                // Timestamps
                createdAt: investor.date_created ? formatDate(investor.date_created) : new Date(),
                updatedAt: investor.date_updated ? formatDate(investor.date_updated) : new Date(),
                
                // Ownership
                ownerId: ownerId,
                createdBy: investor.createdby || 'user',
                
                // Classification
                industries: industryIds,
                subIndustryId: subIndustryIds.length > 0 ? subIndustryIds[0] : null,
                subIndustries: subIndustryIds,
                tags: [],
                
                // Analytics
                viewCount: 0,
                contactCount: 0,
                
                // Miscellaneous
                documents: [],
                pageOrder: ensureNumber(investor.page_order) || 0,
                
                // Investor-specific details
                investorType: investor.investor_preference || 'individual',
                
                // Investment details
                investment: {
                    minInvestment: investor.investment_min 
                        ? formatCurrency(investor.investment_min) 
                        : '',
                    maxInvestment: investor.investment_max 
                        ? formatCurrency(investor.investment_max) 
                        : '',
                    totalFundsAvailable: '',
                    averageInvestment: '',
                    typicalRound: [],
                    stake: investor.investment_stake 
                        ? `${investor.investment_stake}%` 
                        : '',
                    purchasingMin: investor.puchasing_min 
                        ? formatCurrency(investor.puchasing_min) 
                        : '',
                    purchasingMax: investor.puchasing_max 
                        ? formatCurrency(investor.puchasing_max) 
                        : ''
                },
                
                // Focus areas
                focus: {
                    sectorsOfInterest: industryIds,
                    investmentStage: [],
                    geographicFocus: preferredLocations.map(loc => loc.state).filter(Boolean)
                },
                
                // Portfolio
                portfolio: {
                    pastInvestments: [],
                    successStories: '',
                    totalInvestments: 0,
                    activeInvestments: 0,
                    exits: 0
                },
                
                // Investment process
                process: {
                    investmentCriteria: [],
                    investmentProcess: '',
                    dueDigiligencePeriod: '',
                    initialResponseTime: '',
                    decisionTimeline: ''
                },
                
                // Terms
                terms: {
                    expectedReturn: '',
                    exitTimeframe: '',
                    equityRange: '',
                    boardSeat: false
                },
                
                // Value add
                value: {
                    additionalValue: [],
                    mentorship: false,
                    networkAccess: false,
                    strategicPartnerships: false
                },
                
                // Company details
                company: {
                    name: investor.company_name || '',
                    website: investor.company_website || '',
                    about: investor.about_company || '',
                    designation: investor.designation || ''
                },
                
                // Additional details
                factors: investor.factors || '',
                businessProof: investor.business_proof || '',
                investorPlan: investor.investor_plan || '',
                preferredLocations: preferredLocations
            };
            
            // Add to batch
            batch.set(doc(db, 'listings', docId), investorData);
            
            // Update user's listings array if owner exists
            if (ownerId) {
                const userRef = doc(db, 'users', ownerId);
                batch.update(userRef, {
                    listings: serverTimestamp.arrayUnion(docId)
                });
            }
        }
        
        // Commit the batch
        await batch.commit();
        console.log(`Migrated investors batch ${i + 1}/${batches}`);
    }
    
    console.log('Investor listings migration completed');
    
    return idMappings.investors;
};

/**
 * Migrate chat data to Firestore
 * @param {Array} chatData - Array of chat objects
 * @param {Array} chatMessagesData - Array of chat message objects
 * @param {Array} chatFilesData - Array of chat file objects
 * @returns {Promise<void>}
 */
export const migrateChats = async (chatData, chatMessagesData, chatFilesData) => {
    if (!chatData || !chatData.length) {
        console.log('No chat data to migrate');
        return;
    }
    
    console.log(`Migrating ${chatData.length} chats...`);
    
    // Process in batches
    const batchSize = 100;
    const batches = Math.ceil(chatData.length / batchSize);
    
    for (let i = 0; i < batches; i++) {
        const currentBatch = chatData.slice(i * batchSize, (i + 1) * batchSize);
        console.log(`Processing chat batch ${i + 1}/${batches} (${currentBatch.length} chats)`);
        
        // First fetch all listing IDs for this batch
        const listingIdSet = new Set();
        const listingTypeMap = new Map();
        
        currentBatch.forEach(chat => {
            if (!chat.type_id || !chat.type_name) return;
            
            const typeId = chat.type_id.toString();
            const typeName = chat.type_name.toLowerCase();
            
            // Determine collection based on type name
            let collectionName = '';
            if (typeName === 'business') collectionName = 'businesses';
            else if (typeName === 'franchise') collectionName = 'franchises';
            else if (typeName === 'investor') collectionName = 'investors';
            else return; // Skip if unknown type
            
            // Look up new listing ID
            const listingId = lookupDocId(collectionName, typeId);
            
            if (listingId) {
                listingIdSet.add(listingId);
                listingTypeMap.set(typeId, {
                    newId: listingId,
                    typeName: typeName
                });
            }
        });
        
        // Fetch listing names
        const listingNames = {};
        
        for (const listingId of listingIdSet) {
            try {
                const listingRef = doc(db, 'listings', listingId);
                const listingDoc = await getDoc(listingRef);
                
                if (listingDoc.exists()) {
                    listingNames[listingId] = listingDoc.data().name || '';
                }
            } catch (error) {
                console.error(`Error getting listing name for ${listingId}:`, error);
            }
        }
        
        // Process each chat
        for (const chat of currentBatch) {
            if (!chat.id) continue;
            
            // Generate document ID
            const chatId = generateDocId('chatrooms', chat.id);
            
            // Look up participants
            const owner = chat.chat_owner ? lookupDocId('users', chat.chat_owner) : null;
            const partner = chat.chat_partner ? lookupDocId('users', chat.chat_partner) : null;
            
            // Skip if missing participants
            if (!owner || !partner) {
                console.warn(`Skipping chat ${chatId} due to missing participants`);
                continue;
            }
            
            // Look up listing
            const typeId = chat.type_id ? chat.type_id.toString() : '';
            const typeName = chat.type_name ? chat.type_name.toLowerCase() : '';
            
            let listingId = '';
            let listingName = '';
            let listingType = '';
            
            if (listingTypeMap.has(typeId)) {
                const listingInfo = listingTypeMap.get(typeId);
                listingId = listingInfo.newId;
                listingName = listingNames[listingId] || '';
                
                // Map to schema listing types
                if (listingInfo.typeName === 'business') listingType = LISTING_TYPES.BUSINESS;
                else if (listingInfo.typeName === 'franchise') listingType = LISTING_TYPES.FRANCHISE;
                else if (listingInfo.typeName === 'investor') listingType = LISTING_TYPES.INVESTOR;
                else listingType = typeName;
            }
            
            // Get related messages
            const messages = chatMessagesData.filter(msg => 
                msg.chat_id && msg.chat_id.toString() === chat.id.toString()
            );
            
            // Get related files
            const files = chatFilesData.filter(file => 
                file.chat_id && file.chat_id.toString() === chat.id.toString()
            );
            
            // Create chatroom document
            const chatroomRef = doc(db, 'chatrooms', chatId);
            
            await setDoc(chatroomRef, {
                id: chatId,
                participants: [owner, partner],
                listingId: listingId,
                listingName: listingName,
                listingType: listingType,
                urlType: chat.url_type || '',
                lastMessage: null,
                createdAt: chat.created_at ? formatDate(chat.created_at) : new Date(),
                updatedAt: chat.last_action ? formatDate(chat.last_action) : new Date(),
                status: chat.status === 1 
                    ? 'active' 
                    : chat.status === 2 
                        ? 'deleted' 
                        : 'inactive'
            });
            
            // Process messages if any
            if (messages.length > 0) {
                const batch = writeBatch(db);
                const processedMessages = [];
                
                for (const msg of messages) {
                    if (!msg.id) continue;
                    
                    // Generate message ID
                    const msgId = generateDocId('messages', msg.id);
                    
                    // Look up sender and recipient
                    const sender = msg.sender ? lookupDocId('users', msg.sender) : '';
                    const recipient = msg.recipient ? lookupDocId('users', msg.recipient) : '';
                    
                    // Skip if missing participants
                    if (!sender || !recipient) continue;
                    
                    // Find attachment if any
                    let attachment = null;
                    
                    if (msg.msg_file) {
                        const file = files.find(f => 
                            f.id && f.id.toString() === msg.msg_file.toString()
                        );
                        
                        if (file) {
                            attachment = {
                                name: file.filename || 'attachment',
                                path: file.path || '',
                                type: file.ext || '',
                                size: file.size || 0
                            };
                        }
                    }
                    
                    // Map message status
                    const status = mapStatusValue(msg.msg_status, 'message');
                    
                    // Create message document
                    batch.set(doc(db, 'chatrooms', chatId, 'messages', msgId), {
                        id: msgId,
                        sender: sender,
                        recipient: recipient,
                        text: msg.msg_text || '',
                        createdAt: msg.msg_date ? formatDate(msg.msg_date) : new Date(),
                        status: status,
                        type: msg.msg_type || 'text',
                        attachment: attachment
                    });
                    
                    // Track processed message for last message update
                    processedMessages.push({
                        id: msgId,
                        text: msg.msg_text || '',
                        sender: sender,
                        createdAt: msg.msg_date ? formatDate(msg.msg_date) : new Date(),
                        status: status
                    });
                }
                
                // Commit message batch
                await batch.commit();
                
                // Update chatroom with last message
                if (processedMessages.length > 0) {
                    // Sort by date, newest first
                    processedMessages.sort((a, b) => 
                        b.createdAt.getTime() - a.createdAt.getTime()
                    );
                    
                    const lastMessage = processedMessages[0];
                    
                    await setDoc(chatroomRef, { lastMessage }, { merge: true });
                }
            }
        }
        
        console.log(`Completed chat batch ${i + 1}/${batches}`);
    }
    
    console.log('Chat migration completed');
};

/**
 * Run the complete migration process
 * @param {Object} data - Object containing all SQL data
 * @param {Object} options - Migration options
 * @returns {Promise<void>}
 */
export const runMigration = async (data, options = {}) => {
    const {
        skipUsers = false,
        skipCategories = false,
        skipLocations = false,
        skipPlans = false,
        skipUserPlans = false,
        skipBusinesses = false,
        skipFranchises = false,
        skipInvestors = false,
        skipChats = false
    } = options;
    
    try {
        console.log('Starting SQL to Firestore migration...');
        
        // Step 1: Migrate categories
        if (!skipCategories) {
            await migrateCategories(data.industries, data.sub_industries);
        }
        
        // Step 2: Migrate locations
        if (!skipLocations) {
            await migrateLocations(data.states, data.cities);
        }
        
        // Step 3: Migrate users
        if (!skipUsers) {
            await migrateUsers(data.users);
        }
        
        // Step 4: Migrate plans
        if (!skipPlans) {
            await migratePlans(data.plans, data.plan_features);
        }
        
        // Step 5: Migrate user subscriptions
        if (!skipUserPlans) {
            await migrateUserSubscriptions(data.user_plans);
        }
        
        // Step 6: Migrate businesses
        if (!skipBusinesses) {
            await migrateBusinesses(data.businesses, data.business_media);
        }
        
        // Step 7: Migrate franchises
        if (!skipFranchises) {
            await migrateFranchises(
                data.franchise,
                data.franchise_media,
                data.franchise_formats,
                data.franchise_locations
            );
        }
        
        // Step 8: Migrate investors
        if (!skipInvestors) {
            await migrateInvestors(
                data.investors,
                data.investor_sub_industries,
                data.investor_location_preference
            );
        }
        
        // Step 9: Migrate chats
        if (!skipChats) {
            await migrateChats(data.userchat, data.userchat_msg, data.chat_files);
        }
        
        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
};

export default runMigration;