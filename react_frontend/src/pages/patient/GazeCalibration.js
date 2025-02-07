import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import webgazer from "webgazer";
import './GazeCalibration.css';

const GazeCalibration = () => {
  const [calibrationPoints, setCalibrationPoints] = useState({});
  const [accuracy, setAccuracy] = useState("Not calibrated yet");
  const [calibrating, setCalibrating] = useState(false);
  const [centralPointShown, setCentralPointShown] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(true);

  useEffect(() => {
    var canvas = document.getElementById("plotting-canvas");
    if (canvas) {
      const ctx = canvas.getContext('2d');
    }

    // webgazer initialized with the created canvas
    webgazer.setGazeListener((data, elapsedTime) => {
      if (data) {
        console.log("data", data);
      }
    }).begin();

    webgazer.showVideoPreview(false).showPredictionPoints(true);

    showCalibrationPoints();

    return () => {
      webgazer.end();
      const canvas = document.getElementById("plotting-canvas");
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, []);

  const clearCalibration = () => {
    setCalibrationPoints({});
    setAccuracy("Not calibrated yet");
    setCentralPointShown(false);

    document.querySelectorAll(".calibration-button").forEach((btn) => {
      btn.style.backgroundColor = "red";
      btn.removeAttribute("disabled");
    });

    setButtonsVisible(true);
};


  const calPointClick = (id) => {
    setCalibrationPoints((prev) => {
      const newPoints = { ...prev, [id]: (prev[id] || 0) + 1 };
  
      if (newPoints[id] === 5) {
        document.getElementById(id).style.backgroundColor = "#7F96AB";
        document.getElementById(id).setAttribute("disabled", "true");
      } else {
        document.getElementById(id).style.opacity = 0.2 * newPoints[id] + 0.2;
      }
  
      return newPoints;
    });
  };

  useEffect(() => {  
    const allPointsCalibrated = Object.values(calibrationPoints).every(count => count >= 5);
    if (Object.keys(calibrationPoints).length === 9 && allPointsCalibrated) {
      calcAccuracy();
    }
  }, [calibrationPoints]);
  
  const calcAccuracy = () => {
    Swal.fire({
      title: "Calculating Measurement Accuracy",
      text: "Please stare at the pink dot in the centre of the screen for the next 5 seconds. This will be used to calculate the accuracy of the gaze predictions.",
      confirmButtonText: "OK",
      allowOutsideClick: false,
      customClass: {
        popup: "popup",
        title: "popup-title",
        confirmButton: "popup-cancel-button"
      }
    }).then(() => {
  
      webgazer.params.storingPoints = true;

      setCentralPointShown(true);
      setButtonsVisible(false);
      showCentralPoint();

      sleep(5000).then(() => {
        webgazer.params.storingPoints = false; // storing gaze points for 5 seconds

        const storedPoints = webgazer.getStoredPoints();

        if (storedPoints && storedPoints.length > 0) {
          const precision = calculatePrecision(storedPoints);
          setAccuracy(`${precision}%`);

          Swal.fire({
            title: `Your Calibration Accuracy is ${precision}%`,
            text: precision >= 50 
              ? "You can proceed to your first task or choose to recalibrate." 
              : "Your accuracy is too low. Please recalibrate before proceeding.",
            showCancelButton: true,
            showConfirmButton: precision >= 50, // only showing "continue" if accuracy is >= 50%
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
              clearCalibration();
              showCalibrationPoints();
            }
          });
        } else {
          console.log("No stored points available for precision calculation");
        }
      });
    });
  };

  const calculatePrecision = (points) => {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // staring point is at the center of the screen and depends on screen size (dynamic)
    const staringPointX = windowWidth / 2;
    const staringPointY = windowHeight / 2;

    // ensuring points data is valid
    if (!points || points.length !== 2 || !Array.isArray(points[0]) || !Array.isArray(points[1])) {
        console.log("Invalid points format");
        return 0;
    }

    let precisionPercentages = [];

    // filtering out any null values from both x and y arrays
    let validPoints = points[0].map((x, i) => [x, points[1][i]])
        .filter(([x, y]) => x !== null && y !== null);

    // iterating through filtered valid points and calculating accuracy using euclidean distance formula
    validPoints.forEach(([x, y]) => {
        let xDiff = staringPointX - x;
        let yDiff = staringPointY - y;

        let distance = Math.sqrt(xDiff ** 2 + yDiff ** 2);

        let halfWindowHeight = windowHeight / 2;
        let precision = 100 - ((distance / halfWindowHeight) * 100);

        precision = Math.max(0, Math.min(100, precision));

        precisionPercentages.push(precision);
    });

    let averagePrecision = precisionPercentages.length > 0 
        ? precisionPercentages.reduce((a, b) => a + b, 0) / precisionPercentages.length 
        : 0;

    return Math.round(averagePrecision);
};

  const showCentralPoint = () => {
    const centerPoint = document.getElementById("Pt10");
    centerPoint.style.backgroundColor = "#F8727B";
    centerPoint.style.left = "50%";
    centerPoint.style.top = "50%";
    centerPoint.style.transform = "translate(-50%, -50%)";
    centerPoint.disabled = true;
  };

  const showCalibrationPoints = () => {
    const calibrationCoordinates = [
      { x: 10, y: 10 }, { x: 50, y: 10 }, { x: 90, y: 10 },
      { x: 10, y: 50 }, { x: 50, y: 50 }, { x: 90, y: 50 },
      { x: 10, y: 90 }, { x: 50, y: 90 }, { x: 90, y: 90 }
    ];
  };

  return (
    <div>
        <canvas id="plotting-canvas" />
        <div className="calibration-container">
          <div className="calibrationDiv mt-3">
            {buttonsVisible && (
              [...Array(9)].map((_, index) => (
                <button
                  key={index}
                  id={`Pt${index + 1}`}
                  className="calibration-button"
                  onClick={() => calPointClick(`Pt${index + 1}`)}
                >
                  {index + 1}
                </button>
              ))
            )}
            {centralPointShown && (
              <button
                id="Pt10"
                className="calibration-button-last"
                disabled
              >
              </button>
            )}
          </div>
        </div>
    </div>
  );
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default GazeCalibration;
