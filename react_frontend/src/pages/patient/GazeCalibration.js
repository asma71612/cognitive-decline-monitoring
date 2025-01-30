import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GazeCalibration.css';

const GazeCalibration = () => {
  const navigate = useNavigate();

  return (
    <div className="gaze-calibration-container">
      <h1>Gaze Calibration</h1>
      <p>Follow the instructions to calibrate your gaze.</p>
      <button className="next-button" onClick={() => navigate('/natures-gaze-1-instructions')}>
        Next
      </button>
    </div>
  );
};

export default GazeCalibration;
