import { useState } from 'react'
import UploadForm from './components/UploadForm'
import ShareList from './components/ShareList'
import DownloadPage from './components/DownloadPage'
import Home from './Home'
function App() {
  const [refreshKey, setRefreshKey] = useState(0)
  const [codeInput, setCodeInput] = useState('')

  // Simple routing without a library: /s/<code> shows the recipient page
  const match = window.location.pathname.match(/^\/s\/(.+)$/)

  if (window.location.pathname === '/') {
    return <Home />
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Secure File Share</h1>

        {match ? (
          <DownloadPage code={match[1]} />
        ) : window.location.pathname === '/send' ? (
          <>
            <UploadForm onShared={() => setRefreshKey((n) => n + 1)} />
            <ShareList refreshKey={refreshKey} />
          </>
        ) : window.location.pathname === '/receive' ? (
          <div className="bg-white rounded-xl shadow p-6 flex gap-2">
            <input
              placeholder="Have a share code? Enter it here"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              className="border rounded-lg px-3 py-2 flex-1"
            />
            <button
              onClick={() => codeInput && (window.location.href = `/s/${codeInput.trim()}`)}
              className="bg-gray-800 text-white rounded-lg px-4"
            >
              Open
            </button>
          </div>
        ) : (
          <div>Page not found</div>
        )}
      </div>
    </div>
  )
}

export default App
