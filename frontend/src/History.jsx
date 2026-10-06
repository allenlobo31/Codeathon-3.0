import React, { useEffect, useState } from 'react';
import './Home.css';
import './History.css';
import { getActivity, listShares, logout, revokeShare, shareLink } from './api';

const formatDate = (value) => value
  ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
  : '-';

const formatSize = (bytes) => `${((bytes || 0) / (1024 * 1024)).toFixed(2)} MB`;

export default function History({ user, onLogout }) {
  const [shares, setShares] = useState([]);
  const [activity, setActivity] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('all');
  const [activityFilter, setActivityFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revoking, setRevoking] = useState('');

  useEffect(() => {
    if (!user) {
      window.location.href = '/signin';
      return;
    }

    setLoading(true);
    Promise.all([
      listShares(query, status),
      getActivity({ q: query, ...(activityFilter !== 'all' && { outcome: activityFilter }) }),
    ])
      .then(([shareData, activityData]) => {
        setShares(Array.isArray(shareData) ? shareData : []);
        setActivity(Array.isArray(activityData) ? activityData : []);
        setError('');
      })
      .catch((requestError) => setError(requestError.message || 'Could not load history'))
      .finally(() => setLoading(false));
  }, [user, query, status, activityFilter]);

  const handleRevoke = async (share) => {
    if (!window.confirm(`Revoke access to ${share.fileName}?`)) return;
    setRevoking(share.code);
    try {
      await revokeShare(share.code);
      setShares((current) => current.map((item) => item.code === share.code
        ? { ...item, status: 'revoked', revokedAt: new Date().toISOString() }
        : item));
    } catch (requestError) {
      setError(requestError.message || 'Could not revoke access');
    } finally {
      setRevoking('');
    }
  };

  const copyCode = async (code) => {
    await navigator.clipboard?.writeText(code);
  };

  const visibleShares = shares.filter((share) => type === 'all' || share.type === type);

  if (!user) return null;

  return (
    <div className="history-page">
      <div className="history-wrapper">
        <nav className="navbar animate-up">
          <a href="/" className="logo" style={{ textDecoration: 'none', color: 'inherit' }}><div className="logo-dot" />VaultX</a>
          <div className="nav-links"><a href="/history" style={{ opacity: 1, borderBottom: '2px solid var(--text-main)' }}>History</a></div>
          <div className="auth-buttons"><span style={{ marginRight: '1rem', fontWeight: '500' }}>{user.name}</span><button onClick={onLogout || logout} className="btn btn-login">Log out</button></div>
        </nav>

        <div className="history-header animate-up delay-1">
          <div><h1 className="history-title">Your <span className="highlight-pill">History</span></h1><p className="history-subtitle">Track uploads, downloads, views, and access attempts.</p></div>
          <div className="history-controls">
            <button className={`filter-btn ${type === 'all' ? 'active' : ''}`} onClick={() => setType('all')}>All</button>
            <button className={`filter-btn ${type === 'sent' ? 'active' : ''}`} onClick={() => setType('sent')}>Uploaded</button>
            <button className={`filter-btn ${type === 'received' ? 'active' : ''}`} onClick={() => setType('received')}>Downloaded</button>
          </div>
        </div>

        <div className="history-card animate-up delay-2">
          <div className="history-toolbar">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search file, recipient, or email" />
            <select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option><option value="active">Active</option><option value="expired">Expired</option><option value="revoked">Revoked</option><option value="limit_reached">Limit reached</option></select>
          </div>
          {loading ? <p className="history-empty">Loading history...</p> : error ? <p className="history-empty error">{error}</p> : visibleShares.length === 0 ? <p className="history-empty">No transfer history found.</p> : (
            <div className="history-table-wrapper"><table className="history-table"><thead><tr><th>File</th><th>Type</th><th>Status</th><th>Downloads</th><th>Date</th><th>Actions</th></tr></thead><tbody>
              {visibleShares.map((share) => <tr key={`${share.code}-${share.type}`}>
                <td><div className="file-name">{share.fileName}</div><div className="file-size">{formatSize(share.size)} · Code {share.code}</div></td>
                <td><span className={`transfer-type ${share.type}`}>{share.type === 'sent' ? 'Uploaded' : 'Downloaded'}{share.type === 'received' && share.timesReceived > 1 ? ` (${share.timesReceived}x)` : ''}</span></td>
                <td><span className={`status-pill ${share.status === 'active' ? 'completed' : 'pending'}`}>{share.status.replace('_', ' ')}</span></td>
                <td>{share.downloadCount}{share.maxDownloads === null ? ' / unlimited' : ` / ${share.maxDownloads}`}</td>
                <td>{formatDate(share.type === 'received' ? share.receivedAt : share.createdAt)}</td>
                <td className="history-actions"><button onClick={() => copyCode(share.code)} title="Copy code">Copy code</button>{share.type === 'sent' && share.status === 'active' && <button onClick={() => handleRevoke(share)} disabled={revoking === share.code} className="danger">{revoking === share.code ? 'Revoking...' : 'Revoke access'}</button>}</td>
              </tr>)}
            </tbody></table></div>
          )}
        </div>

        <div className="history-card activity-card animate-up delay-3">
          <div className="activity-heading"><div><h2>Download tracking</h2><p>Uploads are listed above; this feed records views, downloads, and denied attempts.</p></div><select value={activityFilter} onChange={(event) => setActivityFilter(event.target.value)}><option value="all">All attempts</option><option value="allowed">Allowed</option><option value="denied">Denied</option></select></div>
          {activity.length === 0 ? <p className="history-empty">No access activity found.</p> : <div className="history-table-wrapper"><table className="history-table"><thead><tr><th>File</th><th>Action</th><th>Result</th><th>User</th><th>Time</th></tr></thead><tbody>{activity.map((event, index) => <tr key={`${event.code}-${event.at}-${index}`}><td><div className="file-name">{event.fileName || 'Unknown file'}</div><div className="file-size">Code {event.code}</div></td><td>{event.action === 'view' ? 'Viewed' : 'Downloaded'}</td><td><span className={`status-pill ${event.outcome === 'allowed' ? 'completed' : 'pending'}`}>{event.outcome}{event.reason ? ` · ${event.reason.replace('_', ' ')}` : ''}</span></td><td>{event.email || 'Guest'}</td><td>{formatDate(event.at)}</td></tr>)}</tbody></table></div>}
        </div>
      </div>
    </div>
  );
}
