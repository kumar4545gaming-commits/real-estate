// Property synchronization between admin panel and main app
// This uses localStorage to share data between the two applications

const STORAGE_KEY = 'real_estate_properties';

// Get properties from localStorage
export const getStoredProperties = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading properties from localStorage:', error);
  }
  return [];
};

// Save properties to localStorage
export const saveProperties = (properties) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    console.log('Properties saved to localStorage:', properties.length);
  } catch (error) {
    console.error('Error saving properties to localStorage:', error);
  }
};

// Add a new property
export const addProperty = (property) => {
  const properties = getStoredProperties();
  const newProperty = {
    ...property,
    id: property.id || `property-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const updatedProperties = [...properties, newProperty];
  saveProperties(updatedProperties);
  return newProperty;
};

// Update an existing property
export const updateProperty = (id, updates) => {
  const properties = getStoredProperties();
  const updatedProperties = properties.map(property => 
    property.id === id 
      ? { ...property, ...updates, updatedAt: new Date() }
      : property
  );
  saveProperties(updatedProperties);
  return updatedProperties.find(p => p.id === id);
};

// Delete a property
export const deleteProperty = (id) => {
  const properties = getStoredProperties();
  const updatedProperties = properties.filter(property => property.id !== id);
  saveProperties(updatedProperties);
  return updatedProperties;
};

// Get featured properties
export const getStoredFeaturedProperties = () => {
  const properties = getStoredProperties();
  return properties.filter(property => property.isFeatured);
};

// Clear duplicates and keep only unique properties
export const removeDuplicates = (properties) => {
  return properties.filter((property, index, self) => 
    index === self.findIndex(p => p.name === property.name && p.location === property.location)
  );
};

// Clear all properties from localStorage
export const clearAllProperties = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('All properties cleared from localStorage');
  } catch (error) {
    console.error('Error clearing properties from localStorage:', error);
  }
};

// Initialize with empty data
export const initializeProperties = () => {
  const properties = getStoredProperties();
  if (properties.length === 0) {
    // Return empty array - no default properties
    saveProperties([]);
    return [];
  }
  return properties;
};
