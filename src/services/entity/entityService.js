import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  increment
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";

// Create a new entity
export const createEntity = async (entity) => {
  try {
    // Add generic entity fields
    const newEntity = {
      ...entity,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isListed: true,
      isVerified: false, // Will be set based on plan after payment
      isFeatured: false, // Will be set based on plan after payment
      viewsCount: 0,
      connectsCount: 0
    };
    
    // Calculate listing expiration based on plan
    // This is a simplified example - in a real app you'd use the plan service
    const expirationDays = {
      basic: 30,
      advance: 90,
      premium: 180,
      platinum: 365
    };
    
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + (expirationDays[entity.planType] || 30));
    
    // Add expiration date
    newEntity.listingExpiresAt = expirationDate;
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, 'entities'), newEntity);
    
    // Update user's entity count
    const userRef = doc(db, 'users', entity.userId);
    await updateDoc(userRef, {
      [`entityCount.${entity.entityType}`]: increment(1)
    });
    
    // Return the created entity with id
    return {
      id: docRef.id,
      ...newEntity
    };
  } catch (error) {
    console.error("Error creating entity:", error);
    throw error;
  }
};

// Get entity by ID
export const getEntityById = async (entityId) => {
  try {
    const docRef = doc(db, 'entities', entityId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error getting entity:", error);
    throw error;
  }
};

// Update entity
export const updateEntity = async (entityId, data) => {
  try {
    const docRef = doc(db, 'entities', entityId);
    
    // Update the entity with new data
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    
    // Get updated entity
    const updatedDoc = await getDoc(docRef);
    
    if (updatedDoc.exists()) {
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error updating entity:", error);
    throw error;
  }
};

// Delete entity
export const deleteEntity = async (entityId, userId) => {
  try {
    // Get entity to check type before deletion
    const entityDoc = await getDoc(doc(db, 'entities', entityId));
    
    if (!entityDoc.exists()) {
      throw new Error("Entity not found");
    }
    
    const entity = entityDoc.data();
    
    // Check if user is the owner
    if (entity.userId !== userId) {
      throw new Error("You don't have permission to delete this entity");
    }
    
    // Delete the entity
    await deleteDoc(doc(db, 'entities', entityId));
    
    // Update user's entity count
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      [`entityCount.${entity.entityType}`]: increment(-1)
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting entity:", error);
    throw error;
  }
};

// Get all entities by user ID
export const getEntitiesByUserId = async (userId) => {
  try {
    const q = query(
      collection(db, 'entities'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const entities = [];
    
    querySnapshot.forEach((doc) => {
      entities.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return entities;
  } catch (error) {
    console.error("Error getting user entities:", error);
    throw error;
  }
};

// Get all entities by type
export const getEntitiesByType = async (
  entityType, 
  lastDoc, 
  limitCount = 10,
  filters = {}
) => {
  try {
    let q = query(
      collection(db, 'entities'),
      where('entityType', '==', entityType),
      where('isListed', '==', true)
    );
    
    // Add filters if provided
    if (filters) {
      if (filters.featured !== undefined) {
        q = query(q, where('isFeatured', '==', filters.featured));
      }
      
      if (filters.industry) {
        q = query(q, where('industries', 'array-contains', filters.industry));
      }
      
      if (filters.planType) {
        q = query(q, where('planType', '==', filters.planType));
      }
    }
    
    // Add sorting and pagination
    q = query(q, orderBy('isFeatured', 'desc'), orderBy('createdAt', 'desc'));
    
    if (lastDoc) {
      q = query(q, startAfter(lastDoc), limit(limitCount));
    } else {
      q = query(q, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(q);
    const entities = [];
    
    querySnapshot.forEach((doc) => {
      entities.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Get the last document for pagination
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    return {
      entities,
      lastVisible
    };
  } catch (error) {
    console.error(`Error getting ${entityType} entities:`, error);
    throw error;
  }
};

// Upload an image (logo or cover) for an entity
export const uploadEntityImage = async (
  entityId, 
  imageFile, 
  imageType
) => {
  try {
    const imageRef = ref(storage, `entities/${entityId}/${imageType}_${Date.now()}`);
    
    // Upload the file
    await uploadBytes(imageRef, imageFile);
    
    // Get download URL
    const downloadURL = await getDownloadURL(imageRef);
    
    // Update entity with new image URL
    const docRef = doc(db, 'entities', entityId);
    
    if (imageType === 'logo') {
      await updateDoc(docRef, {
        logo: downloadURL,
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(docRef, {
        coverImage: downloadURL,
        updatedAt: serverTimestamp()
      });
    }
    
    return downloadURL;
  } catch (error) {
    console.error(`Error uploading ${imageType} image:`, error);
    throw error;
  }
};

// Upload a document for an entity
export const uploadEntityDocument = async (
  entityId,
  documentFile,
  documentType,
  entityType
) => {
  try {
    const docRef = ref(storage, `entities/${entityId}/documents/${documentType}_${Date.now()}`);
    
    // Upload the file
    await uploadBytes(docRef, documentFile);
    
    // Get download URL
    const downloadURL = await getDownloadURL(docRef);
    
    // Update entity with new document URL
    const entityRef = doc(db, 'entities', entityId);
    const entityDoc = await getDoc(entityRef);
    
    if (entityDoc.exists()) {
      const entity = entityDoc.data();
      
      // Handle different document structures based on entity type
      let documents = entity.documents || {};
      
      if (entityType === 'business' || entityType === 'franchise' || entityType === 'startup' || entityType === 'digitalAsset') {
        // These entity types have document arrays
        if (!documents[documentType]) {
          documents[documentType] = [];
        }
        
        documents[documentType].push(downloadURL);
      } else {
        // For other entity types or single document fields
        documents[documentType] = downloadURL;
      }
      
      await updateDoc(entityRef, {
        documents,
        updatedAt: serverTimestamp()
      });
    }
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
};

// Track entity view
export const trackEntityView = async (entityId) => {
  try {
    const docRef = doc(db, 'entities', entityId);
    
    await updateDoc(docRef, {
      viewsCount: increment(1)
    });
    
    return true;
  } catch (error) {
    console.error("Error tracking entity view:", error);
    return false;
  }
};

// Update entity plan
export const updateEntityPlan = async (
  entityId, 
  newPlanType
) => {
  try {
    const docRef = doc(db, 'entities', entityId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error("Entity not found");
    }
    
    const entity = docSnap.data();
    const oldPlanType = entity.planType;
    
    // Define plan features based on plan type 
    // In a real app, this would come from your plan service
    const planFeatures = {
      basic: { featuredListing: false, verifiedBadge: false, expirationDays: 30 },
      advance: { featuredListing: true, verifiedBadge: false, expirationDays: 90 },
      premium: { featuredListing: true, verifiedBadge: true, expirationDays: 180 },
      platinum: { featuredListing: true, verifiedBadge: true, expirationDays: 365 }
    };
    
    const planDetails = planFeatures[newPlanType] || planFeatures.basic;
    
    // Calculate new expiration date
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + planDetails.expirationDays);
    
    // Update entity with new plan details
    await updateDoc(docRef, {
      planType: newPlanType,
      isFeatured: planDetails.featuredListing,
      isVerified: planDetails.verifiedBadge,
      listingExpiresAt: expirationDate,
      updatedAt: serverTimestamp()
    });
    
    return {
      entityId,
      oldPlanType,
      newPlanType,
      expiresAt: expirationDate
    };
  } catch (error) {
    console.error("Error updating entity plan:", error);
    throw error;
  }
};

// Connect with an entity
export const connectWithEntity = async (
  userId,
  entityId
) => {
  try {
    // Check if user has available connects
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      throw new Error("User not found");
    }
    
    const userData = userSnap.data();
    
    if (userData.connectBalance <= 0) {
      throw new Error("You don't have enough connects. Please upgrade your plan.");
    }
    
    // Create connection record
    const connectionData = {
      userId,
      entityId,
      createdAt: serverTimestamp(),
      status: 'pending' // pending, accepted, rejected
    };
    
    const connectionRef = await addDoc(collection(db, 'connections'), connectionData);
    
    // Decrement user's connect balance
    await updateDoc(userRef, {
      connectBalance: increment(-1)
    });
    
    // Increment entity's connects count
    const entityRef = doc(db, 'entities', entityId);
    await updateDoc(entityRef, {
      connectsCount: increment(1)
    });
    
    return {
      connectionId: connectionRef.id,
      ...connectionData
    };
  } catch (error) {
    console.error("Error connecting with entity:", error);
    throw error;
  }
};