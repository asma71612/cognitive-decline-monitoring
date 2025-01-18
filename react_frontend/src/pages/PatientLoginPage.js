import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import brainImage from '../assets/brain.svg';
import './PatientLoginPage.css';

const PatientLoginPage = () => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!userId) {
      setError(''); // Clear error if input is empty
      return;
    }

    try {
      console.log('Checking user ID:', userId);
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log('User data:', docSnap.data());
        setError(''); // Clear any previous error
        navigate('/patient-home-page'); // Redirect to General Home Page
      } else {
        setError('ERROR: Invalid User Identification Code.');
      }
    } catch (error) {
      console.error('Error checking user identification code:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="left-half">
        <div className="login-title">
          <span className="no-spacing">C</span>
          <img src={brainImage} alt="Brain" />
          <span className="with-spacing">GNIFY</span>
        </div>
        <div className="login-description">Small Description</div>
      </div>
      <div className="right-half">
        <div className="welcome-text">Welcome to Cognify!</div>
        <div className="login-text">Log In</div>
        <div className="instruction-text">
          Enter your user identification code to start.
        </div>
        <div className="input-label">User Identification Code</div>
        <input
          type="text"
          className="input-field"
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
            setError(''); // Clear error when user starts typing
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          className={`login-button ${error ? 'error' : ''}`}
          onClick={handleLogin}
          disabled={!!error}
        >
          Log In
        </button>
        {error && <div className="error-text">{error}</div>}
        <div className="forgot-text">Forgot your user identification code?</div>
        <div className="contact-text">Contact your healthcare administrator.</div>
      </div>
    </div>
  );
};

export default PatientLoginPage;
