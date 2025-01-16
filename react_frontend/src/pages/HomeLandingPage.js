import React from "react";
import { Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import brainImage from "../assets/brain.png";
import "./HomeLandingPage.css";

const HomeLandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="home-landing-container">
      <div className="home-title">
        <span className="no-spacing">C</span>
        <img src={brainImage} alt="Brain" />
        <span className="with-spacing">GNIFY</span>
      </div>

      <div className="small-description">Small Description</div>

      <div className="button-group">
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/patient-login")}
        >
          I am a patient
        </Button>
        <Button variant="contained" color="primary">
          I am a healthcare administrator
        </Button>
      </div>
    </Container>
  );
};

export default HomeLandingPage;
