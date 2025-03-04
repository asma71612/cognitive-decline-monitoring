import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig.js";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import UserIDModal from "../components/UserIDModal";
import "./AddPatientsModal.css";

const AddPatientsModal = ({
  closeModal,
  refreshPatients,
  editMode = false,
  patientData = {},
}) => {
  const [firstName, setFirstName] = useState(
    editMode ? patientData.firstName : ""
  );
  const [lastName, setLastName] = useState(
    editMode ? patientData.lastName : ""
  );
  const [dob, setDob] = useState(editMode ? patientData.dob : "");
  const [sex, setSex] = useState(editMode ? patientData.sex : "select");
  const [showUserIDModal, setShowUserIDModal] = useState(false);
  const [generatedUserId, setGeneratedUserId] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (editMode && patientData) {
      setFirstName(patientData.firstName);
      setLastName(patientData.lastName);
      setDob(new Date(patientData.dob).toLocaleDateString("en-US"));
      // I have to do this the brute force way because for some reason Male is always pre-selected...
      setSex(
        patientData.sex === "M"
          ? "male"
          : patientData.sex === "F"
          ? "female"
          : patientData.sex === "O"
          ? "other"
          : "select"
      );
    }
  }, [editMode, patientData]);

  const generateUserId = () => {
    return "ID-" + Math.random().toString(36).substring(2, 15);
  };

  const addPatientToFirebase = async (userId) => {
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
      return true;
    } catch (error) {
      return false;
    }
  };

  const updatePatientInFirebase = async () => {
    try {
      const sexStored = sex === "male" ? "M" : sex === "female" ? "F" : "O";
      const userDoc = doc(db, "users", patientData.id);
      await updateDoc(userDoc, { sex: sexStored });
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName || !dob || sex === "select") {
      alert("Please fill out all fields before proceeding.");
      return;
    }
    if (isAdding) return;
    setIsAdding(true);
    if (editMode) {
      const success = await updatePatientInFirebase();
      if (success) {
        refreshPatients();
        closeModal();
      } else {
        alert("⚠️ Failed to update patient. Please try again.");
      }
    } else {
      const userId = generateUserId();
      setGeneratedUserId(userId);
      const success = await addPatientToFirebase(userId);
      if (success) {
        setShowUserIDModal(true);
      } else {
        alert("⚠️ Failed to add patient. Please try again.");
      }
    }
    setIsAdding(false);
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="modal-header">
            <h2>{editMode ? "Edit Patient" : "Add Patient"}</h2>
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
              disabled={editMode}
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              disabled={editMode}
            />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type={editMode ? "text" : "date"}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              disabled={editMode}
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
            {isAdding
              ? editMode
                ? "Updating..."
                : "Adding..."
              : editMode
              ? "Update"
              : "Add Patient"}
          </button>
        </div>
      </div>
      {!editMode && showUserIDModal && (
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
