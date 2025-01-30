import React from "react";
import InstructionsPage from "../../../components/InstructionsModal";
import naturesGazeBackgroundDark from "../../../assets/naturesGazeBackgroundDark.svg";

const NaturesGaze2Instructions = () => {
  return (
    <InstructionsPage
      title="Nature's Gaze II"
      howToPlay="How to Play"
      instructionsList={[
        "You will begin by focusing on the red dot at the centre of the screen.",
        "A cat will appear either horizontally or vertically from the central red dot.",
      ]}
      strongText="Your task is as soon as the cat appears, to shift your gaze in the opposite direction from where the cat appears as fast and as accurately as possible. For example, if the cat appears to the left of the central red dot, look right."
      subText="In total, there will be __ cats, each alternating their appearance horizontally or vertically from the central red dot. Continue to look in the opposite direction as quickly and accurately as possible."
      noteText="Note that between every cat, you will need to shift your gaze back to the central red dot."
      startButtonText="Start"
      startButtonRoute="/natures-gaze-2-game"
      backgroundImage={naturesGazeBackgroundDark}
    />
  );
};

export default NaturesGaze2Instructions;
