import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import PatientInfoBoxComponent from "./PatientInfoBoxComponent";
import BoxPlot from "./BoxPlot";
import carouselNextImg from "../assets/carousel-next-button.svg";
import PlotDescriptions from "../components/PlotDescriptions";
import "./AllTimeTrendsComponent.css";

const getReports = async (effectiveUserId) => {
  const reportsCollection = collection(
    db,
    `users/${effectiveUserId}/dailyReportsSeeMore`
  );
  const reportSnapshots = await getDocs(reportsCollection);
  return reportSnapshots.docs.map((reportDoc) => {
    const dateKey = reportDoc.id;
    const [month, , year] = dateKey.split("-");
    const monthYear = new Date(year, month - 1).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
    return { dateKey, monthYear };
  });
};

const AllTimeTrendsComponent = ({ userId }) => {
  const effectiveUserId = userId;
  const [selectedGame, setSelectedGame] = useState("");
  const [patientData, setPatientData] = useState(null);

  const [memoryVaultRecallScoreData, setMemoryVaultRecallScoreData] = useState(
    {}
  );
  const [naturesGazeReactionTimeData, setNaturesGazeReactionTimeData] =
    useState({});
  const [naturesGazeSopData, setNaturesGazeSopData] = useState({});
  const [saccadeDurationData, setSaccadeDurationData] = useState({});
  const [fixationAccuracyData, setFixationAccuracyData] = useState({});
  const [saccadeDirectionErrorData, setSaccadeDirectionErrorData] = useState(
    {}
  );
  const [speakingTimeData, setSpeakingTimeData] = useState({});
  const [pauseCountData, setPauseCountData] = useState({});
  const [pauseDurationData, setPauseDurationData] = useState({});
  const [lexNounData, setLexNounData] = useState({});
  const [lexClosedClassData, setLexClosedClassData] = useState({});
  const [lexFillerData, setLexFillerData] = useState({});
  const [lexOpenClassData, setLexOpenClassData] = useState({});
  const [lexVerbData, setLexVerbData] = useState({});
  const [lexicalIndex, setLexicalIndex] = useState(0);
  const [metricsIndex, setMetricsIndex] = useState(0);
  const [structuralMeanData, setStructuralMeanData] = useState({});
  const [structuralSentenceData, setStructuralSentenceData] = useState({});
  const [structuralIndex, setStructuralIndex] = useState(0);
  const [fluencyRepetitionRatioData, setFluencyRepetitionRatioData] = useState({});
  const [fluencyWordsPerMinData, setFluencyWordsPerMinData] = useState({});
  const [fluencyIndex, setFluencyIndex] = useState(0);
  const [semanticLexFreqData, setSemanticLexFreqData] = useState({});
  const [setSemanticEfficiencyData] = useState({});
  const [setSemanticIdeaDensityData] = useState({});
  const [semanticIndex, setSemanticIndex] = useState(0);

  useEffect(() => {
    // Clear all datasets on game change
    setMemoryVaultRecallScoreData({});
    setNaturesGazeReactionTimeData({});
    setNaturesGazeSopData({});
    if (selectedGame !== "naturesGaze") {
      setSaccadeDurationData({});
      setFixationAccuracyData({});
      setSaccadeDirectionErrorData({});
    }
    if (selectedGame !== "processQuest" && selectedGame !== "sceneDetective") {
      setSpeakingTimeData({});
      setPauseCountData({});
      setPauseDurationData({});
      setLexNounData({});
      setLexClosedClassData({});
      setLexFillerData({});
      setLexOpenClassData({});
      setLexVerbData({});
      setStructuralMeanData({});
      setStructuralSentenceData({});
      setFluencyRepetitionRatioData({});
      setFluencyWordsPerMinData({});
      setSemanticLexFreqData({});
      setSemanticEfficiencyData({});
      setSemanticIdeaDensityData({});
    }
  }, [selectedGame, setMemoryVaultRecallScoreData, setNaturesGazeReactionTimeData, setNaturesGazeSopData, setSaccadeDurationData, setFixationAccuracyData, setSaccadeDirectionErrorData, setSpeakingTimeData, setPauseCountData, setPauseDurationData, setLexNounData, setLexClosedClassData, setLexFillerData, setLexOpenClassData, setLexVerbData, setStructuralMeanData, setStructuralSentenceData, setFluencyRevisionRatioData, setFluencyWordsPerMinData, setFluencyStutterCountData, setSemanticLexFreqData, setSemanticEfficiencyData, setSemanticIdeaDensityData]);

  useEffect(() => {
    if (selectedGame === "processQuest" || selectedGame === "sceneDetective") {
      setLexicalIndex(0);
    }
  }, [selectedGame]);

  useEffect(() => {
    if (selectedGame === "processQuest" || selectedGame === "sceneDetective") {
      setMetricsIndex(0);
    }
  }, [selectedGame]);

  useEffect(() => {
    if (selectedGame === "processQuest" || selectedGame === "sceneDetective") {
      setStructuralIndex(0);
    }
  }, [selectedGame]);

  useEffect(() => {
    if (selectedGame === "processQuest" || selectedGame === "sceneDetective") {
      setFluencyIndex(0);
    }
  }, [selectedGame]);

  useEffect(() => {
    if (selectedGame === "processQuest" || selectedGame === "sceneDetective") {
      setSemanticIndex(0);
    }
  }, [selectedGame]);

  // Fetch patient data
  useEffect(() => {
    if (!effectiveUserId) return;
    (async () => {
      try {
        const patientDoc = await getDoc(doc(db, "users", effectiveUserId));
        if (patientDoc.exists()) {
          setPatientData(patientDoc.data());
        }
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    })();
  }, [effectiveUserId]);

  // naturesGaze Reaction Time fetching
  useEffect(() => {
    if (!effectiveUserId || selectedGame !== "naturesGaze") return;
    (async () => {
      try {
        const dataPoints = {
          antiGap: {},
          proGap: {},
          proOverlap: {},
          antiOverlap: {},
        };
        const reports = await getReports(effectiveUserId);
        for (const { dateKey, monthYear } of reports) {
          const metricsDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/metrics`
          );
          const metricsDoc = await getDoc(metricsDocRef);
          if (metricsDoc.exists()) {
            const data = metricsDoc.data();
            
            // Map the backend field names to the display names
            if (data.antisaccadeGap && data.antisaccadeGap.averageReactionTime !== undefined) {
                if (!dataPoints.antiGap[monthYear]) dataPoints.antiGap[monthYear] = [];
                dataPoints.antiGap[monthYear].push(data.antisaccadeGap.averageReactionTime);
            }
            
            if (data.prosaccadeGap && data.prosaccadeGap.averageReactionTime !== undefined) {
                if (!dataPoints.proGap[monthYear]) dataPoints.proGap[monthYear] = [];
                dataPoints.proGap[monthYear].push(data.prosaccadeGap.averageReactionTime);
            }
            
            if (data.prosaccadeOverlap && data.prosaccadeOverlap.averageReactionTime !== undefined) {
                if (!dataPoints.proOverlap[monthYear]) dataPoints.proOverlap[monthYear] = [];
                dataPoints.proOverlap[monthYear].push(data.prosaccadeOverlap.averageReactionTime);
            }
            
            if (data.antisaccadeOverlap && data.antisaccadeOverlap.averageReactionTime !== undefined) {
                if (!dataPoints.antiOverlap[monthYear]) dataPoints.antiOverlap[monthYear] = [];
                dataPoints.antiOverlap[monthYear].push(data.antisaccadeOverlap.averageReactionTime);
            }
          }
        }
        setNaturesGazeReactionTimeData(dataPoints);
      } catch (error) {
        console.error("Error fetching reaction time data:", error);
      }
    })();
  }, [selectedGame, effectiveUserId]);

  // naturesGaze Saccade Omission Percentages fetching
  useEffect(() => {
    if (!effectiveUserId || selectedGame !== "naturesGaze") return;
    (async () => {
      try {
        const dataPoints = {
          antiGap: {},
          proGap: {},
          proOverlap: {},
          antiOverlap: {},
        };
        const reports = await getReports(effectiveUserId);
        for (const { dateKey, monthYear } of reports) {
          const metricsDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/metrics`
          );
          const metricsDoc = await getDoc(metricsDocRef);
          if (metricsDoc.exists()) {
            const data = metricsDoc.data();
            
            // Map the backend field names to the display names
            if (data.antisaccadeGap && data.antisaccadeGap.saccadeOmissionPercentage !== undefined) {
                if (!dataPoints.antiGap[monthYear]) dataPoints.antiGap[monthYear] = [];
                dataPoints.antiGap[monthYear].push(data.antisaccadeGap.saccadeOmissionPercentage);
            }
            
            if (data.prosaccadeGap && data.prosaccadeGap.saccadeOmissionPercentage !== undefined) {
                if (!dataPoints.proGap[monthYear]) dataPoints.proGap[monthYear] = [];
                dataPoints.proGap[monthYear].push(data.prosaccadeGap.saccadeOmissionPercentage);
            }
            
            if (data.prosaccadeOverlap && data.prosaccadeOverlap.saccadeOmissionPercentage !== undefined) {
                if (!dataPoints.proOverlap[monthYear]) dataPoints.proOverlap[monthYear] = [];
                dataPoints.proOverlap[monthYear].push(data.prosaccadeOverlap.saccadeOmissionPercentage);
            }
            
            if (data.antisaccadeOverlap && data.antisaccadeOverlap.saccadeOmissionPercentage !== undefined) {
                if (!dataPoints.antiOverlap[monthYear]) dataPoints.antiOverlap[monthYear] = [];
                dataPoints.antiOverlap[monthYear].push(data.antisaccadeOverlap.saccadeOmissionPercentage);
            }
          }
        }
        setNaturesGazeSopData(dataPoints);
      } catch (error) {
        console.error("Error fetching saccade omission data:", error);
      }
    })();
  }, [selectedGame, effectiveUserId]);

  // naturesGaze Saccade Duration fetching
  useEffect(() => {
    if (!effectiveUserId || selectedGame !== "naturesGaze") return;
    (async () => {
      try {
        const durationPoints = {
          antiGap: {},
          proGap: {},
          antiOverlap: {},
          proOverlap: {},
        };
        const reports = await getReports(effectiveUserId);
        for (const { dateKey, monthYear } of reports) {
          const metricsDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/metrics`
          );
          const metricsDoc = await getDoc(metricsDocRef);
          if (metricsDoc.exists()) {
            const data = metricsDoc.data();
            
            // Map the backend field names to the display names
            if (data.antisaccadeGap && data.antisaccadeGap.averageSaccadeDuration !== undefined) {
                if (!durationPoints.antiGap[monthYear]) durationPoints.antiGap[monthYear] = [];
                durationPoints.antiGap[monthYear].push(data.antisaccadeGap.averageSaccadeDuration);
            }
            
            if (data.prosaccadeGap && data.prosaccadeGap.averageSaccadeDuration !== undefined) {
                if (!durationPoints.proGap[monthYear]) durationPoints.proGap[monthYear] = [];
                durationPoints.proGap[monthYear].push(data.prosaccadeGap.averageSaccadeDuration);
            }
            
            if (data.prosaccadeOverlap && data.prosaccadeOverlap.averageSaccadeDuration !== undefined) {
                if (!durationPoints.proOverlap[monthYear]) durationPoints.proOverlap[monthYear] = [];
                durationPoints.proOverlap[monthYear].push(data.prosaccadeOverlap.averageSaccadeDuration);
            }
            
            if (data.antisaccadeOverlap && data.antisaccadeOverlap.averageSaccadeDuration !== undefined) {
                if (!durationPoints.antiOverlap[monthYear]) durationPoints.antiOverlap[monthYear] = [];
                durationPoints.antiOverlap[monthYear].push(data.antisaccadeOverlap.averageSaccadeDuration);
            }
          }
        }
        setSaccadeDurationData(durationPoints);
      } catch (error) {
        console.error("Error fetching saccade duration data:", error);
      }
    })();
  }, [selectedGame, effectiveUserId]);

  // Fixation Accuracy fetching (2-series: gap and overlap)
  useEffect(() => {
    if (!effectiveUserId || selectedGame !== "naturesGaze") return;
    (async () => {
      try {
        const accuracyPoints = {
          gap: {},
          overlap: {},
        };
        const reports = await getReports(effectiveUserId);
        for (const { dateKey, monthYear } of reports) {
          const metricsDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/metrics`
          );
          const metricsDoc = await getDoc(metricsDocRef);
          if (metricsDoc.exists()) {
            const data = metricsDoc.data();
            
            // For gap accuracy, we take the average of pro and anti saccade gap fixation durations
            const proGapFixation = data.prosaccadeGap?.averageFixationDuration;
            const antiGapFixation = data.antisaccadeGap?.averageFixationDuration;
            
            if (proGapFixation !== undefined || antiGapFixation !== undefined) {
                if (!accuracyPoints.gap[monthYear]) accuracyPoints.gap[monthYear] = [];
                
                if (proGapFixation !== undefined && antiGapFixation !== undefined) {
                    // If both values exist, use their average
                    accuracyPoints.gap[monthYear].push((proGapFixation + antiGapFixation) / 2);
                } else if (proGapFixation !== undefined) {
                    // If only proGap exists
                    accuracyPoints.gap[monthYear].push(proGapFixation);
                } else if (antiGapFixation !== undefined) {
                    // If only antiGap exists
                    accuracyPoints.gap[monthYear].push(antiGapFixation);
                }
            }
            
            // For overlap accuracy, we take the average of pro and anti saccade overlap fixation durations
            const proOverlapFixation = data.prosaccadeOverlap?.averageFixationDuration;
            const antiOverlapFixation = data.antisaccadeOverlap?.averageFixationDuration;
            
            if (proOverlapFixation !== undefined || antiOverlapFixation !== undefined) {
                if (!accuracyPoints.overlap[monthYear]) accuracyPoints.overlap[monthYear] = [];
                
                if (proOverlapFixation !== undefined && antiOverlapFixation !== undefined) {
                    // If both values exist, use their average
                    accuracyPoints.overlap[monthYear].push((proOverlapFixation + antiOverlapFixation) / 2);
                } else if (proOverlapFixation !== undefined) {
                    // If only proOverlap exists
                    accuracyPoints.overlap[monthYear].push(proOverlapFixation);
                } else if (antiOverlapFixation !== undefined) {
                    // If only antiOverlap exists
                    accuracyPoints.overlap[monthYear].push(antiOverlapFixation);
                }
            }
          }
        }
        setFixationAccuracyData(accuracyPoints);
      } catch (error) {
        console.error("Error fetching fixation accuracy data:", error);
      }
    })();
  }, [selectedGame, effectiveUserId]);

  // Saccade Direction Error fetching (4-series)
  useEffect(() => {
    if (!effectiveUserId || selectedGame !== "naturesGaze") return;
    (async () => {
      try {
        const errorPoints = {
          antiGap: {},
          proGap: {},
          antiOverlap: {},
          proOverlap: {},
        };
        const reports = await getReports(effectiveUserId);
        for (const { dateKey, monthYear } of reports) {
          const metricsDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/metrics`
          );
          const metricsDoc = await getDoc(metricsDocRef);
          if (metricsDoc.exists()) {
            const data = metricsDoc.data();
            
            // Map the backend field names to the display names
            if (data.antisaccadeGap && data.antisaccadeGap.saccadeErrorPercentage !== undefined) {
                if (!errorPoints.antiGap[monthYear]) errorPoints.antiGap[monthYear] = [];
                errorPoints.antiGap[monthYear].push(data.antisaccadeGap.saccadeErrorPercentage);
            }
            
            if (data.prosaccadeGap && data.prosaccadeGap.saccadeErrorPercentage !== undefined) {
                if (!errorPoints.proGap[monthYear]) errorPoints.proGap[monthYear] = [];
                errorPoints.proGap[monthYear].push(data.prosaccadeGap.saccadeErrorPercentage);
            }
            
            if (data.prosaccadeOverlap && data.prosaccadeOverlap.saccadeErrorPercentage !== undefined) {
                if (!errorPoints.proOverlap[monthYear]) errorPoints.proOverlap[monthYear] = [];
                errorPoints.proOverlap[monthYear].push(data.prosaccadeOverlap.saccadeErrorPercentage);
            }
            
            if (data.antisaccadeOverlap && data.antisaccadeOverlap.saccadeErrorPercentage !== undefined) {
                if (!errorPoints.antiOverlap[monthYear]) errorPoints.antiOverlap[monthYear] = [];
                errorPoints.antiOverlap[monthYear].push(data.antisaccadeOverlap.saccadeErrorPercentage);
            }
          }
        }
        setSaccadeDirectionErrorData(errorPoints);
      } catch (error) {
        console.error("Error fetching saccade direction error data:", error);
      }
    })();
  }, [selectedGame, effectiveUserId]);

  // Process Quest Speaking Time fetching
  const isTemporalGame =
    selectedGame === "processQuest" || selectedGame === "sceneDetective";

  // MemoryVault Recall Score fetching
  useEffect(() => {
    if (!effectiveUserId || selectedGame !== "memoryVault") return;
    (async () => {
      try {
        const dataPoints = {};
        const reports = await getReports(effectiveUserId);
        for (const { dateKey, monthYear } of reports) {
          const mvDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/memoryVault/recallSpeedAndAccuracy`
          );
          const mvDoc = await getDoc(mvDocRef);
          if (mvDoc.exists()) {
            const { wordPoints, audioPoints, picturePoints } = mvDoc.data();
            const sessionPoints = [];
            if (typeof wordPoints === "number") sessionPoints.push(wordPoints);
            if (typeof audioPoints === "number")
              sessionPoints.push(audioPoints);
            if (typeof picturePoints === "number")
              sessionPoints.push(picturePoints);
            if (sessionPoints.length) {
              if (!dataPoints[monthYear]) dataPoints[monthYear] = [];
              dataPoints[monthYear].push(...sessionPoints);
            }
          }
        }
        setMemoryVaultRecallScoreData(dataPoints);
      } catch (error) {
        console.error("Error fetching memory vault points:", error);
      }
    })();
  }, [selectedGame, effectiveUserId]);

  useEffect(() => {
    if (!effectiveUserId || !isTemporalGame) return;
    (async () => {
      try {
        const dataPoints = {};
        const reports = await getReports(effectiveUserId);
        for (const { dateKey, monthYear } of reports) {
          const tpDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/temporalCharacteristics`
          );
          const tpDoc = await getDoc(tpDocRef);
          console.log(
            "tpDoc for",
            dateKey,
            "exists:",
            tpDoc.exists(),
            "data:",
            tpDoc.data()
          );
          if (tpDoc.exists()) {
            const data = tpDoc.data();
            const speakingTime = data.SpeakingTime;
            if (typeof speakingTime === "string") {
              const [minStr, secStr] = speakingTime.split(":");
              const minutes = parseInt(minStr, 10);
              const seconds = parseInt(secStr, 10) || 0;
              const totalSec = minutes * 60 + seconds;
              console.log(
                "Converted SpeakingTime:",
                speakingTime,
                "=>",
                totalSec,
                "seconds"
              );
              if (!dataPoints[monthYear]) dataPoints[monthYear] = [];
              dataPoints[monthYear].push(totalSec);
            } else if (typeof speakingTime === "number") {
              // new branch
              if (!dataPoints[monthYear]) dataPoints[monthYear] = [];
              dataPoints[monthYear].push(speakingTime);
            } else {
              console.warn(
                "SpeakingTime is not a string for",
                dateKey,
                ":",
                speakingTime
              );
            }
          }
        }
        console.log("Final Speaking Time dataPoints:", dataPoints);
        setSpeakingTimeData(dataPoints);
      } catch (error) {
        console.error("Error fetching Speaking Time data:", error);
      }
    })();
  }, [selectedGame, effectiveUserId, isTemporalGame]);

  // New effect: Fetch Process Quest Pause Count data
  useEffect(() => {
    if (!effectiveUserId || !isTemporalGame) return;
    (async () => {
      try {
        const dataPoints = {};
        const reports = await getReports(effectiveUserId);
        for (const { dateKey, monthYear } of reports) {
          const pausesCollection = collection(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/temporalCharacteristics/Pauses`
          );
          const pausesSnapshots = await getDocs(pausesCollection);
          const count = pausesSnapshots.docs.length; // number of pause documents
          if (!dataPoints[monthYear]) dataPoints[monthYear] = [];
          dataPoints[monthYear].push(count);
        }
        console.log("Final Pause Count dataPoints:", dataPoints);
        setPauseCountData(dataPoints);
      } catch (error) {
        console.error("Error fetching Pause Count data:", error);
      }
    })();
  }, [selectedGame, effectiveUserId, isTemporalGame]);

  // New effect: Fetch Process Quest Pause Duration data
  useEffect(() => {
    if (!effectiveUserId || !isTemporalGame) return;
    (async () => {
      try {
        const dataPoints = {};
        const reports = await getReports(effectiveUserId);
        for (const { dateKey, monthYear } of reports) {
          const pausesCollection = collection(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/temporalCharacteristics/Pauses`
          );
          const pausesSnapshots = await getDocs(pausesCollection);
          pausesSnapshots.docs.forEach((pauseDoc) => {
            const data = pauseDoc.data();
            if (data.StartTime && data.EndTime) {
              try {
                // Check if times are already in numeric format
                if (typeof data.StartTime === 'number' && typeof data.EndTime === 'number') {
                  const duration = data.EndTime - data.StartTime;
                  if (!dataPoints[monthYear]) dataPoints[monthYear] = [];
                  dataPoints[monthYear].push(duration);
                } 
                // Handle string formats like "MM:SS" or "SS.ms"
                else if (typeof data.StartTime === 'string' && typeof data.EndTime === 'string') {
                  let startTotal, endTotal;
                  
                  // Handle "MM:SS" format
                  if (data.StartTime.includes(":")) {
                    const [startMin, startSec] = data.StartTime.split(":").map(x => parseFloat(x));
                    const [endMin, endSec] = data.EndTime.split(":").map(x => parseFloat(x));
                    startTotal = startMin * 60 + startSec;
                    endTotal = endMin * 60 + endSec;
                  } 
                  // Handle seconds or seconds.milliseconds format
                  else {
                    startTotal = parseFloat(data.StartTime);
                    endTotal = parseFloat(data.EndTime);
                  }
                  
                  if (!isNaN(startTotal) && !isNaN(endTotal)) {
                    const duration = endTotal - startTotal;
                    if (duration > 0) { // Only include positive durations
                      if (!dataPoints[monthYear]) dataPoints[monthYear] = [];
                      dataPoints[monthYear].push(duration);
                    } else {
                      console.warn("Invalid pause duration (negative or zero):", duration, "Start:", data.StartTime, "End:", data.EndTime);
                    }
                  } else {
                    console.warn("Invalid time format for pause:", data.StartTime, data.EndTime);
                  }
                }
              } catch (err) {
                console.error("Error calculating pause duration:", err, data);
              }
            }
          });
        }
        console.log("Final Pause Duration dataPoints:", dataPoints);
        setPauseDurationData(dataPoints);
      } catch (error) {
        console.error("Error fetching Pause Duration data:", error);
      }
    })();
  }, [selectedGame, effectiveUserId, isTemporalGame]);

  // New effect: Fetch Process Quest Lexical Features data
  useEffect(() => {
    if (!effectiveUserId || !isTemporalGame) return;
    (async () => {
      try {
        const nounData = {};
        const closedClassData = {};
        const fillerData = {};
        const openClassData = {};
        const verbData = {};
        const reports = await getReports(effectiveUserId);
        for (const { dateKey, monthYear } of reports) {
          const lexicalDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/lexicalFeatures`
          );
          const lexicalDoc = await getDoc(lexicalDocRef);
          if (lexicalDoc.exists()) {
            const data = lexicalDoc.data();
            const nounCount = Number(data.Noun);
            const closedClassCount = Number(data.ClosedClass);
            const fillerCount = Number(data.Filler);
            const openClassCount = Number(data.OpenClass);
            const verbCount = Number(data.Verb);
            if (!nounData[monthYear]) nounData[monthYear] = [];
            if (!closedClassData[monthYear]) closedClassData[monthYear] = [];
            if (!fillerData[monthYear]) fillerData[monthYear] = [];
            if (!openClassData[monthYear]) openClassData[monthYear] = [];
            if (!verbData[monthYear]) verbData[monthYear] = [];
            nounData[monthYear].push(nounCount);
            closedClassData[monthYear].push(closedClassCount);
            fillerData[monthYear].push(fillerCount);
            openClassData[monthYear].push(openClassCount);
            verbData[monthYear].push(verbCount);
          }
        }
        console.log("Lexical Noun dataPoints:", nounData);
        console.log("Lexical ClosedClass dataPoints:", closedClassData);
        console.log("Lexical Filler dataPoints:", fillerData);
        console.log("Lexical OpenClass dataPoints:", openClassData);
        console.log("Lexical Verb dataPoints:", verbData);
        setLexNounData(nounData);
        setLexClosedClassData(closedClassData);
        setLexFillerData(fillerData);
        setLexOpenClassData(openClassData);
        setLexVerbData(verbData);
      } catch (error) {
        console.error("Error fetching lexical features data:", error);
      }
    })();
  }, [selectedGame, effectiveUserId, isTemporalGame]);

  // New effect: Fetch Process Quest Structural Features data
  useEffect(() => {
    if (!effectiveUserId || !isTemporalGame) return;
    (async () => {
      try {
        const meanDataPoints = {};
        const sentenceDataPoints = {};
        const reports = await getReports(effectiveUserId);
        for (const { dateKey, monthYear } of reports) {
          const structuralDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/structuralFeatures`
          );
          const structuralDoc = await getDoc(structuralDocRef);
          if (structuralDoc.exists()) {
            const data = structuralDoc.data();
            // Check for either property name since it might be stored differently
            const meanValue = Number(data.MeanLengthOfUtterance || data.MeanLengthOfOccurrence || 
                               data["Mean Length of Utterance (MLU) (Average number of words per sentence)"]);
            const sentenceCount = Number(data.NumOfSentences);
            if (!meanDataPoints[monthYear]) meanDataPoints[monthYear] = [];
            if (!sentenceDataPoints[monthYear])
              sentenceDataPoints[monthYear] = [];
            meanDataPoints[monthYear].push(meanValue);
            sentenceDataPoints[monthYear].push(sentenceCount);
          }
        }
        console.log("Structural Mean dataPoints:", meanDataPoints);
        console.log("Structural Sentence dataPoints:", sentenceDataPoints);
        setStructuralMeanData(meanDataPoints);
        setStructuralSentenceData(sentenceDataPoints);
      } catch (error) {
        console.error("Error fetching structural features data:", error);
      }
    })();
  }, [selectedGame, effectiveUserId, isTemporalGame]);

  // New effect: Fetch Process Quest Fluency Metrics data
  useEffect(() => {
    if (!effectiveUserId || !isTemporalGame) return;
    (async () => {
      try {
        const repetitionData = {};
        const wordsData = {};
        const reports = await getReports(effectiveUserId);
        for (const { dateKey, monthYear } of reports) {
          const fluencyDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/fluencyMetrics`
          );
          const fluencyDoc = await getDoc(fluencyDocRef);
          if (fluencyDoc.exists()) {
            const data = fluencyDoc.data();
            // Look for either RevisionRatio or RepetitionRatio since the data might be stored with either name
            const repetition = Number(data.RepetitionRatio || data.RevisionRatio);
            const wordsPerMin = Number(data.WordsPerMin);
            if (!repetitionData[monthYear]) repetitionData[monthYear] = [];
            if (!wordsData[monthYear]) wordsData[monthYear] = [];
            repetitionData[monthYear].push(repetition);
            wordsData[monthYear].push(wordsPerMin);
          }
        }
        console.log("Fluency Repetition Ratio:", repetitionData);
        console.log("Fluency Words Per Min:", wordsData);
        setFluencyRepetitionRatioData(repetitionData);
        setFluencyWordsPerMinData(wordsData);
      } catch (error) {
        console.error("Error fetching fluency metrics data:", error);
      }
    })();
  }, [selectedGame, effectiveUserId, isTemporalGame, setFluencyRevisionRatioData, setFluencyWordsPerMinData, setFluencyStutterCountData]);

  // New effect: Fetch Process Quest Semantic Features data
  useEffect(() => {
    if (!effectiveUserId || !isTemporalGame) return;
    (async () => {
      try {
        const lexFreqData = {};
        const efficiencyData = {};
        const ideaDensityData = {};
        const reports = await getReports(effectiveUserId);
        for (const { dateKey, monthYear } of reports) {
          const semanticDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/semanticFeatures`
          );
          const semanticDoc = await getDoc(semanticDocRef);
          if (semanticDoc.exists()) {
            const data = semanticDoc.data();
            const lexFreq = Number(data.LexicalFrequencyOfNouns);
            const efficiency = Number(data.SemanticEfficiency);
            const ideaDensity = Number(data.SemanticIdeaDensity);
            if (!lexFreqData[monthYear]) lexFreqData[monthYear] = [];
            if (!efficiencyData[monthYear]) efficiencyData[monthYear] = [];
            if (!ideaDensityData[monthYear]) ideaDensityData[monthYear] = [];
            lexFreqData[monthYear].push(lexFreq);
            efficiencyData[monthYear].push(efficiency);
            ideaDensityData[monthYear].push(ideaDensity);
          }
        }
        console.log("Semantic LexFreq dataPoints:", lexFreqData);
        console.log("Semantic Efficiency dataPoints:", efficiencyData);
        console.log("Semantic Idea Density dataPoints:", ideaDensityData);
        setSemanticLexFreqData(lexFreqData);
        setSemanticEfficiencyData(efficiencyData);
        setSemanticIdeaDensityData(ideaDensityData);
      } catch (error) {
        console.error("Error fetching semantic features data:", error);
      }
    })();
  }, [selectedGame, effectiveUserId, isTemporalGame, setSemanticLexFreqData, setSemanticEfficiencyData, setSemanticIdeaDensityData]);

  return (
    <div className="all-time-trends-container">
      <PatientInfoBoxComponent
        patientData={patientData}
        effectiveUserId={effectiveUserId}
        reportTitle={"All Time Reports"}
        selectedDate={null}
      />
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
      {selectedGame === "memoryVault" && (
        <BoxPlot
          rawData={memoryVaultRecallScoreData}
          plotTitle="Recall Score"
          displaySubtitle={false}
          xAxisLabel="Date"
          yAxisLabel="Points"
          infoDescription={PlotDescriptions["Recall Score"]}
        />
      )}
      {selectedGame === "naturesGaze" && (
        <>
          <BoxPlot
            rawData={naturesGazeReactionTimeData}
            plotTitle="Reaction Time"
            displaySubtitle={false}
            xAxisLabel="Date"
            yAxisLabel="Time (Milliseconds)"
            seriesLabels={{
              antiGap: "Anti-Saccade, Gap Task",
              proGap: "Pro-Saccade, Gap Task",
              antiOverlap: "Anti-Saccade, Overlap Task",
              proOverlap: "Pro-Saccade, Overlap Task",
            }}
            multiSeries={true}
            infoDescription={PlotDescriptions["Reaction Time"]}
          />
          <BoxPlot
            rawData={naturesGazeSopData}
            plotTitle="Saccade Omission Percentages"
            displaySubtitle={false}
            xAxisLabel="Date"
            yAxisLabel="Percentage (%)"
            seriesLabels={{
              antiGap: "Anti-Saccade, Gap Task",
              proGap: "Pro-Saccade, Gap Task",
              antiOverlap: "Anti-Saccade, Overlap Task",
              proOverlap: "Pro-Saccade, Overlap Task",
            }}
            multiSeries={true}
            infoDescription={PlotDescriptions["Saccade Omission Percentages"]}
          />
          <BoxPlot
            rawData={saccadeDurationData}
            plotTitle="Saccade Durations"
            displaySubtitle={false}
            xAxisLabel="Date"
            yAxisLabel="Duration (Milliseconds)"
            seriesLabels={{
              antiGap: "Anti-Saccade, Gap Task",
              proGap: "Pro-Saccade, Gap Task",
              antiOverlap: "Anti-Saccade, Overlap Task",
              proOverlap: "Pro-Saccade, Overlap Task",
            }}
            multiSeries={true}
            infoDescription={PlotDescriptions["Saccade Durations"]}
          />
          <BoxPlot
            rawData={fixationAccuracyData}
            plotTitle="Fixation Duration"
            displaySubtitle={false}
            xAxisLabel="Date"
            yAxisLabel="Duration (Milliseconds)"
            seriesLabels={{ gap: "Gap Task", overlap: "Overlap Task" }}
            multiSeries={true}
            infoDescription={PlotDescriptions["Fixation Duration"]}
          />
          <BoxPlot
            rawData={saccadeDirectionErrorData}
            plotTitle="Saccade Direction Error"
            displaySubtitle={false}
            xAxisLabel="Date"
            yAxisLabel="Percent Error (%)"
            seriesLabels={{
              antiGap: "Anti-Saccade, Gap Task",
              proGap: "Pro-Saccade, Gap Task",
              antiOverlap: "Anti-Saccade, Overlap Task",
              proOverlap: "Pro-Saccade, Overlap Task",
            }}
            multiSeries={true}
            infoDescription={PlotDescriptions["Saccade Direction Error"]}
          />
        </>
      )}
      {(selectedGame === "processQuest" ||
        selectedGame === "sceneDetective") && (
        <>
          {(() => {
            const metricsConfigs = [
              {
                subtitle: "Speaking Time",
                rawData: speakingTimeData,
                yAxisLabel: "Time (seconds)",
              },
              {
                subtitle: "Pause Count",
                rawData: pauseCountData,
                yAxisLabel: "Pause Count",
              },
              {
                subtitle: "Pause Duration",
                rawData: pauseDurationData,
                yAxisLabel: "Pause Duration (seconds)",
              },
            ];
            return (
              <div className="carousel-wrapper">
                <div className="metrics-carousel-container">
                  <BoxPlot
                    rawData={metricsConfigs[metricsIndex].rawData}
                    plotTitle="Temporal Characteristics"
                    displaySubtitle={true}
                    subtitleText={metricsConfigs[metricsIndex].subtitle}
                    xAxisLabel="Date"
                    yAxisLabel={metricsConfigs[metricsIndex].yAxisLabel}
                    infoDescription={
                      PlotDescriptions[
                        "Temporal Characteristics: " + selectedGame
                      ]
                    }
                  />
                  <button
                    className="carousel-next-button"
                    onClick={() =>
                      setMetricsIndex(
                        (prev) => (prev + 1) % metricsConfigs.length
                      )
                    }
                  >
                    <img src={carouselNextImg} alt="Next" />
                  </button>
                </div>
                <div className="carousel-indicators">
                  {metricsConfigs.map((_, idx) => (
                    <span
                      key={idx}
                      className={
                        idx === metricsIndex ? "indicator active" : "indicator"
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })()}
          {(() => {
            const structuralConfigs = [
              {
                subtitle: "Number of Sentences",
                rawData: structuralSentenceData,
                yAxisLabel: "Sentence Count",
              },
              {
                subtitle: "Mean Length of Utterance",
                rawData: structuralMeanData,
                yAxisLabel: "Mean Length",
              }
            ];
            return (
              <div className="carousel-wrapper">
                <div className="structural-carousel">
                  <BoxPlot
                    rawData={structuralConfigs[structuralIndex].rawData}
                    plotTitle="Structural Features"
                    displaySubtitle={true}
                    subtitleText={structuralConfigs[structuralIndex].subtitle}
                    xAxisLabel="Date"
                    yAxisLabel={structuralConfigs[structuralIndex].yAxisLabel}
                    infoDescription={PlotDescriptions["Structural Features"]}
                  />
                  <button
                    className="carousel-next-button"
                    onClick={() =>
                      setStructuralIndex(
                        (prev) => (prev + 1) % structuralConfigs.length
                      )
                    }
                  >
                    <img src={carouselNextImg} alt="Next" />
                  </button>
                </div>
                <div className="carousel-indicators">
                  {structuralConfigs.map((_, idx) => (
                    <span
                      key={idx}
                      className={
                        idx === structuralIndex
                          ? "indicator active"
                          : "indicator"
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })()}
          {(() => {
            const fluencyConfigs = [
              {
                subtitle: "Speech Rate",
                rawData: fluencyWordsPerMinData,
                yAxisLabel: "Words per Minute",
              },
              {
                subtitle: "Repetition Ratio",
                rawData: fluencyRepetitionRatioData,
                yAxisLabel: "Repetition Ratio",
              },
            ];
            return (
              <div className="carousel-wrapper">
                <div className="fluency-carousel">
                  <BoxPlot
                    rawData={fluencyConfigs[fluencyIndex].rawData}
                    plotTitle="Fluency Metrics"
                    displaySubtitle={true}
                    subtitleText={fluencyConfigs[fluencyIndex].subtitle}
                    xAxisLabel="Date"
                    yAxisLabel={fluencyConfigs[fluencyIndex].yAxisLabel}
                    infoDescription={
                      PlotDescriptions["Fluency Metrics: " + selectedGame]
                    }
                  />
                  <button
                    className="carousel-next-button"
                    onClick={() =>
                      setFluencyIndex(
                        (prev) => (prev + 1) % fluencyConfigs.length
                      )
                    }
                  >
                    <img src={carouselNextImg} alt="Next" />
                  </button>
                </div>
                <div className="carousel-indicators">
                  {fluencyConfigs.map((_, idx) => (
                    <span
                      key={idx}
                      className={
                        idx === fluencyIndex ? "indicator active" : "indicator"
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })()}
          {(() => {
            const lexicalConfigs = [
              {
                subtitle: "Noun",
                rawData: lexNounData,
                yAxisLabel: "Nouns Proportion (%)",
              },
              {
                subtitle: "Verb",
                rawData: lexVerbData,
                yAxisLabel: "Verbs Proportion (%)",
              },
              {
                subtitle: "Filler",
                rawData: lexFillerData,
                yAxisLabel: "Filler Proportion (%)",
              },
              {
                subtitle: "Open Class",
                rawData: lexOpenClassData,
                yAxisLabel: "Open Class Proportion (%)",
              },
              {
                subtitle: "Closed Class",
                rawData: lexClosedClassData,
                yAxisLabel: "Closed Class Proportion (%)",
              },
            ];
            return (
              <div className="carousel-wrapper">
                <div className="lexical-carousel">
                  <BoxPlot
                    rawData={lexicalConfigs[lexicalIndex].rawData}
                    plotTitle="Lexical Content"
                    displaySubtitle={true}
                    subtitleText={lexicalConfigs[lexicalIndex].subtitle}
                    xAxisLabel="Date"
                    yAxisLabel={lexicalConfigs[lexicalIndex].yAxisLabel}
                    infoDescription={
                      PlotDescriptions["Lexical Content: " + selectedGame]
                    }
                  />
                  <button
                    className="carousel-next-button"
                    onClick={() =>
                      setLexicalIndex(
                        (prev) => (prev + 1) % lexicalConfigs.length
                      )
                    }
                  >
                    <img src={carouselNextImg} alt="Next" />
                  </button>
                </div>
                <div className="carousel-indicators">
                  {lexicalConfigs.map((_, idx) => (
                    <span
                      key={idx}
                      className={
                        idx === lexicalIndex ? "indicator active" : "indicator"
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })()}
          {selectedGame === "sceneDetective" ? (
          (() => {
            const semanticConfigs = [
              {
                  subtitle: "Semantic Idea Density",
                  rawData: semanticIdeaDensityData,
                  yAxisLabel: "Density",
                },
                {
                  subtitle: "Semantic Efficiency",
                  rawData: semanticEfficiencyData,
                  yAxisLabel: "Efficiency",
                },
                {
                  subtitle: "Lexical Frequency of Nouns",
                  rawData: semanticLexFreqData,
                  yAxisLabel: "Frequency",
                },
            ];
            return (
              <div className="carousel-wrapper">
                <div className="semantic-carousel">
                  <BoxPlot
                    rawData={semanticConfigs[semanticIndex].rawData}
                    plotTitle="Semantic Features"
                    displaySubtitle={true}
                    subtitleText={semanticConfigs[semanticIndex].subtitle}
                    xAxisLabel="Date"
                    yAxisLabel={semanticConfigs[semanticIndex].yAxisLabel}
                    infoDescription={PlotDescriptions["Semantic Features"]}
                  />
                  {semanticConfigs.length > 1 && (
                    <button
                      className="carousel-next-button"
                      onClick={() =>
                        setSemanticIndex(
                          (prev) => (prev + 1) % semanticConfigs.length
                        )
                      }
                    >
                      <img src={carouselNextImg} alt="Next" />
                    </button>
                  )}
                </div>
                {semanticConfigs.length > 1 && (
                  <div className="carousel-indicators">
                    {semanticConfigs.map((_, idx) => (
                      <span
                        key={idx}
                        className={
                          idx === semanticIndex ? "indicator active" : "indicator"
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          <BoxPlot
              rawData={semanticLexFreqData}
              plotTitle="Lexical Frequency of Nouns"
              displaySubtitle={false}
              xAxisLabel="Date"
              yAxisLabel="Frequency"
              infoDescription={PlotDescriptions["Lexical Frequency of Nouns"]}
            />
          )}
        </>
      )}
      <div style={{ height: "100px" }}></div>
    </div>
  );
};

export default AllTimeTrendsComponent;
