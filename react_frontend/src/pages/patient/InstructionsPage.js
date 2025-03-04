import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import titleImage from '../../assets/title.svg';
import { db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import './GeneralInstructionsPage.css';

const GeneralInstructionsPage = () => {
  const { userId } = useParams(); 
  const [firstPlay, setFirstPlay] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  const fetchUserData = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      if(!userDoc.data().playCount || userDoc.data().playCount === 0){
        setFirstPlay(true);
      }
    }
  };

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
        <div className="side-by-side-buttons">
          <div className="instructions-button-container">
            <Link to={`/patient-home-page/${userId}`} className="start-button">Back to Home</Link>
          </div>

          {firstPlay && 
            <div className="instructions-button-container">
              <Link to="/lighting-calibration" className="secondary-button">Start Calibration</Link>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default GeneralInstructionsPage;
