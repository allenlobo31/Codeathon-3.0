import { useState, useEffect } from 'react'
import { getMe, logout } from './api'
import UploadForm from './components/UploadForm'
import ShareList from './components/ShareList'
import DownloadPage from './components/DownloadPage'
import SendFilePage from './components/SendFilePage'
import ReceiveFilePage from './components/ReceiveFilePage'
import Home from './Home'
import SignIn from './SignIn'
import SignUp from './SignUp'
import History from './History'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then(data => {
        if (data && data.id) {
          setUser(data);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [])

  // Simple routing without a library: /s/<code> shows the recipient page
  const match = window.location.pathname.match(/^\/s\/(.+)$/)
  const path = window.location.pathname.toLowerCase()

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--primary-bg)' }}>Loading...</div>
  }

  if (path === '/' || path === '/home') {
    return <Home user={user} onLogout={logout} />
  }

  if (path.startsWith('/send')) {
    return <SendFilePage user={user} />
  }

  if (path.startsWith('/receive')) {
    return <ReceiveFilePage user={user} />
  }

  if (window.location.pathname === '/history') {
    return <History user={user} onLogout={logout} />
  }

  if (path === '/signin') {
    return <SignIn />
  }

  if (path === '/signup') {
    return <SignUp />
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center">Secure File Share</h1>

        {match ? (
          <DownloadPage code={match[1]} />
        ) : (
          <div>Page not found</div>
        )}
      </div>
    </div>
  )
}

export default App
