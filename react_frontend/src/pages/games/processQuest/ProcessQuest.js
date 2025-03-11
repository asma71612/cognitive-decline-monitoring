import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import titleImage from "../../../assets/title.svg";
import SESSION_PROMPTS from "./imports/sessionPrompts";
import "./ProcessQuest.css";

const ProcessQuest = () => {
  const { userId } = useParams();
  const [playCount, setPlayCount] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(900);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlayCount = async () => {
      if (userId) {
        try {
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPlayCount(docSnap.data()?.playCount || 0);
          } else {
            setPlayCount(0);
          }
        } catch (error) {
          console.error("Error fetching playCount:", error);
          setPlayCount(0);
        }
      }
    };

    fetchPlayCount();
    startRecording();

    return () => stopRecording();
  }, [userId]);

  useEffect(() => {
    if (secondsRemaining === 0) {
      handleNext();
      return;
    }
  
    timerRef.current = setTimeout(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
  
    return () => clearTimeout(timerRef.current);
  }, [secondsRemaining]);

  useEffect(() => {
    const sessionIndex = playCount % SESSION_PROMPTS.length;
    const currentSession = SESSION_PROMPTS[sessionIndex];

    setPrompt(currentSession.prompt);
  }, [playCount]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
      const options = { mimeType: 'audio/webm;codecs=opus' };
  
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.warn(`${options.mimeType} is not supported on this browser`);
        return;
      }
  
      mediaRecorderRef.current = new MediaRecorder(stream, options);
  
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        } else {
          console.warn("Empty data chunk received:", event.data);
        }
      };
  
      mediaRecorderRef.current.onstop = async () => {
  
        const audioBlob = new Blob(audioChunksRef.current, { type: options.mimeType });
  
        if (audioBlob.size === 0) {
          console.warn("Audio blob is empty!");
          return;
        }
  
        uploadAudioForTranscription(audioBlob);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start(1000); // Collect chunks every second
  
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };  

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const uploadAudioForTranscription = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob);

    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');

    formData.append("userId", userId);
    formData.append("date", date);
    formData.append("sessionNumber", playCount+1); // since playCount isnt incremented until memory vault at the end
  
    try {
      const response = await fetch("http://localhost:5001/transcribe", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
  
      if (data.jobName) {
        checkTranscriptionStatus(data.jobName);
      }
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  const analyzeLexicalContent = async (transcript, audio_segments) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/lexical-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, audio_segments }),
      });
      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Error analyzing lexical content:", error);
    }
  };
  
  const analyzeSyntacticComplexity = async (transcript) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/syntactic-complexity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Error analyzing syntactic complexity:", error);
    }
  };
  
  const analyzeNounFrequency = async (transcript) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/noun-frequency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Error analyzing noun frequency:", error);
    }
  };  

  const analyzePauses = async (full_transcription) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/analyze-pauses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_transcription }),
      });
      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Error analyzing pauses:", error);
    }
  };  
  
  const checkTranscriptionStatus = async (jobName) => {
    try {
      const response = await fetch(`http://localhost:5001/transcription/${jobName}`);
      const data = await response.json();

      const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');

      const dailyReportsRef = doc(db, `users/${userId}/dailyReports/${formattedDate}`);
      const dailyReportsSeeMoreRef = doc(db, `users/${userId}/dailyReportsSeeMore/${formattedDate}`);
  
      if (data.transcript) {
        const lexicalContentResult = await analyzeLexicalContent(data.transcript, data.audio_segments);
        const syntacticComplexityResult = await analyzeSyntacticComplexity(data.transcript);
        const nounFrequencyResult = await analyzeNounFrequency(data.transcript);
        const analyzePausesResult = await analyzePauses(data.full_transcription);

        try {
          const dailyReportsDoc = await getDoc(dailyReportsRef);
          const dailyReportsSeeMoreDoc = await getDoc(dailyReportsSeeMoreRef);

          if (!dailyReportsDoc.exists()) {
            await setDoc(dailyReportsRef, {});
          }
          if (!dailyReportsSeeMoreDoc.exists()) {
            await setDoc(dailyReportsSeeMoreRef, {});
          }

          const dailyReportsProcessQuest = doc(db, `users/${userId}/dailyReports/${formattedDate}/games/processQuest`);
          const fluencyMetricsProcessQuest = doc(db, `users/${userId}/dailyReportsSeeMore/${formattedDate}/processQuest/fluencyMetrics`);
          const lexicalFeaturesProcessQuest = doc(db, `users/${userId}/dailyReportsSeeMore/${formattedDate}/processQuest/lexicalFeatures`);
          const semanticFeaturesProcessQuest = doc(db, `users/${userId}/dailyReportsSeeMore/${formattedDate}/processQuest/semanticFeatures`);
          const structuralFeaturesProcessQuest = doc(db, `users/${userId}/dailyReportsSeeMore/${formattedDate}/processQuest/structuralFeatures`);
          const temporalCharacteristicsProcessQuest = doc(db, `users/${userId}/dailyReportsSeeMore/${formattedDate}/processQuest/temporalCharacteristics`);

          const dailyReportsMetrics = {
            AverageNounLexicalFrequency: lexicalContentResult["Results"]["Frequency of Nouns"],
            OpenedClosedRatio: lexicalContentResult["Results"]["Open/Closed Class Ratio"],
            RepetitionRatio: lexicalContentResult["Results"]["Repetition Ratio"]
          };
          const fluencyMetrics = {
            RepetitionRatio: lexicalContentResult["Results"]["Repetition Ratio"],
            WordsPerMin: lexicalContentResult["Words per Minute"]
          };
          const lexicalFeatures = {
            ClosedClass: lexicalContentResult["Results"]["Closed-Class Words"],
            Filler: lexicalContentResult["Results"]["Frequency of Filler Words"],
            Noun: lexicalContentResult["Results"]["Frequency of Nouns"],
            OpenClass: lexicalContentResult["Results"]["Open-Class Words"],
            Verb: lexicalContentResult["Results"]["Frequency of Verbs and auxillary verbs"]
          };
          const semanticFeatures = {
            LexicalFrequencyOfNouns: nounFrequencyResult
          };
          const structuralFeatures = {
            MeanLengthOfOccurrence: syntacticComplexityResult["Mean Length of Utterance (MLU) (Average number of words per sentence)"],
            NumOfSentences: syntacticComplexityResult["Total Sentences"]
          };
          const temporalCharacteristics = {
            SpeakingTime: lexicalContentResult["Speech Duration"]
          };

          await setDoc(dailyReportsProcessQuest, dailyReportsMetrics);
          await setDoc(fluencyMetricsProcessQuest, fluencyMetrics);
          await setDoc(lexicalFeaturesProcessQuest, lexicalFeatures);
          await setDoc(semanticFeaturesProcessQuest, semanticFeatures);
          await setDoc(structuralFeaturesProcessQuest, structuralFeatures);
          await setDoc(temporalCharacteristicsProcessQuest, temporalCharacteristics);

          for (let i = 0; i < analyzePausesResult?.length; i++) {

            const pause = analyzePausesResult[i];
            const pauseRef = doc(db,`users/${userId}/dailyReportsSeeMore/${formattedDate}/processQuest/temporalCharacteristics/Pauses/${i + 1}`);
            
            await setDoc(pauseRef, {
              StartTime: pause.StartTime,
              EndTime: pause.EndTime
            });
          }

          console.log("Reporting for Process Quest saved successfully to Firebase.");

        } catch (error) {
          console.error("Error saving reports for Process Quest:", error);
        }
        
      } else {
        setTimeout(() => checkTranscriptionStatus(jobName), 5001);
      }
    } catch (error) {
      console.error("Error fetching transcription:", error);
    }
  }; 

  const handleNext = () => {
    stopRecording();
    navigate(`/memory-vault-recall-instructions/${userId}`);
  };

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };
  
  return (
    <div className="process-quest-container">
      <div className="title-container-instructions">
        <img src={titleImage} alt="Title" className="title-image-small" />
      </div>

      <div className="timer">
        <p>{formatTime(secondsRemaining)}</p>
      </div>

      <div className="process-quest-content">
        <h1 className="process-quest-title">Process Quest</h1>
        <p className="game-instructions-text">Verbally respond to the prompt below:</p>
        <div className="process-quest-prompt-container">
          <p className="process-quest-prompt">{prompt}</p>
        </div>

        <div className="start-button-container">
          <button className="start-button" onClick={handleNext}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default ProcessQuest;
