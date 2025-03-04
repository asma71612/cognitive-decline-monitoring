import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeLandingPage from './pages/HomeLandingPage';
import PatientLoginPage from './pages/patient/PatientLoginPage';
import PatientHomePage from './pages/patient/PatientHomePage';
import PatientReportPage from './pages/patient/PatientReportPage';
import SupportPage from './pages/patient/SupportPage';
import GeneralInstructionsPage from './pages/patient/GeneralInstructionsPage';
import InstructionsPage from './pages/patient/InstructionsPage';
import LightingCalibration from './pages/patient/LightingCalibration';
import GazeCalibration from './pages/patient/GazeCalibration';
import NaturesGaze1Instructions from './pages/games/naturesGaze/NaturesGaze1Instructions';
import NaturesGaze1 from './pages/games/naturesGaze/NaturesGaze1';
import NaturesGaze2Instructions from './pages/games/naturesGaze/NaturesGaze2Instructions';
import NaturesGaze2 from './pages/games/naturesGaze/NaturesGaze2';
import MemoryVaultStartInstructions from './pages/games/memoryVault/MemoryVaultStartInstructions';
import MemoryVaultRecallInstructions from './pages/games/memoryVault/MemoryVaultRecallInstructions';
import MemoryVaultStart from './pages/games/memoryVault/MemoryVaultStart';
import MemoryVaultRecall from './pages/games/memoryVault/MemoryVaultRecall';
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
        <Route path="/home" element={<HomeLandingPage />} />
        <Route path="/patient-login" element={<PatientLoginPage />} />
        <Route path="/patient-home-page/:userId" element={<PatientHomePage />} />
        <Route path="/patient-report-page/:userId" element={<PatientReportPage />} />
        <Route path="/support-page" element={<SupportPage />} />
        <Route path="/general-instructions/:userId" element={<GeneralInstructionsPage />} />
        <Route path="/instructions/:userId" element={<InstructionsPage />} />
        <Route path="/lighting-calibration" element={<LightingCalibration />} />
        <Route path="/gaze-calibration" element={<GazeCalibration />} />
        <Route path="/natures-gaze-1-instructions" element={<NaturesGaze1Instructions />} />
        <Route path="/natures-gaze-1-game" element={<NaturesGaze1 />} />
        <Route path="/natures-gaze-2-instructions" element={<NaturesGaze2Instructions />} />
        <Route path="/natures-gaze-2-game" element={<NaturesGaze2 />} />
        <Route path="/memory-vault-start-instructions/:userId" element={<MemoryVaultStartInstructions />} />
        <Route path="/memory-vault-recall-instructions/:userId" element={<MemoryVaultRecallInstructions />} />
        <Route path="/memory-vault-start/:userId" element={<MemoryVaultStart />} />
        <Route path="/memory-vault-recall/:userId" element={<MemoryVaultRecall />} />
        <Route path="/physician-login" element={<PhysicianLoginPage />} />
        <Route path="/physician-signup" element={<PhysicianSignUp />} />
        <Route path="/physician-home-page" element={<PhysicianHomePage />} />
        <Route path="/physician-daily-report/:userId" element={<PhysicianDailyReports />} />
        <Route path="/physician-weekly-report" element={<PhysicianWeeklyReports />} />
        <Route path="/physician-all-time-trends/:userId" element={<PhysicianAllTimeTrends />} />
        <Route path="/physician-support" element={<PhysicianSupportPage />} />
      </Routes>
    </Router>
  );
};

export default App;
