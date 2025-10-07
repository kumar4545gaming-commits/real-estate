import React, { useState, useEffect } from 'react';
import { getStoredProperties, getStoredFeaturedProperties, initializeProperties, saveProperties, removeDuplicates, clearAllProperties } from '../utils/property-sync';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyDetails, setShowPropertyDetails] = useState(false);

  useEffect(() => {
        const loadProperties = () => {
          try {
            console.log('Loading properties...');

            // Clear all existing properties
            clearAllProperties();

            // Initialize with empty data
            const storedProps = initializeProperties();
            const storedFeatured = getStoredFeaturedProperties();
            setProperties(storedProps);
            setFeaturedProperties(storedFeatured);

            console.log('Loaded properties:', storedProps.length);
            setLoading(false);

          } catch (error) {
            console.error('Error loading properties:', error);
            setLoading(false);
          }
        };

    loadProperties();
    
    // Listen for storage changes (when admin panel updates properties)
    const handleStorageChange = (e) => {
      if (e.key === 'real_estate_properties') {
        console.log('Properties updated from admin panel, reloading...');
        const storedProps = getStoredProperties();
        const storedFeatured = getStoredFeaturedProperties();
        setProperties(storedProps);
        setFeaturedProperties(storedFeatured);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const PropertyCard = ({ property }) => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Property Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-2">🏢</div>
          <div className="text-lg font-semibold">{property.name}</div>
        </div>
        {property.isFeatured && (
          <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ⭐ Featured
          </div>
        )}
        <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          {property.status || 'Available'}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{property.name}</h3>
        <p className="text-gray-600 mb-3 flex items-center">
          📍 {property.location}
        </p>
        <p className="text-sm text-gray-500 mb-4">By {property.developer}</p>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-xs text-gray-500 mb-1">Land Area</div>
            <div className="font-semibold text-gray-900">{property.landArea}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-xs text-gray-500 mb-1">Total Units</div>
            <div className="font-semibold text-gray-900">{property.totalUnits}</div>
          </div>
        </div>

        {/* Price Range */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="text-sm text-green-600 mb-1">Price Range</div>
          <div className="text-lg font-bold text-green-700">{property.priceRange}</div>
        </div>

        {/* Unit Types */}
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-2">Unit Types:</div>
          <div className="flex flex-wrap gap-2">
            {property.unitTypes?.slice(0, 2).map((unit, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {unit}
              </span>
            ))}
            {property.unitTypes?.length > 2 && (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                +{property.unitTypes.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="text-sm text-yellow-700 font-semibold">Rating</div>
          <div className="text-lg font-bold text-yellow-700">⭐ {property.rating}</div>
        </div>

        {/* View Details Button */}
        <button
          onClick={() => setSelectedProperty(property)}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300"
        >
          View Details
        </button>
      </div>
    </div>
  );

  const PropertyDetailsModal = ({ property, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          ×
        </button>

        {/* Modal Content */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{property.name}</h2>
          <p className="text-gray-600 mb-6 flex items-center">
            📍 {property.location}
          </p>

          {/* Detailed Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Basic Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Details</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="mb-2"><strong>Developer:</strong> {property.developer}</div>
                <div className="mb-2"><strong>Land Area:</strong> {property.landArea}</div>
                <div className="mb-2"><strong>Total Units:</strong> {property.totalUnits}</div>
                <div className="mb-2"><strong>Towers:</strong> {property.towers}</div>
                <div><strong>Status:</strong> {property.possessionStatus}</div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Pricing</h3>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-700 mb-2">
                  {property.priceRange}
                </div>
                <div className="text-sm text-green-600">Pre-launch pricing</div>
              </div>
            </div>

            {/* Legal & Approval */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Legal Status</h3>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <div className="text-yellow-800 font-medium">{property.legalApproval}</div>
              </div>
            </div>

            {/* Master Plan Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Master Plan</h3>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="text-blue-800">{property.masterPlanFeatures}</div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {property.amenities?.map((amenity, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                  • {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Connectivity */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Connectivity</h3>
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              {property.connectivity?.map((item, index) => (
                <div key={index} className="mb-2 text-green-800">
                  • {item}
                </div>
              ))}
            </div>
          </div>

          {/* Gallery Sources */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Gallery & More Info</h3>
            <div className="space-y-2">
              {property.gallerySources?.map((source, index) => (
                <a
                  key={index}
                  href={source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-blue-50 text-blue-600 p-3 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  🔗 {source}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
                  There are currently no properties available. Check back later or contact us for more information.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                    Contact Us
                  </button>
                  <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Get Notified
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
                        {property.description || 'No description available for this property.'}
                      </p>
                    </div>
                    
                    {/* Read More Button */}
                    <button 
                      onClick={() => {
                        setSelectedProperty(property);
                        setShowPropertyDetails(true);
                      }}
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
            <button className="bg-blue-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition-colors">
              Call Now
            </button>
          </div>
        </div>
      </div>

      {/* Property Details Modal */}
      {showPropertyDetails && selectedProperty && (
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
                  onClick={() => {
                    setShowPropertyDetails(false);
                    setSelectedProperty(null);
                  }}
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

              {/* Connectivity */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Connectivity</h3>
                <div className="space-y-2">
                  {selectedProperty.connectivity?.map((item, index) => (
                    <div key={index} className="bg-green-50 p-3 rounded-lg">
                      <span className="text-green-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>


              {/* Unit Variants Pricing */}
              {selectedProperty.unitVariants && selectedProperty.unitVariants.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Unit Variants & Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedProperty.unitVariants.map((variant, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                        <div className="p-4">
                          <h4 className="text-lg font-bold text-gray-900 mb-1">{variant.variant}</h4>
                          <div className="text-2xl font-bold text-gray-900 mb-1">{variant.pricing}</div>
                          <div className="text-xs text-gray-600 mb-2">Onwards</div>
                          <div className="text-xs text-gray-500">{variant.sqft}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}



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
    </div>
  );
};

export default Properties;
