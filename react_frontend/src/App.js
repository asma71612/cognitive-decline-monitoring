import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeLandingPage from './pages/HomeLandingPage';
import PatientLoginPage from './pages/PatientLoginPage';
import PatientHomePage from './pages/PatientHomePage';
import PatientReportingLandingPage from './pages/PatientReportingLandingPage';
import InfoPage from './pages/InfoPage';
import GeneralInstructionsPage from './pages/GeneralInstructionsPage';
import LightingCalibration from './pages/LightingCalibration';
import GazeCalibration from './pages/GazeCalibration';
import './App.css'; // Global styles

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLandingPage />} />
        <Route path="/patient-login" element={<PatientLoginPage />} />
        <Route path="/patient-home-page" element={<PatientHomePage />} />
        <Route path="/patient-reporting-landing-page" element={<PatientReportingLandingPage />} />
        <Route path="/info-page" element={<InfoPage />} />
        <Route path="/general-instructions" element={<GeneralInstructionsPage />} />
        <Route path="/lighting-calibration" element={<LightingCalibration />} />
        <Route path="/gaze-calibration" element={<GazeCalibration />} />
      </Routes>
    </Router>
  );
};

export default App;
