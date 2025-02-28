import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import titleImage from '../../assets/title.svg';
import homeIcon from '../../assets/home-dark.svg';
import reportIcon from '../../assets/reports-light.svg';
import supportIcon from '../../assets/support-light.svg';
import profileIcon from '../../assets/profile-light.svg';
import './PatientHomePage.css';

const PatientHomePage = () => {
  const [completedDays, setCompletedDays] = useState([]);
  const [numCompletedDays, setNumCompletedDays] = useState(0);
  const [playFrequency, setPlayFrequency] = useState(null);
  const [firstPlayed, setFirstPlayed] = useState(null); 
  const [nextStartDate, setNextStartDate] = useState(null);
  const [isCooldown, setIsCooldown] = useState(false);

  // today's date as a string adjusted to local time zone
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

  // today's date in YYYY-MM-DD format
  const formattedToday = today.toISOString().split('T')[0];

  useEffect(() => {
    const userRef = doc(db, 'users', localStorage.getItem("userId"));
  
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('data', data);
        setCompletedDays(data?.completedDays || []);
        setNumCompletedDays(data?.numCompletedDays || 0);
        setPlayFrequency(data?.playFrequency || 6);
        setFirstPlayed(data?.firstPlayed || null);
      }
    });
  
    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, []);

  const remainingTasks = 7 - numCompletedDays;

  const taskCompletedToday = completedDays?.includes(formattedToday);

  const getTimeUntilNextPlay = () => {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setDate(now.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);
    return Math.max(0, nextMidnight - now);
  };

  const formatCountdownDaily = (timeLeft) => {
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const [countdown, setCountdown] = useState(getTimeUntilNextPlay());

  useEffect(() => {
    if (taskCompletedToday) {
      const interval = setInterval(() => {
        setCountdown(getTimeUntilNextPlay());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [taskCompletedToday]);

  // CODE FOR DETERMINING COOLDOWN PERIOD LOGIC (BETWEEN 7-DAY MONITORING PERIODS, EX. 6 MONTHS APART)
  useEffect(() => {
    if (firstPlayed && playFrequency) {
      const firstDate = new Date(firstPlayed);
      const currentDate = new Date();
  
      let nextStart = new Date(firstDate);
      while (nextStart <= currentDate) {
        nextStart.setMonth(nextStart.getMonth() + playFrequency);
      }
  
      setNextStartDate(nextStart);
  
      // checking if user is currently in a cooldown period
      setIsCooldown(numCompletedDays === 7 && currentDate < nextStart);
    }
  }, [firstPlayed, playFrequency, numCompletedDays]);

  const getCooldownCountdown = () => {
    if (!nextStartDate) return null;
  
    const now = new Date();
    const timeLeft = nextStartDate - now;
  
    if (timeLeft <= 0) return null;
  
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="patient-home-container">
      <div className="left-side">
        <div className="title-container">
          <img src={titleImage} alt="Title" className="title-image" />
        </div>
        <div className="menu">
          <Link to="/patient-home-page" className="menu-item link">
            <img src={homeIcon} alt="Home" />
            <span>Home</span>
          </Link>
          <Link to="/patient-report-page" className="menu-item link">
            <img src={reportIcon} alt="My Reports" />
            <span style={{ color: "#516A80" }}>My Reports</span>
          </Link>
          <Link to="/support-page" className="menu-item link">
            <img src={supportIcon} alt="Support" />
            <span>Support</span>
          </Link>
        </div>
        <Link to="/patient-login" className="menu-item link logout">
          <img src={profileIcon} alt="Log Out" />
          <span>Log Out</span>
        </Link>
      </div>
      <div className="right-side">
        <div className="home-content">
          <h1>Home</h1>
          <p className='date-announcement'>{`Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.`}</p>
            <div>
              {isCooldown ? (
                <div>
                  <p className="tasks-left">You have completed all tasks for this period! 🎉</p>
                  <p className="countdown">Your next task period is available in {getCooldownCountdown()}.</p>

                  <button className="disabled-task-button" disabled={true}>
                    Complete My Task
                  </button>

                  <Link to="/instructions" className="complete-task-button">
                    Instructions
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="tasks-left">
                    {remainingTasks > 0
                      ? `You have ${remainingTasks} task(s) left to complete this week.`
                      : "You have completed all tasks for this week! 🎉"}
                  </p>

                  {taskCompletedToday ? (
                    <>
                      <p className="countdown">Your next task is available in {formatCountdownDaily(countdown)}.</p>
                      <button className="disabled-task-button" disabled={true}>
                        Complete My Task
                      </button>

                      <Link to="/instructions" className="complete-task-button">
                        Instructions
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/memory-vault-start-instructions" className="complete-task-button">
                        Complete My Task
                      </Link>

                      <Link to="/instructions" className="complete-task-button">
                        Instructions
                      </Link>
                    </>
                  )}
                </div>
              )}

              <div className="task-progress">
                <h3 className="progress-bar-title">This Week's Task Progress</h3>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${(numCompletedDays / 7) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHomePage;
