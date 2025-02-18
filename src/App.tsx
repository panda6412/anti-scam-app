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

  useEffect(() => {
    setJwtToken(localStorage.getItem('jwtToken'))
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      console.log('xx', localStorage.getItem('jwtToken'))
      try {
        const response = await fetch('http://localhost:3000/api/user', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // or sessionStorage
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Unauthorized')
        }

        const data = await response.json()
        setUser(data.user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Authentication failed', error)
      }
    }

    fetchUser()
  }, [])

  if (!isAuthenticated) {
    return <div className='flex h-screen items-center justify-center text-2xl text-red-500'>!Unauthorized Access {jwtToken || 'no token'}</div>
  }

  return (
    <div className='p-4'>
      <h1 className='text-xl'>Welcome, {user?.name}</h1>
    </div>
  )
}

export default App
