import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { Link } from 'react-router-dom';
import titleImage from "../../../assets/title.svg";
import RECALL_SESSIONS from './imports/recallSessions';
import "./MemoryVault.css";

const MemoryVaultRecall = () => {
  const [playCount, setPlayCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);

  const [word, setWord] = useState("");
  const [audio, setAudio] = useState("");
  const [picture, setPicture] = useState("");

  const [inputWord, setInputWord] = useState("");
  const [inputAudio, setInputAudio] = useState("");
  const [inputPicture, setInputPicture] = useState("");

  const [wordHint, setWordHint] = useState(null);
  const [audioHint, setAudioHint] = useState(null);
  const [pictureHint, setPictureHint] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      fetchUserData(storedUserId);
    }
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        setPlayCount(userDoc.data().playCount || 0);
      } else {
        await setDoc(userRef, { playCount: 0, completedDays: [], currentStreak: 0 });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  

  useEffect(() => {
    const sessionIndex = playCount % RECALL_SESSIONS.length;
    const prevSession = RECALL_SESSIONS[sessionIndex];

    setWord(prevSession.word);
    setAudio(prevSession.audio);
    setPicture(prevSession.picture);
  }, [playCount]);

  const handleHint = (type) => {
    if (hintsUsed >= 3) return;

    switch (type) {
      case "word":
        setWordHint(RECALL_SESSIONS[playCount % RECALL_SESSIONS.length].wordHint);
        break;
      case "audio":
        setAudioHint(RECALL_SESSIONS[playCount % RECALL_SESSIONS.length].audioHint);
        break;
      case "picture":
        setPictureHint(RECALL_SESSIONS[playCount % RECALL_SESSIONS.length].pictureHint);
        break;
      default:
        break;
    }

    setHintsUsed(hintsUsed + 1);
  };

  const handleDone = async () => {
    const presentedWords = [word, audio, picture].filter(Boolean).join(", ");
    const recalledWords = [inputWord, inputAudio, inputPicture].filter(Boolean).join(", ");
    
    const userAttempt = {
      Presented: presentedWords,
      Recalled: recalledWords,
      HintsUsed: hintsUsed,
      Timestamp: new Date().toISOString(),
    };

    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');

    const pathToDailyReports = `/users/${userId}/dailyReports/${formattedDate}/games/memoryVault/recallSpeedAndAccuracy`;
    const pathToSeeMore = `/users/${userId}/dailyReportsSeeMore/${formattedDate}/memoryVault/recallSpeedAndAccuracy`;

    try {
      await updateDoc(doc(db, pathToDailyReports), userAttempt);
      await updateDoc(doc(db, pathToSeeMore), userAttempt);
    } catch (error) {
      console.error("Error saving response:", error);
    }

    const newCount = playCount + 1;
    setPlayCount(newCount);

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // today's date as a string adjusted to local time zone
      const today = new Date();
      today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

      // today's date in YYYY-MM-DD format
      const formattedToday = today.toISOString().split('T')[0];

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setMinutes(yesterday.getMinutes() - yesterday.getTimezoneOffset());
      const yesterdayStr = yesterday.toISOString().split("T")[0]; 

      const lastPlayed = userDoc.data().lastPlayed || null;
      const firstPlayed = userDoc.data().firstPlayed || formattedToday;

      const completedDays = userDoc.data().completedDays || [];

      console.log('completedDays', completedDays);
      console.log('completedDays.length', completedDays.length);


      let newStreak = 1;

      if (lastPlayed) {
        if (lastPlayed === yesterdayStr) {
          newStreak = userDoc.currentStreak + 1;
        }
      }

      await updateDoc(userRef, {
        completedDays: arrayUnion(formattedToday),
        numCompletedDays: completedDays.includes(formattedToday) ? completedDays.length : completedDays.length + 1,
        playCount: newCount,
        lastPlayed: formattedToday,
        firstPlayed: firstPlayed,
        currentStreak: newStreak
      });
    }

    setInputWord("");
    setInputAudio("");
    setInputPicture("");
    setHintsUsed(0);
    setWordHint(null);
    setAudioHint(null);
    setPictureHint(null);
  };

  return (
    <div className="memory-vault-container">
      <div className="title-container-instructions">
        <img src={titleImage} alt="Title" className="title-image-small" />
      </div>

      <div className="memory-vault-content">
        <h1 className="memory-vault-title">Unlock the Memory Vault</h1>
        <p className="game-instructions-text">Recall the items presented earlier in this session:</p>
        <div className="memory-input-container">
          <div className='input-container'>
            <p className='bold'>Enter the word you read</p>
            <input className='input-textbox' type="text" value={inputWord} onChange={(e) => setInputWord(e.target.value)} />
            <div className='hint-container'>
              <button className='hint-button' onClick={() => handleHint("word")} disabled={wordHint}>Need a Hint?</button>
              {wordHint && <p className="hint-text">{wordHint}</p>}
            </div>
          </div>

          <div className='input-container'>
            <p className='bold'>Enter the word you heard</p>
            <input className='input-textbox' type="text" value={inputAudio} onChange={(e) => setInputAudio(e.target.value)} />
            <div className='hint-container'>
              <button className='hint-button' onClick={() => handleHint("audio")} disabled={audioHint}>Need a Hint?</button>
              {audioHint && <p className="hint-text">{audioHint}</p>}
            </div>
          </div>

          <div className='input-container'>
            <p className='bold'>Enter the picture you saw</p>
            <input className='input-textbox' type="text" value={inputPicture} onChange={(e) => setInputPicture(e.target.value)} />
            <div className='hint-container'>
              <button className='hint-button' onClick={() => handleHint("picture")} disabled={pictureHint}>Need a Hint?</button>
              {pictureHint && <p className="hint-text">{pictureHint}</p>}
            </div>
          </div>
        </div>

        <div className="start-button-container">
          <Link to="/patient-home-page">
            <button className="start-button" onClick={handleDone}>Done</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemoryVaultRecall;
