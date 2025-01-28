import React from 'react';
import { useNavigate } from "react-router-dom";
import './NaturesGaze1Instructions.css';
import naturesGazeBackgroundDark from '../../../assets/naturesGazeBackgroundDark.svg';

const NaturesGaze1Instructions = () => {
  const navigate = useNavigate();
  return (
    <div className="instructions-page" style={{ backgroundImage: `url(${naturesGazeBackgroundDark})` }}>
      <div className="game-instruction-card">
        <h1>Nature's Gaze I</h1>
        <h2>How to Play</h2>
        <ol>
          <li>You will begin by focusing on the red dot at the centre of the screen.</li>
          <li>A bird will appear either horizontally or vertically from the central red dot.</li>
        </ol>
        <p>
          <strong>Your task is as soon as the bird appears, to shift your gaze to follow the bird as fast and as accurately as possible.</strong>
        </p>
        <p>
          In total, there will be <span className="placeholder">__</span> birds, each alternating their appearance horizontally or vertically from the central red dot. Continue to follow them as quickly and accurately as possible.
        </p>
        <p>
          Note that between every bird, you will need to shift your gaze back to the central red dot.
        </p>
        <button className="start-button" onClick={() => navigate('/natures-gaze-1-game')}>Start</button>
      </div>
    </div>
  );
}

export default NaturesGaze1Instructions;
