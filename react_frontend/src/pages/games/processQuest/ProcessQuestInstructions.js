import React from "react";
import { useParams } from 'react-router-dom';
import InstructionsPage from "../../../components/InstructionsModal";
import memoryVaultBackgroundDark from "../../../assets/memoryVaultBackgroundDark.png";

const ProcessQuestInstructions = () => {
  const { userId } = useParams();

  return (
    <InstructionsPage
      title="Process Quest"
      howToPlay="How to Play"
      firstText="A prompt will appear on the screen. Your task is to respond to it with clear and organized verbal instructions."
      strongText="You have up to 15 minutes to complete your explanation."
      italicsText="Note that for the duration of the task, your audio will be recorded and transcribed for further analysis. Ensure your microphone permissions are enabled on this website."
      startButtonText="Start"
      startButtonRoute={`/process-quest/${userId}`}
      backgroundImage={memoryVaultBackgroundDark}
    />
  );
};

export default ProcessQuestInstructions;
