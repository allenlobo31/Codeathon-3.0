import { useEffect, useState } from 'react'
import { listShares, revokeShare, shareLink } from '../api'
import { formatSize, formatDate } from '../utils'
import StatusBadge from './StatusBadge'

export default function ShareList({ refreshKey }) {
  const [shares, setShares] = useState([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [reload, setReload] = useState(0)

  useEffect(() => {
    listShares(q, status).then(setShares).catch(() => setShares([]))
  }, [q, status, refreshKey, reload])

  async function handleRevoke(code) {
    if (!confirm('Revoke this link? It will stop working immediately.')) return
    await revokeShare(code)
    setReload((n) => n + 1)
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold">Shared files</h2>

      <div className="flex gap-2">
        <input
          placeholder="Search by file name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="revoked">Revoked</option>
        </select>
      </div>

      {shares.length === 0 ? (
        <p className="text-sm text-gray-500">No shares found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2">File</th>
                <th>Status</th>
                <th>Expires</th>
                <th>Downloads</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shares.map((s) => (
                <tr key={s.code} className="border-b last:border-0">
                  <td className="py-2">
                    <div className="font-medium">{s.fileName}</div>
                    <div className="text-xs text-gray-500">{formatSize(s.size)}</div>
                  </td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>{formatDate(s.expiresAt)}</td>
                  <td>{s.downloadCount}</td>
                  <td className="space-x-3 text-right">
                    <button
                      onClick={() => navigator.clipboard.writeText(shareLink(s.code))}
                      className="text-blue-600 hover:underline"
                    >
                      Copy link
                    </button>
                    {s.status === 'active' && (
                      <button onClick={() => handleRevoke(s.code)} className="text-red-600 hover:underline">
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
