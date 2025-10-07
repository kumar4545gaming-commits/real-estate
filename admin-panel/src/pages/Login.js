import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const { signin, isAuthenticated, error, clearError, resetPassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login component - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('User is authenticated, navigating to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  // Clear form fields on page load/refresh
  useEffect(() => {
    setEmail('');
    setPassword('');
    setResetEmail('');
    setResetMessage('');
    setShowForgotPassword(false);
  }, []);

  // Password validation function
  const validatePassword = (password) => {
    const errors = [];
    
    // Length requirements (8-64 characters)
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (password.length > 64) {
      errors.push('Password must be no more than 64 characters long');
    }
    
    // Character requirements
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    // Check for common weak patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password cannot contain more than 2 consecutive identical characters');
    }
    
    
    return errors;
  };

  // Handle password change with validation
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (newPassword.length > 0) {
      const errors = validatePassword(newPassword);
      setPasswordErrors(errors);
      setShowPasswordRequirements(true);
    } else {
      setPasswordErrors([]);
      setShowPasswordRequirements(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password before submission
    const passwordValidationErrors = validatePassword(password);
    if (passwordValidationErrors.length > 0) {
      setPasswordErrors(passwordValidationErrors);
      setShowPasswordRequirements(true);
      return;
    }
    
    setLoading(true);
    
    console.log('Submitting login form with:', { email, password: '***' });
    const result = await signin(email, password);
    console.log('Login result:', result);
    
    if (result.success) {
      console.log('Login successful, navigating to dashboard');
      navigate('/dashboard');
    } else {
      console.log('Login failed:', result.error);
    }
    
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setResetMessage('Please enter your email address');
      return;
    }
    
    const result = await resetPassword(resetEmail);
    if (result.success) {
      setResetMessage(result.message);
      setResetEmail('');
    } else {
      setResetMessage(result.error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'white',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{ 
          maxWidth: '400px', 
          width: '100%',
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#111827',
              margin: 0,
              letterSpacing: '-0.025em'
            }}>
              Welcome Back
            </h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Username Field */}
            <div>
              <label htmlFor="username" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Username *
              </label>
              <input
                id="username"
                name="username"
                type="email"
                value={email}
                autoComplete="off"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #D1D5DB',
                  borderRadius: '8px',
                  color: '#111827',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your Username"
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.borderColor = '#FBBF24';
                  e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#F9FAFB';
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  minLength="8"
                  maxLength="64"
                  style={{
                    width: '100%',
                    padding: '14px 50px 14px 16px',
                    backgroundColor: '#F9FAFB',
                    border: passwordErrors.length > 0 ? '1px solid #DC2626' : '1px solid #D1D5DB',
                    borderRadius: '8px',
                    color: '#111827',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your Password"
                  value={password}
                  onChange={handlePasswordChange}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = 'white';
                    e.target.style.borderColor = passwordErrors.length > 0 ? '#DC2626' : '#FBBF24';
                    e.target.style.boxShadow = passwordErrors.length > 0 ? '0 0 0 3px rgba(220, 38, 38, 0.1)' : '0 0 0 3px rgba(251, 191, 36, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = '#F9FAFB';
                    e.target.style.borderColor = passwordErrors.length > 0 ? '#DC2626' : '#D1D5DB';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '16px',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </button>
              </div>
              
              {/* Password Requirements */}
              {showPasswordRequirements && (
                <div style={{
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}>
                  <div style={{
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Password Requirements:
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '4px'
                  }}>
                    <div style={{
                      color: password.length >= 8 ? '#10B981' : '#6B7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{password.length >= 8 ? '✓' : '○'}</span>
                      8-64 characters
                    </div>
                    <div style={{
                      color: /[a-z]/.test(password) ? '#10B981' : '#6B7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{/[a-z]/.test(password) ? '✓' : '○'}</span>
                      Lowercase letter
                    </div>
                    <div style={{
                      color: /[A-Z]/.test(password) ? '#10B981' : '#6B7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{/[A-Z]/.test(password) ? '✓' : '○'}</span>
                      Uppercase letter
                    </div>
                    <div style={{
                      color: /\d/.test(password) ? '#10B981' : '#6B7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{/\d/.test(password) ? '✓' : '○'}</span>
                      Number
                    </div>
                    <div style={{
                      color: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) ? '#10B981' : '#6B7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password) ? '✓' : '○'}</span>
                      Special character
                    </div>
                  </div>
                  
                  {/* Error Messages */}
                  {passwordErrors.length > 0 && (
                    <div style={{
                      marginTop: '8px',
                      padding: '8px',
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FECACA',
                      borderRadius: '6px'
                    }}>
                      {passwordErrors.map((error, index) => (
                        <div key={index} style={{
                          color: '#DC2626',
                          fontSize: '11px',
                          marginBottom: '2px'
                        }}>
                          • {error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#FBBF24',
                  marginRight: '8px',
                  cursor: 'pointer'
                }}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" style={{
                fontSize: '14px',
                color: '#6B7280',
                cursor: 'pointer'
              }}>
                Remember me
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                color: '#DC2626',
                fontSize: '14px',
                textAlign: 'center',
                padding: '8px',
                backgroundColor: '#FEF2F2',
                borderRadius: '6px',
                border: '1px solid #FECACA'
              }}>
                {error}
              </div>
            )}

            {/* Login Button */}
            <div style={{ marginTop: '8px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '16px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: '#FBBF24',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#F59E0B';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#FBBF24';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }
                }}
              >
                {loading ? (
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #f3f3f3',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                ) : (
                  'Login'
                )}
              </button>
            </div>

            {/* Links */}
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <button
                type="button"
                style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  marginBottom: '8px',
                  display: 'block',
                  transition: 'color 0.2s ease'
                }}
                onClick={() => setShowForgotPassword(!showForgotPassword)}
                onMouseEnter={(e) => e.target.style.color = '#374151'}
                onMouseLeave={(e) => e.target.style.color = '#6B7280'}
              >
                Forgot password?
              </button>
              <button
                type="button"
                style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  display: 'block',
                  transition: 'color 0.2s ease'
                }}
                onClick={() => {/* Handle sign up */}}
                onMouseEnter={(e) => e.target.style.color = '#374151'}
                onMouseLeave={(e) => e.target.style.color = '#6B7280'}
              >
                Don't have an account?
              </button>
            </div>

          </form>

          {/* Forgot Password Form */}
          {showForgotPassword && (
            <div style={{
              marginTop: '24px',
              padding: '24px',
              backgroundColor: '#F9FAFB',
              borderRadius: '8px',
              border: '1px solid #E5E7EB'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                textAlign: 'center',
                marginBottom: '16px'
              }}>
                Reset Password
              </h3>
              <form onSubmit={handleForgotPassword}>
                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="reset-email" style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#111827',
                    marginBottom: '8px'
                  }}>
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      color: '#111827',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'all 0.2s'
                    }}
                    placeholder="Enter your email address"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#FBBF24';
                      e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E5E7EB';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                
                {resetMessage && (
                  <div style={{
                    marginBottom: '16px',
                    padding: '12px',
                    backgroundColor: resetMessage.includes('sent') ? '#D1FAE5' : '#FEE2E2',
                    color: resetMessage.includes('sent') ? '#065F46' : '#DC2626',
                    borderRadius: '6px',
                    fontSize: '14px',
                    textAlign: 'center'
                  }}>
                    {resetMessage}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      backgroundColor: '#FBBF24',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#F59E0B'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#FBBF24'}
                  >
                    Send Reset Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetEmail('');
                      setResetMessage('');
                    }}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      backgroundColor: '#6B7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#4B5563'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#6B7280'}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
