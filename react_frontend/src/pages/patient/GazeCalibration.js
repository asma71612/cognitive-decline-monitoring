import React, { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import webgazer from "webgazer";
import './GazeCalibration.css';

const GazeCalibration = () => {
  const [calibrationPoints, setCalibrationPoints] = useState({});
  const [accuracy, setAccuracy] = useState("Not calibrated yet");
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [gazeDataByPoint, setGazeDataByPoint] = useState({});
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    
    if (!canvas) {
      console.warn("Canvas element not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Could not get canvas context");
      return;
    }

    webgazer.setGazeListener((data) => {
      if (data) console.log("Gaze data:", data);
    }).begin();

    // enable or disable live video + prediction points here
    webgazer.showVideoPreview(false).showPredictionPoints(true);

    return () => {

      webgazer.clearGazeListener();
      
      webgazer.end();
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []); 

  const calPointClick = (id) => {
    setCalibrationPoints((prev) => {
      const newPoints = { ...prev, [id]: (prev[id] || 0) + 1 };
  
      if (newPoints[id] === 5) {
        document.getElementById(id).style.backgroundColor = "#7F96AB";
        document.getElementById(id).setAttribute("disabled", "true");
      } else {
        document.getElementById(id).style.opacity = 0.2 * newPoints[id] + 0.2;
      }
  
      // collecting gaze data for this specific point
      collectGazeData(id);
  
      return newPoints;
    });
  };

  const collectGazeData = (id) => {
    setGazeDataByPoint((prev) => ({
      ...prev,
      [id]: [],
    }));

    webgazer.clearGazeListener();
  
    webgazer.setGazeListener((data) => {
      if (data) {
        setGazeDataByPoint((prev) => ({
          ...prev,
          [id]: [...(prev[id] || []), [data.x, data.y]],
        }));
      }
    });
  };  

  useEffect(() => {
    const allPointsCalibrated = Object.values(calibrationPoints).every(count => count >= 5);
    if (Object.keys(calibrationPoints).length === 9 && allPointsCalibrated) {
      calcAccuracy();
    }
  }, [calibrationPoints]);

  const calcAccuracy = async () => {
    
    webgazer.params.storingPoints = true;
    await sleep(5000);
    webgazer.params.storingPoints = false;

    const storedPoints = webgazer.getStoredPoints();

    if (storedPoints && storedPoints.length > 0) {
      const precision = calculatePrecision(storedPoints);
      setAccuracy(`${precision}%`);

      // TO DO: DEFINE PRECISION THRESHHOLD TO CONTINUE TO GAMES HERE
      Swal.fire({
        title: `Your Calibration Accuracy is ${precision}%`,
        text: precision >= 50 
          ? "You can proceed to your first task or choose to recalibrate." 
          : "Your accuracy is too low. Please recalibrate before proceeding.",
        showCancelButton: true,
        showConfirmButton: precision >= 50,
        confirmButtonText: "Continue",
        cancelButtonText: "Recalibrate",
        allowOutsideClick: false,
        customClass: {
          popup: "popup",
          title: "popup-title",
          text: "popup-text",
          confirmButton: "popup-confirm-button",
          cancelButton: "popup-cancel-button"
        }
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/natures-gaze-1-instructions";
        } else {
          window.location.href = "/gaze-calibration";
        }
      });
    } else {
      console.log("No stored points are available for accuracy calculation.");
    }
  };

  const calculatePrecision = () => {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
  
    const calibrationCoordinates = [
      { id: "Pt1", x: 10, y: 10 }, { id: "Pt2", x: 50, y: 10 }, { id: "Pt3", x: 90, y: 10 },
      { id: "Pt4", x: 10, y: 50 }, { id: "Pt5", x: 50, y: 50 }, { id: "Pt6", x: 90, y: 50 },
      { id: "Pt7", x: 10, y: 90 }, { id: "Pt8", x: 50, y: 90 }, { id: "Pt9", x: 90, y: 90 }
    ];
  
    let precisionPercentages = [];
  
    calibrationCoordinates.forEach(({ id, x, y }) => {
      const targetX = (x / 100) * windowWidth;
      const targetY = (y / 100) * windowHeight;
  
      let validPoints = gazeDataByPoint[id] || [];
      
      if (validPoints.length === 0) return;
  
      let distances = validPoints.map(([px, py]) => 
        Math.sqrt((targetX - px) ** 2 + (targetY - py) ** 2)
      );
  
      let avgDistance = distances.reduce((a, b) => a + b, 0) / distances.length;
      
      // TO DO: DEFINE ERROR THRESHOLD HERE
      const maxError = Math.min(windowWidth, windowHeight);
      let precision = Math.max(0, 100 - ((avgDistance / maxError) * 100));
              
      precision = Math.max(0, Math.min(100, precision));
  
      console.log(`Point ${id} precision: ${precision}%`);
      precisionPercentages.push(precision);
    });
  
    let avgPrecision = precisionPercentages.length > 0
      ? precisionPercentages.reduce((a, b) => a + b, 0) / precisionPercentages.length
      : 0;
  
    return Math.round(avgPrecision);
  };

  return (
    <div>
      <canvas ref={canvasRef} id="plotting-canvas"/>
        <div className="calibration-container">
          <div className="calibrationDiv mt-3">
            {buttonsVisible &&
              [...Array(9)].map((_, index) => (
                <button
                  key={index}
                  id={`Pt${index + 1}`}
                  className="calibration-button"
                  onClick={() => calPointClick(`Pt${index + 1}`)}
                >
                  {index + 1}
                </button>
              ))}
          </div>
        </div>
    </div>
  );
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default GazeCalibration;
