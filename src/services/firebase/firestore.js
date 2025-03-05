import {
    doc,
    collection,
    getDocs,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    serverTimestamp,
    Timestamp,
    increment
  } from 'firebase/firestore';
  import { db } from './config';
  
  /**
   * Generic Firestore service with CRUD operations
   */
  
  // Create a document with a specific ID
  export const createDocumentWithId = async (collectionName, docId, data) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const timestamp = serverTimestamp();
      await setDoc(docRef, {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp
      });
      return docId;
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error);
      throw error;
    }
  };
  
  // Create a document with auto-generated ID
  export const createDocument = async (collectionName, data) => {
    try {
      const collectionRef = collection(db, collectionName);
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
  
  // Get a document by ID
  export const getDocument = async (collectionName, docId) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  };
  
  // Update a document
  export const updateDocument = async (collectionName, docId, data) => {
    try {
      const docRef = doc(db, collectionName, docId);
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
  
  // Delete a document
  export const deleteDocument = async (collectionName, docId) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  };
  
  // Query documents with filtering and pagination
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
      const collectionRef = collection(db, collectionName);
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
  
  // Get all documents from a collection (use with caution for small collections only)
  export const getAllDocuments = async (collectionName) => {
    try {
      const collectionRef = collection(db, collectionName);
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
  
  // Transaction utilities
  export const batchUpdate = async (updates) => {
    // This would implement batch updates when needed
    // For complex transactions, a custom solution would be implemented here
  };
  
  // Increment a numeric field
  export const incrementField = async (collectionName, docId, field, value = 1) => {
    try {
      const docRef = doc(db, collectionName, docId);
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
  
  // Convert firestore timestamp to Date
  export const timestampToDate = (timestamp) => {
    if (!timestamp) return null;
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return timestamp;
  };
  
  // Convert Date to firestore timestamp
  export const dateToTimestamp = (date) => {
    if (!date) return null;
    if (date instanceof Date) {
      return Timestamp.fromDate(date);
    }
    return date;
  };