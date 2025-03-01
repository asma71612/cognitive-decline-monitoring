import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { db } from "../../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import titleImage from "../../../assets/title.svg";
import "./MemoryVault.css";

// IMPORTING AUDIO FILES
import alarm from './audio/alarm.mp3';
import block from './audio/block.mp3';
import boat from './audio/boat.mp3';
import brush from './audio/brush.mp3';
import cloud from './audio/cloud.mp3';
import door from './audio/door.mp3';
import egg from './audio/egg.mp3';
import frame from './audio/frame.mp3';
import globe from './audio/globe.mp3';
import grass from './audio/grass.mp3';
import hammock from './audio/hammock.mp3';
import kettle from './audio/kettle.mp3';
import leaf from './audio/leaf.mp3';
import lemon from './audio/lemon.mp3';
import mouse from './audio/mouse.mp3';
import notebook from './audio/notebook.mp3';
import pineapple from './audio/pineapple.mp3';
import rainbow from './audio/rainbow.mp3';
import ruler from './audio/ruler.mp3';
import salt from './audio/salt.mp3';
import shark from './audio/shark.mp3';

// IMPORTING IMAGES
import apple from './pictures/apple.png';
import bell from './pictures/bell.png';
import bowl from './pictures/bowl.png';
import button from './pictures/button.png';
import candle from './pictures/candle.png';
import carrot from './pictures/carrot.png';
import chair from './pictures/chair.png';
import fan from './pictures/fan.png';
import hammer from './pictures/hammer.png';
import key from './pictures/key.png';
import kite from './pictures/kite.png';
import knife from './pictures/knife.png';
import ladder from './pictures/ladder.png';
import lamp from './pictures/lamp.png';
import map from './pictures/map.png';
import moon from './pictures/moon.png';
import pencil from './pictures/pencil.png';
import sock from './pictures/sock.png';
import star from './pictures/star.png';
import vase from './pictures/vase.png';
import volcano from './pictures/volcano.png';

const SESSIONS = [
  { word: "spoon", audio: 'rainbow', picture: 'apple', pictureRef: apple },
  { word: "bicycle", audio: 'shark', picture: 'pencil', pictureRef: pencil },
  { word: "castle", audio: 'notebook', picture: 'volcano', pictureRef: volcano },
  { word: "clock", audio: 'globe', picture: 'hammer', pictureRef: hammer },
  { word: "crown", audio: 'pineapple', picture: 'lamp', pictureRef: lamp },
  { word: "flower", audio: 'hammock', picture: 'kite', pictureRef: kite },
  { word: "window", audio: 'grass', picture: 'moon', pictureRef: moon },
  { word: "fire", audio: 'leaf', picture: 'key', pictureRef: key },
  { word: "cookie", audio: 'door', picture: 'knife', pictureRef: knife },
  { word: "rain", audio: 'egg', picture: 'star', pictureRef: star },
  { word: "locket", audio: 'cloud', picture: 'ladder', pictureRef: ladder },
  { word: "bottle", audio: 'ruler', picture: 'button', pictureRef: button },
  { word: "toothbrush", audio: 'kettle', picture: 'candle', pictureRef: candle },
  { word: "drum", audio: 'brush', picture: 'carrot', pictureRef: carrot },
  { word: "rope", audio: 'lemon', picture: 'bell', pictureRef: bell },
  { word: "belt", audio: 'alarm', picture: 'chair', pictureRef: chair },
  { word: "wheel", audio: 'block', picture: 'vase', pictureRef: vase },
  { word: "bridge", audio: 'mouse', picture: 'sock', pictureRef: sock },
  { word: "honey", audio: 'frame', picture: 'fan', pictureRef: fan },
  { word: "glass", audio: 'boat', picture: 'bowl', pictureRef: bowl },
  { word: "basket", audio: 'salt', picture: 'map', pictureRef: map },
];

const MemoryVaultStart = () => {
  const [playCount, setPlayCount] = useState(0);
  const [word, setWord] = useState("");
  const [picture, setPicture] = useState("");
  const [audio, setAudio] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    
    if (storedUserId) {
      setUserId(storedUserId); // setting userId from localStorage
    } else {
      console.log("User ID not found in localStorage");
    }
  }, []);

  useEffect(() => {
    const fetchPlayCount = async () => {
      if (userId) {
        try {
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setPlayCount(data?.playCount || 0);
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

  const incrementPlayCount = async () => {
    if (userId) {
      try {
        const docRef = doc(db, "users", userId);
        await updateDoc(docRef, {
          playCount: playCount + 1,
        });
        setPlayCount(prevCount => prevCount + 1);
      } catch (error) {
        console.error("Error incrementing playCount:", error);
      }
    }
  };

  return (
    <div className="memory-vault-container">
      <div className="title-container-instructions">
        <img src={titleImage} alt="Title" className="title-image-small" />
      </div>

      <div className="memory-vault-content">
        <h1 className="game-title">Memory Vault</h1>
        <p className="game-instructions-text">Remember these items for later:</p>
        <div className="memory-items-container">
          <div className="memory-item">{word}</div>
          <div className="memory-item">
            <p className="audio-icon">🔊</p>

            <audio controls key={audio}>
              <source src={getAudioSrc(audio)} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
          <div className="memory-item">
            <img src={picture} alt="memory-image" className="memory-image" />
          </div>
        </div>

        <div className="start-button-container">
          <Link to="/memory-vault-recall-instructions">
            <button className="start-button">Next</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MemoryVaultStart;