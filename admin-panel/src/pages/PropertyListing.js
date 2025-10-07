import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import PropertyForm from '../components/PropertyForm';

const PropertyListing = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
                  <div style={{
                    backgroundColor: showPropertyForm ? 'green' : 'red',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}>
                    STATE: {showPropertyForm ? 'FORM OPEN' : 'FORM CLOSED'}
                  </div>
                  
                  {/* Comprehensive Property Form */}
                  {showPropertyForm && (
                    <div style={{
                      backgroundColor: 'white',
                      padding: '40px',
                      borderRadius: '15px',
                      border: '2px solid #e5e7eb',
                      margin: '20px 0',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      maxWidth: '1000px',
                      width: '100%'
                    }}>
                      <h2 style={{ marginBottom: '10px', color: '#1f2937', fontSize: '28px', fontWeight: 'bold', textAlign: 'center' }}>
                        Add New Property
                      </h2>
                      <p style={{ marginBottom: '30px', color: '#6b7280', textAlign: 'center', fontSize: '16px' }}>
                        Enter property details below
                      </p>
                      
                      <form style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        
                        {/* Basic Section */}
                        <div style={{ border: '2px solid #e5e7eb', borderRadius: '10px', padding: '25px' }}>
                          <h3 style={{ marginBottom: '20px', color: '#1f2937', fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
                            📋 Basic Information
                          </h3>
                          
                          {/* Property Images */}
                          <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', color: '#374151', fontSize: '16px' }}>
                              Property Images (Multiple Images)
                            </label>
                            <div style={{
                              border: '2px dashed #d1d5db',
                              borderRadius: '8px',
                              padding: '20px',
                              textAlign: 'center',
                              backgroundColor: '#f9fafb'
                            }}>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                style={{ width: '100%', marginBottom: '10px' }}
                              />
                              <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                                Select multiple images for the property
                              </p>
                            </div>
                          </div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                Project Name *
                              </label>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '12px',
                                  border: '2px solid #d1d5db',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  outline: 'none'
                                }}
                                placeholder="Enter project name"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                Location *
                              </label>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '12px',
                                  border: '2px solid #d1d5db',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  outline: 'none'
                                }}
                                placeholder="Enter location"
                              />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                Total Land Area *
                              </label>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '12px',
                                  border: '2px solid #d1d5db',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  outline: 'none'
                                }}
                                placeholder="e.g., 5 acres, 10,000 sq ft"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Dimensions Section */}
                        <div style={{ border: '2px solid #e5e7eb', borderRadius: '10px', padding: '25px' }}>
                          <h3 style={{ marginBottom: '20px', color: '#1f2937', fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
                            📐 Dimensions & Configuration
                          </h3>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                No of Units *
                              </label>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '12px',
                                  border: '2px solid #d1d5db',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  outline: 'none'
                                }}
                                placeholder="e.g., 500 units"
                              />
                            </div>
                            <div>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                Towers and Blocks *
                              </label>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '12px',
                                  border: '2px solid #d1d5db',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  outline: 'none'
                                }}
                                placeholder="e.g., 5 towers, 20 floors each"
                              />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                                Possession Time *
                              </label>
                              <input
                                type="text"
                                style={{
                                  width: '100%',
                                  padding: '12px',
                                  border: '2px solid #d1d5db',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  outline: 'none'
                                }}
                                placeholder="e.g., Dec 2025"
                              />
                            </div>
                          </div>

                          {/* Unit Variants Configuration */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                                Unit Variants Configuration (Up to 3 variants)
                              </h4>
                              <button
                                type="button"
                                style={{
                                  backgroundColor: '#3b82f6',
                                  color: 'white',
                                  padding: '8px 16px',
                                  borderRadius: '6px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  fontWeight: '600'
                                }}
                              >
                                + Add Variant
                              </button>
                            </div>
                            
                            {/* Variant 1 */}
                            <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '15px', border: '1px solid #e5e7eb' }}>
                              <h5 style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                                Variant 1
                              </h5>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                                <div>
                                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                                    Unit Type *
                                  </label>
                                  <input
                                    type="text"
                                    style={{
                                      width: '100%',
                                      padding: '10px',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '6px',
                                      fontSize: '14px',
                                      outline: 'none'
                                    }}
                                    placeholder="e.g., 2 BHK"
                                  />
                                </div>
                                <div>
                                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                                    Sqft *
                                  </label>
                                  <input
                                    type="text"
                                    style={{
                                      width: '100%',
                                      padding: '10px',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '6px',
                                      fontSize: '14px',
                                      outline: 'none'
                                    }}
                                    placeholder="e.g., 1200 sqft"
                                  />
                                </div>
                                <div>
                                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                                    Pricing *
                                  </label>
                                  <input
                                    type="text"
                                    style={{
                                      width: '100%',
                                      padding: '10px',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '6px',
                                      fontSize: '14px',
                                      outline: 'none'
                                    }}
                                    placeholder="e.g., ₹1.5 Cr onwards"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Amenities Section */}
                        <div style={{ border: '2px solid #e5e7eb', borderRadius: '10px', padding: '25px' }}>
                          <h3 style={{ marginBottom: '20px', color: '#1f2937', fontSize: '20px', fontWeight: 'bold', borderBottom: '2px solid #e5e7eb', paddingBottom: '10px' }}>
                            🏠 Amenities
                          </h3>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                            {[
                              'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Club House',
                              'Power Backup', 'Lift', 'Playground', 'Shopping Center', 'School Nearby',
                              'Hospital Nearby', 'Metro Station', 'Bus Stop', 'Restaurant', 'Tennis Court',
                              'Basketball Court', 'Jogging Track', 'Children Play Area', 'Party Hall'
                            ].map((amenity) => (
                              <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px', borderRadius: '6px', backgroundColor: '#f9fafb' }}>
                                <input
                                  type="checkbox"
                                  style={{ margin: 0, transform: 'scale(1.2)' }}
                                />
                                <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>{amenity}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        {/* Form Actions */}
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #e5e7eb' }}>
                          <button
                            type="button"
                            onClick={() => setShowPropertyForm(false)}
                            style={{
                              padding: '15px 30px',
                              border: '2px solid #d1d5db',
                              borderRadius: '8px',
                              backgroundColor: 'white',
                              color: '#374151',
                              cursor: 'pointer',
                              fontSize: '16px',
                              fontWeight: '600',
                              minWidth: '120px'
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            style={{
                              padding: '15px 30px',
                              border: 'none',
                              borderRadius: '8px',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: '16px',
                              fontWeight: '600',
                              minWidth: '120px'
                            }}
                          >
                            Save Property
                  </button>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  <button 
                    onClick={() => {
                      console.log('Add Property button clicked (no properties)');
                      alert('Button clicked! Opening form...');
                      setShowPropertyForm(true);
                    }}
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
                    <div className="relative h-48 lg:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-4xl mb-2">🏢</div>
                        <div className="text-sm font-medium">Property Image</div>
                      </div>
                    </div>
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

                    {/* Property Description */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Prestige Evergreen is a premium, nature-themed residential township by Prestige Group located on Varthur Road, Whitefield, Bangalore.
                        Spread across 21 acres, it offers approximately 2,000 Vaastu-compliant 1 to 4 BHK apartments with sizes ranging from 650 to 2,500 sq ft.
                      </p>
                    </div>

                    {/* Read More Button */}
                    <button
                      onClick={() => setSelectedProperty(property)}
                      className="w-full bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Read More
                    </button>
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
              {/* Property Image */}
              <div className="mb-6">
                <div className="relative h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">🏢</div>
                    <div className="text-lg font-medium">Property Image</div>
                  </div>
                </div>
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
      )}

      {/* Simple Property Form Modal */}
      {showPropertyForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ marginBottom: '20px', color: '#1f2937' }}>Add New Property</h2>
            <p style={{ marginBottom: '20px', color: '#6b7280' }}>
              Property form is working! State: {showPropertyForm ? 'true' : 'false'}
            </p>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Project Name:</label>
              <input 
                type="text" 
                placeholder="Enter project name"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Location:</label>
              <input 
                type="text" 
                placeholder="Enter location"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => {
                  console.log('Closing form');
                  setShowPropertyForm(false);
                }}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  console.log('Saving property');
                  alert('Property saved!');
                  setShowPropertyForm(false);
                }}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Save Property
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Add Property Button */}
      <button
        onClick={() => {
          console.log('Floating button clicked');
          alert('Floating button clicked! Opening form...');
          setShowPropertyForm(true);
        }}
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
          onClose={() => setShowPropertyForm(false)}
          onSuccess={(property) => {
            console.log('Property added successfully:', property);
            setShowPropertyForm(false);
            // Refresh the properties list with visual feedback
            loadProperties(true);
            // Show success message
            setTimeout(() => {
              alert(`✅ Property "${property.name}" has been added successfully!\n\nYou can see it in the properties list below.`);
            }, 500);
          }}
        />
      )}
    </div>
  );
};

export default PropertyListing;

