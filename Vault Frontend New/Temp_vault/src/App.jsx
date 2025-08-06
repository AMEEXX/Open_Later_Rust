import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Capsules from './pages/Capsules'
import CapsuleDetail from './pages/CapsuleDetail'
import CreateCapsule from './pages/CreateCapsule'
import NotFound from './pages/NotFound'

// Debug component to show current route info
function RouteDebugger() {
  const location = useLocation()
  
  if (import.meta.env.DEV) {
    return (
      <div className="fixed top-0 left-0 bg-black/90 text-white p-2 text-xs z-50 border-b border-gray-600">
        <div>🌐 URL: {window.location.href}</div>
        <div>📍 Pathname: {location.pathname}</div>
        <div>🔍 Search: {location.search}</div>
        <div>🏷️ Hash: {location.hash}</div>
      </div>
    )
  }
  return null
}

function App() {
  console.log("🚀 App component rendered")
  
  return (
    <Router>
      <RouteDebugger />
      <div className="min-h-screen bg-background text-foreground font-sans bg-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capsules" element={<Capsules />} />
          
          {/* Try multiple route patterns to see which one works */}
          <Route path="/capsule/:public_id" element={<CapsuleDetail />} />
          <Route path="/capsule/:id" element={<CapsuleDetail />} />
          <Route path="/capsule/:publicId" element={<CapsuleDetail />} />
          
          <Route path="/create" element={<CreateCapsule />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App