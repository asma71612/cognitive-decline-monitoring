import React from "react";
import "./PatientInfoBoxComponent.css";

const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

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

const PatientInfoBoxComponent = ({
  selectedDate,
  patientData,
  effectivePatientId,
}) => {
  return (
    <div className="patient-info-box-container">
      <h1>
        Daily Reports{" "}
        {selectedDate && `for ${formatSelectedDate(selectedDate)}`}
      </h1>
      {patientData && (
        <div className="patient-info-box">
          <h2>
            {patientData.firstName} {patientData.lastName}{" "}
            {patientData.dob && patientData.sex && (
              <span>
                ({calculateAge(patientData.dob)}, {patientData.sex})
              </span>
            )}
          </h2>
          <p>
            <strong>User ID:</strong> {effectivePatientId}
          </p>
          <p>
            <strong>Date of Birth:</strong> {patientData.dob}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientInfoBoxComponent;
