import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeLandingPage from './pages/HomeLandingPage';
import PatientLoginPage from './pages/patient/PatientLoginPage';
import PatientHomePage from './pages/patient/PatientHomePage';
import PatientReportingLandingPage from './pages/patient/PatientReportingLandingPage';
import InfoPage from './pages/patient/InfoPage';
import GeneralInstructionsPage from './pages/patient/GeneralInstructionsPage';
import LightingCalibration from './pages/patient/LightingCalibration';
import GazeCalibration from './pages/patient/GazeCalibration';
import ProsaccadeInstructions from './pages/games/prosaccade/ProsaccadeInstructions';
import ProsaccadeGame from './pages/games/prosaccade/ProsaccadeGame';
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
        <Route path="/prosaccade-instructions" element={<ProsaccadeInstructions />} />
        <Route path="/prosaccade-game" element={<ProsaccadeGame />} />
      </Routes>
    </Router>
  );
};

export default App;
