import React from "react";
import { useParams, Link } from "react-router-dom";
import titleImage from "../../assets/title.svg";
import patientsIcon from "../../assets/my-patients-light.svg";
import supportIcon from "../../assets/support-light.svg";
import profileIcon from "../../assets/profile-light.svg";
import dailyReportsIcon from "../../assets/daily-reports-dark.svg";
import weeklyReportsIcon from "../../assets/weekly-reports.svg";
import allTimeReportsIcon from "../../assets/all-time-reports.svg";
import DailyReportComponent from "../../components/DailyReportComponent";
import "./DailyReports.css";

const DailyReports = () => {
  const { patientId } = useParams();

  return (
    <div className="daily-reports-container">
      {/* Left Menu */}
      <div className="left-side-physician">
        <div className="title-container">
          <img src={titleImage} alt="Title" className="title-image" />
        </div>
        <div className="menu">
          <Link to="/physician-home-page" className="menu-item-daily-reports link">
            <img src={patientsIcon} alt="My Patients" />
            <span>My Patients</span>
          </Link>
          <Link to="/daily-reports" className="menu-item-daily-reports link daily">
            <img src={dailyReportsIcon} alt="Daily Reports" />
            <span>Daily Reports</span>
          </Link>
          <Link to="/weekly-reports" className="menu-item-daily-reports link">
            <img src={weeklyReportsIcon} alt="Weekly Reports" />
            <span>Weekly Reports</span>
          </Link>
          <Link to="/all-time-trends" className="menu-item-daily-reports link">
            <img src={allTimeReportsIcon} alt="All-Time Trends" />
            <span>All-Time Trends</span>
          </Link>
          <Link to="/physician-support" className="menu-item-daily-reports link">
            <img src={supportIcon} alt="Support" />
            <span>Support</span>
          </Link>
        </div>
        <Link to="/physician-login" className="menu-item-daily-reports link logout">
          <img src={profileIcon} alt="Log Out" />
          <span>Log Out</span>
        </Link>
      </div>
      {/* Right Side: Shared Daily Report Content */}
      <div className="right-side-physician">
        <DailyReportComponent patientId={patientId} />
      </div>
    </div>
  );
};

export default DailyReports;
