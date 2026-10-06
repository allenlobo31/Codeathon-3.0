import React, { useState } from 'react';
import { signup } from './api';
import './Home.css';
import './Auth.css';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    try {
      await signup(name, email, password, confirmPassword);
      window.location.href = '/'; // Redirect on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="signup-wrapper animate-up">
        
        <div className="signup-header">
          <div className="logo">
            <div className="logo-dot"></div>
            VaultX
          </div>
          <h1 className="signup-title">
            Securely share with <span className="highlight-pill">VaultX</span>
          </h1>
        </div>
        
        <div className="auth-container glass signup-card">
          <div className="auth-content">
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <div style={{color: 'red', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center'}}>{error}</div>}
              
              <div className="input-group">
                <span className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Name" 
                  className="auth-input" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <span className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                    <path d="M2 4l10 8 10-8"></path>
                  </svg>
                </span>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="auth-input" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <span className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                  </svg>
                </span>
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="auth-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="input-group">
                <span className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0110 0v4"></path>
                  </svg>
                </span>
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  className="auth-input" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>

              <button type="submit" className="auth-submit" style={{marginTop: '1.5rem'}} disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="19" x2="19" y2="5"></line>
                    <polyline points="9 5 19 5 19 15"></polyline>
                  </svg>
                )}
              </button>
            </form>
          </div>
          
          <div className="auth-illustration">
            <div className="illustration-tag" style={{top: '40px', right: '40px'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0110 0v4"></path>
              </svg>
              Encrypted Sharing
            </div>
            {/* Outline Key illustration SVG mockup to match design */}
            <img 
              src="/c29837534474899d5e668cf508cb5da5.jpg" 
              alt="Encrypted Sharing" 
              style={{ width: '80%', height: 'auto', objectFit: 'cover', borderRadius: '12px' }} 
            />
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default SignUp;
