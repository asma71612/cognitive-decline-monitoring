import React from "react";
import "./NaturesGaze1.css";
import naturesGazeBackgroundLight from "../../../assets/naturesGazeBackgroundLight.svg";

const NaturesGaze1 = () => {
  return (
    <div
      className="natures-gaze-1-page"
      style={{ backgroundImage: `url(${naturesGazeBackgroundLight})` }}
    ></div>
  );
};

export default NaturesGaze1;
