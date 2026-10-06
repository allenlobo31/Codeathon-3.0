// All backend calls live here.
export const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function getToken() {
  return localStorage.getItem('token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
}

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

async function fetchWithAuth(endpoint, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API}${endpoint}`, { ...options, headers });
  return handle(res);
}

// --- Auth Endpoints ---

export async function login(email, password) {
  const data = await fetchWithAuth('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function signup(name, email, password, confirmPassword) {
  const data = await fetchWithAuth('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, confirmPassword }),
  });
  setToken(data.token);
  return data;
}

export async function getMe() {
  return fetchWithAuth('/api/auth/me');
}

export function logout() {
  setToken(null);
  window.location.href = '/signin';
}

// --- File & Share Endpoints ---

export async function uploadFile(file) {
  const form = new FormData();
  form.append('file', file);
  return fetchWithAuth('/api/files', { method: 'POST', body: form });
}

export async function createShare(fileId, expiresInMinutes, options = {}) {
  return fetchWithAuth('/api/shares', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId, expiresInMinutes, ...options }),
  });
}

export async function listShares(q = '', status = '') {
  const params = new URLSearchParams({ q, status });
  return fetchWithAuth(`/api/shares?${params}`);
}

export async function getShareInfo(code) {
  return fetchWithAuth(`/api/shares/${code}`);
}

export async function revokeShare(code) {
  return fetchWithAuth(`/api/shares/${code}/revoke`, { method: 'PATCH' });
}

export const downloadUrl = (code) => {
  const token = getToken();
  const url = new URL(`${API}/api/shares/${code}/download`);
  // Note: for direct browser downloads with token, a different strategy is required
  // if it's a restricted share (like fetching blob and triggering download).
  // But for simple links, this works if the backend allows token in query (unlikely) 
  // or if the share is public. See BACKEND.md for restricted download implementation details.
  return url.toString();
};
export const shareLink = (code) => `${window.location.origin}/s/${code}`;
