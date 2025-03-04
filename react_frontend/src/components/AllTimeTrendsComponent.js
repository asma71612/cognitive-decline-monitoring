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
  const [fluencyRevisionRatioData, setFluencyRevisionRatioData] = useState({});
  const [fluencyWordsPerMinData, setFluencyWordsPerMinData] = useState({});
  const [fluencyStutterCountData, setFluencyStutterCountData] = useState({});
  const [fluencyIndex, setFluencyIndex] = useState(0);
  const [semanticLexFreqData, setSemanticLexFreqData] = useState({});
  const [semanticEfficiencyData, setSemanticEfficiencyData] = useState({});
  const [semanticIdeaDensityData, setSemanticIdeaDensityData] = useState({});
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
      setFluencyRevisionRatioData({});
      setFluencyWordsPerMinData({});
      setFluencyStutterCountData({});
      setSemanticLexFreqData({});
      setSemanticEfficiencyData({});
      setSemanticIdeaDensityData({});
    }
  }, [selectedGame]);

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
          const reactionDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/reactionTime`
          );
          const reactionDoc = await getDoc(reactionDocRef);
          if (reactionDoc.exists()) {
            const data = reactionDoc.data();
            Object.entries(data).forEach(([series, value]) => {
              if (value != null && dataPoints.hasOwnProperty(series)) {
                if (!dataPoints[series][monthYear])
                  dataPoints[series][monthYear] = [];
                dataPoints[series][monthYear].push(value);
              }
            });
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
          const saccadeDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/saccadeOmissionPercentages`
          );
          const saccadeDoc = await getDoc(saccadeDocRef);
          if (saccadeDoc.exists()) {
            const data = saccadeDoc.data();
            Object.entries(data).forEach(([series, value]) => {
              if (value != null && dataPoints.hasOwnProperty(series)) {
                if (!dataPoints[series][monthYear])
                  dataPoints[series][monthYear] = [];
                dataPoints[series][monthYear].push(value);
              }
            });
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
          const sdDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/saccadeDuration`
          );
          const durationsCollection = collection(sdDocRef, "durations");
          const durationsSnapshots = await getDocs(durationsCollection);
          durationsSnapshots.docs.forEach((docSnap) => {
            const data = docSnap.data();
            const seriesKey = docSnap.id;
            if (
              data.Duration != null &&
              durationPoints[seriesKey] !== undefined
            ) {
              if (!durationPoints[seriesKey][monthYear]) {
                durationPoints[seriesKey][monthYear] = [];
              }
              durationPoints[seriesKey][monthYear].push(data.Duration);
            }
          });
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
          const fixAccDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/fixationAccuracy`
          );
          const accuracyCollection = collection(
            fixAccDocRef,
            "landingAccuracy"
          );
          const accuracySnapshots = await getDocs(accuracyCollection);
          accuracySnapshots.docs.forEach((docSnap) => {
            const data = docSnap.data();
            const seriesKey = docSnap.id; // expected: "gap" or "overlap"
            if (
              data.LandingAccuracy != null &&
              accuracyPoints[seriesKey] !== undefined
            ) {
              if (!accuracyPoints[seriesKey][monthYear]) {
                accuracyPoints[seriesKey][monthYear] = [];
              }
              accuracyPoints[seriesKey][monthYear].push(data.LandingAccuracy);
            }
          });
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
          const errorDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/saccadeDirectionError`
          );
          const errorsCollection = collection(errorDocRef, "errors");
          const errorsSnapshot = await getDocs(errorsCollection);
          errorsSnapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            const seriesKey = docSnap.id; // expected: antiGap, proGap, antiOverlap, proOverlap
            if (
              data.PercentError != null &&
              errorPoints[seriesKey] !== undefined
            ) {
              if (!errorPoints[seriesKey][monthYear]) {
                errorPoints[seriesKey][monthYear] = [];
              }
              errorPoints[seriesKey][monthYear].push(data.PercentError);
            }
          });
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
              // Convert StartTime & EndTime ("MM:SS") to seconds
              const [startMin, startSec] = data.StartTime.split(":").map((x) =>
                parseInt(x, 10)
              );
              const [endMin, endSec] = data.EndTime.split(":").map((x) =>
                parseInt(x, 10)
              );
              const startTotal = startMin * 60 + startSec;
              const endTotal = endMin * 60 + endSec;
              const duration = endTotal - startTotal;
              if (!dataPoints[monthYear]) dataPoints[monthYear] = [];
              dataPoints[monthYear].push(duration);
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
            const meanValue = Number(data.MeanLengthOfOccurrence);
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
        const revisionData = {};
        const wordsData = {};
        const stutterData = {};
        const reports = await getReports(effectiveUserId);
        for (const { dateKey, monthYear } of reports) {
          const fluencyDocRef = doc(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/fluencyMetrics`
          );
          const fluencyDoc = await getDoc(fluencyDocRef);
          if (fluencyDoc.exists()) {
            const data = fluencyDoc.data();
            const revision = Number(data.RevisionRatio);
            const wordsPerMin = Number(data.WordsPerMin);
            if (!revisionData[monthYear]) revisionData[monthYear] = [];
            if (!wordsData[monthYear]) wordsData[monthYear] = [];
            revisionData[monthYear].push(revision);
            wordsData[monthYear].push(wordsPerMin);
          }
          const stuttersCollection = collection(
            db,
            `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/fluencyMetrics/Stutters`
          );
          const stuttersSnapshots = await getDocs(stuttersCollection);
          if (!stutterData[monthYear]) stutterData[monthYear] = [];
          // Push count of stutter documents
          stutterData[monthYear].push(stuttersSnapshots.docs.length);
        }
        console.log("Fluency Revision Ratio:", revisionData);
        console.log("Fluency Words Per Min:", wordsData);
        console.log("Fluency Stutter Count:", stutterData);
        setFluencyRevisionRatioData(revisionData);
        setFluencyWordsPerMinData(wordsData);
        setFluencyStutterCountData(stutterData);
      } catch (error) {
        console.error("Error fetching fluency metrics data:", error);
      }
    })();
  }, [selectedGame, effectiveUserId, isTemporalGame]);

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
  }, [selectedGame, effectiveUserId, isTemporalGame]);

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
            yAxisLabel="Time (seconds)"
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
            yAxisLabel="Duration (seconds)"
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
            plotTitle="Fixation Accuracy"
            displaySubtitle={false}
            xAxisLabel="Date"
            yAxisLabel="Landing Accuracy (degrees)"
            seriesLabels={{ gap: "Gap Task", overlap: "Overlap Task" }}
            multiSeries={true}
            infoDescription={PlotDescriptions["Fixation Accuracy"]}
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
                subtitle: "Mean Length of Occurrence",
                rawData: structuralMeanData,
                yAxisLabel: "Mean Length",
              },
              {
                subtitle: "Number of Sentences",
                rawData: structuralSentenceData,
                yAxisLabel: "Sentence Count",
              },
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
                subtitle: "Word Count",
                rawData: fluencyWordsPerMinData,
                yAxisLabel: "Words per Minute",
              },
              {
                subtitle: "Stutter Count",
                rawData: fluencyStutterCountData,
                yAxisLabel: "Stutter Count",
              },
              {
                subtitle: "Revision Ratio",
                rawData: fluencyRevisionRatioData,
                yAxisLabel: "Revision Ratio",
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
                yAxisLabel: "Nouns Proportion (percent)",
              },
              {
                subtitle: "Verb",
                rawData: lexVerbData,
                yAxisLabel: "Verbs Proportion (percent)",
              },
              {
                subtitle: "Filler",
                rawData: lexFillerData,
                yAxisLabel: "Filler Proportion (percent)",
              },
              {
                subtitle: "Open Class",
                rawData: lexOpenClassData,
                yAxisLabel: "Open Class Proportion (percent)",
              },
              {
                subtitle: "Closed Class",
                rawData: lexClosedClassData,
                yAxisLabel: "Closed Class Proportion (percent)",
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
          {(() => {
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
                </div>
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
              </div>
            );
          })()}
        </>
      )}
      <div style={{ height: "100px" }}></div>
    </div>
  );
};

export default AllTimeTrendsComponent;
