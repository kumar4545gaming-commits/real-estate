import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../firebase';

// Initialize database with sample data
export const setupDatabase = async () => {
  try {
    // Create admin user
    const adminEmail = 'admin@realestate.com';
    const adminPassword = 'admin123';
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      const adminUser = userCredential.user;
      
      // Create admin document
      await setDoc(doc(db, 'admins', adminUser.uid), {
        name: 'Super Admin',
        email: adminEmail,
        role: 'super-admin',
        isActive: true,
        createdAt: new Date()
      });
      
      console.log('Admin user created successfully');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('Admin user already exists');
      } else {
        console.error('Error creating admin user:', error);
      }
    }

    // Add sample properties
    const sampleProperties = [
      {
        title: 'Luxury Apartment in Downtown',
        description: 'Beautiful 3-bedroom apartment with modern amenities in the heart of the city.',
        price: 7500000,
        location: {
          address: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        },
        propertyType: 'apartment',
        status: 'ready-to-move',
        bedrooms: 3,
        bathrooms: 2,
        area: 1200,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1613977257593-3bbbf9c4f6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            alt: 'Luxury Apartment',
            isPrimary: true
          }
        ],
        amenities: ['Swimming Pool', 'Gym', 'Parking', 'Security'],
        isFeatured: true,
        isActive: true,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Modern Villa with Garden',
        description: 'Spacious 4-bedroom villa with private garden and modern facilities.',
        price: 12000000,
        location: {
          address: '456 Garden Lane',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560001'
        },
        propertyType: 'villa',
        status: 'ongoing',
        bedrooms: 4,
        bathrooms: 3,
        area: 2000,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            alt: 'Modern Villa',
            isPrimary: true
          }
        ],
        amenities: ['Garden', 'Parking', 'Security', 'Power Backup'],
        isFeatured: true,
        isActive: true,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Commercial Plot for Development',
        description: 'Prime commercial plot in business district, perfect for office or retail development.',
        price: 25000000,
        location: {
          address: '789 Business Park',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001'
        },
        propertyType: 'plot',
        status: 'pre-launch',
        bedrooms: 0,
        bathrooms: 0,
        area: 5000,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
            alt: 'Commercial Plot',
            isPrimary: true
          }
        ],
        amenities: ['Prime Location', 'Easy Access', 'Development Ready'],
        isFeatured: true,
        isActive: true,
        createdBy: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Add properties to Firestore
    for (const property of sampleProperties) {
      try {
        await addDoc(collection(db, 'properties'), property);
        console.log(`Added property: ${property.title}`);
      } catch (error) {
        console.error(`Error adding property ${property.title}:`, error);
      }
    }

    console.log('Database setup completed successfully!');
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
};

// Function to check if database is already set up
export const checkDatabaseSetup = async () => {
  try {
    const { getDocs, collection } = await import('firebase/firestore');
    const propertiesSnapshot = await getDocs(collection(db, 'properties'));
    const adminsSnapshot = await getDocs(collection(db, 'admins'));
    
    return {
      hasProperties: !propertiesSnapshot.empty,
      hasAdmins: !adminsSnapshot.empty
    };
  } catch (error) {
    console.error('Error checking database setup:', error);
    return { hasProperties: false, hasAdmins: false };
  }
};
