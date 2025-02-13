import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeLandingPage from './pages/HomeLandingPage';
import PatientLoginPage from './pages/patient/PatientLoginPage';
import PatientHomePage from './pages/patient/PatientHomePage';
import PatientReportPage from './pages/patient/PatientReportPage';
import SupportPage from './pages/patient/SupportPage';
import GeneralInstructionsPage from './pages/patient/GeneralInstructionsPage';
import LightingCalibration from './pages/patient/LightingCalibration';
import GazeCalibration from './pages/patient/GazeCalibration';
import NaturesGaze1Instructions from './pages/games/naturesGaze/NaturesGaze1Instructions';
import NaturesGaze1 from './pages/games/naturesGaze/NaturesGaze1';
import NaturesGaze2Instructions from './pages/games/naturesGaze/NaturesGaze2Instructions';
import NaturesGaze2 from './pages/games/naturesGaze/NaturesGaze2';
import PhysicianLoginPage from './pages/physician/PhysicianLoginPage';
import PhysicianSignUp from './pages/physician/PhysicianSignUp';
import PhysicianHomePage from './pages/physician/PhysicianHomePage';
import PhysicianSupportPage from './pages/physician/PhysicianSupportPage';
import PhysicianDailyReports from './pages/physicianReporting/DailyReports';
import PhysicianWeeklyReports from './pages/physicianReporting/WeeklyReports';
import PhysicianAllTimeTrends from './pages/physicianReporting/AllTimeTrends';
import './App.css'; // Global styles

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLandingPage />} />
        <Route path="/patient-login" element={<PatientLoginPage />} />
        <Route path="/patient-home-page" element={<PatientHomePage />} />
        <Route path="/patient-report-page" element={<PatientReportPage />} />
        <Route path="/support-page" element={<SupportPage />} />
        <Route path="/general-instructions" element={<GeneralInstructionsPage />} />
        <Route path="/lighting-calibration" element={<LightingCalibration />} />
        <Route path="/gaze-calibration" element={<GazeCalibration />} />
        <Route path="/natures-gaze-1-instructions" element={<NaturesGaze1Instructions />} />
        <Route path="/natures-gaze-1-game" element={<NaturesGaze1 />} />
        <Route path="/natures-gaze-2-instructions" element={<NaturesGaze2Instructions />} />
        <Route path="/natures-gaze-2-game" element={<NaturesGaze2 />} />
        <Route path="/physician-login" element={<PhysicianLoginPage />} />
        <Route path="/physician-signup" element={<PhysicianSignUp />} />
        <Route path="/physician-home-page" element={<PhysicianHomePage />} />
        <Route path="/physician-daily-report/:patientId" element={<PhysicianDailyReports />} />
        <Route path="/physician-weekly-report" element={<PhysicianWeeklyReports />} />
        <Route path="/physician-all-time-trends" element={<PhysicianAllTimeTrends />} />
        <Route path="/physician-support" element={<PhysicianSupportPage />} />
      </Routes>
    </Router>
  );
};

export default App;
