import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = ({ children }) => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
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
            
            {/* B Logo */}
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)',
              position: 'relative'
            }}>
              {/* Stylized B with house roof */}
              <div style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                fontFamily: 'serif',
                position: 'relative'
              }}>
                B
                {/* House roof */}
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '0',
                  height: '0',
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: '4px solid #92400e',
                  zIndex: 1
                }}></div>
                {/* Vertical bars inside B */}
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  left: '4px',
                  width: '1px',
                  height: '10px',
                  background: 'white',
                  opacity: 0.8
                }}></div>
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  left: '6px',
                  width: '1px',
                  height: '10px',
                  background: 'white',
                  opacity: 0.6
                }}></div>
              </div>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            flex: 1,
            justifyContent: 'center'
          }}>
            {[
              { name: 'Dashboard', path: '/dashboard' },
              { name: 'Property listing', path: '/properties' },
              { name: 'Inquiries', path: '/inquiries' },
              { name: 'Contact details', path: '/contact' },
              { name: 'Other', path: '/other' }
            ].map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive 
                      ? 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)'
                      : 'transparent',
                    color: isActive ? 'white' : '#374151',
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    whiteSpace: 'nowrap'
                  }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'rgba(217, 119, 6, 0.1)';
                    e.target.style.color = '#d97706';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#374151';
                  }
                }}
              >
                {item.name}
              </button>
              );
            })}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
