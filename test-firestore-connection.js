// Test script to verify Firestore connection
// Run this in the browser console to test the connection

import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './src/firebase.js';

async function testFirestoreConnection() {
  try {
    console.log('Testing Firestore connection...');
    
    // Test reading from properties collection
    const propertiesRef = collection(db, 'properties');
    const snapshot = await getDocs(propertiesRef);
    
    console.log('✅ Firestore connection successful!');
    console.log(`Found ${snapshot.size} properties in the database`);
    
    // List all properties
    snapshot.forEach((doc) => {
      console.log(`Property: ${doc.id} - ${doc.data().name}`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    return false;
  }
}

// Test adding a property (optional)
async function testAddProperty() {
  try {
    console.log('Testing property addition...');
    
    const testProperty = {
      name: 'Test Property',
      location: 'Test Location',
      landArea: '1 acre',
      totalUnits: '100',
      towers: '2 towers',
      possessionStatus: 'Dec 2025',
      unitTypes: ['2 BHK', '3 BHK'],
      unitVariants: [
        { variant: '2 BHK', sqft: '1000 sqft', pricing: '₹50 Lakhs' }
      ],
      amenities: ['Swimming Pool', 'Gym'],
      developer: 'Test Developer',
      status: 'Available',
      priceRange: '₹50 Lakhs onwards',
      rating: '4.5',
      description: 'Test property description',
      isFeatured: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'properties'), testProperty);
    console.log('✅ Test property added successfully with ID:', docRef.id);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to add test property:', error);
    return false;
  }
}

// Export functions for use in browser console
window.testFirestoreConnection = testFirestoreConnection;
window.testAddProperty = testAddProperty;

console.log('Firestore test functions loaded. Use testFirestoreConnection() or testAddProperty() to test.');




