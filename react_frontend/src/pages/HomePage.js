import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import './HomePage.css'; // Import specific CSS for this page

const HomePage = () => {
  return (
    <Container className="home-container">
      <div className="camera-position-rectangle"></div>
      <Typography variant="h4" align="center" sx={{ fontWeight: 'bold' }}>
        How to Set Up Eye Tracking
      </Typography>

      <ul className="instruction-list">
        <li>1. Ensure your face is visible.</li>
        <li>2. Ensure good lighting conditions.</li>
        <li>3. Ensure there is no strong light behind your back.</li>
        <li>4. Ensure there is no light reflections on glasses.</li>
      </ul>
      <Button
        variant="contained"
        color="primary"
        className="start-button"
        onClick={() => window.location.href = '/calibration'}
      >
        Start Gaze Calibration
      </Button>
    </Container>
  );
};

export default HomePage;
