// DailyReports.js
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig.js";

// Import assets for the left side menu (same as in PhysicianHomePage)
import titleImage from "../../assets/title.svg";
import patientsIcon from "../../assets/my-patients.svg";
import supportIcon from "../../assets/support-light.svg";
import profileIcon from "../../assets/profile-light.svg";

import "./DailyReports.css"; // DailyReports-specific CSS

const DailyReports = () => {
  const { patientId } = useParams();
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const patientDocRef = doc(db, "users", patientId);
        const patientDoc = await getDoc(patientDocRef);
        if (patientDoc.exists()) {
          setPatientData(patientDoc.data());
        } else {
          console.error("Patient not found.");
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <div className="daily-reports-container">
      {/* Left Side Menu */}
      <div className="left-side-physician">
        <div className="title-container">
          <img src={titleImage} alt="Title" className="title-image" />
        </div>
        <div className="menu">
          <Link to="/physician-home-page" className="menu-item link">
            <img src={patientsIcon} alt="My Patients" />
            <span>My Patients</span>
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

      {/* Right Side Content */}
      <div className="right-side-physician">
        <div className="daily-reports-content">
          <h1>Daily Reports</h1>
          {patientData ? (
            <div className="patient-info-box">
              <h2>
                {patientData.firstName} {patientData.lastName}
              </h2>
              <p>User ID: {patientId}</p>
              <p>Date of Birth: {formatDate(patientData.dob)}</p>
            </div>
          ) : (
            <p>Loading patient data...</p>
          )}

          {/* Future sections for test metrics can be added below */}
        </div>
      </div>
    </div>
  );
};

export default DailyReports;
