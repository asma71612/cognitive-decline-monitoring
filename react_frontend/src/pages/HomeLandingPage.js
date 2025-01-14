import React, { useState } from "react";
import { Button, Container, Typography, TextField } from "@mui/material";
import axios from "axios";
import "./HomeLandingPage.css";

const HomeLandingPage = () => {
  const [userCode, setUserCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateUserCode = (code) => {
    const regex = /^[a-zA-Z0-9]*$/;
    return regex.test(code);
  };

  const handleSubmit = async () => {
    if (!validateUserCode(userCode)) {
      setError("User code contains special characters.");
      return;
    }

    try {
      const response = await axios.post("/api/validateUserCode", userCode);
      if (response.data) {
        setSuccess(true);
        setError("");
      } else {
        setError("Invalid user code.");
      }
    } catch (error) {
      setError("An error occurred while validating the user code.");
    }
  };

  return (
    <Container className="home-landing-container">
      <h2 align="center" className="home-title">
        Welcome to Cognify!
      </h2>

      <h5 align="center" className="user-code-prompt">
        Enter User Identification Code
      </h5>

      <TextField
        variant="outlined"
        className="user-code-input"
        value={userCode}
        onChange={(e) => setUserCode(e.target.value)}
        error={!!error}
        helperText={error}
      />

      <Button
        variant="contained"
        color="primary"
        className="submit-button"
        onClick={handleSubmit}
        disabled={!userCode}
      >
        Submit
      </Button>
      {success && (
        <Typography variant="h6" color="green">
          User code is valid!
        </Typography>
      )}
    </Container>
  );
};

export default HomeLandingPage;
