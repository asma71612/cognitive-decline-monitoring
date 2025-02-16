import React, { useState } from "react";
import "./DailyReportsSeeMoreComponent.css";

const formatSelectedDate = (dateStr) => {
  const [month, day, year] = dateStr.split("-");
  const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const DailyReportsSeeMoreComponent = ({ selectedDate, onBack }) => {
  const formattedDate = selectedDate ? formatSelectedDate(selectedDate) : "";
  const [selectedGame, setSelectedGame] = useState("");

  return (
    <div className="daily-reports-see-more-container">
      {onBack && (
        <div className="back-button-container">
          <button className="back-button" onClick={onBack}>
            Back
          </button>
        </div>
      )}
      <div className="header-section">
        <h1>
          Daily Reports {formattedDate && `for ${formattedDate}`}
        </h1>
      </div>
      {/* Four game buttons */}
      <div className="buttons-container">
        <button className="report-button" onClick={() => setSelectedGame("naturesGaze")}>
          Natures Gaze I/II
        </button>
        <button className="report-button" onClick={() => setSelectedGame("memoryVault")}>
          Memory Vault
        </button>
        <button className="report-button" onClick={() => setSelectedGame("processQuest")}>
          Process Quest
        </button>
        <button className="report-button" onClick={() => setSelectedGame("sceneDetective")}>
          Scene Detective
        </button>
      </div>

      {selectedGame === "sceneDetective" && (
        <div className="scene-detective-section">
          <div className="scene-detective-grid">
            <div className="scene-box"></div>
            <div className="scene-box"></div>
            <div className="scene-box"></div>
            <div className="scene-box"></div>
            <div className="scene-box span-2"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyReportsSeeMoreComponent;
