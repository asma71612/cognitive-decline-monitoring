import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import InstructionsPage from "../../components/InstructionsModal";
import naturesGazeBackground from "../../assets/gaze-calibration-instructions-background.png";

const NaturesGazeInstructions = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showCooldownMessage, setShowCooldownMessage] = useState(false);
  const [nextStartDate, setNextStartDate] = useState(null);

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
            
            if (inCooldownPeriod) {
              setNextStartDate(nextStart);
              setShowCooldownMessage(true);
            }
          }

          // Check if they've already played today
          const alreadyPlayedToday = completedDays.includes(formattedToday);
          
          setHasPlayedToday(alreadyPlayedToday);
        }
      } catch (error) {
        console.error("Error checking user play status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserPlayStatus();
  }, [userId]);

  // Format the next start date
  const formatNextStartDate = () => {
    if (!nextStartDate) return "";
    
    return nextStartDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // If still loading
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#fff3e3' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <h3>Loading...</h3>
          <p>Please wait while we check your play status.</p>
        </div>
      </div>
    );
  }

  // If in cooldown period
  if (showCooldownMessage) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#fff3e3' 
      }}>
        <div style={{ 
          textAlign: 'center',
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '500px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#516A80' }}>Nature's Gaze Game</h3>
          <p>You have completed all 7 days of the Nature's Gaze game.</p>
          <p>The game will be available again on: <strong>{formatNextStartDate()}</strong></p>
          <button 
            onClick={() => navigate(`/patient-home-page/${userId}`)}
            style={{
              backgroundColor: '#516A80',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // If already played today
  if (hasPlayedToday) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#fff3e3' 
      }}>
        <div style={{ 
          textAlign: 'center',
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '500px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#516A80' }}>Nature's Gaze Game</h3>
          <p>You have already completed your Nature's Gaze task for today.</p>
          <p>Come back tomorrow for your next session!</p>
          <button 
            onClick={() => navigate(`/patient-home-page/${userId}`)}
            style={{
              backgroundColor: '#516A80',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <InstructionsPage
      title="Nature's Gaze"
      howToPlay="How It Works"
      firstText="This activity measures how quickly and accurately your eyes can respond to a bird on the screen."
      instructionsList={[
        "Focus on the bird at the center of the screen.",
        "When the bird moves to a new position, follow the instructions on screen.",
        "Try to respond as quickly and accurately as possible."
      ]}
      italicsText="Please remain seated in the same position and try not to move your head excessively."
      startButtonText="Start Game"
      startButtonRoute={`/natures-gaze${userId ? `/${userId}` : ''}`}
      backgroundImage={naturesGazeBackground}
    />
  );
};

export default NaturesGazeInstructions; 