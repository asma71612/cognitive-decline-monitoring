import React from "react";
import InstructionsPage from "../../../components/InstructionsModal";
import memoryVaultBackgroundDark from "../../../assets/memoryVaultBackgroundDark.png";

const MemoryVaultInstructions = () => {
  return (
    <InstructionsPage
      title="Unlock the Memory Vault"
      howToPlay="How to Play"
      firstText="Time to unlock the Memory Vault! We're now asking you to recall the 3 items from earlier in the session:"
      instructionsList={[
        "The word you saw on the screen",
        "The word you heard",
        "The picture displayed (*)"
      ]}
      italicsText="(*) Don’t worry—you don’t need to describe the picture, just identify what it is."
      startButtonText="Start"
      startButtonRoute="/memory-vault-recall"
      backgroundImage={memoryVaultBackgroundDark}
    />
  );
};

export default MemoryVaultInstructions;
