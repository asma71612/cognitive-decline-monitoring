import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import titleImage from "../../assets/title.svg";
import "./LightingCalibration.css";

const LightingCalibration = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL
  const [cameraError, setCameraError] = useState(null); // State to handle errors
  const [isLightingGood, setIsLightingGood] = useState(true); // State to track lighting condition
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State to disable the button

  useEffect(() => {
    // Request access to the camera
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream; // Attach the stream to the video element
        }
      } catch (error) {
        setCameraError(
          "Unable to access camera. Please check your permissions."
        );
      }
    };

    startCamera();

    // Capture the current value of videoRef to use in cleanup
    const videoElement = videoRef.current;

    // Cleanup: Stop the camera when the component unmounts
    return () => {
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop()); // Stop each track
      }
    };
  }, []);

  useEffect(() => {
    // Check lighting every second (or as needed)
    const checkLighting = () => {
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext("2d");
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        const imageData = context.getImageData(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const pixels = imageData.data;

        let totalBrightness = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b; // Luminosity formula
          totalBrightness += brightness;
        }

        const averageBrightness = totalBrightness / (pixels.length / 4);

        // If average brightness is below threshold (adjust the threshold as needed)
        if (averageBrightness < 100) {
          setIsLightingGood(false);
          setIsButtonDisabled(true);
        } else {
          setIsLightingGood(true);
          setIsButtonDisabled(false);
        }
      }
    };

    // Run the lighting check every 1 second
    const lightingInterval = setInterval(checkLighting, 1000);

    return () => clearInterval(lightingInterval);
  }, []);

  const handleStartCalibration = () => {
    // Navigate to gaze calibration instructions with userId
    navigate(`/gaze-calibration-instructions/${userId}`);
  };

  return (
    <div className="lighting-container">
      {/* Video Feed or Error Message */}
      <div className="camera-position-rectangle">
        {cameraError ? (
          <p className="error-message">{cameraError}</p>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="camera-video"
          ></video>
        )}
      </div>

      <div className="instructions-container">
        <div className="title-container-lighting-calibration">
          <img src={titleImage} alt="Title" className="title-image-small" />
        </div>
        <h3 className="title">Lighting Calibration</h3>

        <ul className="instruction-list">
          <li>1. Ensure your face is visible.</li>
          <li>2. Ensure good lighting conditions.</li>
          <li>3. Ensure there is no strong light behind your back.</li>
          <li>4. Ensure there are no light reflections on glasses.</li>
        </ul>
      </div>

      {!isLightingGood ? (
        <p className="error-message-lighting-calibration">PLEASE SIT IN A WELL LIT ROOM.</p>
      ) : (
        <p className="success-message">GOOD LIGHTING CONDITIONS.</p>
      )}

      <button
        className="start-button"
        onClick={handleStartCalibration}
        disabled={isButtonDisabled}
      >
        Start Gaze Calibration
      </button>

      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: "none" }}
      ></canvas>
    </div>
  );
};

export default LightingCalibration;
