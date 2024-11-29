import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CalibrationPage from './pages/CalibrationPage';
import './App.css'; // Global styles

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calibration" element={<CalibrationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
