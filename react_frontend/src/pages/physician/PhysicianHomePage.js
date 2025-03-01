import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";
import AddPatientsModal from "../../components/AddPatientsModal";
import titleImage from "../../assets/title.svg";
import patientsIcon from "../../assets/my-patients-dark.svg";
import supportIcon from "../../assets/support-light.svg";
import profileIcon from "../../assets/profile-light.svg";
import searchIcon from "../../assets/search.svg";
import "./PhysicianHomePage.css";

const PhysicianHomePage = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Track the search input
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        console.log("Is snapshot empty?", querySnapshot.empty);
        const patientsData = querySnapshot.docs.map((doc) => {
          console.log("Patient doc:", doc.id, doc.data());
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        if (querySnapshot.empty) {
          console.log("No patients found in Firestore.");
        }
        setPatients(patientsData);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    fetchPatients();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatDateForDisplay = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const filteredPatients = patients.filter((patient) =>
    (patient.firstName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="physician-home-container">
      <div className="left-side-physician">
        <div className="title-container">
          <img src={titleImage} alt="Title" className="title-image" />
        </div>
        <div className="menu">
          <Link
            to="/physician-home-page"
            className="menu-item-my-patients link patients"
          >
            <img src={patientsIcon} alt="My Patients" />
            <span style={{ color: "#2F3B66" }}>My Patients</span>
          </Link>
          <Link to="/physician-support" className="menu-item link colored">
            <img src={supportIcon} alt="Support" />
            <span style={{ color: "#516A80" }}>Support</span>
          </Link>
        </div>
        <Link to="/physician-login" className="menu-item link logout">
          <img src={profileIcon} alt="Log Out" />
          <span>Log Out</span>
        </Link>
      </div>

      <div className="right-side-physician">
        <div className="physician-home-content">
          <h1>My Patients</h1>

          {/* Search and Add Patient Buttons */}
          <div className="search-add-container">
            <button className="add-patient-btn-homepage" onClick={openModal}>
              Add Patient
            </button>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search by first name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
                <th>Reports</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.lastName || "N/A"}</td>
                    <td>{patient.firstName || "N/A"}</td>
                    <td>{patient.sex || "N/A"}</td>
                    <td>{formatDateForDisplay(patient.dob)}</td>
                    <td>{formatDateForDisplay(patient.enrolmentDate)}</td>
                    <td>
                      {/* Link passes the patient.id via the URL */}
                      <Link
                        to={`/physician-all-time-trends/${patient.id}`}
                        className="view-reports-btn"
                      >
                        View Reports
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No patients found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <AddPatientsModal closeModal={closeModal} setPatients={setPatients} />
      )}
    </div>
  );
};

export default PhysicianHomePage;
