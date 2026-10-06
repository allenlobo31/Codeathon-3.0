import React, { useState, useEffect } from 'react';
import './Home.css'; // For navbar styles
import './History.css';
import { listShares } from './api';

const History = ({ user, onLogout }) => {
  const [filter, setFilter] = useState('all');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    // History is private: send logged-out visitors to sign in
    if (!user) {
      window.location.href = '/signin';
      return;
    }
    listShares()
      .then(data => setHistoryData(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message || 'Could not load history'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.code);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      window.prompt('Share code:', item.code);
    }
  };

  const formatDate = (value) =>
    value ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '-';

  const formatStatus = (status = '') =>
    status ? status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ') : 'Unknown';

  const filteredData = historyData.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  if (!user) return null;

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
            <span style={{ marginRight: '1rem', fontWeight: '500' }}>{user.name}</span>
            <button onClick={onLogout} className="btn btn-login" style={{ cursor: 'pointer' }}>Log out</button>
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
                {loading ? (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)'}}>Loading history...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" style={{textAlign: 'center', padding: '4rem 1rem', color: '#dc2626'}}>{error}</td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map(item => {
                    const fileName = String(item.fileName || 'Unnamed file');
                    const lowerName = fileName.toLowerCase();
                    return (
                    <tr key={`${item.id}-${item.type}`}>
                      <td>
                        <div className="file-info">
                          <div className="file-icon doc">
                            {lowerName.endsWith('.pdf') ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                            ) : lowerName.match(/\.(jpg|jpeg|png|gif|webp)$/) ? (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                              </svg>
                            ) : (
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="file-name">{fileName}</div>
                            <div className="file-size">{((item.size || 0) / (1024 * 1024)).toFixed(2)} MB · Code {item.code}</div>
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
                      <td>{formatDate(item.type === 'received' && item.receivedAt ? item.receivedAt : item.createdAt)}</td>
                      <td>
                        <span className={`status-pill ${item.status === 'active' ? 'completed' : 'pending'}`}>
                          {formatStatus(item.status)}
                        </span>
                      </td>
                      <td style={{textAlign: 'center'}}>
                        <button
                          id={`history-copy-${item.id}`}
                          className="action-btn"
                          title={copiedId === item.id ? 'Copied!' : 'Copy share code'}
                          onClick={() => handleCopy(item)}
                        >
                          {copiedId === item.id ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                          )}
                        </button>
                      </td>
                    </tr>
                    );
                  })
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
