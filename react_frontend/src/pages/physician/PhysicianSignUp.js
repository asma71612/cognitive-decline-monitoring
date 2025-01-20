import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';
import titleImage from '../../assets/title.svg';
import './PhysicianSignUp.css';

const PhysicianSignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created:', userCredential.user);
      setError(''); // Clear any previous error
      navigate('/physician-login'); // Redirect to Physician Login Page
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Error: An account already exists with that email.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSignUp();
    }
  };

  return (
    <div className="signup-container-physician">
      <div className="left-half-physician">
        <img src={titleImage} alt="Title" className="title-image-signup-physician" />
        <div className="signup-description-physician">Bringing clarity to cognitive health.</div>
      </div>
      <div className="right-half-physician">
        <div className="welcome-text-physician">Welcome to Cognify!</div>
        <div className="signup-text-physician">Sign Up</div>
        <div className="instruction-text-physician">
          Enter your email and password to create an account.
        </div>
        <div className="input-label-physician">Email</div>
        <input
          type="text"
          className="input-field-physician"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(''); // Clear error when user starts typing
          }}
          onKeyDown={handleKeyDown}
        />
        <div className="input-label-physician">Password</div>
        <input
          type="password"
          className="input-field-physician"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(''); // Clear error when user starts typing
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          className={`signup-button-physician ${error ? 'error' : ''}`}
          onClick={handleSignUp}
        >
          Sign Up
        </button>
        {error && <div className="error-text-physician">{error}</div>}
      </div>
    </div>
  );
};

export default PhysicianSignUp;
