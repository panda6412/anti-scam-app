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
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setJwtToken(localStorage.getItem('jwtToken'))
  }, [])

  useEffect(() => {
    // ✅ Listen for the token from the parent WebView
    const handleMessage = (event: MessageEvent) => {
      if (event.data) {
        console.log("Received token:", event.data);
        setToken(event.data);
        localStorage.setItem('jwtToken', event.data);
        fetchUser(event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // ✅ Fetch user data from the backend using the received token
  const fetchUser = async (jwt: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setUser(data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication failed', error);
    }
  };

  if (!isAuthenticated) {
    return <div className='flex h-screen items-center justify-center text-2xl text-red-500'>!!Unauthorized Access {jwtToken || 'no token'}</div>
  }

  return (
    <div className='p-4'>
      <h1 className='text-xl'>Welcome, {user?.name} {token}</h1>
    </div>
  )
}

export default App
