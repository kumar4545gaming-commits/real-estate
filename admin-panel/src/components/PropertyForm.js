import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, getDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';

const PropertyForm = ({ onClose, onSuccess, editingProperty }) => {
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

  // Populate form when editing a property
  useEffect(() => {
    if (editingProperty) {
      console.log('Populating form for editing:', editingProperty);
      setFormData({
        projectName: editingProperty.name || '',
        location: editingProperty.location || '',
        totalLandArea: editingProperty.landArea || '',
        noOfUnits: editingProperty.totalUnits || '',
        towersAndBlocks: editingProperty.towers || '',
        possessionTime: editingProperty.possessionStatus || '',
        unitVariants: editingProperty.unitVariants || [{ variant: '', sqft: '', pricing: '' }],
        amenities: editingProperty.amenities || [],
        propertyImages: editingProperty.images || [],
        imageFiles: [] // Don't populate imageFiles for existing images
      });
    }
  }, [editingProperty]);

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


  const compressImageFast = (file, maxWidth = 800, quality = 0.7) => {
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

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      console.log('Files selected:', files);
      setUploadStatus('Compressing images...');
      
      const compressedFiles = [];
      const imageUrls = [];
      
      // Process files in parallel for faster compression
      const compressionPromises = files.map(async (file, index) => {
        try {
          const compressedFile = await compressImageFast(file);
          compressedFiles.push(compressedFile);
          imageUrls.push(URL.createObjectURL(compressedFile));
          console.log(`Compressed ${file.name}: ${file.size} -> ${compressedFile.size} bytes`);
        } catch (error) {
          console.error('Compression failed for:', file.name, error);
          // Fallback to original file
          compressedFiles.push(file);
          imageUrls.push(URL.createObjectURL(file));
        }
      });
      
      await Promise.all(compressionPromises);
      
      setFormData(prev => ({
        ...prev,
        propertyImages: [...prev.propertyImages, ...imageUrls],
        imageFiles: [...prev.imageFiles, ...compressedFiles]
      }));
      
      setUploadStatus('');
      console.log('Updated formData with compressed files:', compressedFiles.length);
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
    
    console.log('🚀 Starting parallel upload of', files.length, 'files');
    console.log('📁 Files to upload:', files.map(f => ({ name: f.name, size: f.size, type: f.type })));
    setUploadStatus('Uploading images in parallel...');
    setUploadProgress(0);
    
    // Check Firebase Storage connection first
    try {
      console.log('🔍 Testing Firebase Storage connection...');
      console.log('Storage instance:', storage);
      console.log('Storage app:', storage.app);
    } catch (error) {
      console.error('❌ Firebase Storage connection error:', error);
      setUploadStatus('Firebase Storage connection failed');
      return [];
    }
    
    // Upload all files in parallel for maximum speed
    const uploadPromises = files.map(async (file, index) => {
      try {
        const fileName = `properties/${Date.now()}_${index}_${file.name || 'image'}`;
        console.log(`📤 Creating storage reference for: ${fileName}`);
        const storageRef = ref(storage, fileName);
        
        console.log(`🚀 Starting upload ${index + 1}/${files.length}:`, {
          fileName: file.name,
          size: file.size,
          type: file.type,
          storagePath: fileName
        });
        
        // Add timeout to prevent hanging
        const uploadPromise = uploadBytes(storageRef, file);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Upload timeout after 30 seconds')), 30000)
        );
        
        console.log(`⏳ Uploading file ${index + 1}...`);
        const snapshot = await Promise.race([uploadPromise, timeoutPromise]);
        console.log(`📸 Upload snapshot received:`, snapshot);
        
        console.log(`🔗 Getting download URL for file ${index + 1}...`);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        console.log(`✅ Upload completed ${index + 1}/${files.length}:`, file.name);
        console.log(`   📍 Storage path: ${fileName}`);
        console.log(`   🔗 Download URL: ${downloadURL}`);
        
        // Update progress
        const progress = ((index + 1) / files.length) * 100;
        setUploadProgress(progress);
        setUploadStatus(`Uploaded ${index + 1} of ${files.length} images`);
        
        return downloadURL;
      } catch (error) {
        console.error(`❌ Error uploading image ${index + 1}:`, {
          fileName: file.name,
          error: error.message,
          code: error.code,
          stack: error.stack
        });
        setUploadStatus(`Failed to upload image ${index + 1}: ${error.message}`);
        return null; // Return null for failed uploads
      }
    });
    
    // Wait for all uploads to complete
    console.log('⏳ Waiting for all uploads to complete...');
    const results = await Promise.all(uploadPromises);
    
    // Filter out failed uploads
    const successfulUploads = results.filter(url => url !== null && url.trim() !== '');
    
    console.log('📊 Upload results summary:');
    console.log('   Total files:', files.length);
    console.log('   Successful uploads:', successfulUploads.length);
    console.log('   Failed uploads:', files.length - successfulUploads.length);
    console.log('   Results array:', results);
    console.log('   Successful URLs:', successfulUploads);
    
    if (successfulUploads.length === 0) {
      console.error('❌ No images were successfully uploaded!');
      console.error('   This could be due to:');
      console.error('   1. Firebase Storage rules blocking uploads');
      console.error('   2. Network connectivity issues');
      console.error('   3. File size or format issues');
      console.error('   4. Firebase Storage quota exceeded');
    } else {
      console.log('✅ Upload summary:');
      successfulUploads.forEach((url, index) => {
        console.log(`   Image ${index + 1}: ${url}`);
      });
    }
    
    return successfulUploads;
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
        console.log('Files to upload:', formData.imageFiles.length);
        imageUrls = await uploadImagesToStorage(formData.imageFiles);
        console.log('Images uploaded successfully:', imageUrls);
        console.log('Number of uploaded images:', imageUrls.length);
        
        // Validate that we have actual URLs
        if (imageUrls.length === 0) {
          console.warn('⚠️ No images were successfully uploaded!');
          alert('Warning: No images were successfully uploaded. The property will be saved without images.');
        } else {
          console.log('✅ Successfully uploaded images:', imageUrls);
        }
      } else {
        console.log('No images to upload');
      }
      
      setUploadStatus('Saving property details...');
      setUploadProgress(100);

      // Combine existing images with newly uploaded images
      const existingImages = editingProperty ? (editingProperty.images || []) : [];
      const newImages = Array.isArray(imageUrls) ? imageUrls.filter(url => url && url.trim() !== '') : [];
      const allImages = [...existingImages, ...newImages];
      
      console.log('Existing images:', existingImages);
      console.log('New images:', newImages);
      console.log('Combined images:', allImages);
      console.log('Total images count:', allImages.length);
      
      // Ensure we have a valid images array
      if (allImages.length === 0) {
        console.log('No images to save - using empty array');
      } else {
        console.log('✅ Final images array to save:', allImages);
      }
      
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
        images: allImages, // Combine existing and new images
        developer: 'Your Developer Name',
        status: 'Available',
        priceRange: formData.unitVariants.length > 0 
          ? `${formData.unitVariants[0].pricing} onwards`
          : 'Contact for pricing',
        rating: '4.5',
        description: `Modern residential project in ${formData.location} with ${formData.noOfUnits} units across ${formData.towersAndBlocks}.`,
        isFeatured: false,
        ...(editingProperty ? {} : { createdAt: serverTimestamp() }), // Only add createdAt for new properties
        updatedAt: serverTimestamp()
      };
      
      // Validate the images field before saving
      if (!Array.isArray(propertyData.images)) {
        console.error('❌ Images field is not an array!', propertyData.images);
        propertyData.images = [];
      }
      
      console.log('📋 Final property data to save:');
      console.log('- Images field type:', typeof propertyData.images);
      console.log('- Images field value:', propertyData.images);
      console.log('- Images array length:', propertyData.images.length);
      
      console.log('Complete property data before saving:', propertyData);
      console.log('Images field in property data:', propertyData.images);

      // Save to Firestore (create or update)
      console.log('Saving property data to Firestore:', propertyData);
      console.log('Images field being saved:', propertyData.images);
      console.log('Images field type:', typeof propertyData.images);
      console.log('Images field length:', propertyData.images.length);
      
      let docRef;
      if (editingProperty) {
        // Update existing property
        console.log('Updating existing property with ID:', editingProperty.id);
        docRef = doc(db, 'properties', editingProperty.id);
        await updateDoc(docRef, propertyData);
        console.log('Property updated successfully');
      } else {
        // Create new property
        console.log('Creating new property');
        docRef = await addDoc(collection(db, 'properties'), propertyData);
        console.log('Property created with ID:', docRef.id);
      }
      
      // Verify the saved data by reading it back from Firestore
      try {
        const savedDoc = await getDoc(doc(db, 'properties', docRef.id));
        if (savedDoc.exists()) {
          const savedData = savedDoc.data();
          console.log('🔍 Verifying saved data from Firestore...');
          console.log('- Document ID:', docRef.id);
          console.log('- Has images field:', 'images' in savedData);
          console.log('- Images field value:', savedData.images);
          console.log('- Images array length in Firestore:', savedData.images ? savedData.images.length : 'undefined');
          console.log('- Images array type in Firestore:', typeof savedData.images);
          
          if (savedData.images && Array.isArray(savedData.images) && savedData.images.length > 0) {
            console.log('✅ SUCCESS: Images successfully saved to Firestore!');
            savedData.images.forEach((url, index) => {
              console.log(`   Image ${index + 1}: ${url}`);
            });
          } else if (savedData.images && Array.isArray(savedData.images) && savedData.images.length === 0) {
            console.log('⚠️ WARNING: Images field exists but is empty array');
          } else {
            console.error('❌ ERROR: Images field missing or invalid in saved data!');
            console.error('   Expected: Array with image URLs');
            console.error('   Actual:', savedData.images);
          }
        } else {
          console.error('❌ Document not found after saving!');
        }
      } catch (error) {
        console.error('❌ Error verifying saved data:', error);
      }
      
      // Call success callback with the saved data including the Firestore ID
      const propertyId = editingProperty ? editingProperty.id : docRef.id;
      const savedProperty = { id: propertyId, ...propertyData };
      console.log('Success callback data:', savedProperty);
      console.log('Success callback images:', savedProperty.images);
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
                {editingProperty ? 'Edit Property' : 'Add New Property'}
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
                  ⚡ Images are compressed and uploaded in parallel for maximum speed
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
                <button
                  type="button"
                  onClick={async () => {
                    console.log('Testing Firestore connection with images...');
                    try {
                      const testData = {
                        name: 'Test Property with Images',
                        location: 'Test Location',
                        images: [
                          'https://example.com/test1.jpg',
                          'https://example.com/test2.jpg'
                        ],
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                      };
                      
                      console.log('Saving test data:', testData);
                      const docRef = await addDoc(collection(db, 'properties'), testData);
                      console.log('Test property saved with ID:', docRef.id);
                      
                      // Verify it was saved
                      const savedDoc = await getDoc(doc(db, 'properties', docRef.id));
                      if (savedDoc.exists()) {
                        const savedData = savedDoc.data();
                        console.log('Test data verified:', savedData);
                        console.log('Test images array:', savedData.images);
                        console.log('Test images length:', savedData.images ? savedData.images.length : 'undefined');
                        
                        if (savedData.images && savedData.images.length > 0) {
                          alert('✅ Firestore test successful! Images array saved correctly. Check console for details.');
                        } else {
                          alert('❌ Firestore test failed! Images array not found. Check console for details.');
                        }
                      }
                    } catch (error) {
                      console.error('Firestore test failed:', error);
                      alert('Firestore test failed: ' + error.message);
                    }
                  }}
                  style={{
                    marginTop: '10px',
                    marginLeft: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🗄️ Test Firestore
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    console.log('Checking existing Firestore data...');
                    try {
                      const propertiesRef = collection(db, 'properties');
                      const snapshot = await getDocs(propertiesRef);
                      
                      console.log('Total documents in Firestore:', snapshot.size);
                      
                      snapshot.forEach((doc) => {
                        const data = doc.data();
                        console.log(`Document ${doc.id}:`, data);
                        console.log(`Images in ${doc.id}:`, data.images);
                        console.log(`Images type:`, typeof data.images);
                        console.log(`Images length:`, data.images ? data.images.length : 'undefined');
                        console.log('---');
                      });
                      
                      alert(`Found ${snapshot.size} properties in Firestore. Check console for details.`);
                    } catch (error) {
                      console.error('Error checking Firestore data:', error);
                      alert('Error checking Firestore data: ' + error.message);
                    }
                  }}
                  style={{
                    marginTop: '10px',
                    marginLeft: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  📊 Check Firestore
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    console.log('Testing direct save with hardcoded images...');
                    try {
                      const testProperty = {
                        name: 'Direct Test Property',
                        location: 'Test Location',
                        images: ['https://example.com/test1.jpg', 'https://example.com/test2.jpg'],
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                      };
                      
                      console.log('Saving test property:', testProperty);
                      const docRef = await addDoc(collection(db, 'properties'), testProperty);
                      console.log('Test property saved with ID:', docRef.id);
                      
                      // Immediately verify
                      const savedDoc = await getDoc(doc(db, 'properties', docRef.id));
                      if (savedDoc.exists()) {
                        const savedData = savedDoc.data();
                        console.log('Verified saved data:', savedData);
                        console.log('Images field exists:', 'images' in savedData);
                        console.log('Images field value:', savedData.images);
                        
                        if (savedData.images) {
                          alert('✅ Images field successfully saved to Firestore! Check Firebase console.');
                        } else {
                          alert('❌ Images field not found in saved data!');
                        }
                      }
                    } catch (error) {
                      console.error('Direct test failed:', error);
                      alert('Direct test failed: ' + error.message);
                    }
                  }}
                  style={{
                    marginTop: '10px',
                    marginLeft: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🔥 Direct Test
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    console.log('Testing complete image upload flow...');
                    try {
                      // Create a simple test image
                      const canvas = document.createElement('canvas');
                      canvas.width = 200;
                      canvas.height = 200;
                      const ctx = canvas.getContext('2d');
                      
                      // Draw a simple test image
                      ctx.fillStyle = '#4f46e5';
                      ctx.fillRect(0, 0, 200, 200);
                      ctx.fillStyle = '#ffffff';
                      ctx.font = '24px Arial';
                      ctx.textAlign = 'center';
                      ctx.fillText('TEST IMAGE', 100, 100);
                      ctx.fillText('UPLOAD', 100, 130);
                      
                      // Convert to blob
                      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.8));
                      console.log('Created test image blob:', blob.size, 'bytes');
                      
                      // Test the upload process
                      const testFiles = [blob];
                      const uploadedUrls = await uploadImagesToStorage(testFiles);
                      
                      if (uploadedUrls.length > 0) {
                        console.log('✅ Test upload successful!');
                        console.log('Uploaded URLs:', uploadedUrls);
                        
                        // Save to Firestore
                        const testProperty = {
                          name: 'Complete Test Property',
                          location: 'Test Location',
                          images: uploadedUrls,
                          createdAt: serverTimestamp(),
                          updatedAt: serverTimestamp()
                        };
                        
                        const docRef = await addDoc(collection(db, 'properties'), testProperty);
                        console.log('Test property saved with ID:', docRef.id);
                        
                        // Verify
                        const savedDoc = await getDoc(doc(db, 'properties', docRef.id));
                        if (savedDoc.exists()) {
                          const savedData = savedDoc.data();
                          if (savedData.images && savedData.images.length > 0) {
                            alert('✅ Complete test successful! Images uploaded and saved to Firestore.');
                          } else {
                            alert('❌ Complete test failed! Images not saved to Firestore.');
                          }
                        }
                      } else {
                        console.error('❌ Test upload failed!');
                        alert('❌ Test upload failed! Check console for details.');
                      }
                    } catch (error) {
                      console.error('Complete test failed:', error);
                      alert('Complete test failed: ' + error.message);
                    }
                  }}
                  style={{
                    marginTop: '10px',
                    marginLeft: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🧪 Complete Test
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    console.log('🔍 Testing Firebase Storage connection...');
                    try {
                      // Test Firebase Storage connection
                      console.log('Storage instance:', storage);
                      console.log('Storage app:', storage.app);
                      console.log('Storage bucket:', storage.app.options.storageBucket);
                      
                      // Try to create a simple test file
                      const testData = new Blob(['test'], { type: 'text/plain' });
                      const testRef = ref(storage, 'test-connection.txt');
                      
                      console.log('📤 Attempting to upload test file...');
                      const snapshot = await uploadBytes(testRef, testData);
                      console.log('✅ Test upload successful:', snapshot);
                      
                      const downloadURL = await getDownloadURL(snapshot.ref);
                      console.log('🔗 Test download URL:', downloadURL);
                      
                      alert('✅ Firebase Storage connection successful!\n\nTest file uploaded and can be accessed.');
                      
                    } catch (error) {
                      console.error('❌ Firebase Storage connection test failed:', error);
                      alert('❌ Firebase Storage connection failed!\n\nError: ' + error.message + '\n\nCheck console for details.');
                    }
                  }}
                  style={{
                    marginTop: '10px',
                    marginLeft: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  🔗 Test Storage
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
                {formData.imageFiles.length > 0 ? `Uploading ${formData.imageFiles.length} images in parallel...` : 'Saving property details...'}
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
              {isSubmitting ? 'Saving...' : (editingProperty ? 'Update Property' : 'Save Property')}
            </button>
            {!isSubmitting && formData.imageFiles.length > 0 && (
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('Save property without images? This will skip the image upload process and save immediately.')) {
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
