import React from "react";
import { useParams } from 'react-router-dom';
import InstructionsPage from "../../components/InstructionsModal";
import gazeCalibrationBackground from "../../assets/memoryVaultBackgroundDark.png"; // Using existing background, should be replaced with appropriate one

const GazeCalibrationInstructions = () => {
  const { userId } = useParams();

  return (
    <InstructionsPage
      title="Gaze Calibration"
      howToPlay="How It Works"
      firstText="Calibration helps the system track your eye movements accurately. This is important for the eye-tracking tasks in this application."
      instructionsList={[
        "You will see a series of red dots appear on the screen",
        "Look directly at each dot and click on it",
        "Hold your head steady while data is being collected",
        "Complete all dots to finish the calibration"
      ]}
      italicsText="The calibration process may take a few minutes. Please remain seated in the same position throughout the process."
      startButtonText="Start Calibration"
      startButtonRoute={`/gaze-calibration${userId ? `/${userId}` : ''}`}
      backgroundImage={gazeCalibrationBackground}
    />
  );
};

export default GazeCalibrationInstructions; 