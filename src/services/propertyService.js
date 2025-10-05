import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';

// Get all properties
export const getProperties = async () => {
  try {
    const propertiesRef = collection(db, 'properties');
    const q = query(
      propertiesRef, 
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting properties:', error);
    return [];
  }
};

// Get featured properties
export const getFeaturedProperties = async () => {
  try {
    const propertiesRef = collection(db, 'properties');
    const q = query(
      propertiesRef, 
      where('isActive', '==', true),
      where('isFeatured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(6)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting featured properties:', error);
    return [];
  }
};

// Get properties by type
export const getPropertiesByType = async (type) => {
  try {
    const propertiesRef = collection(db, 'properties');
    const q = query(
      propertiesRef, 
      where('isActive', '==', true),
      where('propertyType', '==', type),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting properties by type:', error);
    return [];
  }
};

// Get single property
export const getProperty = async (id) => {
  try {
    const propertyDoc = await getDoc(doc(db, 'properties', id));
    if (propertyDoc.exists()) {
      return { id: propertyDoc.id, ...propertyDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting property:', error);
    return null;
  }
};

// Real-time listener for properties
export const subscribeToProperties = (callback) => {
  const propertiesRef = collection(db, 'properties');
  const q = query(
    propertiesRef, 
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const properties = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(properties);
  });
};

// Real-time listener for featured properties
export const subscribeToFeaturedProperties = (callback) => {
  const propertiesRef = collection(db, 'properties');
  const q = query(
    propertiesRef, 
    where('isActive', '==', true),
    where('isFeatured', '==', true),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const properties = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(properties);
  });
};
