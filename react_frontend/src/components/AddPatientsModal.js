import React, { useState } from "react";
import { db } from "../firebaseConfig.js";
import { doc, setDoc } from "firebase/firestore";
import UserIDModal from "../components/UserIDModal";
import "./AddPatientsModal.css";

const AddPatientsModal = ({ closeModal }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState("select");
  const [showUserIDModal, setShowUserIDModal] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState("");
  const [isAdding, setIsAdding] = useState(false); // Prevent multiple submissions

  const generateUserId = () => {
    return "ID-" + Math.random().toString(36).substring(2, 15); // Random patient ID
  };

  const addPatientToFirebase = async (userId) => {
    let attempts = 0;
    const maxAttempts = 3; // Retry up to 3 times in case of failure

    while (attempts < maxAttempts) {
      try {
        const sexStored = sex === "male" ? "M" : sex === "female" ? "F" : "O";

        const userDoc = doc(db, "users", userId);
        await setDoc(userDoc, {
          firstName,
          lastName,
          dob,
          sex: sexStored,
          enrolmentDate: new Date().toISOString(),
        });

        return true; // Success
      } catch (error) {
        attempts++;
        await new Promise((res) => setTimeout(res, 500)); // Small delay before retry
      }
    }

    return false; // Failure after retries
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !dob || sex === "select") {
      alert("Please fill out all fields before adding a patient.");
      return;
    }

    if (isAdding) {
      return; // Prevent duplicate submissions
    }

    setIsAdding(true);
    const userId = generateUserId();
    setGeneratedUserId(userId);

    const success = await addPatientToFirebase(userId);
    if (success) {
      setShowUserIDModal(true);
    } else {
      alert("⚠️ Failed to add patient. Please try again.");
    }

    setIsAdding(false);
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>Add Patient</h2>
            <div className="close-btn-container">
              <button className="close-btn" onClick={closeModal}>
                X
              </button>
            </div>
          </div>
          <p>Please enter the patient's information.</p>

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Sex</label>
            <select value={sex} onChange={(e) => setSex(e.target.value)}>
              <option value="select" disabled>
                Select
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            className="add-patient-btn"
            onClick={handleSubmit}
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add Patient"}
          </button>
        </div>
      </div>

      {/* Conditionally render the UserIDModal */}
      {showUserIDModal && (
        <UserIDModal
          userId={generatedUserId}
          onClose={() => setShowUserIDModal(false)}
          onConfirm={() => {}}
        />
      )}
    </>
  );
};

export default AddPatientsModal;
