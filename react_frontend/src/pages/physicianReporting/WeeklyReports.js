import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import titleImage from "../../assets/title.svg";
import patientsIcon from "../../assets/my-patients-light.svg";
import supportIcon from "../../assets/support-light.svg";
import profileIcon from "../../assets/profile-light.svg";
import dailyReportsIcon from "../../assets/daily-reports-light.svg";
import weeklyReportsIcon from "../../assets/weekly-reports-dark.svg";
import allTimeReportsIcon from "../../assets/all-time-reports-light.svg";
import WeeklyReportComponent from "../../components/WeeklyReportComponent";
import "./AllTimeTrends.css";
import './WeeklyReports.css';

const WeeklyReports = () => {
    const { userId } = useParams();
    const [view] = useState("weekly");
 
    return (
      <div className="weekly-reports-container">
        {/* Left Menu */}
        <div className="left-side-physician">
          <div className="title-container">
            <img src={titleImage} alt="Title" className="title-image" />
          </div>
          <div className="menu">
            <Link
              to="/physician-home-page"
              className="menu-item-daily-reports link"
            >
              <img src={patientsIcon} alt="My Patients" />
              <span>My Patients</span>
            </Link>
            <Link
              to={`/physician-daily-report/${userId}`}
              className="menu-item-daily-reports link"
            >
              <img src={dailyReportsIcon} alt="Daily Reports" />
              <span>Daily Reports</span>
            </Link>
            <Link
              to={`/physician-weekly-report/${userId}`}
              className="menu-item-weekly-reports link weekly"
            >
              <img src={weeklyReportsIcon} alt="Weekly Reports" />
              <span>Weekly Reports</span>
            </Link>
            <Link
              to={`/physician-all-time-trends/${userId}`}
              className="menu-item-all-time-reports link"
            >
              <img src={allTimeReportsIcon} alt="All-Time Trends" />
              <span>All-Time Trends</span>
            </Link>
            <Link
              to="/physician-support"
              className="menu-item-daily-reports link"
            >
              <img src={supportIcon} alt="Support" />
              <span>Support</span>
            </Link>
          </div>
          <Link
            to="/physician-login"
            className="menu-item-weekly-reports link logout"
          >
            <img src={profileIcon} alt="Log Out" />
            <span>Log Out</span>
          </Link>
        </div>
        {/* Right Side: All Time Trends Report Content */}
        <div className="right-side-physician">
        {view === "weekly" && (
          <WeeklyReportComponent
          userId={userId}
          />
        )}
        </div>
      </div>
    );
  };
  
  export default WeeklyReports;
  
