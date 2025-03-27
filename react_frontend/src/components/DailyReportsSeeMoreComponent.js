import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import PatientInfoBoxComponent from "./PatientInfoBoxComponent";
import "./DailyReportsSeeMoreComponent.css";
import infoIcon from "../assets/information-hover.svg";
import PlotDescriptions from "./PlotDescriptions";

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

const lexicalFeaturesOrder = [
  "ClosedClass",
  "Filler",
  "Noun",
  "OpenClass",
  "Verb",
];

const semanticFeaturesOrder = [
  "SemanticUnits",
  "SemanticIdeaDensity",
  "SemanticEfficiency",
  "LexicalFrequencyOfNouns",
];

const fluencyMetricsOrder = ["WordsPerMin", "RevisionRatio"];

const structuralFeaturesOrder = ["NumOfSentences", "MeanLengthOfOccurrence"];

const TitleWithInfo = ({ title, description }) => {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div className="grid-title-container">
      <h3>{title}</h3>
      <img
        src={infoIcon}
        alt="Info"
        className="info-icon"
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      />
      {showInfo && <div className="info-popover">{description}</div>}
    </div>
  );
};

const DailyReportsSeeMoreComponent = ({
  selectedDate,
  onBack,
  userId: propUserId,
}) => {
  const { userId } = useParams();
  const effectiveUserId = propUserId || userId;
  const [selectedGame, setSelectedGame] = useState("");
  const [sceneData, setSceneData] = useState(null);
  const [processQuestData, setProcessQuestData] = useState(null);
  const [memoryVaultData, setMemoryVaultData] = useState(null);
  const [naturesGazeData, setNaturesGazeData] = useState(null);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    if (!effectiveUserId) return;
    const fetchPatientData = async () => {
      try {
        const patientDoc = await getDoc(doc(db, "users", effectiveUserId));
        if (patientDoc.exists()) {
          setPatientData(patientDoc.data());
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };
    fetchPatientData();
  }, [effectiveUserId]);

  // Fetch Scene Detective Data
  useEffect(() => {
    const fetchSceneData = async () => {
      if (!selectedDate || !effectiveUserId) return;
      try {
        const sceneRef = collection(
          db,
          `users/${effectiveUserId}/dailyReportsSeeMore/${selectedDate}/sceneDetective`
        );
        const snapshot = await getDocs(sceneRef);
        let data = {};
        snapshot.forEach((docSnap) => {
          data[docSnap.id] = docSnap.data();
        });

        if (data["temporalCharacteristics"]) {
          const pausesRef = collection(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${selectedDate}/sceneDetective/temporalCharacteristics/Pauses`
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
            `users/${effectiveUserId}/dailyReportsSeeMore/${selectedDate}/sceneDetective/fluencyMetrics/Stutters`
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
  }, [selectedGame, selectedDate, effectiveUserId]);

  // Fetch Process Quest Data
  useEffect(() => {
    const fetchProcessQuestData = async () => {
      if (!selectedDate || !effectiveUserId) return;
      try {
        const questRef = collection(
          db,
          `users/${effectiveUserId}/dailyReportsSeeMore/${selectedDate}/processQuest`
        );
        const snapshot = await getDocs(questRef);
        let data = {};
        snapshot.forEach((docSnap) => {
          data[docSnap.id] = docSnap.data();
        });

        if (data["temporalCharacteristics"]) {
          const pausesRef = collection(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${selectedDate}/processQuest/temporalCharacteristics/Pauses`
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
            `users/${effectiveUserId}/dailyReportsSeeMore/${selectedDate}/processQuest/fluencyMetrics/Stutters`
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
  }, [selectedGame, selectedDate, effectiveUserId]);

  // Fetch Memory Vault Data
  useEffect(() => {
    const fetchMemoryVaultData = async () => {
      if (!selectedDate || !effectiveUserId) return;
      try {
        const vaultRef = collection(
          db,
          `users/${effectiveUserId}/dailyReportsSeeMore/${selectedDate}/memoryVault`
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
  }, [selectedGame, selectedDate, effectiveUserId]);

  // Fetch Natures Gaze Data
  useEffect(() => {
    const fetchNaturesGazeData = async () => {
      if (!selectedDate || !effectiveUserId) return;
      let data = {};

      try {
        // Fetch the metrics document which contains all the eye tracking data
        const metricsRef = doc(
          db,
          `users/${effectiveUserId}/dailyReportsSeeMore/${selectedDate}/naturesGaze/metrics`
        );
        const metricsSnap = await getDoc(metricsRef);
        
        if (metricsSnap.exists()) {
          const metricsData = metricsSnap.data();
          
          // Set up saccade direction error data
          data.saccadeDirectionError = {
            AverageSaccadeErrorPercentage: 
              (metricsData.prosaccadeGap?.saccadeErrorPercentage + 
               metricsData.antisaccadeGap?.saccadeErrorPercentage +
               metricsData.prosaccadeOverlap?.saccadeErrorPercentage +
               metricsData.antisaccadeOverlap?.saccadeErrorPercentage) / 4,
            errors: {
              'antigap': {
                ErrorCount: Math.round(metricsData.antisaccadeGap?.saccadeErrorPercentage * 10),
                PercentError: metricsData.antisaccadeGap?.saccadeErrorPercentage
              },
              'antioverlap': {
                ErrorCount: Math.round(metricsData.antisaccadeOverlap?.saccadeErrorPercentage * 10),
                PercentError: metricsData.antisaccadeOverlap?.saccadeErrorPercentage
              },
              'progap': {
                ErrorCount: Math.round(metricsData.prosaccadeGap?.saccadeErrorPercentage * 10),
                PercentError: metricsData.prosaccadeGap?.saccadeErrorPercentage
              },
              'prooverlap': {
                ErrorCount: Math.round(metricsData.prosaccadeOverlap?.saccadeErrorPercentage * 10),
                PercentError: metricsData.prosaccadeOverlap?.saccadeErrorPercentage
              }
            }
          };
          
          // Set up saccade duration data
          data.saccadeDuration = {
            AverageSaccadeDuration: 
              (metricsData.prosaccadeGap?.averageSaccadeDuration + 
               metricsData.antisaccadeGap?.averageSaccadeDuration +
               metricsData.prosaccadeOverlap?.averageSaccadeDuration +
               metricsData.antisaccadeOverlap?.averageSaccadeDuration) / 4,
            durations: {
              'antigap': {
                Duration: metricsData.antisaccadeGap?.averageSaccadeDuration
              },
              'antioverlap': {
                Duration: metricsData.antisaccadeOverlap?.averageSaccadeDuration
              },
              'progap': {
                Duration: metricsData.prosaccadeGap?.averageSaccadeDuration
              },
              'prooverlap': {
                Duration: metricsData.prosaccadeOverlap?.averageSaccadeDuration
              }
            }
          };
          
          // Set up saccade omission percentages
          data.saccadeOmissionPercentages = {
            antiGap: metricsData.antisaccadeGap?.saccadeOmissionPercentage,
            antiOverlap: metricsData.antisaccadeOverlap?.saccadeOmissionPercentage,
            proGap: metricsData.prosaccadeGap?.saccadeOmissionPercentage,
            proOverlap: metricsData.prosaccadeOverlap?.saccadeOmissionPercentage
          };
          
          // Set up reaction time data
          data.reactionTime = {
            antiGap: metricsData.antisaccadeGap?.averageReactionTime,
            antiOverlap: metricsData.antisaccadeOverlap?.averageReactionTime,
            proGap: metricsData.prosaccadeGap?.averageReactionTime,
            proOverlap: metricsData.prosaccadeOverlap?.averageReactionTime
          };
          
          // Set up fixation duration data (previously fixation accuracy)
          data.fixationAccuracy = {
            AverageFixationDuration: 
              (metricsData.prosaccadeGap?.averageFixationDuration + 
               metricsData.antisaccadeGap?.averageFixationDuration +
               metricsData.prosaccadeOverlap?.averageFixationDuration +
               metricsData.antisaccadeOverlap?.averageFixationDuration) / 4,
            landingAccuracy: {
              'gap': {
                LandingAccuracy: (metricsData.prosaccadeGap?.averageFixationDuration + 
                                  metricsData.antisaccadeGap?.averageFixationDuration) / 2
              },
              'overlap': {
                LandingAccuracy: (metricsData.prosaccadeOverlap?.averageFixationDuration + 
                                  metricsData.antisaccadeOverlap?.averageFixationDuration) / 2
              }
            }
          };
        }
      } catch (error) {
        console.error("Error fetching naturesGaze metrics data", error);
      }

      setNaturesGazeData(data);
    };

    if (selectedGame === "naturesGaze") {
      fetchNaturesGazeData();
    }
  }, [selectedGame, selectedDate, effectiveUserId]);

  const renderFixationAccuracyTable = (landingAccuracy) => {
    return (
      <div className="table-container">
        <div className="table-header">
          <span>Task</span>
          <span>Duration (ms)</span>
        </div>
        {Object.entries(landingAccuracy).map(([task, data]) => (
          <div key={task} className="table-row">
            <span>{task}</span>
            <span>{data.LandingAccuracy !== undefined ? data.LandingAccuracy.toFixed(2) : "N/A"}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderSaccadeDirectionErrorTable = (errors) => {
    return (
      <div className="table-container">
        <div className="table-header">
          <span>Task</span>
          <span>Error Count</span>
          <span>Percent Error</span>
        </div>
        {Object.entries(errors).map(([task, data]) => (
          <div key={task} className="table-row">
            <span>{task}</span>
            <span>{data.ErrorCount !== undefined ? data.ErrorCount : "N/A"}</span>
            <span>{data.PercentError !== undefined ? data.PercentError.toFixed(2) + "%" : "N/A"}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderSaccadeDurationTable = (durations) => {
    return (
      <div className="table-container">
        <div className="table-header">
          <span>Task</span>
          <span>Duration</span>
        </div>
        {Object.entries(durations).map(([task, data]) => (
          <div key={task} className="table-row">
            <span>{task}</span>
            <span>{data.Duration !== undefined ? data.Duration.toFixed(2) + " ms" : "N/A"}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderReactionTime = (data) => {
    return (
      <div className="table-container">
        <div className="table-header">
          <span>Task</span>
          <span>Time (ms)</span>
        </div>
        {["antiGap", "antiOverlap", "proGap", "proOverlap"].map((task) => (
          <div key={task} className="table-row">
            <span>{task}</span>
            <span>{data[task] !== undefined ? data[task].toFixed(2) : "N/A"}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderSaccadeOmissionPercentages = (data) => {
    return (
      <div className="table-container">
        <div className="table-header">
          <span>Task</span>
          <span>Percent</span>
        </div>
        {["antiGap", "antiOverlap", "proGap", "proOverlap"].map((task) => (
          <div key={task} className="table-row">
            <span>{task}</span>
            <span>{data[task] !== undefined ? data[task].toFixed(2) + "%" : "N/A"}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderLexicalFeatures = (fields) => {
    const sortedFields = Object.keys(fields)
      .sort(
        (a, b) =>
          lexicalFeaturesOrder.indexOf(a) - lexicalFeaturesOrder.indexOf(b)
      )
      .reduce((obj, key) => {
        obj[key] = fields[key];
        return obj;
      }, {});

    return (
      <div className="table-container">
        <div className="table-header">
          <span>Word Types</span>
          <span>Count</span>
        </div>
        {Object.entries(sortedFields).map(([key, value]) => (
          <div key={key} className="table-row">
            <span>{formatMetricName(key)}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderSemanticFeatures = (fields) => {
    const sortedFields = Object.keys(fields)
      .sort(
        (a, b) =>
          semanticFeaturesOrder.indexOf(a) - semanticFeaturesOrder.indexOf(b)
      )
      .reduce((obj, key) => {
        obj[key] = fields[key];
        return obj;
      }, {});

    return (
      <div className="fields">
        {Object.entries(sortedFields).map(([key, value]) => (
          <p key={key}>
            <strong>{formatMetricName(key)}:</strong> {value}
          </p>
        ))}
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

  const renderFluencyMetrics = (fields, game) => {
    const sortedFields = fluencyMetricsOrder.reduce((obj, key) => {
      if (fields[key] !== undefined) {
        obj[key] = fields[key];
      }
      return obj;
    }, {});

    return (
      <div className="fields">
        {Object.entries(sortedFields).map(([key, value]) => (
          <p key={key}>
            <strong>{formatMetricName(key)}:</strong> {value}
          </p>
        ))}
        {/* Only show stutters table for games other than Process Quest and Scene Detective */}
        {game !== "processQuest" && game !== "sceneDetective" && fields.stutters && renderStutters(fields.stutters)}
      </div>
    );
  };

  const renderStructuralFeatures = (fields) => {
    const sortedFields = structuralFeaturesOrder.reduce((obj, key) => {
      if (fields[key] !== undefined) {
        obj[key] = fields[key];
      }
      return obj;
    }, {});

    return (
      <div className="fields">
        {Object.entries(sortedFields).map(([key, value]) => (
          <p key={key}>
            <strong>{formatMetricName(key)}:</strong> {value}
          </p>
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

  const renderMemoryVaultTable = (data) => {
    const presentedArray = data.Presented
      ? data.Presented.split(",").map((item) => item.trim())
      : [];
    const recalledArray = data.Recalled
      ? data.Recalled.split(",").map((item) => item.trim())
      : [];

    // row 0: wordPoints, row 1: audioPoints, row 2: picturePoints
    const pointsArray = [data.wordPoints, data.audioPoints, data.picturePoints];
    const totalPoints =
      (typeof data.wordPoints === "number" ? data.wordPoints : 0) +
      (typeof data.audioPoints === "number" ? data.audioPoints : 0) +
      (typeof data.picturePoints === "number" ? data.picturePoints : 0);

    const maxRows = Math.max(
      presentedArray.length,
      recalledArray.length,
      pointsArray.length
    );

    return (
      <>
        <p className="total-points">
          <strong>Total Points Scored (out of 12): </strong>{totalPoints}
        </p>
        <div className="table-container">
          <div className="table-header">
            <span>Presented</span>
            <span>Recalled</span>
            <span>Points Scored</span>
          </div>
          {Array.from({ length: maxRows }).map((_, index) => (
            <div key={index} className="table-row">
              <span>{presentedArray[index] || ""}</span>
              <span>{recalledArray[index] || ""}</span>
              <span>{pointsArray[index] !== undefined ? pointsArray[index] : ""}</span>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="daily-reports-see-more-container">
      {onBack && (
        <div className="back-button-container">
          <Link className="back-button-see-more" onClick={onBack}>
            Back
          </Link>
        </div>
      )}
      <PatientInfoBoxComponent
        reportTitle="Daily Reports"
        selectedDate={selectedDate}
        patientData={patientData}
        effectiveUserId={effectiveUserId}
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
      {/* Game Section Views */}
      {selectedGame === "sceneDetective" && (
        <div className="game-section">
          {sceneData === null ? (
            <p>Loading scene detective data...</p>
          ) : Object.keys(sceneData).length === 0 ? (
            <p>No metrics available for Scene Detective on this date.</p>
          ) : (
            <div className="game-grid">
              {[
                "lexicalFeatures",
                "temporalCharacteristics",
                "fluencyMetrics",
                "structuralFeatures",
                "semanticFeatures",
              ].map((metric) => {
                let descriptionKey =
                  metricTitles[metric] || formatMetricName(metric);
                if (
                  selectedGame === "processQuest" ||
                  selectedGame === "sceneDetective"
                ) {
                  if (metric === "fluencyMetrics") {
                    descriptionKey = "Fluency Metrics: " + selectedGame;
                  } else if (metric === "lexicalFeatures") {
                    descriptionKey = "Lexical Content: " + selectedGame;
                  } else if (metric === "temporalCharacteristics") {
                    descriptionKey =
                      "Temporal Characteristics: " + selectedGame;
                  }
                }
                return (
                  <div key={metric} className="game-box">
                    <TitleWithInfo
                      title={metricTitles[metric] || formatMetricName(metric)}
                      description={PlotDescriptions[descriptionKey] || ""}
                    />
                    <div className="fields">
                      {metric === "lexicalFeatures" ? (
                        renderLexicalFeatures(sceneData[metric])
                      ) : metric === "semanticFeatures" ? (
                        renderSemanticFeatures(sceneData[metric])
                      ) : metric === "fluencyMetrics" ? (
                        renderFluencyMetrics(sceneData[metric], "sceneDetective")
                      ) : metric === "structuralFeatures" ? (
                        renderStructuralFeatures(sceneData[metric])
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
                              <strong>{formatMetricName(field)}:</strong>{" "}
                              {value}
                            </p>
                          )
                        )
                      )}
                    </div>
                  </div>
                );
              })}
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
                "lexicalFeatures",
                "temporalCharacteristics",
                "fluencyMetrics",
                "semanticFeatures",
                "structuralFeatures",
              ].map((metric) => {
                let descriptionKey =
                  metricTitles[metric] || formatMetricName(metric);
                if (
                  selectedGame === "processQuest" ||
                  selectedGame === "sceneDetective"
                ) {
                  if (metric === "fluencyMetrics") {
                    descriptionKey = "Fluency Metrics: " + selectedGame;
                  } else if (metric === "lexicalFeatures") {
                    descriptionKey = "Lexical Content: " + selectedGame;
                  } else if (metric === "temporalCharacteristics") {
                    descriptionKey =
                      "Temporal Characteristics: " + selectedGame;
                  }
                }
                return (
                  <div key={metric} className="game-box">
                    <TitleWithInfo
                      title={metricTitles[metric] || formatMetricName(metric)}
                      description={PlotDescriptions[descriptionKey] || ""}
                    />
                    <div className="fields">
                      {metric === "lexicalFeatures" ? (
                        renderLexicalFeatures(processQuestData[metric])
                      ) : metric === "semanticFeatures" ? (
                        renderSemanticFeatures(processQuestData[metric])
                      ) : metric === "fluencyMetrics" ? (
                        renderFluencyMetrics(processQuestData[metric], "processQuest")
                      ) : metric === "structuralFeatures" ? (
                        renderStructuralFeatures(processQuestData[metric])
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
                              <strong>{formatMetricName(field)}:</strong>{" "}
                              {value}
                            </p>
                          )
                        )
                      )}
                    </div>
                  </div>
                );
              })}
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
            <div className="game-box-vault">
              <TitleWithInfo
                title="Recall Accuracy"
                description={PlotDescriptions["Recall Score"] || ""}
              />
              {renderMemoryVaultTable(
                memoryVaultData["recallSpeedAndAccuracy"]
              )}
            </div>
          )}
        </div>
      )}
      {selectedGame === "naturesGaze" && (
        <div className="game-section">
          {naturesGazeData === null ? (
            <p>Loading Natures Gaze data...</p>
          ) : Object.keys(naturesGazeData).length === 0 ? (
            <p>No metrics available for Natures Gaze on this date.</p>
          ) : (
            <div className="game-grid">
              <div className="game-box">
                <TitleWithInfo
                  title="Saccade Direction Error"
                  description={
                    PlotDescriptions["Saccade Direction Error"] || ""
                  }
                />
                {naturesGazeData.saccadeDirectionError ? (
                  <>
                    <p>
                      <strong>Average Direction Error:</strong>{" "}
                      {naturesGazeData.saccadeDirectionError
                        .AverageSaccadeErrorPercentage && 
                        naturesGazeData.saccadeDirectionError
                          .AverageSaccadeErrorPercentage.toFixed(2) + "%"}
                    </p>
                    {naturesGazeData.saccadeDirectionError.errors ? (
                      renderSaccadeDirectionErrorTable(
                        naturesGazeData.saccadeDirectionError.errors
                      )
                    ) : (
                      <p>No error data.</p>
                    )}
                  </>
                ) : (
                  <p>No saccade direction error data.</p>
                )}
              </div>
              <div className="game-box">
                <TitleWithInfo
                  title="Saccade Duration"
                  description={PlotDescriptions["Saccade Durations"] || ""}
                />
                {naturesGazeData.saccadeDuration ? (
                  <>
                    {naturesGazeData.saccadeDuration.AverageSaccadeDuration && (
                      <p>
                        <strong>Average Saccade Duration:</strong>{" "}
                        {naturesGazeData.saccadeDuration.AverageSaccadeDuration.toFixed(2)} ms
                      </p>
                    )}
                    {naturesGazeData.saccadeDuration.durations ? (
                      renderSaccadeDurationTable(
                        naturesGazeData.saccadeDuration.durations
                      )
                    ) : (
                      <p>No duration data.</p>
                    )}
                  </>
                ) : (
                  <p>No saccade duration data.</p>
                )}
              </div>
              <div className="game-box">
                <TitleWithInfo
                  title="Saccade Omission Percentages"
                  description={
                    PlotDescriptions["Saccade Omission Percentages"] || ""
                  }
                />
                {naturesGazeData.saccadeOmissionPercentages ? (
                  renderSaccadeOmissionPercentages(
                    naturesGazeData.saccadeOmissionPercentages
                  )
                ) : (
                  <p>No omission percentages data.</p>
                )}
              </div>
              <div className="game-box">
                <TitleWithInfo
                  title="Reaction Time"
                  description={PlotDescriptions["Reaction Time"] || ""}
                />
                {naturesGazeData.reactionTime ? (
                  renderReactionTime(naturesGazeData.reactionTime)
                ) : (
                  <p>No reaction time data.</p>
                )}
              </div>
              <div className="game-box">
                <TitleWithInfo
                  title="Average Fixation Duration"
                  description={PlotDescriptions["Fixation Accuracy"] || ""}
                />
                {naturesGazeData.fixationAccuracy &&
                naturesGazeData.fixationAccuracy.landingAccuracy ? (
                  <>
                    {naturesGazeData.fixationAccuracy.AverageFixationDuration && (
                      <p>
                        <strong>Average Fixation Duration:</strong>{" "}
                        {naturesGazeData.fixationAccuracy.AverageFixationDuration.toFixed(2)} ms
                      </p>
                    )}
                    {renderFixationAccuracyTable(
                      naturesGazeData.fixationAccuracy.landingAccuracy
                    )}
                  </>
                ) : (
                  <p>No fixation duration data.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      <div style={{ height: "100px" }}></div> {/* Spacer for scrolling */}
    </div>
  );
};

export default DailyReportsSeeMoreComponent;
