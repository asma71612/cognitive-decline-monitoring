import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeLandingPage from './pages/HomeLandingPage';
import PatientLoginPage from './pages/PatientLoginPage';
import GeneralHomePage from './pages/GeneralHomePage';
import './App.css'; // Global styles

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLandingPage />} />
        <Route path="/patient-login" element={<PatientLoginPage />} />
        <Route path="/general-home-page" element={<GeneralHomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
