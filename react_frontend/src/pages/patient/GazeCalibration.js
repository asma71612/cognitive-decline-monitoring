import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebaseConfig.js";
import { collection, addDoc } from "firebase/firestore";
import "./GazeCalibration.css";

const GazeCalibration = () => {
  const navigate = useNavigate();
  const gridPoints = [
    { x: 10, y: 10 }, { x: 50, y: 10 }, { x: 90, y: 10 },
    { x: 10, y: 50 }, { x: 50, y: 50 }, { x: 90, y: 50 },
    { x: 10, y: 90 }, { x: 50, y: 90 }, { x: 90, y: 90 },
  ];

  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [gazeData, setGazeData] = useState([]);
  const [accuracy, setAccuracy] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const gazeDataRef = useRef([]);

  useEffect(() => {
    if (window.webgazer) {
      window.webgazer.setRegression("ridge")
        .setGazeListener((data) => {
          if (recording && data) {
            gazeDataRef.current.push({ x: data.x, y: data.y });
          }
        })
        .begin();
    }

    // hide/unhide video and points preview here
    window.webgazer.showVideoPreview(false).showPredictionPoints(false);

    return () => {
      if (window.webgazer) window.webgazer.end();
    };
  }, [recording]);

  const handlePointClick = async () => {
    if (!recording) {
      setRecording(true);

      setTimeout(() => {
        setRecording(false);
        setGazeData([...gazeData, ...gazeDataRef.current]);
        gazeDataRef.current = [];

        if (currentPointIndex + 1 < gridPoints.length) {
          setCurrentPointIndex((prev) => prev + 1);
        } else {
          finishCalibration();
        }
      }, 5);
    }
  };

  const calculateAccuracy = () => {
    if (gazeData.length === 0) return 0;

    let totalError = 0;
    gazeData.forEach((data, i) => {
      const actual = gridPoints[i % gridPoints.length];
      const error = Math.sqrt((data.x - actual.x) ** 2 + (data.y - actual.y) ** 2);
      totalError += error;
    });

    const avgError = totalError / gazeData.length;
    const screenDiagonal = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2);
    return (1 - avgError / screenDiagonal) * 100;
  };

  const finishCalibration = async () => {
    const acc = calculateAccuracy();
    setAccuracy(acc);
    setShowPopup(true);

    await addDoc(collection(db, "gaze_data"), { data: gazeData, accuracy: acc });
  };

  const restartCalibration = () => {
    setShowPopup(false);
    setCurrentPointIndex(0);
    setGazeData([]);
    gazeDataRef.current = [];
    setRecording(false);
  };
  
  return (
    <div className={`gaze-calibration-container ${showPopup ? "dimmed" : ""}`}>
      <div className="counter">Points Left: {gridPoints.length - currentPointIndex}</div>

      {currentPointIndex < gridPoints.length && (
        <div
          className="calibration-point"
          style={{
            left: `${gridPoints[currentPointIndex].x}%`,
            top: `${gridPoints[currentPointIndex].y}%`,
          }}
          onClick={handlePointClick}
        />
      )}

      {showPopup && (
        <div className="popup">
          <h2 className="calibration-accuracy">Calibration Accuracy</h2>
          <h1>{accuracy.toFixed(2)}%</h1>
          {accuracy >= 65 ? (
            <>
              <p className="calibration-success">CALIBRATION WAS SUCCESSFUL.</p>
              <button className="recalibrate-button" onClick={() => restartCalibration()}>Recalibrate</button>
              <button className="continue-button" onClick={() => navigate("/natures-gaze-1-instructions")}>Continue</button>
            </>
          ) : (
            <>
              <p className="calibration-error">CALIBRATION ACCURACY TOO LOW. TRY AGAIN.</p>
              <button className="recalibrate-button" onClick={() => { setShowPopup(false); setCurrentPointIndex(0); setGazeData([]); }}>Recalibrate</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default GazeCalibration;
