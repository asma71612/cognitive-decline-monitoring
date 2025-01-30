import React from "react";
import InstructionsPage from "../../../components/InstructionsModal";
import naturesGazeBackgroundDark from "../../../assets/naturesGazeBackgroundDark.svg";

const NaturesGaze1Instructions = () => {
  return (
    <InstructionsPage
      title="Nature's Gaze I"
      howToPlay="How to Play"
      instructionsList={[
        "You will begin by focusing on the red dot at the centre of the screen.",
        "A bird will appear either horizontally or vertically from the central red dot.",
      ]}
      strongText="Your task is as soon as the bird appears, to shift your gaze to follow the bird as fast and as accurately as possible."
      subText="In total, there will be __ birds, each alternating their appearance horizontally or vertically from the central red dot. Continue to follow them as quickly and accurately as possible."
      noteText="Note that between every bird, you will need to shift your gaze back to the central red dot."
      startButtonText="Start"
      startButtonRoute="/natures-gaze-1-game"
      backgroundImage={naturesGazeBackgroundDark}
    />
  );
};

export default NaturesGaze1Instructions;
