import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Capsules from './pages/Capsules';
import CapsuleDetail from './pages/CapsuleDetail';
import CreateCapsule from './pages/CreateCapsule';
import NotFound from './pages/NotFound';

function App() {
  console.log("App component rendered - Routes configured");
  
  return (
    <Router>
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
  );
}

export default App;