import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './GazeCalibration.css';

const GazeCalibration = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const iframeRef = useRef(null);

  // For future enhancement: We'll eventually move all logic from gaze_calibration.html here
  // For now, we're using an iframe to embed the existing Flask implementation

  // This function could potentially be used to resize the iframe if needed
  const handleIframeLoad = () => {
    if (iframeRef.current) {
      // If we need to make any adjustments to the iframe after loading, we can do it here
      console.log("Gaze calibration iframe loaded");
    }
  };

  // This listens for any messages from the iframe directly
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data && event.data.type === 'CALIBRATION_COMPLETE') {
        console.log('Received calibration complete message:', event.data);
        
        // Navigate to Memory Vault Start Instructions after calibration is complete
        if (userId) {
          navigate(`/memory-vault-start-instructions/${userId}`);
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

  return (
    <div className="gaze-calibration-container">
      <div className="calibration-frame-container">
        <iframe 
          ref={iframeRef}
          src="http://localhost:5000/gaze-calibration-test" 
          title="Gaze Calibration"
          className="calibration-frame"
          onLoad={handleIframeLoad}
          scrolling="no"
          allow="camera"
          style={{ height: '100vh', width: '100%', border: 'none' }}
        />
      </div>
    </div>
  );
};

export default GazeCalibration;
