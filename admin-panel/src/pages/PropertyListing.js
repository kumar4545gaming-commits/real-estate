
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import PropertyForm from '../components/PropertyForm';

const PropertyListing = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [deletingProperty, setDeletingProperty] = useState(null);

  // Helper function to get images from property
  const getPropertyImages = (property) => {
    return property.images || property.propertyImages || [];
  };

  // Function to delete a property
  const handleDeleteProperty = async (property) => {
    if (!window.confirm(`Are you sure you want to delete "${property.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingProperty(property.id);
      console.log('Deleting property:', property.id);
      
      await deleteDoc(doc(db, 'properties', property.id));
      console.log('Property deleted successfully');
      
      // Remove from local state
      setProperties(prev => prev.filter(p => p.id !== property.id));
      
      // Close modal if it was open
      if (selectedProperty && selectedProperty.id === property.id) {
        setSelectedProperty(null);
      }
      
      alert(`✅ Property "${property.name}" has been deleted successfully!`);
      
    } catch (error) {
      console.error('Error deleting property:', error);
      alert(`❌ Failed to delete property: ${error.message}`);
    } finally {
      setDeletingProperty(null);
    }
  };

  // Function to edit a property
  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setShowPropertyForm(true);
  };

  // Function to load properties (can be called externally)
  const loadProperties = async (isRefresh = false) => {
    try {
      console.log('Loading properties from Firestore...');
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Get all properties from Firestore
      const propertiesRef = collection(db, 'properties');
      const propertiesQuery = query(propertiesRef, orderBy('createdAt', 'desc'));
      const propertiesSnapshot = await getDocs(propertiesQuery);
      
      const allProperties = [];
      propertiesSnapshot.forEach((doc) => {
        const propertyData = { id: doc.id, ...doc.data() };
        allProperties.push(propertyData);
      });

      setProperties(allProperties);
      console.log('Loaded properties from Firestore:', allProperties.length);
      if (allProperties.length > 0) {
        console.log('Sample property data:', allProperties[0]); // Debug: show first property data
        console.log('Sample property images:', allProperties[0].images); // Debug: show images
        console.log('All property keys:', Object.keys(allProperties[0])); // Debug: show all keys
      }
      setLoading(false);
      setRefreshing(false);

    } catch (error) {
      console.error('Error loading properties from Firestore:', error);
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load properties from Firestore
  useEffect(() => {
    loadProperties();
  }, []);

  // Refresh properties when component becomes visible (navigation back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadProperties();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (loading) {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-4xl mb-4">🔄</div>
              <div className="text-lg text-gray-600">Loading properties...</div>
            </div>
          </div>
        );
      }

      if (properties.length === 0) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="text-center">
                <div className="text-6xl mb-6">🏢</div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">No Properties Found</h2>
                <p className="text-xl text-gray-600 mb-8">
                  There are currently no properties available. Add new properties through the admin panel.
                </p>
                <div className="flex flex-col items-center gap-4">
                  {/* Property Form Modal */}
                  {showPropertyForm && (
                    <PropertyForm
                      onClose={() => {
                        setShowPropertyForm(false);
                        setEditingProperty(null);
                      }}
                      editingProperty={editingProperty}
                      onSuccess={(property) => {
                        console.log('Property added successfully:', property);
                        setShowPropertyForm(false);
                        setEditingProperty(null);
                        // Refresh the properties list
                        loadProperties(true);
                        // Show success message
                        setTimeout(() => {
                          alert(`✅ Property "${property.name}" has been added successfully!\n\nYou can see it in the properties list below.`);
                        }, 500);
                      }}
                    />
                  )}
                  
                  <button 
                    onClick={() => setShowPropertyForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🏢 Add New Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Property Management
              {refreshing && <span className="ml-2 text-blue-600">(Refreshing...)</span>}
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => loadProperties(true)}
                disabled={refreshing}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
              </button>
              <button
                onClick={() => {
                  console.log('All Properties:', properties);
                  properties.forEach((prop, index) => {
                    console.log(`Property ${index}:`, prop);
                    console.log(`Property ${index} images:`, getPropertyImages(prop));
                  });
                }}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
              >
                🔍 Debug Data
              </button>
              <button
                onClick={() => setShowPropertyForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                ➕ Add Property
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Property Listings */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Available Properties</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {properties.map((property, index) => (
              <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row">
                  {/* Left Side - Property Image */}
                  <div className="lg:w-1/2">
                    {getPropertyImages(property).length > 0 ? (
                      <div className="relative h-48 lg:h-full">
                        <img
                          src={getPropertyImages(property)[0]}
                          alt={property.name}
                          className="w-full h-full object-cover"
                        />
                        {getPropertyImages(property).length > 1 && (
                          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                            +{getPropertyImages(property).length - 1} more
                          </div>
                        )}
                      </div>
                    ) : (
                    <div className="relative h-48 lg:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-4xl mb-2">🏢</div>
                          <div className="text-sm font-medium">No Image</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Side - Property Info & Description */}
                  <div className="lg:w-1/2 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{property.name}</h3>
                    <p className="text-gray-600 mb-4">{property.location}</p>

                    {/* Property Details */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Developer:</span>
                        <span className="text-sm font-medium">{property.developer}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className="text-sm font-medium text-green-600">{property.status}</span>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-500">Price:</span>
                        <span className="text-sm font-medium text-blue-600">{property.priceRange}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedProperty(property)}
                        className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                      >
                        Read More
                      </button>
                      
                      {/* Admin Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProperty(property)}
                          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm"
                          title="Edit Property"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property)}
                          disabled={deletingProperty === property.id}
                          className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors text-sm disabled:opacity-50"
                          title="Delete Property"
                        >
                          {deletingProperty === property.id ? '🗑️ Deleting...' : '🗑️ Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">We're Here to Help You Find Your Perfect Property</h2>
          <p className="text-xl mb-6 text-blue-100">
            Contact us for more information about our properties
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Enquire Now
            </button>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              WhatsApp
            </button>
            <button className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors">
              Call Now
            </button>
          </div>
        </div>
      </div>

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedProperty.name}</h2>
                  <p className="text-blue-100">{selectedProperty.location}</p>
                </div>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-white hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Property Images */}
              <div className="mb-6">
                {/* Debug info - remove this later */}
                {console.log('Selected Property Images:', getPropertyImages(selectedProperty))}
                {console.log('Selected Property Keys:', Object.keys(selectedProperty))}
                {getPropertyImages(selectedProperty).length > 0 && (
                  <div style={{ padding: '10px', backgroundColor: '#f0f9ff', borderRadius: '5px', marginBottom: '10px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#1e40af' }}>
                      🔍 Debug: Found {getPropertyImages(selectedProperty).length} images
                    </p>
                    {getPropertyImages(selectedProperty).map((url, index) => (
                      <p key={index} style={{ margin: '5px 0 0 0', fontSize: '10px', color: '#64748b', wordBreak: 'break-all' }}>
                        Image {index + 1}: {url}
                      </p>
                    ))}
                  </div>
                )}
                {getPropertyImages(selectedProperty).length > 0 ? (
                  <div className="space-y-4">
                    <div className="relative h-64 rounded-lg overflow-hidden">
                      <img
                        src={getPropertyImages(selectedProperty)[0]}
                        alt={selectedProperty.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {getPropertyImages(selectedProperty).length > 1 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {getPropertyImages(selectedProperty).slice(1).map((image, index) => (
                          <div key={index} className="relative h-24 rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt={`${selectedProperty.name} ${index + 2}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">🏢</div>
                      <div className="text-lg font-medium">No Images Available</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Developer:</span>
                      <span className="font-medium">{selectedProperty.developer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Land Area:</span>
                      <span className="font-medium">{selectedProperty.landArea}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Units:</span>
                      <span className="font-medium">{selectedProperty.totalUnits}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Towers:</span>
                      <span className="font-medium">{selectedProperty.towers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600">{selectedProperty.status}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price Range:</span>
                      <span className="font-medium text-blue-600">{selectedProperty.priceRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Possession:</span>
                      <span className="font-medium">{selectedProperty.possessionStatus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="font-medium text-yellow-600">{selectedProperty.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Unit Types */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Unit Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProperty.unitTypes?.map((unit, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <span className="text-gray-700">{unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedProperty.amenities?.map((amenity, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg">
                      <span className="text-blue-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {/* Admin Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedProperty(null);
                      handleEditProperty(selectedProperty);
                    }}
                    className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    ✏️ Edit Property
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProperty(null);
                      handleDeleteProperty(selectedProperty);
                    }}
                    disabled={deletingProperty === selectedProperty.id}
                    className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {deletingProperty === selectedProperty.id ? '🗑️ Deleting...' : '🗑️ Delete Property'}
                  </button>
                </div>
                
                {/* Customer Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
                    Enquire Now
                  </button>
                  <button className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    WhatsApp
                  </button>
                  <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Call Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Add Property Button */}
      <button
        onClick={() => setShowPropertyForm(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-110 z-40"
        title="Add New Property"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* Property Form Modal */}
      {showPropertyForm && (
        <PropertyForm
          onClose={() => {
            setShowPropertyForm(false);
            setEditingProperty(null);
          }}
          editingProperty={editingProperty}
          onSuccess={(property) => {
            console.log('Property saved successfully:', property);
            setShowPropertyForm(false);
            setEditingProperty(null);
            // Refresh the properties list with visual feedback
            loadProperties(true);
            // Show success message
            setTimeout(() => {
              const action = editingProperty ? 'updated' : 'added';
              alert(`✅ Property "${property.name}" has been ${action} successfully!\n\nYou can see it in the properties list below.`);
            }, 500);
          }}
        />
      )}
    </div>
  );
};

export default PropertyListing;