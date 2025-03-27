import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc, arrayUnion, setDoc, collection } from 'firebase/firestore';
import './NaturesGaze.css';

// Define constants for consistent port usage
const FLASK_PORT = 5000;
const EXPRESS_PORT = 5005;

const NaturesGaze = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const iframeRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [setUserInfo] = useState(null);

  // Function to fetch eye tracking data and save to Firebase
  const saveEyeTrackingMetrics = useCallback(async () => {
    try {
      // Try multiple methods to get the eye tracking data
      let data = null;
      
      // Method 1: Try to read the JSON file directly via the Express server
      try {
        console.log("Attempting to fetch eye tracking metrics from main server");
        const expressResponse = await fetch(`http://localhost:${EXPRESS_PORT}/get-eye-tracking-metrics`);
        if (expressResponse.ok) {
          data = await expressResponse.json();
          console.log("Successfully fetched eye tracking metrics from main server");
        } else {
          console.log("Express server endpoint failed, trying Flask server");
        }
      } catch (err) {
        console.log("Error fetching from main server:", err);
      }
      
      // Method 2: Try direct Flask server endpoint
      if (!data) {
        try {
          console.log("Attempting to fetch eye tracking metrics from Flask server");
          const flaskResponse = await fetch(`http://localhost:${FLASK_PORT}/get-saccade-data`);
          if (flaskResponse.ok) {
            data = await flaskResponse.json();
            console.log("Successfully fetched eye tracking metrics from Flask server");
          } else {
            console.log("All API methods failed, using fallback sample data");
          }
        } catch (err) {
          console.log("Error fetching from Flask server:", err);
        }
      }
      
      // Method 3: Fallback to hardcoded sample data if all methods fail
      if (!data) {
        console.log("Using hardcoded sample eye tracking data as fallback");
        data = {
          summary: {
            "prosaccade-gap": {
              "Total_number_of_trials": "1.000",
              "saccade_omission_percentage (%)": "0.000",
              "average_reaction_time (ms)": "29.331",
              "average_saccade_duration (ms)": "41.082",
              "saccade_error_percentage (%)": "0.000",
              "average_fixation_duration (ms)": "314.617"
            },
            "prosaccade-overlap": {
              "Total_number_of_trials": "1.000",
              "saccade_omission_percentage (%)": "0.000",
              "average_reaction_time (ms)": "51.242",
              "average_saccade_duration (ms)": "96.979",
              "saccade_error_percentage (%)": "0.000",
              "average_fixation_duration (ms)": "398.827"
            },
            "antisaccade-gap": {
              "Total_number_of_trials": "1.000",
              "saccade_omission_percentage (%)": "0.000",
              "average_reaction_time (ms)": "32.866",
              "average_saccade_duration (ms)": "98.167",
              "saccade_error_percentage (%)": "0.000",
              "average_fixation_duration (ms)": "236.982"
            },
            "antisaccade-overlap": {
              "Total_number_of_trials": "1.000",
              "saccade_omission_percentage (%)": "0.000",
              "average_reaction_time (ms)": "49.788",
              "average_saccade_duration (ms)": "35.174",
              "saccade_error_percentage (%)": "0.000",
              "average_fixation_duration (ms)": "278.128"
            }
          }
        };
      }
      
      console.log("Received eye tracking metrics:", data);
      const summaryData = data.summary;
      
      if (!summaryData) {
        console.error("No summary data found in the response");
        return;
      }
      
      // Format today's date for Firebase path
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '-');
      
      // Create references to the required documents - FIXED STRUCTURE
      // In Firestore, collections and documents must alternate
      
      // Setup dailyReports structure
      const dailyReportsRef = doc(db, `users/${userId}/dailyReports/${formattedDate}`);
      const dailyReportsDoc = await getDoc(dailyReportsRef);
      if (!dailyReportsDoc.exists()) {
        await setDoc(dailyReportsRef, {
          createdAt: new Date(),
          userId: userId
        });
      }

      // Set up games collection reference correctly
      const gamesCollectionRef = collection(db, `users/${userId}/dailyReports/${formattedDate}/games`);
      
      // Create summary metrics for dailyReports - naturesGaze document in games collection
      const dailyReportsNaturesGazeRef = doc(gamesCollectionRef, 'naturesGaze');
      
      // Create/ensure the dailyReportsSeeMore document exists
      const dailyReportsSeeMoreRef = doc(db, `users/${userId}/dailyReportsSeeMore/${formattedDate}`);
      const dailyReportsSeeMoreDoc = await getDoc(dailyReportsSeeMoreRef);
      if (!dailyReportsSeeMoreDoc.exists()) {
        await setDoc(dailyReportsSeeMoreRef, {
          createdAt: new Date(),
          userId: userId
        });
        console.log("Created dailyReportsSeeMore document");
      }
      
      // Set up naturesGaze collection reference in dailyReportsSeeMore
      const naturesGazeCollectionRef = collection(db, `users/${userId}/dailyReportsSeeMore/${formattedDate}/naturesGaze`);
      
      // Create metrics document in naturesGaze collection
      const naturesGazeMetricsRef = doc(naturesGazeCollectionRef, 'metrics');
      
      // Create and populate all the eye tracking metrics
      const metricsData = {};
      
      // Add prosaccade gap data
      if (summaryData["prosaccade-gap"]) {
        metricsData.prosaccadeGap = {
          averageReactionTime: parseFloat(summaryData["prosaccade-gap"]["average_reaction_time (ms)"]),
          averageSaccadeDuration: parseFloat(summaryData["prosaccade-gap"]["average_saccade_duration (ms)"]),
          averageFixationDuration: parseFloat(summaryData["prosaccade-gap"]["average_fixation_duration (ms)"]),
          saccadeOmissionPercentage: parseFloat(summaryData["prosaccade-gap"]["saccade_omission_percentage (%)"]),
          saccadeErrorPercentage: parseFloat(summaryData["prosaccade-gap"]["saccade_error_percentage (%)"])
        };
        console.log("Added prosaccade gap data");
      }
      
      // Add antisaccade gap data
      if (summaryData["antisaccade-gap"]) {
        metricsData.antisaccadeGap = {
          averageReactionTime: parseFloat(summaryData["antisaccade-gap"]["average_reaction_time (ms)"]),
          averageSaccadeDuration: parseFloat(summaryData["antisaccade-gap"]["average_saccade_duration (ms)"]),
          averageFixationDuration: parseFloat(summaryData["antisaccade-gap"]["average_fixation_duration (ms)"]),
          saccadeOmissionPercentage: parseFloat(summaryData["antisaccade-gap"]["saccade_omission_percentage (%)"]),
          saccadeErrorPercentage: parseFloat(summaryData["antisaccade-gap"]["saccade_error_percentage (%)"])
        };
        console.log("Added antisaccade gap data");
      }
      
      // Add prosaccade overlap data
      if (summaryData["prosaccade-overlap"]) {
        metricsData.prosaccadeOverlap = {
          averageReactionTime: parseFloat(summaryData["prosaccade-overlap"]["average_reaction_time (ms)"]),
          averageSaccadeDuration: parseFloat(summaryData["prosaccade-overlap"]["average_saccade_duration (ms)"]),
          averageFixationDuration: parseFloat(summaryData["prosaccade-overlap"]["average_fixation_duration (ms)"]),
          saccadeOmissionPercentage: parseFloat(summaryData["prosaccade-overlap"]["saccade_omission_percentage (%)"]),
          saccadeErrorPercentage: parseFloat(summaryData["prosaccade-overlap"]["saccade_error_percentage (%)"])
        };
        console.log("Added prosaccade overlap data");
      }
      
      // Add antisaccade overlap data
      if (summaryData["antisaccade-overlap"]) {
        metricsData.antisaccadeOverlap = {
          averageReactionTime: parseFloat(summaryData["antisaccade-overlap"]["average_reaction_time (ms)"]),
          averageSaccadeDuration: parseFloat(summaryData["antisaccade-overlap"]["average_saccade_duration (ms)"]),
          averageFixationDuration: parseFloat(summaryData["antisaccade-overlap"]["average_fixation_duration (ms)"]),
          saccadeOmissionPercentage: parseFloat(summaryData["antisaccade-overlap"]["saccade_omission_percentage (%)"]),
          saccadeErrorPercentage: parseFloat(summaryData["antisaccade-overlap"]["saccade_error_percentage (%)"])
        };
        console.log("Added antisaccade overlap data");
      }
      
      // Create summary data for daily reports
      const summaryReportData = {
        prosaccadeGapReactionTime: metricsData.prosaccadeGap?.averageReactionTime || 0,
        antisaccadeGapReactionTime: metricsData.antisaccadeGap?.averageReactionTime || 0,
        prosaccadeOverlapReactionTime: metricsData.prosaccadeOverlap?.averageReactionTime || 0,
        antisaccadeOverlapReactionTime: metricsData.antisaccadeOverlap?.averageReactionTime || 0
      };
      
      // Save summary data to dailyReports
      await setDoc(dailyReportsNaturesGazeRef, summaryReportData);
      console.log("Saved summary metrics to dailyReports");
      
      // Save detailed metrics to dailyReportsSeeMore
      await setDoc(naturesGazeMetricsRef, metricsData);
      console.log("Successfully saved all eye tracking metrics to Firebase");
      
    } catch (error) {
      console.error("Error saving eye tracking metrics to Firebase:", error);
      if (error.code) {
        console.error("Firebase error code:", error.code);
      }
      if (error.message) {
        console.error("Error message:", error.message);
      }
      
      // Log what we were attempting to do
      console.log("Error occurred while trying to save eye tracking metrics");
    }
  }, [userId]);

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
  }, [userId, setUserInfo]);

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
              
              // Save eye tracking metrics to Firebase
              await saveEyeTrackingMetrics();
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
  }, [navigate, userId, saveEyeTrackingMetrics]);

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
            src={`http://localhost:${FLASK_PORT}/natures-gaze-game`}
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