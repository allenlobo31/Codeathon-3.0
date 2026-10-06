import React from 'react';
import './Home.css';
import './Auth.css';

const SignIn = () => {
  return (
    <div className="auth-page">
      <div className="auth-container animate-up">
        <div className="auth-content">
          <h1 className="auth-title">
            Welcome back<br />to <span className="highlight-pill">VaultX</span>
          </h1>
          
          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="M2 4l10 8 10-8"></path>
                </svg>
              </span>
              <input type="email" placeholder="Email Address" className="auth-input" required />
            </div>

            <div className="input-group">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0110 0v4"></path>
                </svg>
              </span>
              <input type="password" placeholder="Password" className="auth-input" required />
            </div>

            <button type="submit" className="auth-submit">
              Sign In 
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="19" x2="19" y2="5"></line>
                <polyline points="9 5 19 5 19 15"></polyline>
              </svg>
            </button>
            
            <div className="auth-footer">
              New to VaultX? <a href="/signup">Create Account ↗</a>
            </div>
          </form>
        </div>
        
        <div className="auth-illustration">
          <div className="illustration-box">
            <div className="illustration-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0110 0v4"></path>
              </svg>
              Security First
            </div>
            {/* Key illustration SVG mockup */}
            <svg width="120" height="120" viewBox="0 0 24 24" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{transform: 'rotate(-45deg)'}}>
              <circle cx="15" cy="15" r="6"></circle>
              <path d="M2.5 2.5L9 9"></path>
              <path d="M4 10l-2 2 2 2"></path>
              <path d="M8 6l-2-2-2 2"></path>
              <circle cx="15" cy="15" r="2" fill="white"></circle>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
