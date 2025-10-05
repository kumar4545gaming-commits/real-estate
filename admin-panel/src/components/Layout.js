import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { admin, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? '250px' : '0',
        backgroundColor: '#1f2937',
        color: 'white',
        transition: 'width 0.3s',
        overflow: 'hidden',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000
      }}>
        <div style={{ padding: '20px' }}>
          <h2 style={{ marginBottom: '30px', fontSize: '20px' }}>Admin Panel</h2>
          <nav>
            <a 
              href="/dashboard" 
              style={{ 
                display: 'block', 
                padding: '10px 0', 
                color: 'white', 
                textDecoration: 'none',
                borderBottom: '1px solid #374151'
              }}
            >
              Dashboard
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? '250px' : '0',
        transition: 'margin-left 0.3s'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          padding: '15px 20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ☰
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>Welcome, {admin?.name}</span>
            <button
              onClick={logout}
              className="btn btn-secondary"
              style={{ padding: '8px 16px' }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
