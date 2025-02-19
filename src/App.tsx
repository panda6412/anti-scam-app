import { useEffect, useState } from 'react'
import './App.css'

interface User {
  sub: string
  name: string
  iat: number
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const [jwtToken, setJwtToken] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [log, setLog] = useState<string | null>(null)

  useEffect(() => {
    setJwtToken(localStorage.getItem('jwtToken'))
  }, [])

  useEffect(() => {
    // ✅ Listen for the token from the parent WebView
    setLog('Listening for token')
    const handleMessage = (event: MessageEvent) => {
      if (event.data) {
        setLog('Received token:' + event.data)
        setToken(event.data)
        localStorage.setItem('jwtToken', event.data)
        fetchUser(event.data)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // ✅ Fetch user data from the backend using the received token
  const fetchUser = async (jwt: string) => {
    setLog('Fetching user')
    try {
      // http://localhost:9999
      const response = await fetch('https://964f-211-72-129-103.ngrok-free.app/api/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      })

      if (!response.ok) {
        throw new Error('Unauthorized')
      }

      setLog('User pre fetched: ' + response.status)
      const text = await response.text()
      setLog('User pre fetched: ' + text)
      const data = JSON.parse(text)
      setLog('User fetched: ' + data.user)
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (error) {
      setTimeout(() => {
        setLog('Authentication failed: ' + error)
        console.error('Authentication failed', error)
      }, 5000)
    }
  }

  // useEffect(() => {
  //   const jwtToken =
  //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  //   fetchUser(jwtToken)
  // }, [])

  if (!isAuthenticated) {
    return (
      <div className='flex flex-col h-10'>
        <div className='flex h-screen items-center justify-center text-2xl text-red-500'>
          !!Unauthorized Access {jwtToken || 'no jwtToken'}
        </div>
        <div className='flex h-screen items-center justify-center text-2xl text-yellow-500'>
          !!!!Unauthorized Access {token || 'no token'}
        </div>
        <div className='flex h-screen items-center justify-center text-2xl text-green-500'>{log || 'no log'}</div>
      </div>
    )
  }

  return (
    <div className='p-4'>
      <h1 className='text-xl'>
        Welcome, {user?.name} {token}
      </h1>
    </div>
  )
}

export default App
