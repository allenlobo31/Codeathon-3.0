import React, { useState } from 'react';
import './Home.css'; // For navbar styles
import './History.css';

const mockHistoryData = [];

const History = ({ user, onLogout }) => {
  const [filter, setFilter] = useState('all');

  const filteredData = mockHistoryData.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <div className="history-page">
      <div className="history-wrapper">
        
        {/* Navbar Reuse */}
        <nav className="navbar animate-up">
          <a href="/" className="logo" style={{textDecoration: 'none', color: 'inherit'}}>
            <div className="logo-dot"></div>
            VaultX
          </a>
          <div className="nav-links">
            <a href="/history" style={{opacity: 1, borderBottom: '2px solid var(--text-main)'}}>History</a>
            <a href="/my-files">My Files</a>
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

        <div className="history-header animate-up delay-1">
          <div>
            <h1 className="history-title">
              Your <span className="highlight-pill">History</span>
            </h1>
            <p className="history-subtitle">View and manage your recent secure file transfers.</p>
          </div>
          
          <div className="history-controls">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Activity
            </button>
            <button 
              className={`filter-btn ${filter === 'sent' ? 'active' : ''}`}
              onClick={() => setFilter('sent')}
            >
              Sent
            </button>
            <button 
              className={`filter-btn ${filter === 'received' ? 'active' : ''}`}
              onClick={() => setFilter('received')}
            >
              Received
            </button>
          </div>
        </div>

        <div className="history-card animate-up delay-2">
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>File Details</th>
                  <th>Transfer Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{textAlign: 'center'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="file-info">
                          <div className={`file-icon ${item.icon}`}>
                            {item.icon === 'pdf' && (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                            )}
                            {item.icon === 'img' && (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                              </svg>
                            )}
                            {item.icon === 'doc' && (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="file-name">{item.fileName}</div>
                            <div className="file-size">{item.fileSize}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={`transfer-type ${item.type}`}>
                          {item.type === 'sent' ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="19" x2="12" y2="5"></line>
                              <polyline points="5 12 12 5 19 12"></polyline>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <polyline points="19 12 12 19 5 12"></polyline>
                            </svg>
                          )}
                          {item.type === 'sent' ? 'Sent' : 'Received'}
                        </div>
                      </td>
                      <td>{item.date}</td>
                      <td>
                        <span className={`status-pill ${item.status}`}>
                          {item.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td style={{textAlign: 'center'}}>
                        <button className="action-btn" title="View Details">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)'}}>
                      <div style={{fontSize: '1.1rem', marginBottom: '0.5rem'}}>No transfer history found.</div>
                      <div style={{fontSize: '0.9rem', opacity: 0.7}}>Your past files will appear here.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default History;
