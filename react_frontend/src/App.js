import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeLandingPage from './pages/HomeLandingPage';
import PatientLoginPage from './pages/PatientLoginPage';
import PatientHomePage from './pages/PatientHomePage';
import './App.css'; // Global styles

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeLandingPage />} />
        <Route path="/patient-login" element={<PatientLoginPage />} />
        <Route path="/patient-home-page" element={<PatientHomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
