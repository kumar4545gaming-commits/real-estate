import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  orderBy, 
  where,
  onSnapshot
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';

const PropertyContext = createContext();

export const useProperties = () => {
  return useContext(PropertyContext);
};

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    featured: 0,
    sold: 0
  });

  // Get all properties
  const getProperties = async () => {
    try {
      const propertiesRef = collection(db, 'properties');
      const q = query(propertiesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const propertiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProperties(propertiesData);
      updateStats(propertiesData);
      setLoading(false);
    } catch (error) {
      console.error('Error getting properties:', error);
      setLoading(false);
    }
  };

  // Get single property
  const getProperty = async (id) => {
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

  // Add new property
  const addProperty = async (propertyData, images) => {
    try {
      // Upload images to Firebase Storage
      const imageUrls = await uploadImages(images);
      
      const propertyWithImages = {
        ...propertyData,
        images: imageUrls,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'properties'), propertyWithImages);
      return docRef.id;
    } catch (error) {
      console.error('Error adding property:', error);
      throw error;
    }
  };

  // Update property
  const updateProperty = async (id, propertyData, newImages = []) => {
    try {
      const propertyRef = doc(db, 'properties', id);
      
      let updateData = {
        ...propertyData,
        updatedAt: new Date()
      };

      // If new images are provided, upload them
      if (newImages.length > 0) {
        const imageUrls = await uploadImages(newImages);
        updateData.images = [...(propertyData.images || []), ...imageUrls];
      }

      await updateDoc(propertyRef, updateData);
    } catch (error) {
      console.error('Error updating property:', error);
      throw error;
    }
  };

  // Delete property
  const deleteProperty = async (id) => {
    try {
      // Get property to delete associated images
      const property = await getProperty(id);
      if (property && property.images) {
        // Delete images from storage
        for (const image of property.images) {
          try {
            const imageRef = ref(storage, image.url);
            await deleteObject(imageRef);
          } catch (error) {
            console.error('Error deleting image:', error);
          }
        }
      }

      await deleteDoc(doc(db, 'properties', id));
    } catch (error) {
      console.error('Error deleting property:', error);
      throw error;
    }
  };

  // Upload images to Firebase Storage
  const uploadImages = async (images) => {
    const uploadPromises = images.map(async (image) => {
      const imageRef = ref(storage, `properties/${Date.now()}_${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return {
        url: downloadURL,
        alt: image.name,
        isPrimary: false
      };
    });

    return Promise.all(uploadPromises);
  };

  // Update statistics
  const updateStats = (propertiesData) => {
    const stats = {
      total: propertiesData.length,
      active: propertiesData.filter(p => p.isActive).length,
      featured: propertiesData.filter(p => p.isFeatured).length,
      sold: propertiesData.filter(p => p.status === 'sold').length
    };
    setStats(stats);
  };

  // Real-time listener for properties
  useEffect(() => {
    const propertiesRef = collection(db, 'properties');
    const q = query(propertiesRef, orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const propertiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProperties(propertiesData);
      updateStats(propertiesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    properties,
    loading,
    stats,
    getProperties,
    getProperty,
    addProperty,
    updateProperty,
    deleteProperty,
    uploadImages
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};
