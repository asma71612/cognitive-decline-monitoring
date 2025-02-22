import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import PatientInfoBoxComponent from "./PatientInfoBoxComponent";
import BoxPlot from "./BoxPlot";
import "./AllTimeTrendsComponent.css";

const AllTimeTrendsComponent = ({ patientId }) => {
  const effectivePatientId = patientId || localStorage.getItem("userId");
  const [selectedGame, setSelectedGame] = useState(""); // By default, no game is selected
  const [patientData, setPatientData] = useState(null);
  const [rawData, setRawData] = useState({});

  // This will clear any old data when switching games so no previous graphs render on the screen even for a split second
  useEffect(() => {
    setRawData({});
  }, [selectedGame]);

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
    if (!effectivePatientId || selectedGame !== "memoryVault") return;

    const fetchDataAndComputePoints = async () => {
      try {
        const memoryVaultPoints = {};
        const reportsCollection = collection(
          db,
          `users/${effectivePatientId}/dailyReportsSeeMore`
        );
        const reportSnapshots = await getDocs(reportsCollection);

        for (const reportDoc of reportSnapshots.docs) {
          const dateKey = reportDoc.id;
          const [month, , year] = dateKey.split("-");
          const monthYear = new Date(year, month - 1).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "short" }
          );

          const memoryVaultCollection = collection(
            db,
            `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/memoryVault`
          );
          const memoryVaultSnapshots = await getDocs(memoryVaultCollection);

          for (const mvDoc of memoryVaultSnapshots.docs) {
            const { Presented, Recalled } = mvDoc.data();
            const presentedWords = Presented.split(",").map((w) => w.trim());
            const recalledWords = Recalled.split(",").map((w) => w.trim());
            let sessionPoints = [];
            for (let i = 0; i < presentedWords.length; i++) {
              const response = await fetch(
                "http://127.0.0.1:5000/compute-points",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    presented_word: presentedWords[i],
                    recalled_word: recalledWords[i],
                  }),
                }
              );
              const { points } = await response.json();
              sessionPoints.push(points);
            }
            if (!memoryVaultPoints[monthYear]) {
              memoryVaultPoints[monthYear] = [];
            }
            memoryVaultPoints[monthYear].push(...sessionPoints);
          }
        }
        setRawData(memoryVaultPoints);
      } catch (error) {
        console.error("Error fetching or computing points:", error);
      }
    };

    fetchDataAndComputePoints();
  }, [selectedGame, effectivePatientId]);

  useEffect(() => {
    if (!effectivePatientId || selectedGame !== "naturesGaze") return;
    const fetchNaturesGazeData = async () => {
      try {
        const naturesGazePoints = { gap: {}, overlap: {} };
        const reportsCollection = collection(
          db,
          `users/${effectivePatientId}/dailyReportsSeeMore`
        );
        const reportSnapshots = await getDocs(reportsCollection);

        for (const reportDoc of reportSnapshots.docs) {
          const dateKey = reportDoc.id;
          const [month, , year] = dateKey.split("-");
          const monthYear = new Date(year, month - 1).toLocaleDateString(
            "en-US",
            { year: "numeric", month: "short" }
          );

          const natureDocRef = doc(
            db,
            `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/naturesGaze/reactionTime`
          );
          const natureDoc = await getDoc(natureDocRef);

          if (natureDoc.exists()) {
            const data = natureDoc.data();
            const gapTask = data.GapTask;
            const overlapTask = data.OverlapTask;

            if (gapTask != null) {
              if (!naturesGazePoints.gap[monthYear]) {
                naturesGazePoints.gap[monthYear] = [];
              }
              naturesGazePoints.gap[monthYear].push(gapTask);
            }
            if (overlapTask != null) {
              if (!naturesGazePoints.overlap[monthYear]) {
                naturesGazePoints.overlap[monthYear] = [];
              }
              naturesGazePoints.overlap[monthYear].push(overlapTask);
            }
          }
        }
        setRawData(naturesGazePoints);
      } catch (error) {
        console.error("Error fetching natures gaze data:", error);
      }
    };
    fetchNaturesGazeData();
  }, [selectedGame, effectivePatientId]);

  return (
    <div className="all-time-trends-container">
      <PatientInfoBoxComponent
        patientData={patientData}
        effectivePatientId={effectivePatientId}
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
      {(selectedGame === "memoryVault" || selectedGame === "naturesGaze") && (
        <BoxPlot
          rawData={rawData}
          plotTitle={
            selectedGame === "memoryVault" ? "Recall Score" : "Reaction Time"
          }
          xAxisLabel="Date"
          yAxisLabel={selectedGame === "memoryVault" ? "Points" : "Time (s)"}
          seriesLabels={
            selectedGame === "naturesGaze"
              ? { gap: "Gap Task", overlap: "Overlap Task" }
              : undefined
          }
        />
      )}
      <div style={{ height: "100px" }}></div>
    </div>
  );
};

export default AllTimeTrendsComponent;
