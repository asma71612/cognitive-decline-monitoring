import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from 'react-router-dom';
import { db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import titleImage from "../../../assets/title.svg";
import {
  alarm, block, boat, brush, cloud, door, egg, frame, globe, grass, hammock,
  kettle, leaf, lemon, mouse, notebook, pineapple, rainbow, ruler, salt, shark 
} from './imports/audioFiles';
import SESSIONS from "./imports/startSessions";
import "./MemoryVault.css";

const MemoryVaultStart = () => {
  const { userId } = useParams();
  const [playCount, setPlayCount] = useState(0);
  const [word, setWord] = useState("");
  const [picture, setPicture] = useState("");
  const [audio, setAudio] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchPlayCount = async () => {
      if (userId) {
        try {
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPlayCount(docSnap.data()?.playCount || 0);
          } else {
            console.log("No document exists");
            setPlayCount(0);
          }
        } catch (error) {
          console.error("Error fetching playCount:", error);
          setPlayCount(0);
        }
      }
    };

    fetchPlayCount();
  }, [userId]);

  useEffect(() => {
    const sessionIndex = playCount % SESSIONS.length;
    const sessionData = SESSIONS[sessionIndex];

    setWord(sessionData.word);
    setPicture(sessionData.pictureRef);
    setAudio(sessionData.audio);
  }, [playCount]);

  const getAudioSrc = (audio) => {
    const audioMap = {
      rainbow, shark, notebook, globe, pineapple, hammock, grass, leaf, door, egg,
      cloud, ruler, kettle, brush, lemon, alarm, block, mouse, frame, boat, salt
    };
    return audioMap[audio] || "";
  };

  const handlePlayAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="memory-vault-container">
      <div className="title-container-instructions">
        <img src={titleImage} alt="Title" className="title-image-small" />
      </div>

      <div className="memory-vault-content">
        <h1 className="memory-vault-title">Memory Vault</h1>
        <p className="game-instructions-text">Remember these items for later:</p>
        <div className="memory-items-container">
          <div className="memory-item">{word}</div>
          <div className="memory-item">
            <p className="audio-icon" onClick={handlePlayAudio} style={{ cursor: "pointer" }}>
              🔊
            </p>
            <p className="audio-icon-text" onClick={handlePlayAudio} style={{ cursor: "pointer" }}>
              click to listen
            </p>
            <audio ref={audioRef} src={getAudioSrc(audio)} />
          </div>
          <div className="memory-item">
            <img src={picture} alt="memory-image" className="memory-image" />
          </div>
        </div>

        <div className="start-button-container">
          <Link to={`/memory-vault-recall-instructions/${userId}`}>
            <button className="start-button">Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemoryVaultStart;
