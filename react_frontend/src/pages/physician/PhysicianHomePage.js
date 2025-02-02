import React from 'react';
import { Link } from 'react-router-dom';
import titleImage from '../../assets/title.svg';
import patientsIcon from '../../assets/my-patients.svg';
import dailyReportsIcon from '../../assets/daily-reports.svg';
import weeklyReportsIcon from '../../assets/weekly-reports.svg';
import trendsIcon from '../../assets/all-time-reports.svg';
import supportIcon from '../../assets/support-light.svg';
import profileIcon from '../../assets/profile-light.svg';
import './PhysicianHomePage.css';

const PhysicianHomePage = () => {
  return (
    <div className="physician-home-container">
      <div className="left-side-physician">
        <div className="title-container">
          <img src={titleImage} alt="Title" className="title-image" />
        </div>
        <div className="menu">
          <Link to="/physician-home-page" className="menu-item link">
            <img src={patientsIcon} alt="My Patients" />
            <span>My Patients</span>
          </Link>
          <Link to="/physician-daily-report" className="menu-item link colored">
            <img src={dailyReportsIcon} alt="Daily Reports" />
            <span>Daily Reports</span>
          </Link>
          <Link to="/physician-weekly-report" className="menu-item link colored">
            <img src={weeklyReportsIcon} alt="Weekly Reports" />
            <span>Weekly Reports</span>
          </Link>
          <Link to="/physician-all-time-trends" className="menu-item link colored">
            <img src={trendsIcon} alt="All-Time Trends" />
            <span>All-Time Trends</span>
          </Link>
          <Link to="/physician-support" className="menu-item link colored">
            <img src={supportIcon} alt="Support" />
            <span>Support</span>
          </Link>
        </div>
        <Link to="/physician-login" className="menu-item link logout">
          <img src={profileIcon} alt="Log Out" />
          <span>Log Out</span>
        </Link>
      </div>
      <div className="right-side">
        <div className="physician-home-content">
          <h1>My Patients</h1>
        </div>
      </div>
    </div>
  );
};

export default PhysicianHomePage;
