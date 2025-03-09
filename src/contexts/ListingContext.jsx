import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  getDocument, 
  createDocumentWithId, 
  updateDocument, 
  deleteDocument, 
  queryDocuments,
  batchUpdate
} from '../services/firebase/firestore';
import { LISTING_TYPES, PLAN_TYPES } from '../utils/constants';

// Create listing context
export const ListingContext = createContext();

// Listing provider component
export const ListingProvider = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error helper
  const clearError = () => setError(null);

  // Load user listings when user profile changes
  useEffect(() => {
    const loadUserListings = async () => {
      if (!currentUser) {
        setUserListings([]);
        return;
      }

      setLoading(true);
      try {
        // In development/testing, provide some placeholder data
        if (process.env.NODE_ENV === 'development') {
          // Mock data for testing
          setUserListings([
            {
              id: '1',
              title: 'Coffee Shop',
              type: 'business',
              description: 'A well-established coffee shop in downtown area',
              price: '50,00,000',
              location: 'Mumbai',
              category: 'Food & Beverage',
              plan: 'premium',
              status: 'active',
              views: 245,
              connects: 12,
              createdAt: new Date()
            },
            {
              id: '2',
              title: 'Tech Startup',
              type: 'startup',
              description: 'SaaS platform for small businesses',
              price: '1,20,00,000',
              location: 'Bangalore',
              category: 'Technology',
              plan: 'basic',
              status: 'active',
              views: 123,
              connects: 5,
              createdAt: new Date()
            }
          ]);
          setLoading(false);
          return;
        }

        // In production, query the actual data
        try {
          // Query user's listings
          const result = await queryDocuments({
            collectionName: 'listings',
            filters: [
              { field: 'ownerId', operator: '==', value: currentUser.uid }
            ],
            pageSize: 50 // Assuming most users won't have more than 50 listings
          });

          setUserListings(result.documents || []);
        } catch (err) {
          console.error('Error loading user listings:', err);
          // Fail gracefully with empty array
          setUserListings([]);
        }
      } catch (err) {
        console.error('Error in listing context:', err);
        setError(err.message);
        // Ensure we have a valid array
        setUserListings([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserListings();
  }, [currentUser, userProfile]);

  // Get listing count by type
  const getListingCountByType = (type) => {
    if (!Array.isArray(userListings)) return 0;
    return userListings.filter(listing => listing?.type === type).length;
  };

  // Get all listings by type
  const getListingsByType = (type) => {
    if (!Array.isArray(userListings)) return [];
    return userListings.filter(listing => listing?.type === type);
  };

  // Create a new listing
  const createListing = async (listingData) => {
    if (!currentUser) {
      throw new Error('You must be logged in to create a listing');
    }

    clearError();
    setLoading(true);

    try {
      // Mock creation in development
      if (process.env.NODE_ENV === 'development') {
        const newListing = {
          id: Date.now().toString(),
          ...listingData,
          ownerId: currentUser.uid,
          ownerName: currentUser.displayName || '',
          ownerEmail: currentUser.email || '',
          creatorId: currentUser.uid,
          status: 'active',
          connects: 0,
          views: 0,
          createdAt: new Date()
        };
        
        // Update local state
        setUserListings(prev => [...(Array.isArray(prev) ? prev : []), newListing]);
        
        setLoading(false);
        return newListing;
      }

      // Add owner information
      const enrichedData = {
        ...listingData,
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName || '',
        ownerEmail: currentUser.email || '',
        creatorId: currentUser.uid,
        status: 'active',
        connects: 0,
        views: 0
      };

      // Create listing in Firestore
      const listingId = await createDocumentWithId(
        'listings', 
        listingData.customId || Date.now().toString(), 
        enrichedData
      );

      // Update user's listings list in Firestore
      const userListingsArray = Array.isArray(userProfile?.listings) ? userProfile.listings : [];
      const updatedListings = [...userListingsArray, listingId];
      
      await updateDocument('users', currentUser.uid, {
        listings: updatedListings
      });

      // Get the created listing
      const newListing = await getDocument('listings', listingId);

      // Update local state
      setUserListings(prev => [...(Array.isArray(prev) ? prev : []), newListing]);

      return newListing;
    } catch (err) {
      console.error('Error creating listing:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a listing
  const updateListing = async (listingId, data) => {
    if (!currentUser) {
      throw new Error('You must be logged in to update a listing');
    }

    clearError();
    setLoading(true);

    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        // Update the listing in local state
        const updatedListings = userListings.map(listing => 
          listing.id === listingId ? { ...listing, ...data } : listing
        );
        
        setUserListings(updatedListings);
        
        const updatedListing = updatedListings.find(e => e.id === listingId);
        
        setLoading(false);
        return updatedListing;
      }

      // Get the listing to verify ownership
      const listing = await getDocument('listings', listingId);
      
      if (!listing) {
        throw new Error('Listing not found');
      }

      if (listing.ownerId !== currentUser.uid) {
        throw new Error('You do not have permission to update this listing');
      }

      // Update the listing
      await updateDocument('listings', listingId, data);

      // Get the updated listing
      const updatedListing = await getDocument('listings', listingId);

      // Update local state
      setUserListings(prev => {
        if (!Array.isArray(prev)) return [updatedListing];
        return prev.map(e => e.id === listingId ? updatedListing : e);
      });

      return updatedListing;
    } catch (err) {
      console.error('Error updating listing:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a listing
  const deleteListing = async (listingId) => {
    if (!currentUser) {
      throw new Error('You must be logged in to delete a listing');
    }

    clearError();
    setLoading(true);

    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        setUserListings(prev => 
          Array.isArray(prev) ? prev.filter(e => e.id !== listingId) : []
        );
        
        setLoading(false);
        return true;
      }

      // Get the listing to verify ownership
      const listing = await getDocument('listings', listingId);
      
      if (!listing) {
        throw new Error('Listing not found');
      }

      if (listing.ownerId !== currentUser.uid) {
        throw new Error('You do not have permission to delete this listing');
      }

      // Delete the listing
      await deleteDocument('listings', listingId);

      // Update user's listings list in Firestore
      const userListingsArray = Array.isArray(userProfile?.listings) ? userProfile.listings : [];
      const updatedListings = userListingsArray.filter(id => id !== listingId);
      
      await updateDocument('users', currentUser.uid, {
        listings: updatedListings
      });

      // Update local state
      setUserListings(prev => {
        if (!Array.isArray(prev)) return [];
        return prev.filter(e => e.id !== listingId);
      });

      return true;
    } catch (err) {
      console.error('Error deleting listing:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Change listing plan
  const changeListingPlan = async (listingId, planType) => {
    if (!Object.values(PLAN_TYPES).includes(planType)) {
      throw new Error('Invalid plan type');
    }

    try {
      const updatedListing = await updateListing(listingId, {
        plan: planType,
        planUpdatedAt: new Date()
      });

      return updatedListing;
    } catch (err) {
      throw err;
    }
  };

  // Get listing by ID (can be used for any listing, not just user's)
  const getListingById = async (listingId) => {
    setLoading(true);
    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        const listing = Array.isArray(userListings) 
          ? userListings.find(e => e.id === listingId)
          : null;
          
        if (listing) {
          setLoading(false);
          return listing;
        }
        
        // Create a mock listing if not found
        const mockListing = {
          id: listingId,
          title: 'Sample Listing',
          type: 'business',
          description: 'This is a placeholder listing for development',
          price: '50,00,000',
          location: 'Mumbai',
          category: 'Food & Beverage',
          plan: 'basic',
          status: 'active',
          views: 123,
          connects: 5,
          createdAt: new Date()
        };
        
        setLoading(false);
        return mockListing;
      }

      const listing = await getDocument('listings', listingId);
      return listing;
    } catch (err) {
      console.error('Error getting listing:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Search for listings
  const searchListings = async (searchParams) => {
    setLoading(true);
    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create mock search results
        const mockResults = [
          {
            id: '101',
            title: 'Coffee Shop in Mumbai',
            type: 'business',
            description: 'Well-established coffee shop in prime location',
            price: '50,00,000',
            location: 'Mumbai',
            category: 'Food & Beverage',
            plan: 'premium',
            status: 'active',
            views: 245,
            connects: 12,
            createdAt: new Date()
          },
          {
            id: '102',
            title: 'Restaurant Franchise',
            type: 'franchise',
            description: 'Popular restaurant chain with 5 locations',
            price: '1,50,00,000',
            location: 'Delhi',
            category: 'Food & Beverage',
            plan: 'platinum',
            status: 'active',
            views: 412,
            connects: 25,
            createdAt: new Date()
          }
        ];
        
        setLoading(false);
        return {
          documents: mockResults,
          lastVisible: null,
          hasMore: false
        };
      }

      // Build filters from search params
      const filters = [];
      
      // Type filter
      if (searchParams.type && Object.values(LISTING_TYPES).includes(searchParams.type)) {
        filters.push({ field: 'type', operator: '==', value: searchParams.type });
      }
      
      // Status filter - only show active listings by default
      filters.push({ field: 'status', operator: '==', value: searchParams.status || 'active' });
      
      // Other filters as needed
      if (searchParams.location) {
        filters.push({ field: 'location', operator: '==', value: searchParams.location });
      }
      
      if (searchParams.priceMin) {
        filters.push({ field: 'price', operator: '>=', value: parseFloat(searchParams.priceMin) });
      }
      
      if (searchParams.priceMax) {
        filters.push({ field: 'price', operator: '<=', value: parseFloat(searchParams.priceMax) });
      }
      
      // Execute query
      const result = await queryDocuments({
        collectionName: 'listings',
        filters,
        sortBy: searchParams.sortBy || 'createdAt',
        sortDirection: searchParams.sortDirection || 'desc',
        pageSize: searchParams.pageSize || 20,
        lastVisible: searchParams.lastVisible || null
      });
      
      return result;
    } catch (err) {
      console.error('Error searching listings:', err);
      setError(err.message);
      
      // Return empty result on error
      return {
        documents: [],
        lastVisible: null,
        hasMore: false
      };
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------
  // NEW FUNCTIONS FOR DASHBOARD FEATURES
  // ------------------------------------

  // FAVORITES MANAGEMENT
  
  // Get user favorites
  const getFavorites = async () => {
    if (!currentUser) {
      throw new Error('You must be logged in to access favorites');
    }

    setLoading(true);

    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock favorites
        const mockFavorites = [
          {
            id: '101',
            title: 'Coffee Shop Chain',
            type: LISTING_TYPES.BUSINESS,
            description: 'Well-established coffee shop chain with 5 locations in premium areas',
            location: 'Mumbai',
            price: '2,50,00,000',
            rating: 4.8,
            views: 342,
            categories: ['Food & Beverage', 'Retail'],
            savedAt: new Date('2023-05-10')
          },
          {
            id: '102',
            title: 'Tech Education Platform',
            type: LISTING_TYPES.STARTUP,
            description: 'EdTech platform focused on programming skills with 50,000+ users',
            location: 'Bangalore',
            price: '1,20,00,000',
            rating: 4.5,
            views: 217,
            categories: ['Education', 'Technology'],
            savedAt: new Date('2023-05-12')
          }
        ];
        
        return mockFavorites;
      }

      // Get user favorites from Firestore
      const userDoc = await getDocument('users', currentUser.uid);
      
      if (!userDoc || !userDoc.favorites || !Array.isArray(userDoc.favorites)) {
        return [];
      }
      
      // Get full listing data for each favorite ID
      const favoriteIds = userDoc.favorites;
      
      if (favoriteIds.length === 0) {
        return [];
      }
      
      // Get all favorites in one query for efficiency
      const results = await queryDocuments({
        collectionName: 'listings',
        filters: [
          { field: 'id', operator: 'in', value: favoriteIds }
        ]
      });
      
      // Sort by the order in the favorites array to maintain user's order
      const sortedFavorites = results.documents.sort((a, b) => {
        return favoriteIds.indexOf(a.id) - favoriteIds.indexOf(b.id);
      });
      
      return sortedFavorites;
    } catch (err) {
      console.error('Error getting favorites:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Add a listing to favorites
  const addToFavorites = async (listingId) => {
    if (!currentUser) {
      throw new Error('You must be logged in to add to favorites');
    }
    
    clearError();
    setLoading(true);
    
    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
      }
      
      // Get user document
      const userDoc = await getDocument('users', currentUser.uid);
      
      if (!userDoc) {
        throw new Error('User document not found');
      }
      
      // Get current favorites
      const currentFavorites = userDoc.favorites || [];
      
      // Check if already in favorites
      if (currentFavorites.includes(listingId)) {
        return true; // Already a favorite
      }
      
      // Add to favorites
      const updatedFavorites = [...currentFavorites, listingId];
      
      // Update user document
      await updateDocument('users', currentUser.uid, {
        favorites: updatedFavorites
      });
      
      // Also add to listing's favorite count
      try {
        await updateDocument('listings', listingId, {
          favoriteCount: (await getDocument('listings', listingId))?.favoriteCount + 1 || 1
        });
      } catch (err) {
        console.error('Error updating listing favorite count:', err);
      }
      
      return true;
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Remove a listing from favorites
  const removeFromFavorites = async (listingId) => {
    if (!currentUser) {
      throw new Error('You must be logged in to remove from favorites');
    }
    
    clearError();
    setLoading(true);
    
    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
      }
      
      // Get user document
      const userDoc = await getDocument('users', currentUser.uid);
      
      if (!userDoc) {
        throw new Error('User document not found');
      }
      
      // Get current favorites
      const currentFavorites = userDoc.favorites || [];
      
      // Check if in favorites
      if (!currentFavorites.includes(listingId)) {
        return true; // Not a favorite, so no action needed
      }
      
      // Remove from favorites
      const updatedFavorites = currentFavorites.filter(id => id !== listingId);
      
      // Update user document
      await updateDocument('users', currentUser.uid, {
        favorites: updatedFavorites
      });
      
      // Also decrement listing's favorite count
      try {
        const listing = await getDocument('listings', listingId);
        if (listing && typeof listing.favoriteCount === 'number' && listing.favoriteCount > 0) {
          await updateDocument('listings', listingId, {
            favoriteCount: listing.favoriteCount - 1
          });
        }
      } catch (err) {
        console.error('Error updating listing favorite count:', err);
      }
      
      return true;
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // RECENTLY VIEWED MANAGEMENT
  
  // Get recently viewed listings
  const getRecentlyViewed = async () => {
    if (!currentUser) {
      throw new Error('You must be logged in to access recently viewed listings');
    }
    
    setLoading(true);
    
    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock recently viewed
        const mockRecentlyViewed = [
          {
            id: '201',
            title: 'Luxury Hotel',
            type: LISTING_TYPES.BUSINESS,
            description: 'Premium hotel property in a tourist destination',
            location: 'Goa',
            price: '12,50,00,000',
            categories: ['Hospitality', 'Real Estate'],
            viewedAt: new Date('2023-05-22T14:35:00'),
            isFavorite: false
          },
          {
            id: '202',
            title: 'E-commerce Marketplace',
            type: LISTING_TYPES.STARTUP,
            description: 'B2B e-commerce platform connecting wholesalers and retailers',
            location: 'Bangalore',
            price: '5,00,00,000',
            categories: ['E-commerce', 'B2B', 'Technology'],
            viewedAt: new Date('2023-05-22T12:15:00'),
            isFavorite: true
          }
        ];
        
        return mockRecentlyViewed;
      }
      
      // Get user's recently viewed from Firestore
      const userDoc = await getDocument('users', currentUser.uid);
      
      if (!userDoc || !userDoc.recentlyViewed || !Array.isArray(userDoc.recentlyViewed)) {
        return [];
      }
      
      // Get recently viewed items with timestamp
      const recentlyViewedItems = userDoc.recentlyViewed;
      
      if (recentlyViewedItems.length === 0) {
        return [];
      }
      
      // Extract listing IDs
      const listingIds = recentlyViewedItems.map(item => item.listingId);
      
      // Get all listings in one query for efficiency
      const results = await queryDocuments({
        collectionName: 'listings',
        filters: [
          { field: 'id', operator: 'in', value: listingIds }
        ]
      });
      
      // Get user favorites to check if listings are favorited
      const favorites = userDoc.favorites || [];
      
      // Combine listing data with viewed timestamp and favorite status
      const recentlyViewed = results.documents.map(listing => {
        // Find the viewed timestamp for this listing
        const viewedItem = recentlyViewedItems.find(item => item.listingId === listing.id);
        
        return {
          ...listing,
          viewedAt: viewedItem?.viewedAt?.toDate() || new Date(),
          isFavorite: favorites.includes(listing.id)
        };
      });
      
      // Sort by viewed timestamp, most recent first
      recentlyViewed.sort((a, b) => b.viewedAt - a.viewedAt);
      
      return recentlyViewed;
    } catch (err) {
      console.error('Error getting recently viewed listings:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Add a listing to recently viewed
  const addToRecentlyViewed = async (listingId) => {
    if (!currentUser) {
      return; // Not logged in, no tracking
    }
    
    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      
      // Get user document
      const userDoc = await getDocument('users', currentUser.uid);
      
      if (!userDoc) {
        return;
      }
      
      // Get current recently viewed
      const currentRecentlyViewed = userDoc.recentlyViewed || [];
      
      // Remove this listing if it exists (to re-add at the top)
      const filteredItems = currentRecentlyViewed.filter(item => item.listingId !== listingId);
      
      // Add to the beginning of recently viewed
      const updatedRecentlyViewed = [
        { 
          listingId, 
          viewedAt: new Date() 
        },
        ...filteredItems
      ].slice(0, 30); // Keep last 30 items
      
      // Update user document
      await updateDocument('users', currentUser.uid, {
        recentlyViewed: updatedRecentlyViewed
      });
      
      // Also increment listing's view count
      try {
        const listing = await getDocument('listings', listingId);
        if (listing) {
          await updateDocument('listings', listingId, {
            views: (listing.views || 0) + 1
          });
        }
      } catch (err) {
        console.error('Error updating listing view count:', err);
      }
      
      return true;
    } catch (err) {
      console.error('Error adding to recently viewed:', err);
      // Don't set error or throw, since this is non-critical
      return false;
    }
  };
  
  // Clear recently viewed history
  const clearRecentlyViewed = async () => {
    if (!currentUser) {
      throw new Error('You must be logged in to clear recently viewed history');
    }
    
    clearError();
    setLoading(true);
    
    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
      }
      
      // Update user document to clear history
      await updateDocument('users', currentUser.uid, {
        recentlyViewed: []
      });
      
      return true;
    } catch (err) {
      console.error('Error clearing recently viewed history:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // SAVED SEARCHES MANAGEMENT
  
  // Get saved searches
  const getSavedSearches = async () => {
    if (!currentUser) {
      throw new Error('You must be logged in to access saved searches');
    }
    
    setLoading(true);
    
    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock saved searches
        const mockSavedSearches = [
          {
            id: '1',
            name: 'Coffee Shops in Mumbai',
            query: 'coffee shop',
            type: LISTING_TYPES.BUSINESS,
            filters: {
              location: 'Mumbai',
              priceMin: '5000000',
              priceMax: '15000000',
              categories: ['Food & Beverage', 'Retail']
            },
            createdAt: new Date('2023-04-15'),
            lastRun: new Date('2023-05-10')
          },
          {
            id: '2',
            name: 'Tech Startups under ₹1 Cr',
            query: 'tech startup',
            type: LISTING_TYPES.STARTUP,
            filters: {
              priceMax: '10000000',
              categories: ['Technology', 'SaaS']
            },
            createdAt: new Date('2023-04-20'),
            lastRun: new Date('2023-05-12')
          }
        ];
        
        return mockSavedSearches;
      }
      
      // Query saved searches from Firestore
      const results = await queryDocuments({
        collectionName: 'savedSearches',
        filters: [
          { field: 'userId', operator: '==', value: currentUser.uid }
        ],
        sortBy: 'createdAt',
        sortDirection: 'desc'
      });
      
      return results.documents || [];
    } catch (err) {
      console.error('Error getting saved searches:', err);
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Save a search
  const saveSearch = async (searchData) => {
    if (!currentUser) {
      throw new Error('You must be logged in to save a search');
    }
    
    clearError();
    setLoading(true);
    
    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
          id: Date.now().toString(),
          ...searchData,
          createdAt: new Date()
        };
      }
      
      // Create the search document
      const searchId = await createDocumentWithId(
        'savedSearches',
        Date.now().toString(),
        {
          ...searchData,
          userId: currentUser.uid,
          createdAt: new Date()
        }
      );
      
      // Get the created search
      const savedSearch = await getDocument('savedSearches', searchId);
      
      return savedSearch;
    } catch (err) {
      console.error('Error saving search:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a saved search
  const deleteSavedSearch = async (searchId) => {
    if (!currentUser) {
      throw new Error('You must be logged in to delete a saved search');
    }
    
    clearError();
    setLoading(true);
    
    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
      }
      
      // Get the search to verify ownership
      const search = await getDocument('savedSearches', searchId);
      
      if (!search) {
        throw new Error('Search not found');
      }
      
      if (search.userId !== currentUser.uid) {
        throw new Error('You do not have permission to delete this saved search');
      }
      
      // Delete the search
      await deleteDocument('savedSearches', searchId);
      
      return true;
    } catch (err) {
      console.error('Error deleting saved search:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update last run time for a saved search
  const updateSearchLastRun = async (searchId) => {
    if (!currentUser) {
      throw new Error('You must be logged in to run a saved search');
    }
    
    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      
      // Update the last run timestamp
      await updateDocument('savedSearches', searchId, {
        lastRun: new Date()
      });
      
      return true;
    } catch (err) {
      console.error('Error updating search last run:', err);
      return false; // Non-critical operation
    }
  };
  
  // ANALYTICS DATA
  
  // Get analytics data
  const getAnalyticsData = async (dateRange = '30d', listingId = 'all') => {
    if (!currentUser) {
      throw new Error('You must be logged in to access analytics');
    }
    
    setLoading(true);
    
    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Generate mock analytics data
        // Generate mock view counts for each day in the selected range
        const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 365;
        const dailyViews = Array.from({ length: days }, () => Math.floor(Math.random() * 50) + 1);
        const dailyContacts = Array.from({ length: days }, () => Math.floor(Math.random() * 15));
        const dailyFavorites = Array.from({ length: days }, () => Math.floor(Math.random() * 10));
        
        // Generate dates for x-axis
        const dates = [];
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - (days - i - 1));
          dates.push(date.toISOString().split('T')[0]);
        }
        
        // Calculate totals
        const totalViews = dailyViews.reduce((acc, curr) => acc + curr, 0);
        const totalContacts = dailyContacts.reduce((acc, curr) => acc + curr, 0);
        const totalFavorites = dailyFavorites.reduce((acc, curr) => acc + curr, 0);
        
        // Generate random trend percentage between -25 and 75
        const getRandomTrend = () => {
          return Math.floor(Math.random() * 100) - 25;
        };
        
        // Traffic sources
        const trafficSources = [
          { source: 'Search Engines', percentage: 45, trend: getRandomTrend() },
          { source: 'Direct', percentage: 25, trend: getRandomTrend() },
          { source: 'Social Media', percentage: 15, trend: getRandomTrend() },
          { source: 'Referrals', percentage: 10, trend: getRandomTrend() },
          { source: 'Other', percentage: 5, trend: getRandomTrend() }
        ];
        
        // User demographics
        const demographics = {
          locations: [
            { location: 'Mumbai', percentage: 35 },
            { location: 'Delhi', percentage: 20 },
            { location: 'Bangalore', percentage: 15 },
            { location: 'Hyderabad', percentage: 10 },
            { location: 'Chennai', percentage: 8 },
            { location: 'Other', percentage: 12 }
          ],
          devices: [
            { device: 'Mobile', percentage: 65 },
            { device: 'Desktop', percentage: 30 },
            { device: 'Tablet', percentage: 5 }
          ]
        };
        
        // Mock data structure
        const analyticsData = {
          summary: {
            views: {
              total: totalViews,
              trend: getRandomTrend()
            },
            contacts: {
              total: totalContacts,
              trend: getRandomTrend()
            },
            favorites: {
              total: totalFavorites,
              trend: getRandomTrend()
            },
            conversionRate: {
              value: (totalContacts / (totalViews || 1) * 100).toFixed(2),
              trend: getRandomTrend()
            }
          },
          charts: {
            dates,
            dailyViews,
            dailyContacts,
            dailyFavorites
          },
          trafficSources,
          demographics
        };
        
        return analyticsData;
      }
      
      // In production, this would query analytics data from Firestore
      // For simplicity, we'll return structured mock data for now
      
      // Get the date range filter based on selected period
      const startDate = new Date();
      if (dateRange === '7d') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (dateRange === '30d') {
        startDate.setDate(startDate.getDate() - 30);
      } else if (dateRange === '90d') {
        startDate.setDate(startDate.getDate() - 90);
      } else {
        startDate.setDate(startDate.getDate() - 365);
      }
      
      // Query filters
      const filters = [
        { field: 'userId', operator: '==', value: currentUser.uid },
        { field: 'timestamp', operator: '>=', value: startDate }
      ];
      
      // Add listing filter if specified
      if (listingId !== 'all') {
        filters.push({ field: 'listingId', operator: '==', value: listingId });
      }
      
      // Query analytics data
      // This would be implemented based on your actual analytics structure in Firestore
      
      // For now, return the mock data since we don't have a real implementation
      return {}; // Replace with real implementation
    } catch (err) {
      console.error('Error getting analytics data:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    userListings,
    loading,
    error,
    clearError,
    getListingCountByType,
    getListingsByType,
    createListing,
    updateListing,
    deleteListing,
    changeListingPlan,
    getListingById,
    searchListings,
    // New functions for dashboard features
    getFavorites,
    addToFavorites,
    removeFromFavorites,
    getRecentlyViewed,
    addToRecentlyViewed,
    clearRecentlyViewed,
    getSavedSearches,
    saveSearch,
    deleteSavedSearch,
    updateSearchLastRun,
    getAnalyticsData
  };

  return (
    <ListingContext.Provider value={value}>
      {children}
    </ListingContext.Provider>
  );
};

// Custom hook to use the listing context
export const useListing = () => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error("useListing must be used within a ListingProvider");
  }
  return context;
};

export default ListingProvider;