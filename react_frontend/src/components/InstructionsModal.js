import React from "react";
import { useNavigate } from "react-router-dom";
import "./InstructionsModal.css";

const InstructionsModal = ({
  title,
  howToPlay,
  instructionsList,
  strongText,
  subText,
  noteText,
  startButtonText,
  startButtonRoute,
  backgroundImage,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className="instructions-modal"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="game-instruction-card">
        <h1>{title}</h1>
        <h2>{howToPlay}</h2>
        <ol>
          {instructionsList.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ol>
        <p>
          <strong>{strongText}</strong>
        </p>
        <p>{subText}</p>
        <p>{noteText}</p>
        <button
          className="start-button"
          onClick={() => navigate(startButtonRoute)}
        >
          {startButtonText}
        </button>
      </div>
    </div>
  );
};

export default InstructionsModal;
