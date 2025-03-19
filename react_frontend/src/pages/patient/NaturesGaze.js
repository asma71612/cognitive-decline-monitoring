import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import './NaturesGaze.css';

const NaturesGaze = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const iframeRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);

  // Check if user has already played today
  useEffect(() => {
    const checkUserPlayStatus = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo(userData);
          
          // Get today's date in YYYY-MM-DD format
          const today = new Date();
          today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
          const formattedToday = today.toISOString().split('T')[0];
          
          // Check if user has completed 7 days and is in cooldown period
          const completedDays = userData.completedDays || [];
          const numCompletedDays = userData.numCompletedDays || 0;
          const firstPlayed = userData.firstPlayed || null;
          const playFrequency = userData.playFrequency || 6; // Default to 6 months

          let inCooldownPeriod = false;
          
          if (numCompletedDays >= 7 && firstPlayed) {
            const firstDate = new Date(firstPlayed);
            const currentDate = new Date();
            
            let nextStart = new Date(firstDate);
            while (nextStart <= currentDate) {
              nextStart.setMonth(nextStart.getMonth() + playFrequency);
            }
            
            // If they've completed 7 days and we haven't reached the next start date
            inCooldownPeriod = numCompletedDays >= 7 && currentDate < nextStart;
          }

          // Check if they've already played today
          const alreadyPlayedToday = completedDays.includes(formattedToday);
          
          setHasPlayedToday(alreadyPlayedToday || inCooldownPeriod);
        }
      } catch (error) {
        console.error("Error checking user play status:", error);
        setErrorMessage("Failed to check play status. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserPlayStatus();
  }, [userId]);

  // This function handles iframe loading
  const handleIframeLoad = () => {
    if (iframeRef.current) {
      console.log("Nature's Gaze game iframe loaded");
    }
  };

  // This listens for any messages from the iframe
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data && event.data.type === 'NATURES_GAZE_COMPLETE') {
        console.log('Received game complete message:', event.data);
        
        // Update Firebase to record that user played today
        if (userId) {
          try {
            const userRef = doc(db, "users", userId);
            const userDoc = await getDoc(userRef);
            
            if (userDoc.exists()) {
              const today = new Date();
              today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
              const formattedToday = today.toISOString().split('T')[0];
              
              const userData = userDoc.data();
              const completedDays = userData.completedDays || [];
              const firstPlayed = userData.firstPlayed || formattedToday;
              
              // Calculate streak
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              yesterday.setMinutes(yesterday.getMinutes() - yesterday.getTimezoneOffset());
              const yesterdayStr = yesterday.toISOString().split("T")[0];
              
              const lastPlayed = userData.lastPlayed || null;
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
            console.error("Error updating play status:", error);
          }
        }
        
        // Redirect to Process Quest Instructions after game is complete
        if (userId) {
          navigate(`/process-quest-instructions/${userId}`);
        } else {
          navigate('/patient-login');
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate, userId]);

  // Handle errors
  const handleError = () => {
    setErrorMessage("Unable to load the Nature's Gaze game. Please make sure the Flask server is running.");
  };

  if (isLoading) {
    return (
      <div className="natures-gaze-container">
        <div className="loading-message">
          <h3>Loading...</h3>
          <p>Please wait while we check your play status.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="natures-gaze-container">
      {errorMessage ? (
        <div className="error-message">
          <h3>Error</h3>
          <p>{errorMessage}</p>
          <button 
            onClick={() => navigate(userId ? `/patient-home-page/${userId}` : '/patient-login')}
            className="back-button"
          >
            Return to Home
          </button>
        </div>
      ) : hasPlayedToday ? (
        <div className="already-played-message">
          <h3>Nature's Gaze Game</h3>
          <p>You have already completed your Nature's Gaze task for today.</p>
          <p>Come back tomorrow for your next session!</p>
          <button 
            onClick={() => navigate(userId ? `/patient-home-page/${userId}` : '/patient-login')}
            className="back-button"
          >
            Return to Home
          </button>
        </div>
      ) : (
        <div className="game-frame-container">
          <iframe 
            ref={iframeRef}
            src="http://localhost:5000/natures-gaze-game" 
            title="Nature's Gaze Game"
            className="game-frame"
            onLoad={handleIframeLoad}
            onError={handleError}
            scrolling="no"
            allow="camera"
          />
        </div>
      )}
    </div>
  );
};

export default NaturesGaze; 