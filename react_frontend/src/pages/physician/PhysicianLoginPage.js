import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig.js';
import titleImage from '../../assets/title.svg';
import './PhysicianLoginPage.css';

const PhysicianLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in:', userCredential.user);
      setError(''); // Clear any previous error
      navigate('/physician-home-page'); // Redirect to Physician Home Page
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid email or password.');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('Google user:', user);
      navigate('/physician-home-page'); // Redirect to Physician Home Page
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('An error occurred. Please try again.');
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email to reset your password.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent. Please check your inbox.');
      setError('');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setError('Error sending password reset email. Please try again.');
    }
  };

  return (
    <div className="login-container-physician">
      <div className="left-half-physician">
        <img src={titleImage} alt="Title" className="title-image-login-physician" />
        <div className="login-description-physician">Bringing clarity to cognitive health.</div>
      </div>
      <div className="right-half-physician">
        <div className="welcome-text-physician">Welcome to Cognify!</div>
        <div className="login-text-physician">Log In</div>
        <div className="instruction-text-physician">
          Enter your email and password to start.
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
          className="input-field-physician password-input-field-physician"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(''); // Clear error when user starts typing
          }}
          onKeyDown={handleKeyDown}
        />
        <div className="forgot-text-physician">
          <a href="#" onClick={handlePasswordReset}>Forgot your password?</a>
        </div>
        <button
          className={`login-button-physician ${error ? 'error' : ''}`}
          onClick={handleLogin}
        >
          Log In
        </button>
        {error && <div className="error-text-physician-login">{error}</div>}
        {message && <div className="message-text-physician">{message}</div>}
        <button className="google-login-button" onClick={handleGoogleLogin}>
          Sign in with Google
        </button>
        <div className="signup-text-physician-login">
          Don’t have an account? <a href="/physician-signup">Sign up here</a>
        </div>
      </div>
    </div>
  );
};

export default PhysicianLoginPage;
