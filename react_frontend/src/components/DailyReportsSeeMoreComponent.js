import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import PatientInfoBoxComponent from "./PatientInfoBoxComponent";
import "./DailyReportsSeeMoreComponent.css";

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
  const [selectedGame, setSelectedGame] = useState("");
  const [sceneData, setSceneData] = useState(null);
  const [processQuestData, setProcessQuestData] = useState(null);
  const [memoryVaultData, setMemoryVaultData] = useState(null);
  const [patientData, setPatientData] = useState(null);

  const effectivePatientId = localStorage.getItem("userId");

  useEffect(() => {
    if (!effectivePatientId) return;
    const fetchPatientData = async () => {
      try {
        const patientDoc = await getDoc(doc(db, "users", effectivePatientId));
        if (patientDoc.exists()) {
          setPatientData(patientDoc.data());
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    fetchPatientData();
  }, [effectivePatientId]);

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

  useEffect(() => {
    const fetchProcessQuestData = async () => {
      if (!selectedDate || !effectivePatientId) return;
      try {
        const questRef = collection(
          db,
          `users/${effectivePatientId}/dailyReportsSeeMore/${selectedDate}/processQuest`
        );
        const snapshot = await getDocs(questRef);
        let data = {};
        snapshot.forEach((docSnap) => {
          data[docSnap.id] = docSnap.data();
        });

        if (data["temporalCharacteristics"]) {
          const pausesRef = collection(
            db,
            `users/${effectivePatientId}/dailyReportsSeeMore/${selectedDate}/processQuest/temporalCharacteristics/Pauses`
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
            `users/${effectivePatientId}/dailyReportsSeeMore/${selectedDate}/processQuest/fluencyMetrics/Stutters`
          );
          const stuttersSnapshot = await getDocs(stuttersRef);
          let stutters = [];
          stuttersSnapshot.forEach((docSnap) => {
            stutters.push({ id: docSnap.id, ...docSnap.data() });
          });
          data["fluencyMetrics"].stutters = stutters;
        }
        setProcessQuestData(data);
      } catch (error) {
        console.error("Error fetching process quest data:", error);
      }
    };

    if (selectedGame === "processQuest") {
      fetchProcessQuestData();
    }
  }, [selectedGame, selectedDate, effectivePatientId]);

  useEffect(() => {
    const fetchMemoryVaultData = async () => {
      if (!selectedDate || !effectivePatientId) return;
      try {
        const vaultRef = collection(
          db,
          `users/${effectivePatientId}/dailyReportsSeeMore/${selectedDate}/memoryVault`
        );
        const snapshot = await getDocs(vaultRef);
        let data = {};
        snapshot.forEach((docSnap) => {
          data[docSnap.id] = docSnap.data();
        });
        setMemoryVaultData(data);
      } catch (error) {
        console.error("Error fetching memory vault data:", error);
      }
    };

    if (selectedGame === "memoryVault") {
      fetchMemoryVaultData();
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

  const renderMemoryVaultTable = (data) => {
    const presentedArray = data.Presented
      ? data.Presented.split(",").map((item) => item.trim())
      : [];
    const recalledArray = data.Recalled
      ? data.Recalled.split(",").map((item) => item.trim())
      : [];
    const timeArray = data.TimeToRecall
      ? data.TimeToRecall.split(",").map((item) => item.trim())
      : [];
    const maxRows = Math.max(
      presentedArray.length,
      recalledArray.length,
      timeArray.length
    );
    return (
      <div className="table-container">
        <div className="table-header">
          <span>Presented</span>
          <span>Recalled</span>
          <span>Time to Recall (s)</span>
        </div>
        {Array.from({ length: maxRows }).map((_, index) => (
          <div key={index} className="table-row">
            <span>{presentedArray[index] || ""}</span>
            <span>{recalledArray[index] || ""}</span>
            <span>{timeArray[index] || ""}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="daily-reports-see-more-container">
      {onBack && (
        <div className="back-button-container">
          <Link className="back-button" onClick={onBack}>
            Back
          </Link>
        </div>
      )}
      <PatientInfoBoxComponent
        selectedDate={selectedDate}
        patientData={patientData}
        effectivePatientId={effectivePatientId}
      />
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
      {/* Game Section View */}
      {selectedGame === "sceneDetective" && (
        <div className="game-section">
          {sceneData === null ? (
            <p>Loading scene detective data...</p>
          ) : Object.keys(sceneData).length === 0 ? (
            <p>No metrics available for Scene Detective on this date.</p>
          ) : (
            <div className="game-grid">
              {[
                "fluencyMetrics",
                "lexicalFeatures",
                "temporalCharacteristics",
                "semanticFeatures",
                "structuralFeatures",
              ].map((metric) => (
                <div key={metric} className="game-box">
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
          )}
        </div>
      )}
      {selectedGame === "processQuest" && (
        <div className="game-section">
          {processQuestData === null ? (
            <p>Loading process quest data...</p>
          ) : Object.keys(processQuestData).length === 0 ? (
            <p>No metrics available for Process Quest on this date.</p>
          ) : (
            <div className="game-grid">
              {[
                "fluencyMetrics",
                "lexicalFeatures",
                "temporalCharacteristics",
                "semanticFeatures",
                "structuralFeatures",
              ].map((metric) => (
                <div key={metric} className="game-box">
                  <h3>{metricTitles[metric] || formatMetricName(metric)}</h3>
                  <div className="fields">
                    {metric === "lexicalFeatures" ? (
                      renderLexicalFeatures(processQuestData[metric])
                    ) : metric === "fluencyMetrics" ? (
                      <>
                        {Object.entries(processQuestData[metric]).map(
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
                        {processQuestData[metric].stutters &&
                          renderStutters(processQuestData[metric].stutters)}
                      </>
                    ) : metric === "temporalCharacteristics" ? (
                      <>
                        {Object.entries(processQuestData[metric]).map(
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
                        {processQuestData[metric].pauses &&
                          renderPauses(processQuestData[metric].pauses)}
                      </>
                    ) : (
                      Object.entries(processQuestData[metric]).map(
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
          )}
        </div>
      )}
      {selectedGame === "memoryVault" && (
        <div className="game-section">
          {memoryVaultData === null ? (
            <p>Loading memory vault data...</p>
          ) : Object.keys(memoryVaultData).length === 0 ? (
            <p>No metrics available for Memory Vault on this date.</p>
          ) : (
            <div className="game-box">
              <h3>Recall Speed and Accuracy</h3>
              {renderMemoryVaultTable(
                memoryVaultData["recallSpeedAndAccuracy"]
              )}
            </div>
          )}
        </div>
      )}
      <div style={{ height: "100px" }}></div> {/* Spacer to allow scrolling */}
    </div>
  );
};

export default DailyReportsSeeMoreComponent;
