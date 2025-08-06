import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Capsules from './pages/Capsules';
import CapsuleDetail from './pages/CapsuleDetail';
import CreateCapsule from './pages/CreateCapsule';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/capsules" element={<Capsules />} />
        <Route path="/capsule/:id" element={<CapsuleDetail />} />
        <Route path="/create" element={<CreateCapsule />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
