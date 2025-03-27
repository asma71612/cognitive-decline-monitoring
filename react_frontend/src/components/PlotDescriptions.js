import React from "react";

const PlotDescriptions = {
  "Recall Score": (
    <div style={{ textAlign: "center" }}>
      This memory game scores recall accuracy from 0 to 4 points, with
      deductions for using hints (-1 point) or relying on recognition (Maximum
      of 1 point for selecting from a list). Lower scores and increased hint
      dependence may indicate memory retrieval deficits common in MCI.
    </div>
  ),
  "Reaction Time": (
    <div style={{ textAlign: "center" }}>
      This is a measure of the time it took to initiate saccades. The typical
      ranges are:
      <br />
      <br />
      <strong>Healthy</strong>
      <br />
      350-375 ms for pro-saccades
      <br />
      375-400 ms for anti-saccades
      <br />
      <br />
      <strong>Mild Cognitive Impairment</strong>
      <br />
      350-375 ms for pro-saccades
      <br />
      375-400 ms for anti-saccades
      <br />
      <br />
      <strong>Alzheimer’s Disease</strong>
      <br />
      350-400 ms for pro-saccades
      <br />
      450-500 ms for anti-saccades
    </div>
  ),
  "Saccade Omission Percentages": (
    <div style={{ textAlign: "center" }}>
      This percentage indicates how often the user did not respond to the
      target, failing to generate a saccade. Omission is a valuable measure of
      sustained attention and task compliance. The typical ranges are:
      <br />
      <br />
      <strong>Healthy</strong>
      <br />
      0-1% for pro-saccades
      <br />
      2-3% for anti-saccades
      <br />
      <br />
      <strong>Mild Cognitive Impairment</strong>
      <br />
      0.5-1.5% for pro-saccades
      <br />
      3-4% for anti-saccades
      <br />
      <br />
      <strong>Alzheimer’s Disease</strong>
      <br />
      0.5-2% for pro-saccades
      <br />
      5-7% for anti-saccades
    </div>
  ),
  "Saccade Durations": (
    <div style={{ textAlign: "center" }}>
      Saccade duration refers to the time taken for the eyes to move from one
      fixation point to another. It is a reflection of motor control and neural
      processing speed The typical ranges are:
      <br />
      <br />
      <strong>Healthy</strong>
      <br />
      27.1 ms ± 4.3
      <br />
      <strong>Mild Cognitive Impairment</strong>
      <br />
      25.3 ms ± 4.6
      <br />
      <strong>Alzheimer’s Disease</strong>
      <br />
      24.8 ms ± 4.4
    </div>
  ),
  "Fixation Accuracy": (
    <div style={{ textAlign: "center" }}>
      The fixation landing accuracy provides information on how precisely the
      eyes landed on the intended target after a saccade. It measures the
      degrees of deviation between the actual gaze position and target location
      when the eyes come to rest. The confidence interval quantifies hte
      uncertainty in the measurement to help asses the reliability of the
      fixation accuracy estimate.
    </div>
  ),
  "Saccade Direction Error": (
    <div style={{ textAlign: "center" }}>
      This percentage refers to the proportion of eye movement in an incorrect
      direction during the task. Higher error rates suggest problems with
      executive function and inhibitory control. The typical ranges are:
      <br />
      <br />
      <strong>Healthy</strong>
      <br />
      10-25% for pro-saccades
      <br />
      35-60% for anti-saccades
      <br />
      <br />
      <strong>Mild Cognitive Impairment</strong>
      <br />
      20-40% for pro-saccades
      <br />
      50-60% for anti-saccades
      <br />
      <br />
      <strong>Alzheimer’s Disease</strong>
      <br />
      25-40% for pro-saccades
      <br />
      60-80% for anti-saccades
    </div>
  ),
  "Temporal Characteristics: processQuest": (
    <div style={{ textAlign: "center" }}>
      Speaking time and pausing within speech can be indicators of lexical
      access, working memory, and speech planning. The expected pause length and
      frequency is:
      <br />
      <br />
      <strong>Healthy</strong>
      <br />
      Pause Length (milliseconds): 629.41 ± 213
      <br />
      Pause Frequency (per 100 words): 7.41 ± 2.74
      <br />
      <br />
      <strong>Alzheimer’s Disease</strong>
      <br />
      Pause Length (milliseconds): 855.65 ± 253
      <br />
      Pause Frequency (per 100 words): 9.01 ± 3.76
    </div>
  ),
  "Temporal Characteristics: sceneDetective": (
    <div style={{ textAlign: "center" }}>
      Speaking time and pausing within speech can be indicators of lexical
      access, working memory, and speech planning. The expected pause length and
      frequency is:
      <br />
      <br />
      <strong>Healthy</strong>
      <br />
      Pause Length (milliseconds): 805.24 ± 342
      <br />
      Pause Frequency (per 100 words): 12.2 ± 1.84
      <br />
      <br />
      <strong>Alzheimer’s Disease</strong>
      <br />
      Pause Length (milliseconds): 1296.35 ± 720
      <br />
      Pause Frequency (per 100 words): 17.25 ± 5.1
    </div>
  ),
  "Structural Features": (
    <div style={{ textAlign: "center" }}>
      The structure of speech, including the number of sentences and the mean
      length of utterance—calculated as the number of words divided by the total
      number of sentences—can reflect memory limitations that impact one's
      ability to produce complex grammatical constructions.
    </div>
  ),
  "Fluency Metrics: sceneDetective": (
    <div style={{ textAlign: "center" }}>
      With MCI, speech fluency can decline faster as speech progresses, leading
      to changes in words per minute, revision ratio and, stutter count. This
      can be linked difficulty retrieving lexical content, a decline in working
      memory, or executive function impairment. The expected values are:
      <br />
      <br />
      <strong>Words per Minute</strong>
      <br />
      Healthy: 144.60 ± 20.4
      <br />
      MCI: 138.60 ± 25.8
      <br />
      <br />
      <strong>Revision Ratio</strong>
      <br />
      Healthy: 0.95 ± 1.16
      <br />
      MCI: 0.64 ± 1.04
    </div>
  ),
  "Fluency Metrics: processQuest": (
    <div style={{ textAlign: "center" }}>
      With MCI, speech fluency can decline faster as speech progresses, leading
      to changes in words per minute, revision ratio and, stutter count. This
      can be linked difficulty retrieving lexical content, a decline in working
      memory, or executive function impairment. The expected values are:
      <br />
      <br />
      <strong>Words per Minute</strong>
      <br />
      Healthy: 144.60 ± 20.4
      <br />
      MCI: 138.60 ± 25.8
      <br />
      <br />
      <strong>Revision Ratio</strong>
      <br />
      Healthy: 1.73 ± 12.33
      <br />
      MCI: 0.55 ± 0.89
    </div>
  ),
  "Lexical Content: sceneDetective": (
    <div style={{ textAlign: "center" }}>
      Changes in the vocabulary used in speech can serve as an early indicator
      of cognitive decline. Open-class words consist on nouns, verbs and
      adjectives. Closed-class words consist of pronouns, conjunctions, and
      articles. The expected open/closed class words ratio is:
      <br />
      <br />
      <strong>Healthy</strong>
      <br />
      0.93 ± 0.13
      <br />
      <br />
      <strong>Mild Cognitive Impairment</strong>
      <br />
      1.03 ± 0.37
    </div>
  ),
  "Lexical Content: processQuest": (
    <div style={{ textAlign: "center" }}>
      Changes in the vocabulary used in speech can serve as an early indicator
      of cognitive decline. Open-class words consist on nouns, verbs and
      adjectives. Closed-class words consist of pronouns, conjunctions, and
      articles. The expected open/closed class words ratio is:
      <br />
      <br />
      <strong>Healthy</strong>
      <br />
      0.92 ± 0.12
      <br />
      <br />
      <strong>Mild Cognitive Impairment</strong>
      <br />
      0.97 ± 0.18
    </div>
  ),
  "Semantic Features": (
    <div style={{ textAlign: "center" }}>
      These features provide information on semantic retrieval and processing.
      The average lexical frequency of the nouns used is calculated using the
      SUBTLEX-US database, indicating how common or rare the nouns are in
      everyday language, which can help assess lexical retrieval difficulties in
      MCI. The semantic idea density is the ratio of the number of semantic
      units to the total number of words. Semantic efficiency is the number of
      semantic units realtive to the speech duration. The expected values are:
      <br />
      <br />
      <strong>Lexical Frequency of Nouns</strong>
      <br />
      Healthy: 34.84 ± 25.51
      <br />
      MCI: 52.15 ± 62.53
      <br />
      <br />
      <strong> Semantic Idea Density</strong>
      <br />
      Healthy: 0.14 ± 0.06
      <br />
      MCI: 0.15 ± 0.06
    </div>
  ),
};

export default PlotDescriptions;
