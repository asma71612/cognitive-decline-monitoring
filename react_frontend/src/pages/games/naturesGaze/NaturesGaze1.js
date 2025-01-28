import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NaturesGaze1.css";
import naturesGazeBackgroundLight from "../../../assets/naturesGazeBackgroundLight.svg";

const NaturesGaze1 = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/natures-gaze-2-instructions"); // Navigates to the next page after 15 seconds
    }, 10000);

    return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
  }, [navigate]);

  return (
    <div
      className="natures-gaze-1-page"
      style={{ backgroundImage: `url(${naturesGazeBackgroundLight})` }}
    ></div>
  );
};

export default NaturesGaze1;
