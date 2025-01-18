import React from 'react';
import { Link } from 'react-router-dom';
import titleImage from '../../assets/title.svg';
import './GeneralInstructionsPage.css';

const GeneralInstructionsPage = () => {
  return (
    <div className="general-instructions-container">
      <div className="title-container-instructions">
        <img src={titleImage} alt="Title" className="title-image-small" />
      </div>
      <div className="instructions-content">
        <h1 className="instructions-title">Task Instructions</h1>
        <p className="instructions-text">
          This task is designed to monitor your cognitive abilities through a set of interactive games. Here's what to expect:
        </p>
        <ol className="instructions-list">
          <li>You will be guided through an ambient light calibration test and an eye gaze calibration test to ensure data capture is as effective as possible.</li>
          <li>Each game instruction will appear before its subsequent game. Read each instruction carefully before starting.</li>
          <li>There are a total of __ games, each taking up to 1 minute to complete. All games must be completed in one sitting, back-to-back.</li>
        </ol>
        <p className="instructions-note">
          Make sure you're in a quiet environment, free from distractions, so you can fully focus on your task!
        </p>
        <div className="start-button-container">
          <Link to="/lighting-calibration" className="start-button">Start Calibration</Link>
        </div>
      </div>
    </div>
  );
};

export default GeneralInstructionsPage;
