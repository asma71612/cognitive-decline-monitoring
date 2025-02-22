import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import titleImage from "../../assets/title.svg";
import patientsIcon from "../../assets/my-patients-light.svg";
import supportIcon from "../../assets/support-light.svg";
import profileIcon from "../../assets/profile-light.svg";
import dailyReportsIcon from "../../assets/daily-reports-light.svg";
import weeklyReportsIcon from "../../assets/weekly-reports.svg";
import allTimeReportsIcon from "../../assets/all-time-reports-dark.svg";
import AllTimeTrendsComponent from "../../components/AllTimeTrendsComponent";
import "./AllTimeTrends.css";

const AllTimeTrends = () => {
  const { patientId } = useParams();
  const [view] = useState("allTime");

  return (
    <div className="all-time-trends-reports-container">
      {/* Left Menu */}
      <div className="left-side-physician">
        <div className="title-container">
          <img src={titleImage} alt="Title" className="title-image" />
        </div>
        <div className="menu">
          <Link
            to="/physician-home-page"
            className="menu-item-all-time-reports link"
          >
            <img src={patientsIcon} alt="My Patients" />
            <span>My Patients</span>
          </Link>
          <Link
            to={`/physician-daily-report/${patientId}`}
            className="menu-item-all-time-reports link daily"
          >
            <img src={dailyReportsIcon} alt="Daily Reports" />
            <span>Daily Reports</span>
          </Link>
          <Link
            to="/weekly-reports"
            className="menu-item-all-time-reports link"
          >
            <img src={weeklyReportsIcon} alt="Weekly Reports" />
            <span>Weekly Reports</span>
          </Link>
          <Link
            to={`/physician-all-time-trends/${patientId}`}
            className="menu-item-all-time-reports link all-time-trends"
          >
            <img src={allTimeReportsIcon} alt="All-Time Trends" />
            <span>All-Time Trends</span>
          </Link>
          <Link
            to="/physician-support"
            className="menu-item-all-time-reports link"
          >
            <img src={supportIcon} alt="Support" />
            <span>Support</span>
          </Link>
        </div>
        <Link
          to="/physician-login"
          className="menu-item-all-time-reports link logout"
        >
          <img src={profileIcon} alt="Log Out" />
          <span>Log Out</span>
        </Link>
      </div>
      {/* Right Side: All Time Trends Report Content */}
      <div className="right-side-physician">
        {view === "allTime" && <AllTimeTrendsComponent patientId={patientId} />}
      </div>
    </div>
  );
};

export default AllTimeTrends;
