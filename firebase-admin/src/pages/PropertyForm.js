import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProperties } from '../contexts/PropertyContext';
import { Building2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const PropertyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getProperty, addProperty, updateProperty } = useProperties();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    propertyType: 'apartment',
    status: 'ongoing',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: [],
    isFeatured: false,
    isActive: true
  });

  const [newAmenity, setNewAmenity] = useState('');

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    try {
      const property = await getProperty(id);
      if (property) {
        setFormData(property);
        setImages(property.images || []);
      }
    } catch (error) {
      console.error('Error loading property:', error);
      toast.error('Failed to load property');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addAmenity = () => {
    if (newAmenity.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await updateProperty(id, formData, images);
        toast.success('Property updated successfully!');
      } else {
        await addProperty(formData, images);
        toast.success('Property added successfully!');
      }
      navigate('/properties');
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error('Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Property' : 'Add New Property'}
        </h1>
        <p className="text-gray-600">
          {id ? 'Update property information' : 'Create a new property listing'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Property Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Price (₹) *</label>
              <input
                type="number"
                name="price"
                className="form-input"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Property Type *</label>
              <select
                name="propertyType"
                className="form-input"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className="form-label">Status *</label>
              <select
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="ongoing">Ongoing</option>
                <option value="pre-launch">Pre Launch</option>
                <option value="ready-to-move">Ready to Move</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-input"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="form-label">Address *</label>
              <input
                type="text"
                name="location.address"
                className="form-input"
                value={formData.location.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="form-label">City *</label>
              <input
                type="text"
                name="location.city"
                className="form-input"
                value={formData.location.city}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="form-label">State *</label>
              <input
                type="text"
                name="location.state"
                className="form-input"
                value={formData.location.state}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Pincode *</label>
              <input
                type="text"
                name="location.pincode"
                className="form-input"
                value={formData.location.pincode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="form-label">Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                className="form-input"
                value={formData.bedrooms}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div>
              <label className="form-label">Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                className="form-input"
                value={formData.bathrooms}
                onChange={handleInputChange}
                min="0"
              />
            </div>
            <div>
              <label className="form-label">Area (sqft) *</label>
              <input
                type="number"
                name="area"
                className="form-input"
                value={formData.area}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="form-input"
              />
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Amenities */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add amenity"
                className="form-input flex-1"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
              />
              <button
                type="button"
                onClick={addAmenity}
                className="btn btn-primary"
              >
                Add
              </button>
            </div>
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="mr-2"
              />
              Featured Property
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              Active (visible on website)
            </label>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : (id ? 'Update Property' : 'Add Property')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PropertyForm;
