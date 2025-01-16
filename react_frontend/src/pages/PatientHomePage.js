import React from 'react';
import brainImage from '../assets/brain.svg';
import homeIcon from '../assets/home.svg';
import reportIcon from '../assets/reports.svg';
import infoIcon from '../assets/information.svg';
import profileIcon from '../assets/profile.svg';
import './PatientHomePage.css';

const PatientHomePage = () => {
  return (
    <div className="patient-home-container">
      <div className="left-side">
        <div className="logo-title">
          <span className="no-spacing">C</span>
          <img src={brainImage} alt="Brain" />
          <span className="with-spacing">GNIFY</span>
        </div>
        <div className="menu">
          <div className="menu-item">
            <img src={homeIcon} alt="Home" />
            <span>Home</span>
          </div>
          <div className="menu-item">
            <img src={reportIcon} alt="My Reports" />
            <span>My Reports</span>
          </div>
          <div className="menu-item">
            <img src={infoIcon} alt="Information" />
            <span>Information</span>
          </div>
        </div>
        <div className="logout">
          <img src={profileIcon} alt="Log Out" />
          <span>Log Out</span>
        </div>
      </div>
      <div className="right-side">
        {/* Add content for the right side here */}
      </div>
    </div>
  );
};

export default PatientHomePage;
