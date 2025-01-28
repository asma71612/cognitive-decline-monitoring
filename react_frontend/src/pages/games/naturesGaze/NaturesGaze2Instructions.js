import React from "react";
import { useNavigate } from "react-router-dom";
import "./NaturesGaze2Instructions.css";
import naturesGazeBackgroundDark from "../../../assets/naturesGazeBackgroundDark.svg";

const NaturesGaze2Instructions = () => {
  const navigate = useNavigate();
  return (
    <div
      className="instructions-page"
      style={{ backgroundImage: `url(${naturesGazeBackgroundDark})` }}
    >
      <div className="game-instruction-card">
        <h1>Nature's Gaze II</h1>
        <h2>How to Play</h2>
        <ol>
          <li>
            You will begin by focusing on the red dot at the centre of the
            screen.
          </li>
          <li>
            A cat will appear either horizontally or vertically from the central
            red dot.
          </li>
        </ol>
        <p>
          <strong>
            Your task is as soon as the cat appears, to shift your gaze in the
            opposite direction from where the dog appears as fast and as
            accurately as possible. For example, if the cat appears to the left
            of the central red dot, look right.
          </strong>
        </p>
        <p>
          In total, there will be <span className="placeholder">__</span> cats,
          each alternating their appearance horizontally or vertically from the
          central red dot. Continue to look in the opposite direction as quickly
          and accurately as possible.
        </p>
        <p>
          Note that between every cat, you will need to shift your gaze back to
          the central red dot.
        </p>
        <button
          className="start-button"
          onClick={() => navigate("/natures-gaze-2-game")}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default NaturesGaze2Instructions;
