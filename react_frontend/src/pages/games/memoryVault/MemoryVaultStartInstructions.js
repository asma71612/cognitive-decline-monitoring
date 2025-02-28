import React from "react";
import InstructionsPage from "../../../components/InstructionsModal";
import memoryVaultBackgroundDark from "../../../assets/memoryVaultBackgroundDark.png";

const MemoryVaultInstructions = () => {
  return (
    <InstructionsPage
      title="Memory Vault"
      howToPlay="How to Play"
      firstText="The following items will appear on the screen:"
      instructionsList={[
        "A word",
        "A word spoken aloud by playing the audio on the screen",
        "A picture"
      ]}
      strongText="Your task is to remember these 3 items at the end of this session."
      italicsText="Do not write the words down, record them, or use any external aids to help you remember."
      startButtonText="Start"
      startButtonRoute="/memory-vault-start"
      backgroundImage={memoryVaultBackgroundDark}
    />
  );
};

export default MemoryVaultInstructions;
