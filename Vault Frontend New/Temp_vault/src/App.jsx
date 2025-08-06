import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Capsules from './pages/Capsules'
import CapsuleDetail from './pages/CapsuleDetail'
import CreateCapsule from './pages/CreateCapsule'
import NotFound from './pages/NotFound'

// Route debugger component for development
function RouteDebugger() {
  const location = useLocation()
  
  useEffect(() => {
    console.log('🛣️ Route changed:', location.pathname)
    console.log('🔍 Full location:', location)
  }, [location])
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') return null
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      borderRadius: '0 0 0 8px'
    }}>
      <div>Route: {location.pathname}</div>
      <div>Hash: {location.hash}</div>
      <div>Search: {location.search}</div>
    </div>
  )
}

// Component to handle route loading
function RouteHandler() {
  const location = useLocation()

  useEffect(() => {
    // Log when app loads with direct URL
    if (window.performance.navigation.type === 1) { // TYPE_RELOAD
      console.log('🔄 Page reloaded at:', location.pathname)
    } else if (window.performance.navigation.type === 0) { // TYPE_NAVIGATE
      console.log('🌐 Direct navigation to:', location.pathname)
    }
  }, [location])

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/capsules" element={<Capsules />} />
      <Route path="/capsule/:public_id" element={<CapsuleDetail />} />
      <Route path="/create" element={<CreateCapsule />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  console.log("🚀 App component rendered")
  console.log("🌍 Environment:", process.env.NODE_ENV)
  console.log("🔗 Base URL:", import.meta.env.BASE_URL)
  
  useEffect(() => {
    // Check if running on Vercel
    if (window.location.hostname.includes('vercel.app')) {
      console.log('🚀 Running on Vercel')
    }
    
    // Log initial load info
    console.log('📍 Initial URL:', window.location.href)
    console.log('🛠️ User Agent:', navigator.userAgent)
  }, [])
  
  return (
    <Router>
      <RouteDebugger />
      <div className="min-h-screen bg-background text-foreground font-sans bg-black">
        <RouteHandler />
      </div>
    </Router>
  )
}

export default App