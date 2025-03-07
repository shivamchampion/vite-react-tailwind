import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  getDocument, 
  createDocumentWithId, 
  updateDocument, 
  deleteDocument, 
  queryDocuments 
} from '../services/firebase/firestore';
import { ENTITY_TYPES, PLAN_TYPES } from '../utils/constants';

// Create entity context
export const EntityContext = createContext();

// Entity provider component
export const EntityProvider = ({ children }) => {
  const { currentUser, userProfile } = useAuth();
  const [userEntities, setUserEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Clear error helper
  const clearError = () => setError(null);

  // Load user entities when user profile changes
  useEffect(() => {
    const loadUserEntities = async () => {
      if (!currentUser) {
        setUserEntities([]);
        return;
      }

      setLoading(true);
      try {
        // In development/testing, provide some placeholder data
        if (process.env.NODE_ENV === 'development') {
          // Mock data for testing
          setUserEntities([
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
          // Query user's entities
          const result = await queryDocuments({
            collectionName: 'entities',
            filters: [
              { field: 'ownerId', operator: '==', value: currentUser.uid }
            ],
            pageSize: 50 // Assuming most users won't have more than 50 entities
          });

          setUserEntities(result.documents || []);
        } catch (err) {
          console.error('Error loading user entities:', err);
          // Fail gracefully with empty array
          setUserEntities([]);
        }
      } catch (err) {
        console.error('Error in entity context:', err);
        setError(err.message);
        // Ensure we have a valid array
        setUserEntities([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserEntities();
  }, [currentUser, userProfile]);

  // Get entity count by type
  const getEntityCountByType = (type) => {
    if (!Array.isArray(userEntities)) return 0;
    return userEntities.filter(entity => entity?.type === type).length;
  };

  // Get all entities by type
  const getEntitiesByType = (type) => {
    if (!Array.isArray(userEntities)) return [];
    return userEntities.filter(entity => entity?.type === type);
  };

  // Create a new entity
  const createEntity = async (entityData) => {
    if (!currentUser) {
      throw new Error('You must be logged in to create an entity');
    }

    clearError();
    setLoading(true);

    try {
      // Mock creation in development
      if (process.env.NODE_ENV === 'development') {
        const newEntity = {
          id: Date.now().toString(),
          ...entityData,
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
        setUserEntities(prev => [...(Array.isArray(prev) ? prev : []), newEntity]);
        
        setLoading(false);
        return newEntity;
      }

      // Add owner information
      const enrichedData = {
        ...entityData,
        ownerId: currentUser.uid,
        ownerName: currentUser.displayName || '',
        ownerEmail: currentUser.email || '',
        creatorId: currentUser.uid,
        status: 'active',
        connects: 0,
        views: 0
      };

      // Create entity in Firestore
      const entityId = await createDocumentWithId(
        'entities', 
        entityData.customId || Date.now().toString(), 
        enrichedData
      );

      // Update user's entities list in Firestore
      const userEntitiesArray = Array.isArray(userProfile?.entities) ? userProfile.entities : [];
      const updatedEntities = [...userEntitiesArray, entityId];
      
      await updateDocument('users', currentUser.uid, {
        entities: updatedEntities
      });

      // Get the created entity
      const newEntity = await getDocument('entities', entityId);

      // Update local state
      setUserEntities(prev => [...(Array.isArray(prev) ? prev : []), newEntity]);

      return newEntity;
    } catch (err) {
      console.error('Error creating entity:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an entity
  const updateEntity = async (entityId, data) => {
    if (!currentUser) {
      throw new Error('You must be logged in to update an entity');
    }

    clearError();
    setLoading(true);

    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        // Update the entity in local state
        const updatedEntities = userEntities.map(entity => 
          entity.id === entityId ? { ...entity, ...data } : entity
        );
        
        setUserEntities(updatedEntities);
        
        const updatedEntity = updatedEntities.find(e => e.id === entityId);
        
        setLoading(false);
        return updatedEntity;
      }

      // Get the entity to verify ownership
      const entity = await getDocument('entities', entityId);
      
      if (!entity) {
        throw new Error('Entity not found');
      }

      if (entity.ownerId !== currentUser.uid) {
        throw new Error('You do not have permission to update this entity');
      }

      // Update the entity
      await updateDocument('entities', entityId, data);

      // Get the updated entity
      const updatedEntity = await getDocument('entities', entityId);

      // Update local state
      setUserEntities(prev => {
        if (!Array.isArray(prev)) return [updatedEntity];
        return prev.map(e => e.id === entityId ? updatedEntity : e);
      });

      return updatedEntity;
    } catch (err) {
      console.error('Error updating entity:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete an entity
  const deleteEntity = async (entityId) => {
    if (!currentUser) {
      throw new Error('You must be logged in to delete an entity');
    }

    clearError();
    setLoading(true);

    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        setUserEntities(prev => 
          Array.isArray(prev) ? prev.filter(e => e.id !== entityId) : []
        );
        
        setLoading(false);
        return true;
      }

      // Get the entity to verify ownership
      const entity = await getDocument('entities', entityId);
      
      if (!entity) {
        throw new Error('Entity not found');
      }

      if (entity.ownerId !== currentUser.uid) {
        throw new Error('You do not have permission to delete this entity');
      }

      // Delete the entity
      await deleteDocument('entities', entityId);

      // Update user's entities list in Firestore
      const userEntitiesArray = Array.isArray(userProfile?.entities) ? userProfile.entities : [];
      const updatedEntities = userEntitiesArray.filter(id => id !== entityId);
      
      await updateDocument('users', currentUser.uid, {
        entities: updatedEntities
      });

      // Update local state
      setUserEntities(prev => {
        if (!Array.isArray(prev)) return [];
        return prev.filter(e => e.id !== entityId);
      });

      return true;
    } catch (err) {
      console.error('Error deleting entity:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Change entity plan
  const changeEntityPlan = async (entityId, planType) => {
    if (!Object.values(PLAN_TYPES).includes(planType)) {
      throw new Error('Invalid plan type');
    }

    try {
      const updatedEntity = await updateEntity(entityId, {
        plan: planType,
        planUpdatedAt: new Date()
      });

      return updatedEntity;
    } catch (err) {
      throw err;
    }
  };

  // Get entity by ID (can be used for any entity, not just user's)
  const getEntityById = async (entityId) => {
    setLoading(true);
    try {
      // For development/testing
      if (process.env.NODE_ENV === 'development') {
        const entity = Array.isArray(userEntities) 
          ? userEntities.find(e => e.id === entityId)
          : null;
          
        if (entity) {
          setLoading(false);
          return entity;
        }
        
        // Create a mock entity if not found
        const mockEntity = {
          id: entityId,
          title: 'Sample Entity',
          type: 'business',
          description: 'This is a placeholder entity for development',
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
        return mockEntity;
      }

      const entity = await getDocument('entities', entityId);
      return entity;
    } catch (err) {
      console.error('Error getting entity:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Search for entities
  const searchEntities = async (searchParams) => {
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
      if (searchParams.type && Object.values(ENTITY_TYPES).includes(searchParams.type)) {
        filters.push({ field: 'type', operator: '==', value: searchParams.type });
      }
      
      // Status filter - only show active entities by default
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
        collectionName: 'entities',
        filters,
        sortBy: searchParams.sortBy || 'createdAt',
        sortDirection: searchParams.sortDirection || 'desc',
        pageSize: searchParams.pageSize || 20,
        lastVisible: searchParams.lastVisible || null
      });
      
      return result;
    } catch (err) {
      console.error('Error searching entities:', err);
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

  // Context value
  const value = {
    userEntities,
    loading,
    error,
    clearError,
    getEntityCountByType,
    getEntitiesByType,
    createEntity,
    updateEntity,
    deleteEntity,
    changeEntityPlan,
    getEntityById,
    searchEntities
  };

  return (
    <EntityContext.Provider value={value}>
      {children}
    </EntityContext.Provider>
  );
};

// Custom hook to use the entity context
export const useEntity = () => {
  const context = useContext(EntityContext);
  if (!context) {
    throw new Error("useEntity must be used within an EntityProvider");
  }
  return context;
};

export default EntityProvider;