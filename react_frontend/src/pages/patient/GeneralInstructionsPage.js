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
          These tasks are designed to monitor your cognitive abilities through a set of interactive games. Here's what to expect:
        </p>
        <ol className="instructions-list">
          <li>You will be guided through a lighting and eye calibration test to ensure data capture is as effective as possible.</li>
          <li>Each game instruction will appear before its subsequent game. <span className="bold">Read each instruction carefully before starting.</span></li>
          <li>For some tasks, your audio will be recorded for analysis.</li>
        </ol>
        <p className="instructions-note">
          Make sure you're in a quiet environment, free from distractions, so you can fully focus on your task!
        </p>
        <div className="instructions-button-container">
          <Link to="/lighting-calibration" className="start-button">Start Calibration</Link>
        </div>
      </div>
    </div>
  );
};

export default GeneralInstructionsPage;
