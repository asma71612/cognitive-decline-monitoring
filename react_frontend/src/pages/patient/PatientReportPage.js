import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import titleImage from "../../assets/title.svg";
import homeIcon from "../../assets/home-light.svg";
import reportIcon from "../../assets/reports-dark.svg";
import supportIcon from "../../assets/support-light.svg";
import profileIcon from "../../assets/profile-light.svg";
import DailyReportComponent from "../../components/DailyReportComponent";
import DailyReportsSeeMoreComponent from "../../components/DailyReportsSeeMoreComponent";
import "./PatientReportPage.css";

const PatientReportPage = () => {
  const { userId } = useParams();
  const [view, setView] = useState("daily");
  const [selectedDate, setSelectedDate] = useState("");

  const handleSeeMore = (date) => {
    setSelectedDate(date);
    setView("seeMore");
  };

  const handleBack = () => {
    setView("daily");
  };

  return (
    <div className="patient-home-container">
      {/* Left Navigation */}
      <div className="left-side">
        <div className="title-container">
          <img src={titleImage} alt="Title" className="title-image" />
        </div>
        <div className="menu">
          <Link to={`/patient-home-page/${userId}`} className="menu-item link">
            <img src={homeIcon} alt="Home" />
            <span className="home-text">Home</span>
          </Link>
          <Link
            to={`/patient-report-page/${userId}`}
            className="menu-item link"
          >
            <img src={reportIcon} alt="My Reports" />
            <span style={{ color: "#2F3B66" }}>My Reports</span>
          </Link>
          <Link to="/support-page" className="menu-item link">
            <img src={supportIcon} alt="Support" />
            <span style={{ color: "#516A80" }}>Support</span>
          </Link>
        </div>
        <Link to="/patient-login" className="menu-item link logout">
          <img src={profileIcon} alt="Log Out" />
          <span>Log Out</span>
        </Link>
      </div>

      {/* Right Side */}
      <div className="right-side">
        {view === "daily" && (
          <DailyReportComponent onSeeMore={handleSeeMore} userId={userId} />
        )}
        {view === "seeMore" && (
          <DailyReportsSeeMoreComponent
            selectedDate={selectedDate}
            onBack={handleBack}
            userId={userId}
          />
        )}
      </div>
    </div>
  );
};

export default PatientReportPage;
