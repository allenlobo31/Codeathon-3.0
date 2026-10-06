import React from 'react';
import './Home.css';

const Home = ({ user, onLogout }) => {
  return (
    <div className="home-container">
      <div className="content-wrapper">
        
        {/* Navbar */}
        <nav className="navbar animate-up">
          <div className="logo">
            <div className="logo-dot"></div>
            VaultX
          </div>
          <div className="nav-links">
            <a href="/history">History</a>
          </div>
          <div className="auth-buttons">
            {user ? (
              <>
                <span style={{ marginRight: '1rem', fontWeight: '500' }}>{user.name}</span>
                <button onClick={onLogout} className="btn btn-login" style={{ cursor: 'pointer' }}>Log out</button>
              </>
            ) : (
              <>
                <a href="/signin" className="btn btn-login" style={{textDecoration: 'none'}}>Sign in</a>
                <a href="/signup" className="btn btn-signup" style={{textDecoration: 'none'}}>Sign up</a>
              </>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <div className="welcome-badge animate-up delay-1">
            Welcome to VaultX
          </div>
          
          <h1 className="hero-title animate-up delay-2">
            Secure sharing <br/> 
            important files is <span className="highlight-pill">now simple</span>
          </h1>
          
          <p className="hero-subtitle animate-up delay-3">
            Upload, share, and manage your files with complete control, 
            advanced security, and real-time monitoring.
          </p>

          <div className="action-cards animate-up delay-4">
            <a href="/send" className="action-card send">
              <div className="card-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
              </div>
              <h2 className="card-title">SEND</h2>
              <p className="card-desc">Securely transfer files</p>
              <div className="card-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </a>

            <a href="/receive" className="action-card receive">
              <div className="card-icon-wrapper">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </div>
              <h2 className="card-title">RECEIVE</h2>
              <p className="card-desc">Get files securely</p>
              <div className="card-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </a>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
