import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProsaccadeInstructions.css';

const ProsaccadeInstructions = () => {
  const navigate = useNavigate();

  return (
    <div className="prosaccade-instructions-container">
      <h1>Prosaccade Instructions</h1>
      <p>Follow the instructions for the Prosaccade task.</p>
      <button className="next-button" onClick={() => navigate('/prosaccade-game')}>
        Next
      </button>
    </div>
  );
};

export default ProsaccadeInstructions;
