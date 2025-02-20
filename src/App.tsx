/* eslint-disable @typescript-eslint/no-explicit-any */
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

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  useEffect(() => {
    setJwtToken(localStorage.getItem('jwtToken'))
  }, [])

  useEffect(() => {
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

  useEffect(() => {
    // ✅ Read the injected JWT token
    const checkInjectedToken = setInterval(() => {
      const injectedToken = (window as any).injectedToken;
      if (injectedToken) {
        setToken(injectedToken);
        setLog("Received token:" + injectedToken);
        fetchUser(injectedToken)
        clearInterval(checkInjectedToken);
      }
    }, 500);
  }, []);

  const fetchUser = async (jwt: string) => {
    setLog('Fetching user')
    try {
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
      const data = await response.json()
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

  // ✅ Handle File Selection and Preview
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // ✅ Upload Image to Backend
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first.')
      return
    }
    setUploadStatus('Uploading...')

    const formData = new FormData()
    formData.append('image', selectedFile)

    try {
      const response = await fetch('https://964f-211-72-129-103.ngrok-free.app/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setUploadStatus(`Upload successful! Image URL: ${data.imageUrl}`)
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadStatus('Upload failed. Please try again.')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className='flex flex-col h-10'>
        <h1>JWT Token in WebView:</h1>
        <div className='text-2xl text-orange-300'>{token ? token : "Waiting for token..."}</div>
        <div className='flex h-screen items-center justify-center text-2xl text-red-500'>
          !!!!Unauthorized Access {jwtToken || 'no jwtToken'}
        </div>
        <div className='flex h-screen items-center justify-center text-2xl text-yellow-500'>
          !!!!!Unauthorized Access {token || 'no token'}
        </div>
        <div className='flex h-screen items-center justify-center text-2xl text-green-500'>{log || 'no log'}</div>
      </div>
    )
  }

  return (
    <div className='p-4'>
      <h1 className='text-xl'>
        Welcome, {user?.name}
      </h1>

      {/* ✅ Image Upload Section */}
      <div className="mt-4">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2 w-40 h-40 object-cover" />}
        <button
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleUpload}
        >
          Upload Image
        </button>
        {uploadStatus && <p className="mt-2 text-gray-700">{uploadStatus}</p>}
      </div>
    </div>
  )
}

export default App