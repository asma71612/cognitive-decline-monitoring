import React from "react";
import "./UserIDModal.css";

const UserIDModal = ({ patientID, onClose, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>User Identification Code</h2>
          <div className="close-btn-container">
            <button className="close-btn" onClick={onClose}>
              X
            </button>
          </div>
        </div>
        <p>Your patient identification code is:</p>
        <h3>{patientID}</h3>

        <button
          className="done-btn"
          onClick={() => {
            onConfirm();
            onClose();
            window.location.reload();
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default UserIDModal;
