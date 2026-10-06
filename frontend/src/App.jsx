import { useState } from 'react'
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
  const [refreshKey, setRefreshKey] = useState(0)
  const [codeInput, setCodeInput] = useState('')

  // Simple routing without a library: /s/<code> shows the recipient page
  const match = window.location.pathname.match(/^\/s\/(.+)$/)

  const path = window.location.pathname.toLowerCase()
  if (path === '/' || path === '/home') {
    return <Home />
  }

  if (path.startsWith('/send')) {
    return <SendFilePage />
  }

  if (path.startsWith('/receive')) {
    return <ReceiveFilePage />
  }

  if (window.location.pathname === '/history') {
    return <History />
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
