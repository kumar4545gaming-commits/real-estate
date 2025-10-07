import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import PropertyForm from '../components/PropertyForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load properties from Firestore
  const loadProperties = async () => {
    try {
      console.log('Loading properties for dashboard...');
      setLoading(true);

      const propertiesRef = collection(db, 'properties');
      const propertiesQuery = query(propertiesRef, orderBy('createdAt', 'desc'));
      const propertiesSnapshot = await getDocs(propertiesQuery);
      
      const allProperties = [];
      propertiesSnapshot.forEach((doc) => {
        const propertyData = { id: doc.id, ...doc.data() };
        allProperties.push(propertyData);
      });

      setProperties(allProperties);
      console.log('Loaded properties for dashboard:', allProperties.length);
      setLoading(false);

    } catch (error) {
      console.error('Error loading properties for dashboard:', error);
      setLoading(false);
    }
  };

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, []);

  // Calculate stats from real data
  const totalProperties = properties.length;
  const activeListings = properties.filter(p => p.status === 'Available' || p.status === 'Under Construction').length;
  const featuredProperties = properties.filter(p => p.isFeatured === true).length;
  const inquiries = 42; // This could be connected to a inquiries collection later

  const handleViewProperties = () => {
    navigate('/properties');
  };

  const handleAddProperty = () => {
    setShowPropertyForm(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fef7ed 0%, #fef3c7 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Dashboard Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '8px',
            textAlign: 'center'
          }}>
            Welcome to Dashboard
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            Manage your real estate properties efficiently
          </p>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '16px',
              padding: '24px',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>
                Total Properties
              </h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : totalProperties}
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '16px',
              padding: '24px',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>
                Active Listings
              </h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : activeListings}
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '16px',
              padding: '24px',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>
                Featured
              </h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : featuredProperties}
              </p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '16px',
              padding: '24px',
              color: 'white',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>
                Inquiries
              </h3>
              <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
                {loading ? '...' : inquiries}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={handleAddProperty}
              style={{
                background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
              }}
            >
              Add New Property
            </button>
            <button 
              onClick={handleViewProperties}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                color: '#374151',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              View All Properties
            </button>
            <button style={{
              background: 'rgba(255, 255, 255, 0.8)',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              Manage Inquiries
            </button>
          </div>
        </div>
      </div>

      {/* Property Form Modal */}
      {showPropertyForm && (
        <PropertyForm
          onClose={() => setShowPropertyForm(false)}
          onSuccess={(property) => {
            console.log('Property added successfully:', property);
            setShowPropertyForm(false);
            // Refresh the properties list to update dashboard stats
            loadProperties();
            // Optionally navigate to properties list
            navigate('/properties');
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
