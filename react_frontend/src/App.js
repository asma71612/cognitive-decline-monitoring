import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeLandingPage from './pages/HomeLandingPage';
import PatientLoginPage from './pages/patient/PatientLoginPage';
import PatientHomePage from './pages/patient/PatientHomePage';
import PatientReportingLandingPage from './pages/patient/PatientReportingLandingPage';
import SupportPage from './pages/patient/SupportPage';
import GeneralInstructionsPage from './pages/patient/GeneralInstructionsPage';
import LightingCalibration from './pages/patient/LightingCalibration';
import GazeCalibration from './pages/patient/GazeCalibration';
import NaturesGaze1Instructions from './pages/games/naturesGaze/NaturesGaze1Instructions';
import NaturesGaze1 from './pages/games/naturesGaze/NaturesGaze1';
import PhysicianLoginPage from './pages/physician/PhysicianLoginPage';
import PhysicianSignUp from './pages/physician/PhysicianSignUp';
import PhysicianHomePage from './pages/physician/PhysicianHomePage';
import './App.css'; // Global styles

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLandingPage />} />
        <Route path="/patient-login" element={<PatientLoginPage />} />
        <Route path="/patient-home-page" element={<PatientHomePage />} />
        <Route path="/patient-reporting-landing-page" element={<PatientReportingLandingPage />} />
        <Route path="/support-page" element={<SupportPage />} />
        <Route path="/general-instructions" element={<GeneralInstructionsPage />} />
        <Route path="/lighting-calibration" element={<LightingCalibration />} />
        <Route path="/gaze-calibration" element={<GazeCalibration />} />
        <Route path="/natures-gaze-1-instructions" element={<NaturesGaze1Instructions />} />
        <Route path="/natures-gaze-1-game" element={<NaturesGaze1 />} />
        <Route path="/physician-login" element={<PhysicianLoginPage />} />
        <Route path="/physician-signup" element={<PhysicianSignUp />} />
        <Route path="/physician-home-page" element={<PhysicianHomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
