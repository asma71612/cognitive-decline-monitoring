import React from "react";
import { useParams } from 'react-router-dom';
import InstructionsPage from "../../../components/InstructionsModal";
import memoryVaultBackgroundDark from "../../../assets/memoryVaultBackgroundDark.png";

const SceneDetectiveInstructions = () => {
  const { userId } = useParams();

  return (
    <InstructionsPage
      title="Scene Detective"
      howToPlay="How to Play"
      firstText="A picture will appear on the screen. Your task is to observe the scene and describe it in as much detail as possible."
      strongText="You have up to 15 minutes to complete your explanation."
      italicsText="Ensure your microphone permissions are enabled on this website."
      startButtonText="Start"
      startButtonRoute={`/scene-detective/${userId}`}
      backgroundImage={memoryVaultBackgroundDark}
    />
  );
};

export default SceneDetectiveInstructions;
