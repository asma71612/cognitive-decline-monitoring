import React from "react";
import "./App.css"; // Ensure you're importing the updated CSS file

function App() {
  return (
    <div className="welcome-container">
      {/* Camera Position Rectangle */}
      <div className="camera-position-rectangle"></div>
      
      {/* Title */}
      <div className="title">How to Set Up Eye Tracking</div>
      
      {/* Instruction List */}
      <ul className="instruction-list">
        <li>1. Ensure your face is visible.</li>
        <li>2. Ensure good lighting conditions.</li>
        <li>3. Ensure there is no strong light behind your back.</li>
        <li>4. Ensure there is no light reflections on glasses.</li>
      </ul>

      {/* Button */}
      <button className="start-button" onClick={() => alert("Start Gaze Calibration")}>
        Start Gaze Calibration
      </button>
    </div>
  );
}

export default App;
