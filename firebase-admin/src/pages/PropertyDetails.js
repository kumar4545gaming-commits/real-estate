import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProperties } from '../contexts/PropertyContext';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Star,
  Edit,
  ArrowLeft,
  Calendar,
  User
} from 'lucide-react';

const PropertyDetails = () => {
  const { id } = useParams();
  const { getProperty } = useProperties();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const propertyData = await getProperty(id);
      setProperty(propertyData);
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Property not found</h3>
        <p className="text-gray-500 mb-4">The property you're looking for doesn't exist.</p>
        <Link to="/properties" className="btn btn-primary">
          Back to Properties
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/properties"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
          <Link
            to={`/properties/${id}/edit`}
            className="btn btn-primary flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Property
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
        <p className="text-gray-600 mt-2">{property.location?.city}, {property.location?.state}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Images */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
            {property.images && property.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.alt || `Property ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <Building2 className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price and Status */}
          <div className="card">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ₹{property.price?.toLocaleString()}
              </div>
              <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                property.status === 'ready-to-move' 
                  ? 'bg-green-100 text-green-800'
                  : property.status === 'ongoing'
                  ? 'bg-blue-100 text-blue-800'
                  : property.status === 'sold'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {property.status}
              </span>
            </div>
          </div>

          {/* Property Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700 capitalize">{property.propertyType}</span>
              </div>
              {property.bedrooms > 0 && (
                <div className="flex items-center">
                  <Bed className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{property.bedrooms} Bedrooms</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center">
                  <Bath className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-gray-700">{property.bathrooms} Bathrooms</span>
                </div>
              )}
              <div className="flex items-center">
                <Square className="h-5 w-5 text-gray-400 mr-3" />
                <span className="text-gray-700">{property.area} sqft</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-gray-700">{property.location?.address}</p>
                  <p className="text-gray-600 text-sm">
                    {property.location?.city}, {property.location?.state} - {property.location?.pincode}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Settings */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Featured</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  property.isFeatured 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {property.isFeatured ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Active</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  property.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {property.isActive ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Property Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-700">
                  Created: {property.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-700">
                  Updated: {property.updatedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-400 mr-3" />
                <span className="text-gray-700">
                  Created by: {property.createdBy || 'Admin'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
