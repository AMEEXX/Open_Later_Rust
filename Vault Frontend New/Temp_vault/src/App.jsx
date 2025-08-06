import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Capsules from './pages/Capsules'
import CapsuleDetail from './pages/CapsuleDetail'
import CreateCapsule from './pages/CreateCapsule'
import NotFound from './pages/NotFound'




  
  return (
    <Router>
      <RouteDebugger />
      <div className="min-h-screen bg-background text-foreground font-sans bg-black">
        <RouteHandler />
      </div>
    </Router>
  )


export default App