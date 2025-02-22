import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import PatientInfoBoxComponent from "./PatientInfoBoxComponent";
import "./AllTimeTrendsComponent.css";

const AllTimeTrendsComponent = ({ selectedDate }) => {
  const [selectedGame, setSelectedGame] = useState("memoryVault");
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

  return (
    <div className="all-time-trends-container">
      <PatientInfoBoxComponent
        selectedDate={selectedDate}
        patientData={patientData}
        effectivePatientId={effectivePatientId}
        reportType={"Daily Reports"}
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
    </div>
  );
};

export default AllTimeTrendsComponent;
