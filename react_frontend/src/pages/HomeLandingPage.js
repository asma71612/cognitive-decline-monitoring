import React from "react";
import { useNavigate } from "react-router-dom";
import brainImage from "../assets/brain.svg";
import "./HomeLandingPage.css";

const HomeLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-landing-container">
      <div className="home-title">
        <span className="no-spacing">C</span>
        <img src={brainImage} alt="Brain" />
        <span className="with-spacing">GNIFY</span>
      </div>

      <div className="small-description">Small Description</div>

      <div className="button-group">
        <button onClick={() => navigate("/patient-login")}>
          I am a patient
        </button>
        <button>
          I am a healthcare administrator
        </button>
      </div>
    </div>
  );
};

export default HomeLandingPage;
