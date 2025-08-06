import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Capsules from './pages/Capsules'
import CapsuleDetail from './pages/CapsuleDetail'
import CreateCapsule from './pages/CreateCapsule'
import NotFound from './pages/NotFound'

// Route debugger component for development
function RouteDebugger() {
  const location = useLocation()
  
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
      zIndex: 9999
    }}>
      Current Route: {location.pathname}
    </div>
  )
}

function App() {
  console.log("App component rendered")
  
  return (
    <Router>
      <RouteDebugger />
      <div className="min-h-screen bg-background text-foreground font-sans bg-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capsules" element={<Capsules />} />
          <Route path="/capsule/:public_id" element={<CapsuleDetail />} />
          <Route path="/create" element={<CreateCapsule />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App