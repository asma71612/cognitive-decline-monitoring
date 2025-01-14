import React, { useState } from 'react';
import { Button, Container, Typography, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './HomeLandingPage.css';

const HomeLandingPage = () => {
  const [userCode, setUserCode] = useState('');

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
      />
      
      <Button
        variant="contained"
        color="primary"
        className="submit-button"
        disabled
      >
        Submit
      </Button>
    </Container>
  );
};

export default HomeLandingPage;
