import React, { useEffect, useState } from "react";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import upArrow from "../assets/up-arrow.svg";
import downArrow from "../assets/down-arrow.svg";
import "./DailyReportComponent.css";

const gameNames = {
  memoryVault: "Memory Vault",
  processQuest: "Process Quest",
  naturesGaze: "Nature's Gaze I/II",
  sceneDetective: "Scene Detective",
};

const formatMetricName = (name) => {
  const naturesGazeMetricNames = {
    prosaccadeGapReactionTime: "Pro-Saccade Gap Reaction Time",
    antisaccadeGapReactionTime: "Anti-Saccade Gap Reaction Time",
    prosaccadeOverlapReactionTime: "Pro-Saccade Overlap Reaction Time",
    antisaccadeOverlapReactionTime: "Anti-Saccade Overlap Reaction Time"
  };

  if (naturesGazeMetricNames[name]) {
    return naturesGazeMetricNames[name];
  }

  return name.replace(/([a-z])([A-Z])/g, "$1 $2");
};

const formatSelectedDate = (dateStr) => {
  const [month, day, year] = dateStr.split("-");
  const dateObj = new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10)
  );
  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const formatFieldValue = (metric, value) => {
  const naturesGazeMetrics = [
    'prosaccadeGapReactionTime',
    'antisaccadeGapReactionTime',
    'prosaccadeOverlapReactionTime',
    'antisaccadeOverlapReactionTime'
  ];

  if (typeof value === "number") {
    // Round Nature's Gaze metrics to 2 decimal places
    if (naturesGazeMetrics.includes(metric)) {
      const roundedValue = parseFloat(value.toFixed(2));
      return `${roundedValue} ms`;
    }

    const lowerMetric = metric.toLowerCase();
    if (lowerMetric.includes("percent")) {
      return `${value}%`;
    }
    if (lowerMetric.includes("duration") || lowerMetric.includes("time")) {
      return `${value} ms`;
    }
  }
  return value;
};

const DailyReportComponent = ({ userId, onSeeMore }) => {
  const [patientData, setPatientData] = useState(null);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [gameResults, setGameResults] = useState(null);
  const [previousGameResults, setPreviousGameResults] = useState(null);

  useEffect(() => {
    if (!userId) return;
    const fetchPatientData = async () => {
      try {
        const patientDoc = await getDoc(doc(db, "users", userId));
        if (patientDoc.exists()) setPatientData(patientDoc.data());
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    const fetchAvailableDates = async () => {
      try {
        const snapshot = await getDocs(
          collection(db, `users/${userId}/dailyReports`)
        );
        const fetchedDates = snapshot.docs
          .map((doc) => doc.id)
          .sort()
          .reverse();
        setDates(fetchedDates);
      } catch (error) {
        console.error("Error fetching available dates:", error);
      }
    };

    fetchPatientData();
    fetchAvailableDates();
  }, [userId]);

  const fetchGameResults = async (date) => {
    setSelectedDate(date);
    setPreviousGameResults(null);
    try {
      const gamesSnapshot = await getDocs(
        collection(db, `users/${userId}/dailyReports/${date}/games`)
      );
      let fetchedGames = {};
      gamesSnapshot.forEach((doc) => (fetchedGames[doc.id] = doc.data()));
      setGameResults(fetchedGames);
      // Fetch previous session's results if available
      const currentIndex = dates.indexOf(date);
      if (currentIndex < dates.length - 1) {
        const previousDate = dates[currentIndex + 1];
        const prevSnapshot = await getDocs(
          collection(db, `users/${userId}/dailyReports/${previousDate}/games`)
        );
        let prevGames = {};
        prevSnapshot.forEach((doc) => (prevGames[doc.id] = doc.data()));
        setPreviousGameResults(prevGames);
      }
    } catch (error) {
      console.error("Error fetching game results:", error);
    }
  };

  const renderGameMetrics = (gameKey, gameData) => {
    if (gameKey === "memoryVault") {
      return ["Presented", "Recalled"].map((metric) => (
        <div key={metric} className="metric-box memory-vault-metric">
          <h4>{formatMetricName(metric)}</h4>
          <p>
            {gameData[metric] != null
              ? formatFieldValue(metric, gameData[metric])
              : "N/A"}
          </p>
        </div>
      ));
    } else {
      // For other games, show all metrics
      return Object.entries(gameData).map(([metric, value]) => {
        let percentageChange = null;
        if (
          previousGameResults &&
          previousGameResults[gameKey] &&
          previousGameResults[gameKey][metric] !== undefined
        ) {
          const previousValue = previousGameResults[gameKey][metric];
          percentageChange =
            previousValue !== 0
              ? ((value - previousValue) / previousValue) * 100
              : null;
        }
        return (
          <div key={metric} className="metric-box">
            <h4>{formatMetricName(metric)}</h4>
            <p>{formatFieldValue(metric, value)}</p>
            {percentageChange !== null && (
              <div className="comparison">
                <div className="comparison-top">
                  {percentageChange !== 0 && (
                    <img
                      src={percentageChange > 0 ? upArrow : downArrow}
                      alt={percentageChange > 0 ? "Increase" : "Decrease"}
                      className="arrow-icon"
                    />
                  )}
                  <span className="percentage-change">
                    {Math.abs(percentageChange.toFixed(0))}%
                  </span>
                </div>
                <div className="comparison-text">from previous session</div>
              </div>
            )}
          </div>
        );
      });
    }
  };

  return (
    <div className="daily-reports-content">
      <div className="header-container">
        <h1>
          Daily Reports{" "}
          {selectedDate && `for ${formatSelectedDate(selectedDate)}`}
        </h1>
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

      {patientData && (
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
            <strong>User ID:</strong> {userId}
          </p>
          <p>
            <strong>Date of Birth:</strong> {patientData.dob}
          </p>
        </div>
      )}

      {selectedDate && gameResults && (
        <div className="game-results">
          {Object.keys(gameResults).map((gameKey) => {
            const gameName = gameNames[gameKey] || gameKey;
            return (
              <div key={gameKey} className="game-box-neutral">
                <h3 className="game-title">{gameName}</h3>
                <div className="game-metrics">
                  {renderGameMetrics(gameKey, gameResults[gameKey])}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedDate && onSeeMore && (
        <div className="see-more-container">
          <span
            className="see-more-link"
            onClick={() => onSeeMore(selectedDate)}
          >
            See More
          </span>
        </div>
      )}
    </div>
  );
};

export default DailyReportComponent;
