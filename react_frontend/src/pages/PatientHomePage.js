import React from 'react';
import { Link } from 'react-router-dom';
import brainImage from '../assets/brain.svg';
import homeIcon from '../assets/home.svg';
import reportIcon from '../assets/reports.svg';
import infoIcon from '../assets/information.svg';
import profileIcon from '../assets/profile.svg';
import './PatientHomePage.css';

const PatientHomePage = () => {
  const getCurrentDateInEST = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const estDate = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York', ...options });
    const date = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York', day: 'numeric' });
    const day = parseInt(date, 10);
    const suffix = getOrdinalSuffix(day);
    return estDate.replace(day, `${day}${suffix}`);
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="patient-home-container">
      <div className="left-side">
        <div className="logo-title">
          <span className="no-spacing">C</span>
          <img src={brainImage} alt="Brain" />
          <span className="with-spacing">GNIFY</span>
        </div>
        <div className="menu">
          <Link to="/patient-home-page" className="menu-item link">
            <img src={homeIcon} alt="Home" />
            <span>Home</span>
          </Link>
          <Link to="/patient-reporting-landing-page" className="menu-item link">
            <img src={reportIcon} alt="My Reports" />
            <span>My Reports</span>
          </Link>
          <Link to="/info-page" className="menu-item link">
            <img src={infoIcon} alt="Information" />
            <span>Information</span>
          </Link>
        </div>
        <Link to="/patient-login" className="menu-item link logout">
          <img src={profileIcon} alt="Log Out" />
          <span>Log Out</span>
        </Link>
      </div>
      <div className="right-side">
        <div className="home-content">
          <h1>Home</h1>
          <p>{`Today is ${getCurrentDateInEST()}.`}</p>
          <p className="tasks-left">You have 7 tasks left to complete this week.</p>
          <Link to="/general-instructions" className="complete-task-button">Complete My Task</Link>
          <div className="task-progress">
            <h3>This Week's Task Progress</h3>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHomePage;
