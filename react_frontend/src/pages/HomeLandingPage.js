import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './HomeLandingPage.css';

const HomeLandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="home-landing-container">
      <Typography variant="h2" align="center" className="home-title">
        Home Page
      </Typography>
      <Button
        variant="contained"
        color="primary"
        className="start-button"
        onClick={() => navigate('/lighting-calibration')}
      >
        Go to Lighting Calibration
      </Button>
    </Container>
  );
};

export default HomeLandingPage;
