import { useEffect, useState } from 'react'
import { getShareInfo, downloadUrl } from '../api'
import { formatSize, formatDate } from '../utils'
import StatusBadge from './StatusBadge'

export default function DownloadPage({ code }) {
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getShareInfo(code).then(setInfo).catch((e) => setError(e.message))
  }, [code])

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

          {info.status === 'active' ? (
            <a
              href={downloadUrl(code)}
              className="block bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700"
            >
              Download
            </a>
          ) : (
            <p className="text-red-600 text-sm">This link is no longer available.</p>
          )}
        </>
      )}

      <a href="/" className="block text-sm text-blue-600 hover:underline">Back to home</a>
    </div>
  )
}
