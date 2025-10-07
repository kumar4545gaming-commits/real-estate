import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const PropertyForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    totalLandArea: '',
    noOfUnits: '',
    towersAndBlocks: '',
    possessionTime: '',
    unitVariants: [{ variant: '', sqft: '', pricing: '' }],
    amenities: [],
    propertyImages: [],
    imageFiles: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      formData.propertyImages.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [formData.propertyImages]);

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

  const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(resolve, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      console.log('Files selected:', files);
      
      const imageUrls = files.map(file => {
        console.log('Creating URL for file:', file.name, file.size);
        return URL.createObjectURL(file);
      });
      
      setFormData(prev => ({
        ...prev,
        propertyImages: [...prev.propertyImages, ...imageUrls],
        imageFiles: [...prev.imageFiles, ...files]
      }));
      
      console.log('Updated formData with files:', files.length);
    }
  };

  const removeImage = (index) => {
    // Revoke the object URL to free memory
    URL.revokeObjectURL(formData.propertyImages[index]);
    
    setFormData(prev => ({
      ...prev,
      propertyImages: prev.propertyImages.filter((_, i) => i !== index),
      imageFiles: prev.imageFiles.filter((_, i) => i !== index)
    }));
  };

  const uploadImagesToStorage = async (files) => {
    if (files.length === 0) {
      console.log('No files to upload');
      return [];
    }
    
    console.log('Starting upload of', files.length, 'files');
    setUploadStatus('Uploading images...');
    setUploadProgress(0);
    
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`Uploading file ${i + 1}/${files.length}:`, file.name, file.size);
      
      try {
        const fileName = `properties/${Date.now()}_${i}_${file.name || 'image'}`;
        const storageRef = ref(storage, fileName);
        
        setUploadStatus(`Uploading ${i + 1} of ${files.length} images...`);
        
        const snapshot = await uploadBytes(storageRef, file);
        console.log('Upload successful for:', file.name);
        
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Download URL generated:', downloadURL);
        
        results.push(downloadURL);
        
        // Update progress
        const progress = ((i + 1) / files.length) * 100;
        setUploadProgress(progress);
        setUploadStatus(`Uploaded ${i + 1} of ${files.length} images`);
        
      } catch (error) {
        console.error('Error uploading image:', file.name, error);
        setUploadStatus(`Failed to upload image ${i + 1}: ${error.message}`);
        // Continue with other images
      }
    }
    
    console.log('Upload completed. Results:', results);
    return results;
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
      console.log('Form submission started');
      console.log('Form data:', formData);
      console.log('Image files count:', formData.imageFiles.length);
      
      // Upload images to Firebase Storage first
      let imageUrls = [];
      if (formData.imageFiles.length > 0) {
        console.log('Starting image upload process...');
        imageUrls = await uploadImagesToStorage(formData.imageFiles);
        console.log('Images uploaded successfully:', imageUrls);
        console.log('Number of uploaded images:', imageUrls.length);
      } else {
        console.log('No images to upload');
      }
      
      setUploadStatus('Saving property details...');
      setUploadProgress(100);

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
        images: imageUrls, // Store Firebase Storage URLs
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
      console.log('Saving property data to Firestore:', propertyData); // Debug: show what's being saved
      const docRef = await addDoc(collection(db, 'properties'), propertyData);
      console.log('Property saved to Firestore with ID:', docRef.id);
      
      // Call success callback with the saved data including the Firestore ID
      const savedProperty = { id: docRef.id, ...propertyData };
      onSuccess && onSuccess(savedProperty);
      onClose && onClose();
      
      // Show success message
      const originalCount = formData.imageFiles.length;
      const uploadedCount = imageUrls.length;
      const imageInfo = originalCount > 0 ? `\nImages uploaded: ${uploadedCount}/${originalCount}` : '';
      
      alert(`Property saved successfully!\n\nProperty ID: ${docRef.id}${imageInfo}`);
      
      // Clear form data
      setFormData({
        projectName: '',
        location: '',
        totalLandArea: '',
        noOfUnits: '',
        towersAndBlocks: '',
        possessionTime: '',
        unitVariants: [{ variant: '', sqft: '', pricing: '' }],
        amenities: [],
        propertyImages: [],
        imageFiles: []
      });
      
    } catch (error) {
      console.error('Error saving property to Firestore:', error);
      setUploadStatus('Error occurred while saving');
      alert(`Error saving property: ${error.message}\n\nPlease try again with smaller images or check your internet connection.`);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
      setUploadStatus('');
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
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
            
            {/* Property Images */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#374151' }}>
                Property Images (Multiple Images)
              </label>
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f9fafb',
                marginBottom: '15px'
              }}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ width: '100%', marginBottom: '10px' }}
                />
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                  Select multiple images for the property (JPG, PNG, GIF)
                </p>
                <p style={{ color: '#10b981', fontSize: '12px', margin: '5px 0 0 0', fontWeight: '500' }}>
                  ⚡ Images are automatically compressed for faster upload
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    if (formData.imageFiles.length > 0) {
                      console.log('Testing upload with first image...');
                      try {
                        const testFile = formData.imageFiles[0];
                        const fileName = `test/${Date.now()}_test.jpg`;
                        const storageRef = ref(storage, fileName);
                        const snapshot = await uploadBytes(storageRef, testFile);
                        const downloadURL = await getDownloadURL(snapshot.ref);
                        console.log('Test upload successful:', downloadURL);
                        alert('Test upload successful! Check console for URL.');
                      } catch (error) {
                        console.error('Test upload failed:', error);
                        alert('Test upload failed: ' + error.message);
                      }
                    } else {
                      alert('Please select an image first');
                    }
                  }}
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🧪 Test Upload
                </button>
              </div>
              
              {/* Display Selected Images */}
              {formData.propertyImages.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
                  {formData.propertyImages.map((imageUrl, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={imageUrl}
                        alt={`Property ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
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

          {/* Progress Indicator */}
          {isSubmitting && (
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{ width: '20px', height: '20px', border: '2px solid #0ea5e9', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                <span style={{ color: '#0c4a6e', fontWeight: '500' }}>{uploadStatus}</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#e0f2fe', borderRadius: '3px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${uploadProgress}%`, 
                    height: '100%', 
                    backgroundColor: '#0ea5e9', 
                    transition: 'width 0.3s ease',
                    borderRadius: '3px'
                  }}
                ></div>
              </div>
              <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                {formData.imageFiles.length > 0 ? `Uploading ${formData.imageFiles.length} images...` : 'Saving property details...'}
              </p>
            </div>
          )}

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
            {!isSubmitting && formData.imageFiles.length > 0 && (
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('Save property without images? This will skip the image upload process.')) {
                    // Save without images
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
                      images: [], // No images
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
                    
                    try {
                      const docRef = await addDoc(collection(db, 'properties'), propertyData);
                      alert(`Property saved successfully without images!\nProperty ID: ${docRef.id}`);
                      onSuccess && onSuccess({ id: docRef.id, ...propertyData });
                      onClose && onClose();
                    } catch (error) {
                      alert(`Error saving property: ${error.message}`);
                    }
                  }
                }}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #f59e0b',
                  borderRadius: '6px',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Save Without Images
              </button>
            )}
            {isSubmitting && formData.imageFiles.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Skip image upload and save property details only?')) {
                    // Save without images
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
                      images: [], // No images
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
                    
                    addDoc(collection(db, 'properties'), propertyData)
                      .then(docRef => {
                        alert(`Property saved successfully without images!\nProperty ID: ${docRef.id}`);
                        onSuccess && onSuccess({ id: docRef.id, ...propertyData });
                        onClose && onClose();
                      })
                      .catch(error => {
                        alert(`Error saving property: ${error.message}`);
                      });
                  }
                }}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #f59e0b',
                  borderRadius: '6px',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Skip Images
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default PropertyForm;
