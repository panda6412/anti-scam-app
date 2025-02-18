// src/App.tsx
import { useEffect, useState } from 'react'
import { Routes, Route, useSearchParams } from 'react-router'
import { jwtDecode } from 'jwt-decode'
import './App.css'

interface User {
  sub: string
  name: string
  iat: number
}

function Home() {
  return <h1 className='text-2xl'>Home Page</h1>
}

function Dashboard() {
  return <h1 className='text-2xl'>Dashboard</h1>
}

function App() {
  const [searchParams] = useSearchParams()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = searchParams.get('jwtToken')
    if (token) {
      try {
        const decoded = jwtDecode<User>(token)
        console.log(decoded)
        setUser(decoded)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Invalid JWT Token', error)
      }
    }
  }, [searchParams])

  if (!isAuthenticated) {
    return <div className='flex h-screen items-center justify-center text-2xl text-red-500'>Unauthorized Access</div>
  }

  return (
    <div className='p-4'>
      <h1 className='text-xl'>Welcome, {user?.name}</h1>
      <nav>
        <a href='/' className='mr-4'>
          Home
        </a>
        <a href='/dashboard'>Dashboard</a>
      </nav>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
