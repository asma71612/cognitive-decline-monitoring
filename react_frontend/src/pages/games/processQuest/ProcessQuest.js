import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../../../firebaseConfig";
import { doc, getDoc, setDoc, collection, updateDoc, arrayUnion } from "firebase/firestore";
import titleImage from "../../../assets/title.svg";
import SESSION_PROMPTS from "./imports/sessionPrompts";
import "./ProcessQuest.css";

// Define constants for consistent port usage
const EXPRESS_PORT = 5005;

const ProcessQuest = () => {
  const { userId } = useParams();
  const [playCount, setPlayCount] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [secondsRemaining, setSecondsRemaining] = useState(900);
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const navigate = useNavigate();

  const analyzeText = async (transcript, audio_segments) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, audio_segments }),
      });
      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Error analyzing speech content:", error);
      return { error: error.message };
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
      return { error: error.message };
    }
  };

  const checkTranscriptionStatus = useCallback(async (jobName) => {
    try {
      const response = await fetch(`http://localhost:${EXPRESS_PORT}/transcription/${jobName}`);
      const data = await response.json();

      const formattedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');

      const dailyReportsRef = doc(db, `users/${userId}/dailyReports/${formattedDate}`);
      const dailyReportsSeeMoreRef = doc(db, `users/${userId}/dailyReportsSeeMore/${formattedDate}`);
  
      if (data.transcript) {
        const analyzeTextResult = await analyzeText(data.transcript, data.audio_segments);
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

          // Create reference to games collection
          const gamesCollectionRef = collection(db, `users/${userId}/dailyReports/${formattedDate}/games`);

          // Path for dailyReports/processQuest
          const dailyReportsProcessQuest = doc(gamesCollectionRef, 'processQuest');
          
          // Create processQuest collection in dailyReportsSeeMore
          const processQuestCollectionRef = collection(db, `users/${userId}/dailyReportsSeeMore/${formattedDate}/processQuest`);
          
          // Paths for dailyReportsSeeMore/processQuest components
          const fluencyMetricsProcessQuest = doc(processQuestCollectionRef, 'fluencyMetrics');
          const lexicalFeaturesProcessQuest = doc(processQuestCollectionRef, 'lexicalFeatures');
          const semanticFeaturesProcessQuest = doc(processQuestCollectionRef, 'semanticFeatures');
          const structuralFeaturesProcessQuest = doc(processQuestCollectionRef, 'structuralFeatures');
          const temporalCharacteristicsProcessQuest = doc(processQuestCollectionRef, 'temporalCharacteristics');

          // Daily reports summary data
          const dailyReportsMetrics = {
            MedianNounLexicalFrequency: analyzeTextResult["Frequency of Nouns"],
            OpenedClosedRatio: analyzeTextResult["Open/Closed Class Ratio"],
            RepetitionRatio: analyzeTextResult["Repetition Ratio"]
          };
          
          // Detailed metrics for the "see more" section
          const fluencyMetrics = {
            RepetitionRatio: analyzeTextResult["Repetition Ratio"],
            WordsPerMin: analyzeTextResult["Words per Minute"]
          };
          const lexicalFeatures = {
            ClosedClass: analyzeTextResult["Closed-Class Words"],
            Filler: analyzeTextResult["Frequency of Filler Words"],
            Noun: analyzeTextResult["Frequency of Nouns"],
            OpenClass: analyzeTextResult["Open-Class Words"],
            Verb: analyzeTextResult["Frequency of Verbs and auxillary verbs"]
          };
          const semanticFeatures = {
            LexicalFrequencyOfNouns: analyzeTextResult['Average Noun Frequency']
          };
          const structuralFeatures = {
            MeanLengthOfUtterance: analyzeTextResult["Mean Length of Utterance (MLU) (Average number of words per sentence)"],
            NumOfSentences: analyzeTextResult["Total Sentences"]
          };
          const temporalCharacteristics = {
            SpeakingTime: analyzeTextResult["Speech Duration"]
          };

          // Save all metrics to Firebase
          await setDoc(dailyReportsProcessQuest, dailyReportsMetrics);
          await setDoc(fluencyMetricsProcessQuest, fluencyMetrics);
          await setDoc(lexicalFeaturesProcessQuest, lexicalFeatures);
          await setDoc(semanticFeaturesProcessQuest, semanticFeatures);
          await setDoc(structuralFeaturesProcessQuest, structuralFeatures);
          await setDoc(temporalCharacteristicsProcessQuest, temporalCharacteristics);

          // Create the pauses subcollection
          if (analyzePausesResult && analyzePausesResult.length > 0) {
            // Create temporalCharacteristics/Pauses collection
            const pausesCollectionRef = collection(db, `users/${userId}/dailyReportsSeeMore/${formattedDate}/processQuest/temporalCharacteristics/Pauses`);
            
            for (let i = 0; i < analyzePausesResult.length; i++) {
              const pause = analyzePausesResult[i];
              const pauseRef = doc(pausesCollectionRef, `${i + 1}`);
              
              await setDoc(pauseRef, {
                StartTime: pause.StartTime,
                EndTime: pause.EndTime
              });
            }
          }

          console.log("Reporting for Process Quest saved successfully to Firebase.");

        } catch (error) {
          console.error("Error saving reports for Process Quest:", error);
        }
        
      } else {
        setTimeout(() => checkTranscriptionStatus(jobName), 5000);
      }
    } catch (error) {
      console.error("Error fetching transcription:", error);
    }
  }, [userId]);

  const startRecording = useCallback(async () => {
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
  
        const uploadAudioForTranscription = async (audioBlob) => {
          const formData = new FormData();
          formData.append("audio", audioBlob);

          const date = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\//g, '-');

          formData.append("game", "processQuest");
          formData.append("userId", userId);
          formData.append("date", date);
          formData.append("sessionNumber", playCount+1);
        
          try {
            console.log("Attempting to upload audio to transcription server...");
            const response = await fetch(`http://localhost:${EXPRESS_PORT}/transcribe`, {
              method: "POST",
              body: formData,
            });
            
            if (!response.ok) {
              throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();

            if (data.jobName) {
              checkTranscriptionStatus(data.jobName);
            }
          } catch (error) {
            console.error("Error uploading audio:", error);
            
            // Save minimal data to Firebase even if transcription fails
            try {
              console.log("Transcription failed, saving minimal game data to Firebase...");
              const formattedDate = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              }).replace(/\//g, '-');

              // Create required document references
              const dailyReportsRef = doc(db, `users/${userId}/dailyReports/${formattedDate}`);
              const dailyReportsSeeMoreRef = doc(db, `users/${userId}/dailyReportsSeeMore/${formattedDate}`);
              
              // Ensure parent documents exist
              const dailyReportsDoc = await getDoc(dailyReportsRef);
              const dailyReportsSeeMoreDoc = await getDoc(dailyReportsSeeMoreRef);

              if (!dailyReportsDoc.exists()) {
                await setDoc(dailyReportsRef, {
                  createdAt: new Date(),
                  userId: userId
                });
              }
              
              if (!dailyReportsSeeMoreDoc.exists()) {
                await setDoc(dailyReportsSeeMoreRef, {
                  createdAt: new Date(),
                  userId: userId
                });
              }
              
              // Games collection reference
              const gamesCollectionRef = collection(db, `users/${userId}/dailyReports/${formattedDate}/games`);
              
              // Process Quest document in games collection
              const processQuestRef = doc(gamesCollectionRef, 'processQuest');
              
              // Save minimal data (fallback)
              await setDoc(processQuestRef, {
                completedAt: new Date(),
                sessionNumber: playCount + 1,
                transcriptionFailed: true
              });
              
              console.log("Minimal game data saved to Firebase");
              
            } catch (fbError) {
              console.error("Error saving fallback data to Firebase:", fbError);
            }
          }
        };
        
        uploadAudioForTranscription(audioBlob);
        audioChunksRef.current = [];
      };

      mediaRecorderRef.current.start(1000); // Collect chunks every second
  
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }, [userId, playCount, checkTranscriptionStatus]);

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDone = useCallback(() => {
    stopRecording();
    
    // Update user data to mark completion
    const updateUserCompletion = async () => {
      if (userId) {
        try {
          const userRef = doc(db, "users", userId);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const today = new Date();
            today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
            const formattedToday = today.toISOString().split('T')[0];
            
            // Calculate streak
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setMinutes(yesterday.getMinutes() - yesterday.getTimezoneOffset());
            const yesterdayStr = yesterday.toISOString().split("T")[0];
            
            const userData = userDoc.data();
            const lastPlayed = userData.lastPlayed || null;
            const firstPlayed = userData.firstPlayed || formattedToday;
            const completedDays = userData.completedDays || [];
            
            let newStreak = 1;
            if (lastPlayed === yesterdayStr) {
              newStreak = userData.currentStreak + 1;
            }
            
            // Update user document
            await updateDoc(userRef, {
              completedDays: arrayUnion(formattedToday),
              numCompletedDays: completedDays.includes(formattedToday) 
                ? completedDays.length 
                : completedDays.length + 1,
              playCount: (userData.playCount || 0) + 1,
              lastPlayed: formattedToday,
              firstPlayed: firstPlayed,
              currentStreak: newStreak
            });
            
            console.log("Updated user play status in Firebase");
          }
        } catch (error) {
          console.error("Error updating user completion status:", error);
        }
      }
    };
    
    // Update user data before navigating
    updateUserCompletion().then(() => {
      navigate(`/scene-detective-instructions/${userId}`);
    });
  }, [navigate, userId]);
 
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
  }, [userId, startRecording]);

  useEffect(() => {
    if (secondsRemaining === 0) {
      handleDone();
      return;
    }
  
    timerRef.current = setTimeout(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
  
    return () => clearTimeout(timerRef.current);
  }, [secondsRemaining, handleDone]);

  useEffect(() => {
    const sessionIndex = playCount % SESSION_PROMPTS.length;
    const currentSession = SESSION_PROMPTS[sessionIndex];

    setPrompt(currentSession.prompt);
  }, [playCount]);

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
          <button className="start-button" onClick={handleDone}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default ProcessQuest;
