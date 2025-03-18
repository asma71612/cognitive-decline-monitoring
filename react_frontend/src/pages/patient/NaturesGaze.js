import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './NaturesGaze.css';

const NaturesGaze = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const iframeRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // This function handles iframe loading
  const handleIframeLoad = () => {
    if (iframeRef.current) {
      console.log("Nature's Gaze game iframe loaded");
    }
  };

  // This listens for any messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'NATURES_GAZE_COMPLETE') {
        console.log('Received game complete message:', event.data);
        
        // Redirect back to patient home page after game is complete
        if (userId) {
          navigate(`/patient-home-page/${userId}`);
        } else {
          navigate('/patient-login');
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate, userId]);

  // Handle errors
  const handleError = () => {
    setErrorMessage("Unable to load the Nature's Gaze game. Please make sure the Flask server is running.");
  };

  return (
    <div className="natures-gaze-container">
      {errorMessage ? (
        <div className="error-message">
          <h3>Error</h3>
          <p>{errorMessage}</p>
          <button 
            onClick={() => navigate(userId ? `/patient-home-page/${userId}` : '/patient-login')}
            className="back-button"
          >
            Return to Home
          </button>
        </div>
      ) : (
        <div className="game-frame-container">
          <iframe 
            ref={iframeRef}
            src="http://localhost:5000/natures-gaze-game" 
            title="Nature's Gaze Game"
            className="game-frame"
            onLoad={handleIframeLoad}
            onError={handleError}
            scrolling="no"
            allow="camera"
          />
        </div>
      )}
    </div>
  );
};

export default NaturesGaze; 