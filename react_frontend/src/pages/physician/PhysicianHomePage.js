import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";
import titleImage from "../../assets/title.svg";
import patientsIcon from "../../assets/my-patients.svg";
import dailyReportsIcon from "../../assets/daily-reports.svg";
import weeklyReportsIcon from "../../assets/weekly-reports.svg";
import trendsIcon from "../../assets/all-time-reports.svg";
import supportIcon from "../../assets/support-light.svg";
import profileIcon from "../../assets/profile-light.svg";
import searchIcon from "../../assets/search.svg";
import "./PhysicianHomePage.css";

const PhysicianHomePage = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users")); // Get all patient documents inside "users"

        if (querySnapshot.empty) {
          console.log("No patients found in Firestore.");
          return;
        }

        let patientsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          dob: doc.data().dob,
          sex: doc.data().sex,
          enrolmentDate: doc.data().enrolmentDate,
        }));

        // Sort patients by last name alphabetically
        patientsData.sort((a, b) => a.lastName.localeCompare(b.lastName));

        setPatients(patientsData);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

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
          <Link
            to="/physician-weekly-report"
            className="menu-item link colored"
          >
            <img src={weeklyReportsIcon} alt="Weekly Reports" />
            <span>Weekly Reports</span>
          </Link>
          <Link
            to="/physician-all-time-trends"
            className="menu-item link colored"
          >
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

          {/* Search and Add Patient Buttons */}
          <div className="search-add-container">
            <button className="add-patient-btn">Add Patient</button>
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
              <img src={searchIcon} alt="Search" className="search-icon" />
            </div>
          </div>

          {/* Patients Table */}
          <table className="patients-table">
            <thead>
              <tr>
                <th>Last Name</th>
                <th>First Name</th>
                <th>Sex</th>
                <th>Date of Birth</th>
                <th>Enrolment Date</th>
              </tr>
            </thead>
            <tbody>
              {patients.length > 0 ? (
                patients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.lastName || "N/A"}</td>
                    <td>{patient.firstName || "N/A"}</td>
                    <td>{patient.sex || "N/A"}</td>
                    <td>{patient.dob || "N/A"}</td>
                    <td>{patient.enrolmentDate || "N/A"}</td>{" "}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No patients found</td>{" "}
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PhysicianHomePage;
