import React from "react";
import { useNavigate } from "react-router-dom";
import titleImage from "../assets/title.svg";
import "./HomeLandingPage.css";

const HomeLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-landing-container">
      <div className="title-container">
        <img src={titleImage} alt="Title" className="title-image-home" />
      </div>

      <div className="small-description">Bringing clarity to cognitive health.</div>

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
