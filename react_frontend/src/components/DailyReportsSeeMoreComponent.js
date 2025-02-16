import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./DailyReportsSeeMoreComponent.css";

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

const formatMetricName = (name) => {
  return name.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ");
};

const metricTitles = {
  fluencyMetrics: "Fluency Metrics",
  lexicalFeatures: "Lexical Features",
  structuralFeatures: "Structural Features",
  semanticFeatures: "Semantic Features",
  temporalCharacteristics: "Temporal Characteristics",
};

const DailyReportsSeeMoreComponent = ({ selectedDate, onBack }) => {
  const formattedDate = selectedDate ? formatSelectedDate(selectedDate) : "";
  const [selectedGame, setSelectedGame] = useState("");
  const [sceneData, setSceneData] = useState(null);

  const effectivePatientId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSceneData = async () => {
      if (!selectedDate || !effectivePatientId) return;
      try {
        const sceneRef = collection(
          db,
          `users/${effectivePatientId}/dailyReportsSeeMore/${selectedDate}/sceneDetective`
        );
        const snapshot = await getDocs(sceneRef);
        let data = {};
        snapshot.forEach((docSnap) => {
          data[docSnap.id] = docSnap.data();
        });

        if (data["temporalCharacteristics"]) {
          const pausesRef = collection(
            db,
            `users/${effectivePatientId}/dailyReportsSeeMore/${selectedDate}/sceneDetective/temporalCharacteristics/Pauses`
          );
          const pausesSnapshot = await getDocs(pausesRef);
          let pauses = [];
          pausesSnapshot.forEach((docSnap) => {
            pauses.push({ id: docSnap.id, ...docSnap.data() });
          });
          data["temporalCharacteristics"].pauses = pauses;
        }

        if (data["fluencyMetrics"]) {
          const stuttersRef = collection(
            db,
            `users/${effectivePatientId}/dailyReportsSeeMore/${selectedDate}/sceneDetective/fluencyMetrics/Stutters`
          );
          const stuttersSnapshot = await getDocs(stuttersRef);
          let stutters = [];
          stuttersSnapshot.forEach((docSnap) => {
            stutters.push({ id: docSnap.id, ...docSnap.data() });
          });
          data["fluencyMetrics"].stutters = stutters;
        }
        setSceneData(data);
      } catch (error) {
        console.error("Error fetching scene detective data:", error);
      }
    };

    if (selectedGame === "sceneDetective") {
      fetchSceneData();
    }
  }, [selectedGame, selectedDate, effectivePatientId]);

  const renderLexicalFeatures = (fields) => {
    return (
      <div className="table-container">
        <div className="table-header">
          <span>Word Types</span>
          <span>Count</span>
        </div>
        {Object.entries(fields).map(([key, value]) => (
          <div key={key} className="table-row">
            <span>{formatMetricName(key)}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderPauses = (pauses) => {
    return (
      <div className="table-container">
        <div className="table-header">
          <span>Pause #</span>
          <span>Start Time</span>
          <span>End Time</span>
          <span>Duration</span>
        </div>
        {pauses.map((pause, index) => {
          const start = parseFloat(pause.StartTime);
          const end = parseFloat(pause.EndTime);
          const duration =
            !isNaN(start) && !isNaN(end) ? (end - start).toFixed(2) : "N/A";
          return (
            <div key={pause.id} className="table-row">
              <span>{index + 1}</span>
              <span>{pause.StartTime}</span>
              <span>{pause.EndTime}</span>
              <span>{duration}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStutters = (stutters) => {
    return (
      <div className="table-container">
        <div className="table-header">
          <span>Stutter #</span>
          <span>Time</span>
        </div>
        {stutters.map((stutter, index) => (
          <div key={stutter.id} className="table-row">
            <span>{index + 1}</span>
            <span>{stutter.Time}</span>
          </div>
        ))}
      </div>
    );
  };

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
        <h1>Daily Reports {formattedDate && `for ${formattedDate}`}</h1>
      </div>
      {/* Game Buttons */}
      <div className="buttons-container">
        <button
          className={`report-button ${
            selectedGame === "naturesGaze" ? "active" : ""
          }`}
          onClick={() => setSelectedGame("naturesGaze")}
        >
          Natures Gaze I/II
        </button>
        <button
          className={`report-button ${
            selectedGame === "memoryVault" ? "active" : ""
          }`}
          onClick={() => setSelectedGame("memoryVault")}
        >
          Memory Vault
        </button>
        <button
          className={`report-button ${
            selectedGame === "processQuest" ? "active" : ""
          }`}
          onClick={() => setSelectedGame("processQuest")}
        >
          Process Quest
        </button>
        <button
          className={`report-button ${
            selectedGame === "sceneDetective" ? "active" : ""
          }`}
          onClick={() => setSelectedGame("sceneDetective")}
        >
          Scene Detective
        </button>
      </div>
      {/* Scene Detective View */}
      {selectedGame === "sceneDetective" && (
        <div className="scene-detective-section">
          {sceneData ? (
            <div className="scene-detective-grid">
              {[
                "fluencyMetrics",
                "lexicalFeatures",
                "temporalCharacteristics",
                "semanticFeatures",
                "structuralFeatures",
              ].map((metric) => (
                <div key={metric} className="scene-box">
                  <h3>{metricTitles[metric] || formatMetricName(metric)}</h3>
                  <div className="fields">
                    {metric === "lexicalFeatures" ? (
                      renderLexicalFeatures(sceneData[metric])
                    ) : metric === "fluencyMetrics" ? (
                      <>
                        {Object.entries(sceneData[metric]).map(
                          ([field, value]) => {
                            if (field === "stutters") return null;
                            return (
                              <p key={field}>
                                <strong>{formatMetricName(field)}:</strong>{" "}
                                {value}
                              </p>
                            );
                          }
                        )}
                        {sceneData[metric].stutters &&
                          renderStutters(sceneData[metric].stutters)}
                      </>
                    ) : metric === "temporalCharacteristics" ? (
                      <>
                        {Object.entries(sceneData[metric]).map(
                          ([field, value]) => {
                            if (field === "pauses") return null;
                            return (
                              <p key={field}>
                                <strong>{formatMetricName(field)}:</strong>{" "}
                                {value}
                              </p>
                            );
                          }
                        )}
                        {sceneData[metric].pauses &&
                          renderPauses(sceneData[metric].pauses)}
                      </>
                    ) : (
                      Object.entries(sceneData[metric]).map(
                        ([field, value]) => (
                          <p key={field}>
                            <strong>{formatMetricName(field)}:</strong> {value}
                          </p>
                        )
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Loading scene detective data...</p>
          )}
        </div>
      )}
      <div style={{ height: "100px" }}></div> {/* Spacer to allow scrolling */}
    </div>
  );
};

export default DailyReportsSeeMoreComponent;
