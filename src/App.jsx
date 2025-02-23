// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClassicGame from './pages/ClassicGame';
import BorderHopper from './pages/BorderHopper';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ClassicGame />} />
        <Route path="/border-hopper" element={<BorderHopper />} />
      </Routes>
    </Router>
  );
}

export default App;