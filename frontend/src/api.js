// All backend calls live here.
export const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

export async function uploadFile(file) {
  const form = new FormData();
  form.append('file', file);
  return handle(await fetch(`${API}/api/files`, { method: 'POST', body: form }));
}

export async function createShare(fileId, expiresInMinutes) {
  return handle(
    await fetch(`${API}/api/shares`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileId, expiresInMinutes }),
    })
  );
}

export async function listShares(q = '', status = '') {
  const params = new URLSearchParams({ q, status });
  return handle(await fetch(`${API}/api/shares?${params}`));
}

export async function getShareInfo(code) {
  return handle(await fetch(`${API}/api/shares/${code}`));
}

export async function revokeShare(code) {
  return handle(await fetch(`${API}/api/shares/${code}/revoke`, { method: 'PATCH' }));
}

export const downloadUrl = (code) => `${API}/api/shares/${code}/download`;
export const shareLink = (code) => `${window.location.origin}/s/${code}`;
