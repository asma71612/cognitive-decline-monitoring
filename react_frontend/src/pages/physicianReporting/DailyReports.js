import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig.js";
import titleImage from "../../assets/title.svg";
import patientsIcon from "../../assets/my-patients-light.svg";
import supportIcon from "../../assets/support-light.svg";
import profileIcon from "../../assets/profile-light.svg";

// New icon imports for the additional menu items
import dailyReportsIcon from "../../assets/daily-reports-dark.svg";
import weeklyReportsIcon from "../../assets/weekly-reports.svg";
import allTimeReportsIcon from "../../assets/all-time-reports.svg";

import "./DailyReports.css";

const gameNames = {
  memoryVault: "Memory Vault",
  processQuest: "Process Quest",
  naturesGaze: "Nature's Gaze I/II",
  sceneDetective: "Scene Detective",
};

const formatMetricName = (name) => {
  return name.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const formatSelectedDate = (dateStr) => {
  const [month, day, year] = dateStr.split("-");
  const dateObj = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10)
  );
  const options = { month: "long", day: "numeric", year: "numeric" };
  return dateObj.toLocaleDateString("en-US", options);
};

const formatDate = (dateStr) => {
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    let year, month, day;
    if (parts[0].length === 4) {
      // Format: YYYY-MM-DD
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10);
      day = parseInt(parts[2], 10);
    } else {
      // Format: MM-DD-YYYY
      month = parseInt(parts[0], 10);
      day = parseInt(parts[1], 10);
      year = parseInt(parts[2], 10);
    }
    const dateObj = new Date(year, month - 1, day);
    return `${
      dateObj.getMonth() + 1
    }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
  }
  const dateObj = new Date(dateStr);
  return `${
    dateObj.getMonth() + 1
  }/${dateObj.getDate()}/${dateObj.getFullYear()}`;
};

// Helper function to calculate age from a date of birth string.
// Supports both "YYYY-MM-DD" and "MM-DD-YYYY" formats.
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  // If the birthday hasn't occurred yet this year, subtract 1 from age
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const DailyReports = () => {
  const { patientId } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [gameResults, setGameResults] = useState(null);

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

    const fetchAvailableDates = async () => {
      try {
        const dailyReportsRef = collection(
          db,
          `users/${patientId}/dailyReports`
        );
        const snapshot = await getDocs(dailyReportsRef);
        const fetchedDates = snapshot.docs.map((doc) => doc.id);
        setDates(fetchedDates);
      } catch (error) {
        console.error("Error fetching available dates:", error);
      }
    };

    fetchPatientData();
    fetchAvailableDates();
  }, [patientId]);

  const fetchGameResults = async (date) => {
    setSelectedDate(date);
    try {
      const gamesRef = collection(
        db,
        `users/${patientId}/dailyReports/${date}/games`
      );
      const gamesSnapshot = await getDocs(gamesRef);

      if (!gamesSnapshot.empty) {
        let fetchedGames = {};
        gamesSnapshot.forEach((doc) => {
          fetchedGames[doc.id] = doc.data();
        });

        console.log("Fetched game results:", fetchedGames);
        setGameResults(fetchedGames);
      } else {
        console.log("No game data found for this date.");
        setGameResults(null);
      }
    } catch (error) {
      console.error("Error fetching game results:", error);
    }
  };

  return (
    <div className="daily-reports-container">
      {/* Left Side Menu */}
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
            to="/daily-reports"
            className="menu-item-daily-reports link daily"
          >
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
          className="menu-item-daily-reports link logout"
        >
          <img src={profileIcon} alt="Log Out" />
          <span>Log Out</span>
        </Link>
      </div>

      {/* Right Side Content */}
      <div className="right-side-physician">
        <div className="daily-reports-content">
          <div className="header-container">
            <h1>
              Daily Reports
              {selectedDate && ` for ${formatSelectedDate(selectedDate)}`}
            </h1>
            {/* Date Filter */}
            <div className="date-filter">
              <select
                onChange={(e) => fetchGameResults(e.target.value)}
                value={selectedDate}
              >
                <option value="">Select a Date</option>
                {dates.map((date) => (
                  <option key={date} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {patientData ? (
            <div className="patient-info-box">
              <h2>
                {patientData.firstName} {patientData.lastName}{" "}
                {patientData.dob && patientData.sex && (
                  <span>
                    ({calculateAge(patientData.dob)}, {patientData.sex})
                  </span>
                )}
              </h2>
              <p>
                <strong>User ID:</strong> {patientId}
              </p>
              <p>
                <strong>Date of Birth:</strong> {formatDate(patientData.dob)}
              </p>
            </div>
          ) : (
            <p>Loading patient data...</p>
          )}

          {selectedDate && gameResults && (
            <div className="game-results">
              {Object.keys(gameResults).map((gameKey) => {
                const gameName = gameNames[gameKey] || gameKey;
                return (
                  <div key={gameKey} className="game-box">
                    <h3 className="game-title">{gameName}</h3>
                    <div className="game-metrics">
                      {Object.entries(gameResults[gameKey]).map(
                        ([metric, value]) => (
                          <div key={metric} className="metric-box">
                            <h4>{formatMetricName(metric)}</h4>
                            <p>{value}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyReports;
