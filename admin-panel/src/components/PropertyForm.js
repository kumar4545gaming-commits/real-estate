import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const PropertyForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    totalLandArea: '',
    noOfUnits: '',
    towersAndBlocks: '',
    possessionTime: '',
    unitVariants: [{ variant: '', sqft: '', pricing: '' }],
    amenities: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableAmenities = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Club House',
    'Power Backup', 'Lift', 'Playground', 'Shopping Center', 'School Nearby',
    'Hospital Nearby', 'Metro Station', 'Bus Stop', 'Restaurant'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleUnitVariantChange = (index, field, value) => {
    const newVariants = [...formData.unitVariants];
    newVariants[index][field] = value;
    setFormData(prev => ({
      ...prev,
      unitVariants: newVariants
    }));
  };

  const addUnitVariant = () => {
    if (formData.unitVariants.length < 3) {
      setFormData(prev => ({
        ...prev,
        unitVariants: [...prev.unitVariants, { variant: '', sqft: '', pricing: '' }]
      }));
    }
  };

  const removeUnitVariant = (index) => {
    if (formData.unitVariants.length > 1) {
      const newVariants = formData.unitVariants.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        unitVariants: newVariants
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.totalLandArea.trim()) newErrors.totalLandArea = 'Total land area is required';
    if (!formData.noOfUnits.trim()) newErrors.noOfUnits = 'Number of units is required';
    if (!formData.towersAndBlocks.trim()) newErrors.towersAndBlocks = 'Towers and blocks is required';
    if (!formData.possessionTime.trim()) newErrors.possessionTime = 'Possession time is required';

    // Validate unit variants
    formData.unitVariants.forEach((variant, index) => {
      if (!variant.variant.trim()) newErrors[`variant_${index}`] = 'Unit type is required';
      if (!variant.sqft.trim()) newErrors[`sqft_${index}`] = 'Sqft is required';
      if (!variant.pricing.trim()) newErrors[`pricing_${index}`] = 'Pricing is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const propertyData = {
        name: formData.projectName,
        location: formData.location,
        landArea: formData.totalLandArea,
        totalUnits: formData.noOfUnits,
        towers: formData.towersAndBlocks,
        possessionStatus: formData.possessionTime,
        unitTypes: formData.unitVariants.map(v => v.variant),
        unitVariants: formData.unitVariants,
        amenities: formData.amenities,
        developer: 'Your Developer Name',
        status: 'Available',
        priceRange: formData.unitVariants.length > 0 
          ? `${formData.unitVariants[0].pricing} onwards`
          : 'Contact for pricing',
        rating: '4.5',
        description: `Modern residential project in ${formData.location} with ${formData.noOfUnits} units across ${formData.towersAndBlocks}.`,
        isFeatured: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'properties'), propertyData);
      console.log('Property saved to Firestore with ID:', docRef.id);
      
      // Call success callback with the saved data including the Firestore ID
      const savedProperty = { id: docRef.id, ...propertyData };
      onSuccess && onSuccess(savedProperty);
      onClose && onClose();
      
      // Show success message
      alert('Property saved successfully to Firestore!');
      
    } catch (error) {
      console.error('Error saving property to Firestore:', error);
      alert('Error saving property to Firestore. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                Add New Property
              </h2>
              <p style={{ margin: '5px 0 0 0', color: '#6b7280' }}>
                Enter property details below
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '5px'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {/* Basic Information */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
              Basic Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: errors.projectName ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter project name"
                />
                {errors.projectName && (
                  <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>
                    {errors.projectName}
                  </p>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: errors.location ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="Enter location"
                />
                {errors.location && (
                  <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>
                    {errors.location}
                  </p>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                  Total Land Area *
                </label>
                <input
                  type="text"
                  value={formData.totalLandArea}
                  onChange={(e) => handleInputChange('totalLandArea', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: errors.totalLandArea ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="e.g., 5 acres"
                />
                {errors.totalLandArea && (
                  <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>
                    {errors.totalLandArea}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
              Dimensions & Configuration
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                  Number of Units *
                </label>
                <input
                  type="text"
                  value={formData.noOfUnits}
                  onChange={(e) => handleInputChange('noOfUnits', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: errors.noOfUnits ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="e.g., 500 units"
                />
                {errors.noOfUnits && (
                  <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>
                    {errors.noOfUnits}
                  </p>
                )}
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                  Towers and Blocks *
                </label>
                <input
                  type="text"
                  value={formData.towersAndBlocks}
                  onChange={(e) => handleInputChange('towersAndBlocks', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: errors.towersAndBlocks ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="e.g., 5 towers, 20 floors each"
                />
                {errors.towersAndBlocks && (
                  <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>
                    {errors.towersAndBlocks}
                  </p>
                )}
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#374151' }}>
                  Possession Time *
                </label>
                <input
                  type="text"
                  value={formData.possessionTime}
                  onChange={(e) => handleInputChange('possessionTime', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: errors.possessionTime ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                  placeholder="e.g., Dec 2025"
                />
                {errors.possessionTime && (
                  <p style={{ color: '#ef4444', fontSize: '12px', margin: '5px 0 0 0' }}>
                    {errors.possessionTime}
                  </p>
                )}
              </div>
            </div>

            {/* Unit Variants */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '600', margin: 0, color: '#1f2937' }}>
                  Unit Variants Configuration
                </h4>
                {formData.unitVariants.length < 3 && (
                  <button
                    type="button"
                    onClick={addUnitVariant}
                    style={{
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Add Variant
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {formData.unitVariants.map((variant, index) => (
                  <div key={index} style={{
                    padding: '15px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <h5 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                        Variant {index + 1}
                      </h5>
                      {formData.unitVariants.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeUnitVariant(index)}
                          style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                          Unit Type *
                        </label>
                        <input
                          type="text"
                          value={variant.variant}
                          onChange={(e) => handleUnitVariantChange(index, 'variant', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: errors[`variant_${index}`] ? '2px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                          placeholder="e.g., 2 BHK"
                        />
                        {errors[`variant_${index}`] && (
                          <p style={{ color: '#ef4444', fontSize: '10px', margin: '2px 0 0 0' }}>
                            {errors[`variant_${index}`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                          Sqft *
                        </label>
                        <input
                          type="text"
                          value={variant.sqft}
                          onChange={(e) => handleUnitVariantChange(index, 'sqft', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: errors[`sqft_${index}`] ? '2px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                          placeholder="e.g., 1200 sqft"
                        />
                        {errors[`sqft_${index}`] && (
                          <p style={{ color: '#ef4444', fontSize: '10px', margin: '2px 0 0 0' }}>
                            {errors[`sqft_${index}`]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                          Pricing *
                        </label>
                        <input
                          type="text"
                          value={variant.pricing}
                          onChange={(e) => handleUnitVariantChange(index, 'pricing', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: errors[`pricing_${index}`] ? '2px solid #ef4444' : '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}
                          placeholder="e.g., ₹1.5 Cr onwards"
                        />
                        {errors[`pricing_${index}`] && (
                          <p style={{ color: '#ef4444', fontSize: '10px', margin: '2px 0 0 0' }}>
                            {errors[`pricing_${index}`]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#1f2937' }}>
              Amenities
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              {availableAmenities.map((amenity) => (
                <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    style={{ margin: 0 }}
                  />
                  <span style={{ fontSize: '14px', color: '#374151' }}>{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                backgroundColor: 'white',
                color: '#374151',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: isSubmitting ? '#9ca3af' : '#3b82f6',
                color: 'white',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {isSubmitting ? 'Saving...' : 'Save Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;
