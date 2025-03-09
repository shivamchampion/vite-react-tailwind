// src/services/firebase/firestore.js
/**
 * Firestore Database Utilities
 * 
 * This file provides utility functions for interacting with Firestore.
 * It includes CRUD operations, query builders, and transaction helpers.
 * 
 * @version 2.0.0
 * @last-updated 2025-03-09
 */

import { 
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, 
  query, where, orderBy, limit, startAfter, startAt, endAt,
  serverTimestamp, increment, arrayUnion, arrayRemove, 
  writeBatch, runTransaction, documentId,
  getCountFromServer, onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from './config';
import { v4 as uuidv4 } from 'uuid';

// ===== COLLECTION REFERENCES =====

/**
 * Get a reference to a Firestore collection
 * @param {string} collectionName - Name of the collection
 * @returns {Object} Firestore collection reference
 */
export const getCollection = (collectionName) => {
  return collection(db, collectionName);
};

/**
 * Get a reference to a Firestore document
 * @param {string} collectionName - Name of the collection
 * @param {string} docId - Document ID
 * @returns {Object} Firestore document reference
 */
export const getDocRef = (collectionName, docId) => {
  return doc(db, collectionName, docId);
};

/**
 * Get a reference to a subcollection of a document
 * @param {string} collectionName - Name of the parent collection
 * @param {string} docId - Parent document ID
 * @param {string} subcollectionName - Name of the subcollection
 * @returns {Object} Firestore collection reference
 */
export const getSubcollection = (collectionName, docId, subcollectionName) => {
  return collection(db, collectionName, docId, subcollectionName);
};

// ===== DOCUMENT OPERATIONS =====

/**
 * Create a new document with auto-generated ID
 * @param {string} collectionName - Collection name
 * @param {Object} data - Document data
 * @returns {Promise<string>} Created document ID
 */
export const createDocument = async (collectionName, data) => {
  try {
    const collectionRef = getCollection(collectionName);
    const timestamp = serverTimestamp();
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Create a new document with custom ID
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {Object} data - Document data
 * @returns {Promise<string>} Created document ID
 */
export const createDocumentWithId = async (collectionName, docId, data) => {
  try {
    const docRef = getDocRef(collectionName, docId);
    const timestamp = serverTimestamp();
    await setDoc(docRef, {
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    return docId;
  } catch (error) {
    console.error(`Error creating document with ID in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get a document by ID
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<Object|null>} Document data or null if not found
 */
export const getDocument = async (collectionName, docId) => {
  try {
    const docRef = getDocRef(collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update a document by ID
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {Object} data - Updated fields
 * @returns {Promise<boolean>} Success status
 */
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = getDocRef(collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Delete a document by ID
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = getDocRef(collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Soft delete a document by updating its isDeleted flag
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<boolean>} Success status
 */
export const softDeleteDocument = async (collectionName, docId) => {
  try {
    const docRef = getDocRef(collectionName, docId);
    await updateDoc(docRef, {
      isDeleted: true,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Error soft-deleting document from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Create or update a document by ID
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {Object} data - Document data
 * @returns {Promise<string>} Document ID
 */
export const upsertDocument = async (collectionName, docId, data) => {
  try {
    const docRef = getDocRef(collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Update existing document
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
    } else {
      // Create new document
      await setDoc(docRef, {
        ...data,
        id: docId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    return docId;
  } catch (error) {
    console.error(`Error upserting document in ${collectionName}:`, error);
    throw error;
  }
};

// ===== QUERY OPERATIONS =====

/**
 * Get all documents from a collection (use with caution for small collections only)
 * @param {string} collectionName - Collection name
 * @returns {Promise<Array>} Array of document data
 */
export const getAllDocuments = async (collectionName) => {
  try {
    const collectionRef = getCollection(collectionName);
    const querySnapshot = await getDocs(collectionRef);
    
    const documents = [];
    querySnapshot.forEach(doc => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    return documents;
  } catch (error) {
    console.error(`Error getting all documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Query documents with filtering and pagination
 * @param {Object} params - Query parameters
 * @param {string} params.collectionName - Collection name
 * @param {Array} params.filters - Array of filter objects [{ field, operator, value }]
 * @param {string} params.sortBy - Field to sort by (default: 'createdAt')
 * @param {string} params.sortDirection - Sort direction ('asc' or 'desc', default: 'desc')
 * @param {number} params.pageSize - Number of documents per page (default: 10)
 * @param {Object} params.lastVisible - Last document from previous page
 * @returns {Promise<Object>} { documents, lastVisible, hasMore }
 */
export const queryDocuments = async ({ 
  collectionName, 
  filters = [], 
  sortBy = 'createdAt', 
  sortDirection = 'desc', 
  pageSize = 10, 
  lastVisible = null 
}) => {
  try {
    // Build query constraints
    const constraints = [];
    
    // Add filters
    filters.forEach(filter => {
      constraints.push(where(filter.field, filter.operator, filter.value));
    });
    
    // Add sorting
    constraints.push(orderBy(sortBy, sortDirection));
    
    // Add limit
    constraints.push(limit(pageSize));
    
    // Add pagination if lastVisible is provided
    if (lastVisible) {
      constraints.push(startAfter(lastVisible));
    }
    
    // Create and execute query
    const collectionRef = getCollection(collectionName);
    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);
    
    // Extract data from snapshot
    const documents = [];
    querySnapshot.forEach(doc => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    
    // Get last visible document for pagination
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return {
      documents,
      lastVisible: lastDoc,
      hasMore: documents.length === pageSize
    };
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * More flexible query function with multiple orderBy fields
 * @param {string} collectionName - Collection name
 * @param {Array} filters - Array of filter objects [{ field, operator, value }]
 * @param {Array} [orderByFields] - Fields to order by [{ field, direction }]
 * @param {number} [limitCount] - Maximum number of documents to return
 * @returns {Promise<Array>} Array of document data
 */
export const queryDocumentsAdvanced = async (
  collectionName, 
  filters = [], 
  orderByFields = [], 
  limitCount = null
) => {
  try {
    const collectionRef = getCollection(collectionName);
    
    // Create base query
    let baseQuery = query(collectionRef);
    
    // Add filters
    filters.forEach(filter => {
      baseQuery = query(baseQuery, where(filter.field, filter.operator, filter.value));
    });
    
    // Add ordering
    orderByFields.forEach(({ field, direction }) => {
      baseQuery = query(baseQuery, orderBy(field, direction));
    });
    
    // Add limit if specified
    if (limitCount) {
      baseQuery = query(baseQuery, limit(limitCount));
    }
    
    // Execute query
    const querySnapshot = await getDocs(baseQuery);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get documents with pagination
 * @param {string} collectionName - Collection name
 * @param {number} pageSize - Number of documents per page
 * @param {Object} [lastDoc] - Last document from previous page
 * @param {Array} [orderByFields] - Fields to order by [{ field, direction }]
 * @returns {Promise<Object>} { documents, lastDoc, hasMore }
 */
export const getDocumentsWithPagination = async (
  collectionName, 
  pageSize, 
  lastDoc = null, 
  orderByFields = [{ field: 'createdAt', direction: 'desc' }]
) => {
  try {
    const collectionRef = getCollection(collectionName);
    
    // Create base query with ordering
    let baseQuery = query(collectionRef);
    
    // Add ordering
    orderByFields.forEach(({ field, direction }) => {
      baseQuery = query(baseQuery, orderBy(field, direction));
    });
    
    // Add pagination
    let paginatedQuery;
    if (lastDoc) {
      paginatedQuery = query(baseQuery, startAfter(lastDoc), limit(pageSize));
    } else {
      paginatedQuery = query(baseQuery, limit(pageSize));
    }
    
    // Execute query
    const querySnapshot = await getDocs(paginatedQuery);
    
    // Prepare results
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Get last document for next pagination
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    // Check if there are more documents
    const nextQuery = query(
      baseQuery, 
      startAfter(lastVisible), 
      limit(1)
    );
    const nextSnapshot = await getDocs(nextQuery);
    const hasMore = !nextSnapshot.empty;
    
    return {
      documents,
      lastDoc: lastVisible,
      hasMore
    };
  } catch (error) {
    console.error(`Error getting documents with pagination from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Count documents in a collection or query
 * @param {string} collectionName - Collection name
 * @param {Array} [filters] - Optional filters [{ field, operator, value }]
 * @returns {Promise<number>} Document count
 */
export const countDocuments = async (collectionName, filters = []) => {
  try {
    const collectionRef = getCollection(collectionName);
    
    // Create base query
    let baseQuery = query(collectionRef);
    
    // Add filters if specified
    filters.forEach(filter => {
      baseQuery = query(baseQuery, where(filter.field, filter.operator, filter.value));
    });
    
    // Get count
    const snapshot = await getCountFromServer(baseQuery);
    return snapshot.data().count;
  } catch (error) {
    console.error(`Error counting documents in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get documents where field matches any value in array
 * @param {string} collectionName - Collection name
 * @param {string} field - Field to match
 * @param {Array} values - Array of values to match
 * @returns {Promise<Array>} Array of document data
 */
export const getDocumentsWhereIn = async (collectionName, field, values) => {
  try {
    // Firestore has a limit of 10 values for in queries, so we need to batch
    const batchSize = 10;
    const batches = [];
    
    // Split values into batches of 10
    for (let i = 0; i < values.length; i += batchSize) {
      const batch = values.slice(i, i + batchSize);
      batches.push(batch);
    }
    
    // Execute each batch query and combine results
    const results = [];
    for (const batch of batches) {
      const collectionRef = getCollection(collectionName);
      const q = query(collectionRef, where(field, 'in', batch));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.docs.forEach(doc => {
        results.push({
          id: doc.id,
          ...doc.data()
        });
      });
    }
    
    return results;
  } catch (error) {
    console.error(`Error getting documents where field is in values from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get documents by their IDs
 * @param {string} collectionName - Collection name
 * @param {Array} ids - Array of document IDs
 * @returns {Promise<Array>} Array of document data
 */
export const getDocumentsByIds = async (collectionName, ids) => {
  return getDocumentsWhereIn(collectionName, documentId(), ids);
};

// ===== SPECIALIZED OPERATIONS =====

/**
 * Increment a numeric field in a document
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {string} field - Field to increment
 * @param {number} value - Increment amount
 * @returns {Promise<boolean>} Success status
 */
export const incrementField = async (collectionName, docId, field, value = 1) => {
  try {
    const docRef = getDocRef(collectionName, docId);
    await updateDoc(docRef, {
      [field]: increment(value),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Error incrementing field in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Add item to an array field
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {string} field - Array field name
 * @param {any} item - Item to add
 * @returns {Promise<boolean>} Success status
 */
export const addToArray = async (collectionName, docId, field, item) => {
  try {
    const docRef = getDocRef(collectionName, docId);
    await updateDoc(docRef, {
      [field]: arrayUnion(item),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Error adding to array in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Remove item from an array field
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {string} field - Array field name
 * @param {any} item - Item to remove
 * @returns {Promise<boolean>} Success status
 */
export const removeFromArray = async (collectionName, docId, field, item) => {
  try {
    const docRef = getDocRef(collectionName, docId);
    await updateDoc(docRef, {
      [field]: arrayRemove(item),
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error(`Error removing from array in ${collectionName}:`, error);
    throw error;
  }
};

// ===== BATCH & TRANSACTION OPERATIONS =====

/**
 * Execute multiple write operations as a batch
 * @param {Array} operations - Array of operation objects
 * @returns {Promise<boolean>} Success status
 * 
 * Each operation should have:
 * - type: 'create', 'update', 'delete', 'set'
 * - collection: collection name
 * - id: document ID
 * - data: document data (for create, update, set)
 */
export const executeBatch = async (operations) => {
  try {
    const batch = writeBatch(db);
    
    operations.forEach(operation => {
      const docRef = getDocRef(operation.collection, operation.id);
      
      switch (operation.type) {
        case 'create':
          batch.set(docRef, {
            ...operation.data,
            id: operation.id,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          break;
        case 'update':
          batch.update(docRef, {
            ...operation.data,
            updatedAt: serverTimestamp()
          });
          break;
        case 'set':
          batch.set(docRef, operation.data);
          break;
        case 'delete':
          batch.delete(docRef);
          break;
        default:
          throw new Error(`Unknown batch operation type: ${operation.type}`);
      }
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error executing batch operations:', error);
    throw error;
  }
};

/**
 * Alias for executeBatch to maintain compatibility with existing code
 * @param {Array} updates - Array of update operations
 * @returns {Promise<boolean>} Success status
 */
export const batchUpdate = async (updates) => {
  return executeBatch(updates);
};

/**
 * Execute multiple operations in a transaction
 * @param {Function} transactionCallback - Function to execute within transaction
 * @returns {Promise<any>} Transaction result
 * 
 * The transactionCallback receives a transaction object and returns a result.
 * Example: (transaction) => {
 *   const docRef = getDocRef('users', 'user123');
 *   return transaction.get(docRef).then((doc) => {
 *     // Perform operations with transaction
 *     transaction.update(docRef, { balance: doc.data().balance + 100 });
 *     return 'success';
 *   });
 * }
 */
export const executeTransaction = async (transactionCallback) => {
  try {
    return await runTransaction(db, transactionCallback);
  } catch (error) {
    console.error('Error executing transaction:', error);
    throw error;
  }
};

// ===== REAL-TIME LISTENERS =====

/**
 * Subscribe to a document's changes
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {Function} callback - Callback function to handle updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToDocument = (collectionName, docId, callback) => {
  const docRef = getDocRef(collectionName, docId);
  
  return onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({
        id: doc.id,
        ...doc.data()
      });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error(`Error subscribing to document in ${collectionName}:`, error);
  });
};

/**
 * Subscribe to a query's changes
 * @param {string} collectionName - Collection name
 * @param {Array} filters - Array of filter objects [{ field, operator, value }]
 * @param {Array} [orderByFields] - Fields to order by [{ field, direction }]
 * @param {number} [limitCount] - Maximum number of documents to return
 * @param {Function} callback - Callback function to handle updates
 * @returns {Function} Unsubscribe function
 */
export const subscribeToQuery = (
  collectionName, 
  filters = [], 
  orderByFields = [], 
  limitCount = null, 
  callback
) => {
  const collectionRef = getCollection(collectionName);
  
  // Create base query
  let baseQuery = query(collectionRef);
  
  // Add filters
  filters.forEach(filter => {
    baseQuery = query(baseQuery, where(filter.field, filter.operator, filter.value));
  });
  
  // Add ordering
  orderByFields.forEach(({ field, direction }) => {
    baseQuery = query(baseQuery, orderBy(field, direction));
  });
  
  // Add limit if specified
  if (limitCount) {
    baseQuery = query(baseQuery, limit(limitCount));
  }
  
  // Set up listener
  return onSnapshot(baseQuery, (querySnapshot) => {
    const documents = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(documents);
  }, (error) => {
    console.error(`Error subscribing to query in ${collectionName}:`, error);
  });
};

// ===== DATE & TIMESTAMP UTILITIES =====

/**
 * Convert Firestore timestamp to Date
 * @param {Timestamp|any} timestamp - Firestore timestamp
 * @returns {Date|null} JavaScript Date or null
 */
export const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

/**
 * Convert Date to Firestore timestamp
 * @param {Date|any} date - JavaScript Date
 * @returns {Timestamp|null} Firestore timestamp or null
 */
export const dateToTimestamp = (date) => {
  if (!date) return null;
  if (date instanceof Date) {
    return Timestamp.fromDate(date);
  }
  return date;
};

// ===== ID GENERATORS =====

/**
 * Generate a unique document ID
 * @returns {string} UUID v4
 */
export const generateId = () => {
  return uuidv4();
};

/**
 * Generate a slug from a string
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
export const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/&/g, '-and-')      // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')    // Remove all non-word characters
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '')          // Trim - from end of text
    + '-' + Math.floor(Math.random() * 1000); // Add random number for uniqueness
};

// ===== COLLECTION NAMES =====

/**
 * Collection names used in the application
 * @type {Object}
 */
export const COLLECTIONS = {
  USERS: 'users',
  LISTINGS: 'listings',
  PLANS: 'plans',
  SUBSCRIPTIONS: 'subscriptions',
  REVIEWS: 'reviews',
  MESSAGES: 'messages',
  CHATROOMS: 'chatrooms',
  CATEGORIES: 'categories',
  TRANSACTIONS: 'transactions',
  NOTIFICATIONS: 'notifications',
  ANALYTICS: 'analytics',
  REPORTS: 'reports',
  SETTINGS: 'settings',
  LOGS: 'logs'
};

// Export all functions
export default {
  // Collection references
  getCollection,
  getDocRef,
  getSubcollection,
  
  // Document operations
  createDocument,
  createDocumentWithId,
  getDocument,
  updateDocument,
  deleteDocument,
  softDeleteDocument,
  upsertDocument,
  
  // Query operations
  getAllDocuments,
  queryDocuments,
  queryDocumentsAdvanced,
  getDocumentsWithPagination,
  countDocuments,
  getDocumentsWhereIn,
  getDocumentsByIds,
  
  // Specialized operations
  incrementField,
  addToArray,
  removeFromArray,
  
  // Batch & transaction operations
  executeBatch,
  batchUpdate,
  executeTransaction,
  
  // Real-time listeners
  subscribeToDocument,
  subscribeToQuery,
  
  // Date & timestamp utilities
  timestampToDate,
  dateToTimestamp,
  
  // ID generators
  generateId,
  generateSlug,
  
  // Collection names
  COLLECTIONS
};