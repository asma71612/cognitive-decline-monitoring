import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LightingCalibration from './pages/LightingCalibration';
import CalibrationPage from './pages/CalibrationPage';
import './App.css'; // Global styles

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LightingCalibration />} />
        <Route path="/calibration" element={<CalibrationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
