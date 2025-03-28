import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import titleImage from "../../../assets/title.svg";
import RECALL_SESSIONS from './imports/recallSessions';
import "./MemoryVault.css";

const MemoryVaultRecall = () => {
  const { userId } = useParams();
  const [playCount, setPlayCount] = useState(0);
  const [sessionIndex, setSessionIndex] = useState(0);
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

  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchUserData(userId);
    }
  }, [userId]);

  const fetchUserData = async (uid) => {
    try {
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
  
      if (userDoc.exists()) {
        setPlayCount(userDoc.data().playCount || 0);
        // Use the memory_vault_session if it exists, otherwise fallback to playCount
        const memoryVaultSession = userDoc.data().memory_vault_session;
        if (memoryVaultSession !== undefined) {
          setSessionIndex(memoryVaultSession);
        } else {
          // Fallback to using playCount if memory_vault_session doesn't exist
          setSessionIndex(userDoc.data().playCount % RECALL_SESSIONS.length);
        }
      } else {
        await setDoc(userRef, { playCount: 0, completedDays: [], currentStreak: 0 });
        setSessionIndex(0);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  

  useEffect(() => {
    // Use sessionIndex instead of playCount to get the correct session
    const session = RECALL_SESSIONS[sessionIndex];
    if (session) {
      setWord(session.word);
      setAudio(session.audio);
      setPicture(session.picture);
    }
  }, [sessionIndex]);

  const handleHint = (type) => {
    if (hintsUsed >= 3) return;

    switch (type) {
      case "word":
        setWordHint(RECALL_SESSIONS[sessionIndex].wordHint);
        break;
      case "audio":
        setAudioHint(RECALL_SESSIONS[sessionIndex].audioHint);
        break;
      case "picture":
        setPictureHint(RECALL_SESSIONS[sessionIndex].pictureHint);
        break;
      default:
        break;
    }

    setHintsUsed(hintsUsed + 1);
  };

  const handleDone = async () => {
    if (!inputWord || !inputAudio || !inputPicture) {
      alert("Please fill in all fields before proceeding!");
      return;
    }

    const presentedArray = [word, audio, picture];
    const recalledArray = [inputWord, inputAudio, inputPicture];
    
    // Compute points separately for each pair:
    const computePointsForPair = async (presented, recalled, hintUsed) => {
      const response = await fetch("http://127.0.0.1:5000/compute-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          presented_word: presented,
          recalled_word: recalled,
        }),
      });
      const { points } = await response.json();
      return hintUsed ? Math.max(points - 1, 0) : points;
    };

    const wordPoints = await computePointsForPair(presentedArray[0], recalledArray[0], !!wordHint);
    const audioPoints = await computePointsForPair(presentedArray[1], recalledArray[1], !!audioHint);
    const picturePoints = await computePointsForPair(presentedArray[2], recalledArray[2], !!pictureHint);

    const presentedWords = presentedArray.filter(Boolean).join(", ");
    const recalledWords = recalledArray.filter(Boolean).join(", ");
    
    // New object with separate hint booleans and points fields
    const userAttempt = {
      Presented: presentedWords,
      Recalled: recalledWords,
      wordPoints,
      audioPoints,
      picturePoints,
      wordHint: !!wordHint,
      audioHint: !!audioHint,
      pictureHint: !!pictureHint,
    };

    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');

    const userRef = doc(db, "users", userId);
    const dailyReportsRef = doc(db, `users/${userId}/dailyReports/${formattedDate}`);
    const dailyReportsSeeMoreRef = doc(db, `users/${userId}/dailyReportsSeeMore/${formattedDate}`);
    const allTimeReportsRef = doc(db, `users/${userId}/allTimeReports/${formattedDate}`);

    try {
      // Ensure parent documents exist
      const dailyReportsDoc = await getDoc(dailyReportsRef);
      const dailyReportsSeeMoreDoc = await getDoc(dailyReportsSeeMoreRef);
      const allTimeReportsDoc = await getDoc(allTimeReportsRef);

      if (!dailyReportsDoc.exists()) {
        await setDoc(dailyReportsRef, {});
      }
      if (!dailyReportsSeeMoreDoc.exists()) {
        await setDoc(dailyReportsSeeMoreRef, {});
      }
      if (!allTimeReportsDoc.exists()) {
        await setDoc(allTimeReportsRef, {});
      }

      // Setup games collection in dailyReports
      const gamesCollectionRef = collection(db, `users/${userId}/dailyReports/${formattedDate}/games`);

      // Setup allTimeReports games collection
      const allTimeGamesCollectionRef = collection(db, `users/${userId}/allTimeReports/${formattedDate}/games`);

      // Setup memoryVault collection in dailyReportsSeeMore
      const memoryVaultCollectionRef = collection(db, `users/${userId}/dailyReportsSeeMore/${formattedDate}/memoryVault`);

      // Create document references
      const dailyMemoryVaultRef = doc(gamesCollectionRef, 'memoryVault');
      const seeMoreMemoryVaultRef = doc(memoryVaultCollectionRef, 'recallSpeedAndAccuracy');
      const allTimeMemoryVaultRef = doc(allTimeGamesCollectionRef, 'memoryVault');

      await setDoc(dailyMemoryVaultRef, userAttempt);
      await setDoc(seeMoreMemoryVaultRef, userAttempt);
      await setDoc(allTimeMemoryVaultRef, userAttempt);

    } catch (error) {
      console.error("Error saving response:", error);
    }

    const newCount = playCount + 1;
    setPlayCount(newCount);

    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
        const today = new Date();
        today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
        const formattedToday = today.toISOString().split('T')[0];

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setMinutes(yesterday.getMinutes() - yesterday.getTimezoneOffset());
        const yesterdayStr = yesterday.toISOString().split("T")[0];

        const lastPlayed = userDoc.data().lastPlayed || null;
        const firstPlayed = userDoc.data().firstPlayed || formattedToday;
        const completedDays = userDoc.data().completedDays || [];

        let newStreak = 1;
        if (lastPlayed === yesterdayStr) {
            newStreak = userDoc.data().currentStreak + 1;
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

    navigate(`/patient-home-page/${userId}`);
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
              <button 
                className={`hint-button ${wordHint ? 'disabledButtonStyle' : ''}`}
                onClick={() => handleHint("word")} 
                disabled={wordHint}
              >
                Need a Hint?
              </button>
              {wordHint && <p className="hint-text">{wordHint}</p>}
            </div>
          </div>

          <div className='input-container'>
            <p className='bold'>Enter the word you heard</p>
            <input className='input-textbox' type="text" value={inputAudio} onChange={(e) => setInputAudio(e.target.value)} />
            <div className='hint-container'>
              <button 
                className={`hint-button ${audioHint ? 'disabledButtonStyle' : ''}`}
                onClick={() => handleHint("audio")} 
                disabled={audioHint}
              >
                Need a Hint?
              </button>
              {audioHint && <p className="hint-text">{audioHint}</p>}
            </div>
          </div>

          <div className='input-container'>
            <p className='bold'>Enter the picture you saw</p>
            <input className='input-textbox' type="text" value={inputPicture} onChange={(e) => setInputPicture(e.target.value)} />
            <div className='hint-container'>
              <button 
                className={`hint-button ${pictureHint ? 'disabledButtonStyle' : ''}`}
                onClick={() => handleHint("picture")} 
                disabled={pictureHint}
              >
                Need a Hint?
              </button>
              {pictureHint && <p className="hint-text">{pictureHint}</p>}
            </div>
          </div>
        </div>

        <div className="start-button-container">
          <button className="start-button" type="button" onClick={handleDone}>Done</button>
        </div>
      </div>
    </div>
  );
};

export default MemoryVaultRecall;
