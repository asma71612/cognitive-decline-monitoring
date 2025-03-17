import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './GazeCalibration.css';

const GazeCalibration = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [calibrationComplete, setCalibrationComplete] = useState(false);
  const iframeRef = useRef(null);

  // For future enhancement: We'll eventually move all logic from gaze_calibration.html here
  // For now, we're using an iframe to embed the existing Flask implementation

  // This function could potentially be used to resize the iframe if needed
  const handleIframeLoad = () => {
    if (iframeRef.current) {
      // If we need to make any adjustments to the iframe after loading, we can do it here
      console.log("Gaze calibration iframe loaded");
    }
  };

  return (
    <div className="gaze-calibration-container">
      {/* <div className="header">
        <h1>Gaze Calibration</h1>
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div> */}
      
      <div className="calibration-frame-container">
        <iframe 
          ref={iframeRef}
          src="http://localhost:5000/gaze-calibration-test" 
          title="Gaze Calibration"
          className="calibration-frame"
          onLoad={handleIframeLoad}
          scrolling="no"
          allow="camera"
        />
      </div>
    </div>
  );
};

export default GazeCalibration;
