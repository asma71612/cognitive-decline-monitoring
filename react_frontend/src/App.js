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
import GazeCalibrationInstructions from './pages/patient/GazeCalibrationInstructions';
import NaturesGazeInstructions from './pages/patient/NaturesGazeInstructions';
import NaturesGaze from './pages/patient/NaturesGaze';
import NaturesGaze1Instructions from './pages/games/naturesGaze/NaturesGaze1Instructions';
import NaturesGaze1 from './pages/games/naturesGaze/NaturesGaze1';
import NaturesGaze2Instructions from './pages/games/naturesGaze/NaturesGaze2Instructions';
import NaturesGaze2 from './pages/games/naturesGaze/NaturesGaze2';
import MemoryVaultStartInstructions from './pages/games/memoryVault/MemoryVaultStartInstructions';
import MemoryVaultRecallInstructions from './pages/games/memoryVault/MemoryVaultRecallInstructions';
import MemoryVaultStart from './pages/games/memoryVault/MemoryVaultStart';
import MemoryVaultRecall from './pages/games/memoryVault/MemoryVaultRecall';
import ProcessQuestInstructions from './pages/games/processQuest/ProcessQuestInstructions';
import ProcessQuest from './pages/games/processQuest/ProcessQuest';
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
        <Route path="/support-page/:userId" element={<SupportPage />} />
        <Route path="/general-instructions/:userId" element={<GeneralInstructionsPage />} />
        <Route path="/instructions/:userId" element={<InstructionsPage />} />
        <Route path="/lighting-calibration" element={<LightingCalibration />} />
        <Route path="/gaze-calibration-instructions/:userId" element={<GazeCalibrationInstructions />} />
        <Route path="/gaze-calibration-instructions" element={<GazeCalibrationInstructions />} />
        <Route path="/gaze-calibration/:userId" element={<GazeCalibration />} />
        <Route path="/gaze-calibration" element={<GazeCalibration />} />
        <Route path="/natures-gaze-instructions/:userId" element={<NaturesGazeInstructions />} />
        <Route path="/natures-gaze-instructions" element={<NaturesGazeInstructions />} />
        <Route path="/natures-gaze/:userId" element={<NaturesGaze />} />
        <Route path="/natures-gaze" element={<NaturesGaze />} />
        <Route path="/natures-gaze-1-instructions" element={<NaturesGaze1Instructions />} />
        <Route path="/natures-gaze-1-game" element={<NaturesGaze1 />} />
        <Route path="/natures-gaze-2-instructions" element={<NaturesGaze2Instructions />} />
        <Route path="/natures-gaze-2-game" element={<NaturesGaze2 />} />
        <Route path="/memory-vault-start-instructions/:userId" element={<MemoryVaultStartInstructions />} />
        <Route path="/memory-vault-recall-instructions/:userId" element={<MemoryVaultRecallInstructions />} />
        <Route path="/memory-vault-start/:userId" element={<MemoryVaultStart />} />
        <Route path="/memory-vault-recall/:userId" element={<MemoryVaultRecall />} />
        <Route path="/process-quest-instructions/:userId" element={<ProcessQuestInstructions />} />
        <Route path="/process-quest/:userId" element={<ProcessQuest />} />
        <Route path="/physician-login" element={<PhysicianLoginPage />} />
        <Route path="/physician-signup" element={<PhysicianSignUp />} />
        <Route path="/physician-home-page" element={<PhysicianHomePage />} />
        <Route path="/physician-daily-report/:userId" element={<PhysicianDailyReports />} />
        <Route path="/physician-weekly-report/:userId" element={<PhysicianWeeklyReports />} />
        <Route path="/physician-all-time-trends/:userId" element={<PhysicianAllTimeTrends />} />
        <Route path="/physician-support" element={<PhysicianSupportPage />} />
      </Routes>
    </Router>
  );
};

export default App;
