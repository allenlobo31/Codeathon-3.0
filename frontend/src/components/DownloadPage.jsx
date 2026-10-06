import { useEffect, useState } from 'react'
import { downloadShare, getShareInfo } from '../api'
import { formatSize, formatDate } from '../utils'
import StatusBadge from './StatusBadge'

export default function DownloadPage({ code }) {
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    getShareInfo(code).then(setInfo).catch((e) => setError(e.message))
  }, [code])

  async function handleDownload() {
    setDownloading(true)
    setError('')
    try {
      const result = await downloadShare(code)
      const url = URL.createObjectURL(result.blob)
      const link = document.createElement('a')
      link.href = url
      link.download = info.fileName
      link.click()
      URL.revokeObjectURL(url)
      setInfo((current) => current && current.maxDownloads != null
        ? { ...current, remainingDownloads: Math.max(current.remainingDownloads - 1, 0) }
        : current)
    } catch (downloadError) {
      setError(downloadError.message)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6 space-y-4 text-center">
      {error && <p className="text-red-600">{error}</p>}
      {!info && !error && <p className="text-gray-500">Loading...</p>}

      {info && (
        <>
          <h2 className="text-lg font-semibold break-all">{info.fileName}</h2>
          <p className="text-sm text-gray-500">{formatSize(info.size)}</p>
          <StatusBadge status={info.status} />
          <p className="text-sm text-gray-500">Expires: {formatDate(info.expiresAt)}</p>

          {info.status === 'active' && info.accessAllowed ? (
            <>
              <button
                onClick={handleDownload}
                disabled={downloading || info.remainingDownloads === 0}
                className="block w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {downloading ? 'Downloading...' : info.remainingDownloads === 0 ? 'Download limit reached' : 'Download'}
              </button>
              {info.maxDownloads != null && <p className="text-xs text-gray-500">{info.remainingDownloads} download(s) remaining</p>}
            </>
          ) : info.requiresLogin ? (
            <p className="text-red-600 text-sm">Sign in with an authorized email to access this file.</p>
          ) : info.status === 'active' ? (
            <p className="text-red-600 text-sm">Your account is not authorized to access this file.</p>
          ) : (
            <p className="text-red-600 text-sm">This link is no longer available.</p>
          )}
        </>
      )}

      <a href="/" className="block text-sm text-blue-600 hover:underline">Back to home</a>
    </div>
  )
}
