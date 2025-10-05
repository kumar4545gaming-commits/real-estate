import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats');
        setStats(response.data.stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div className="loading"></div>
        <p style={{ marginTop: '20px' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h1 style={{ fontSize: '32px', marginBottom: '30px', color: '#1f2937' }}>
        Dashboard
      </h1>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '40px'
      }}>
        <div className="card">
          <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#374151' }}>
            Total Properties
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
            {stats?.totalProperties || 0}
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#374151' }}>
            Active Properties
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
            {stats?.activeProperties || 0}
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#374151' }}>
            Featured Properties
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
            {stats?.featuredProperties || 0}
          </p>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#374151' }}>
            Total Users
          </h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>
            {stats?.totalUsers || 0}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#1f2937' }}>
          Quick Actions
        </h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary">
            Add New Property
          </button>
          <button className="btn btn-secondary">
            View All Properties
          </button>
          <button className="btn btn-secondary">
            Manage Users
          </button>
          <button className="btn btn-secondary">
            Settings
          </button>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#1f2937' }}>
          Recent Activity
        </h2>
        <p style={{ color: '#6b7280' }}>
          Recent activity will be displayed here once connected to your main site's database.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
