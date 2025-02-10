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
          <li><span className="bold">3. Follow the targets:</span> 9 labelled targets will appear on the screen in a 3x3 grid. In order, click on each target 5 times to disable it before moving onto the next target.</li>
        </ul>

        <p className="italics">To maintain accurate data capture, ensure you are staring at each target the entire time while disabling it.</p>

        <button className="start-button" onClick={() => navigate('/gaze-calibration')}>
          Next
        </button>
      </div>

    </div>
  );
};

export default GazeCalibrationInstructions;
