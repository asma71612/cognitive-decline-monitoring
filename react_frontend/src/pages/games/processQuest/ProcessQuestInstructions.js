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
      firstText="A prompt will appear on the screen. Your task is to provide clear and organized verbal instructions in response to the prompt."
      strongText="You have up to 15 minutes to complete your explanation. Aim to cover all the necessary details within this time."
      italicsText="Note that your audio will be recorded and transcribed for further analysis."
      startButtonText="Start"
      startButtonRoute={`/process-quest/${userId}`}
      backgroundImage={memoryVaultBackgroundDark}
    />
  );
};

export default ProcessQuestInstructions;
