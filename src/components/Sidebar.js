import React from 'react';
import { ProSidebarProvider, Sidebar, Menu, MenuItem } from 'react-pro-sidebar';

function SidebarComponent({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="relative z-10">
        <ProSidebarProvider>
          <Sidebar style={{ width: '300px', height: '100vh', backgroundColor: '#efe5d1' }}>
            <div className="flex justify-between items-center p-4 border-b border-[#e2d6bd]">
              <h2 className="text-lg font-semibold text-[#131a3a]">Menu</h2>
              <button 
                onClick={onClose}
                className="text-[#131a3a] hover:text-[#0f1429]"
                aria-label="Close sidebar"
              >
                <span style={{fontSize: 24, lineHeight: 1}}>×</span>
              </button>
            </div>
            <Menu 
              style={{ 
                backgroundColor: '#efe5d1', 
                color: '#131a3a',
                padding: '10px 0'
              }}
            >
              <MenuItem 
                style={{ 
                  color: '#131a3a', 
                  backgroundColor: 'transparent',
                  padding: '12px 20px',
                  fontSize: '16px'
                }}
              >
                Home
              </MenuItem>
              <MenuItem 
                style={{ 
                  color: '#131a3a', 
                  backgroundColor: 'transparent',
                  padding: '12px 20px',
                  fontSize: '16px'
                }}
              >
                Cities
              </MenuItem>
              <MenuItem 
                style={{ 
                  color: '#131a3a', 
                  backgroundColor: 'transparent',
                  padding: '12px 20px',
                  fontSize: '16px'
                }}
              >
                Top Builders
              </MenuItem>
              <MenuItem 
                style={{ 
                  color: '#131a3a', 
                  backgroundColor: 'transparent',
                  padding: '12px 20px',
                  fontSize: '16px'
                }}
              >
                Popular projects
              </MenuItem>
              <MenuItem 
                style={{ 
                  color: '#131a3a', 
                  backgroundColor: 'transparent',
                  padding: '12px 20px',
                  fontSize: '16px'
                }}
              >
                NRI Services
              </MenuItem>
              <MenuItem 
                style={{ 
                  color: '#131a3a', 
                  backgroundColor: 'transparent',
                  padding: '12px 20px',
                  fontSize: '16px'
                }}
              >
                Media
              </MenuItem>
              <MenuItem 
                style={{ 
                  color: '#131a3a', 
                  backgroundColor: 'transparent',
                  padding: '12px 20px',
                  fontSize: '16px'
                }}
              >
                Our Culture
              </MenuItem>
              <MenuItem 
                style={{ 
                  color: '#131a3a', 
                  backgroundColor: 'transparent',
                  padding: '12px 20px',
                  fontSize: '16px'
                }}
              >
                Become a Partner
              </MenuItem>
              <MenuItem 
                style={{ 
                  color: '#131a3a', 
                  backgroundColor: 'transparent',
                  padding: '12px 20px',
                  fontSize: '16px'
                }}
              >
                Careers
              </MenuItem>
              <MenuItem 
                style={{ 
                  color: '#131a3a', 
                  backgroundColor: 'transparent',
                  padding: '12px 20px',
                  fontSize: '16px'
                }}
              >
                Privacy Policy
              </MenuItem>
            </Menu>
          </Sidebar>
        </ProSidebarProvider>
      </div>
    </div>
  );
}

export default SidebarComponent;
