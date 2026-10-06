import { useState } from 'react'
import { uploadFile, createShare, shareLink } from '../api'

const EXPIRY_OPTIONS = [
  { label: '1 hour', value: 60 },
  { label: '1 day', value: 1440 },
  { label: '7 days', value: 10080 },
]

export default function UploadForm({ onShared }) {
  const [file, setFile] = useState(null)
  const [expiry, setExpiry] = useState(60)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) return setError('Please choose a file')
    setError('')
    setLink('')
    setLoading(true)
    try {
      const uploaded = await uploadFile(file)
      const share = await createShare(uploaded.id, expiry)
      setLink(shareLink(share.code))
      setFile(null)
      e.target.reset()
      onShared()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-lg font-semibold">Share a file</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      <div>
        <label className="block text-sm text-gray-600 mb-1">Link expires after</label>
        <select
          value={expiry}
          onChange={(e) => setExpiry(Number(e.target.value))}
          className="border rounded-lg px-3 py-2 w-full"
        >
          {EXPIRY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <button
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload and create link'}
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {link && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <input readOnly value={link} className="flex-1 bg-transparent text-sm outline-none" />
          <button type="button" onClick={copyLink} className="text-sm text-green-700 font-medium">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )}
    </form>
  )
}
