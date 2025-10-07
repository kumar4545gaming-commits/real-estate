import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #fef7ed 0%, #fef3c7 100%)',
      padding: '60px 0 40px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px'
      }}>

        {/* Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Company Info */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              About Us
            </h3>
            <p style={{
              color: '#6b7280',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              We are a trusted real estate company dedicated to helping you find your dream home. 
              With years of experience and a commitment to excellence.
            </p>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              {/* Social Media Icons */}
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
              }}>
                <span style={{ color: 'white', fontSize: '18px' }}>f</span>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
              }}>
                <span style={{ color: 'white', fontSize: '18px' }}>t</span>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
              }}>
                <span style={{ color: 'white', fontSize: '18px' }}>in</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Quick Links
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
            {['Buy Properties', 'Sell Properties', 'Rent Properties', 'Investment', 'Property Management', 'Legal Services'].map((link, index) => (
              <button
                key={index}
                style={{
                  color: '#6b7280',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'color 0.3s ease',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '0'
                }}
                onMouseEnter={(e) => e.target.style.color = '#d97706'}
                onMouseLeave={(e) => e.target.style.color = '#6b7280'}
              >
                {link}
              </button>
            ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Contact Info
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '10px' }}>📍</span>
                </div>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  123 Real Estate Street, City, State 12345
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '10px' }}>📞</span>
                </div>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  +1 (555) 123-4567
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '10px' }}>✉️</span>
                </div>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  info@realestate.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RERA Information */}
        <div style={{
          borderTop: '1px solid rgba(217, 119, 6, 0.2)',
          paddingTop: '20px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            margin: '0 0 8px 0'
          }}>
            Channel Sales Partner RERA Number
          </p>
          <div style={{
            width: '100%',
            height: '1px',
            backgroundColor: '#D1D5DB',
            margin: '0 auto 8px auto'
          }}></div>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: '0'
          }}>
            RERA Number (Karnataka)- PRM/KA/RERA/1251/446/AG/170829/000078
          </p>
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            margin: '4px 0 0 0'
          }}>
            RERA Number (Maharashtra)- A52100012083
          </p>
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            margin: 0
          }}>
            © 2025 | All Right Reserved.
          </p>
          <div style={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap'
          }}>
            <button
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.3s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0'
              }}
              onMouseEnter={(e) => e.target.style.color = '#d97706'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              Privacy Policy
            </button>
            <button
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.3s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0'
              }}
              onMouseEnter={(e) => e.target.style.color = '#d97706'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              Terms of Service
            </button>
            <button
              style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'color 0.3s ease',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0'
              }}
              onMouseEnter={(e) => e.target.style.color = '#d97706'}
              onMouseLeave={(e) => e.target.style.color = '#6b7280'}
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
