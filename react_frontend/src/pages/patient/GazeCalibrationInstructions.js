import React from 'react';
import { useNavigate } from 'react-router-dom';
import titleImage from "../../assets/title.svg";
import './GazeCalibrationInstructions.css';

const GazeCalibrationInstructions = () => {
  const navigate = useNavigate();

  return (
    <div className="gaze-calibration-container">
      <div className="title-container-lighting-calibration">
        <img src={titleImage} alt="Title" className="title-image-small" />
      </div>

      <div className="gaze-instructions-container">
        <h5 className="subtitle">Step 2</h5>
        <h3 className="title">Gaze Calibration</h3>

        <ul className="instruction-list">
          <li><span className="bold">1. Sit comfortably:</span> Position yourself at eye level with the screen. Maintain a distance of approximately 50–70 cm from the screen.</li>
          <li><span className="bold">2. Stay still:</span> Keep your head as steady as possible.</li>
          <li><span className="bold">3. Follow the targets:</span> One at a time, 9 targets will appear on the screen and move to different locations. Focus on each target as it appears and click on it to move it to its next position.</li>
        </ul>

        <p className="italics">Note that there is a 10 second delay between a target being clicked and moving to the next location. Ensure you're focused on the target the entire time.</p>

        <button className="start-button" onClick={() => navigate('/gaze-calibration')}>
          Next
        </button>
      </div>

      {/* <button className="next-button" onClick={() => navigate('/natures-gaze-1-instructions')}>
        Next
      </button> */}



    </div>
  );
};

export default GazeCalibrationInstructions;
