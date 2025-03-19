import React from "react";
import { useParams } from 'react-router-dom';
import InstructionsPage from "../../components/InstructionsModal";
import naturesGazeBackground from "../../assets/memoryVaultBackgroundDark.png";

const NaturesGazeInstructions = () => {
  const { userId } = useParams();

  return (
    <InstructionsPage
      title="Nature's Gaze"
      howToPlay="How It Works"
      firstText="This activity measures how quickly and accurately your eyes can respond to a bird on the screen."
      instructionsList={[
        "Focus on the bird at the center of the screen.",
        "When the bird moves to a new position, follow the instructions on screen.",
        "Try to respond as quickly and accurately as possible."
      ]}
      italicsText="Please remain seated in the same position and try not to move your head excessively."
      startButtonText="Start Game"
      startButtonRoute={`/natures-gaze${userId ? `/${userId}` : ''}`}
      backgroundImage={naturesGazeBackground}
    />
  );
};

export default NaturesGazeInstructions; 