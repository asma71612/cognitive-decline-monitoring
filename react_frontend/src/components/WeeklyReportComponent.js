import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./WeeklyReportComponent.css";
import PlotDescriptions from "./PlotDescriptions";
import BarChart from "./BarChart";
import carouselNextImg from "../assets/carousel-next-button.svg";

const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
};
const getReports = async (effectivePatientId, filterDates) => {
    console.log("Effective Patient ID:", effectivePatientId);

    const reportsCollection = collection(
        db,
        `users/${effectivePatientId}/dailyReportsSeeMore`
    );
    const reportSnapshots = await getDocs(reportsCollection);

    console.log("Fetched reports:", reportSnapshots.docs.length);

    // Parse filterDates into start and end date ranges
    const dateRanges = filterDates.map(range => {
        const [startDateStr, endDateStr] = range.split(' - ');

        // Function to parse month/day/year into a Date object
        const parseDate = (dateStr) => {
            const [monthStr, day, year] = dateStr.trim().split(' ');
            const month = new Date(`${monthStr} 1, 2020`).getMonth(); // Convert month to 0-indexed
            return new Date(year, month, parseInt(day)); // Return Date object for start or end date
        };

        const startDate = parseDate(startDateStr);
        const endDate = parseDate(endDateStr);

        return { startDate, endDate };
    });

    console.log("Parsed Date Ranges:", dateRanges);

    return reportSnapshots.docs
        .filter(reportDoc => {
            const dateKey = reportDoc.id; // The reportDoc ID represents the date (MM-DD-YYYY)
            console.log("Checking reportDoc.id:", dateKey);

            // Convert the report date string (MM-DD-YYYY) to a Date object
            const [month, day, year] = dateKey.split("-").map(Number);
            const reportDate = new Date(year, month - 1, day); // MM-DD-YYYY to Date object

            // Check if the report date falls within any of the date ranges
            return dateRanges.some(({ startDate, endDate }) => {
                return reportDate >= startDate && reportDate <= endDate;
            });
        })
        .map(reportDoc => {
            const dateKey = reportDoc.id;
            console.log("Date Key (ID):", dateKey);
            const [month, , year] = dateKey.split("-");
            console.log("Parsed month:", month, "year:", year);

            const monthYear = new Date(year, month - 1).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
            });

            return { dateKey, monthYear };
        });
};




const WeeklyReportComponent = ({ patientId }) => {
    const effectivePatientId = patientId || localStorage.getItem("userId");
    const [selectedWeek, setSelectedWeek] = useState("");
    const [selectedGame, setSelectedGame] = useState("");
    const [patientData, setPatientData] = useState(null);
    const [selectedDates, setSelectedDates] = useState([]);
    const [filteredDates, setFilteredDates] = useState([]);
    const [memoryVaultRecallScoreData, setMemoryVaultRecallScoreData] = useState({});
    const [naturesGazeReactionTimeData, setNaturesGazeReactionTimeData] =
        useState({});
    const [naturesGazeSopData, setNaturesGazeSopData] = useState({});
    const [saccadeDurationData, setSaccadeDurationData] = useState({});
    const [fixationAccuracyData, setFixationAccuracyData] = useState({});
    const [saccadeDirectionErrorData, setSaccadeDirectionErrorData] = useState(
        {}
    );
    const [speakingTimeData, setSpeakingTimeData] = useState({});
    const [pauseCountData, setPauseCountData] = useState({});
    const [pauseDurationData, setPauseDurationData] = useState({});
    const [lexNounData, setLexNounData] = useState({});
    const [lexClosedClassData, setLexClosedClassData] = useState({});
    const [lexFillerData, setLexFillerData] = useState({});
    const [lexOpenClassData, setLexOpenClassData] = useState({});
    const [lexVerbData, setLexVerbData] = useState({});
    const [lexicalIndex, setLexicalIndex] = useState(0);
    const [metricsIndex, setMetricsIndex] = useState(0);
    const [structuralMeanData, setStructuralMeanData] = useState({});
    const [structuralSentenceData, setStructuralSentenceData] = useState({});
    const [structuralIndex, setStructuralIndex] = useState(0);
    const [fluencyRevisionRatioData, setFluencyRevisionRatioData] = useState({});
    const [fluencyWordsPerMinData, setFluencyWordsPerMinData] = useState({});
    const [fluencyStutterCountData, setFluencyStutterCountData] = useState({});
    const [fluencyIndex, setFluencyIndex] = useState(0);
    const [semanticLexFreqData, setSemanticLexFreqData] = useState({});
    const [semanticEfficiencyData, setSemanticEfficiencyData] = useState({});
    const [semanticIdeaDensityData, setSemanticIdeaDensityData] = useState({});
    const [semanticIndex, setSemanticIndex] = useState(0);

    useEffect(() => {
        //Clear all datasets on game change
        setMemoryVaultRecallScoreData({});
        setNaturesGazeReactionTimeData({});
        setNaturesGazeSopData({});
        if (selectedGame !== "naturesGaze") {
          setSaccadeDurationData({});
          setFixationAccuracyData({});
          setSaccadeDirectionErrorData({});
        }
        if (selectedGame !== "processQuest" && selectedGame !== "sceneDetective") {
          setSpeakingTimeData({});
          setPauseCountData({});
          setPauseDurationData({});
          setLexNounData({});
          setLexClosedClassData({});
          setLexFillerData({});
          setLexOpenClassData({});
          setLexVerbData({});
          setStructuralMeanData({});
          setStructuralSentenceData({});
          setFluencyRevisionRatioData({});
          setFluencyWordsPerMinData({});
          setFluencyStutterCountData({});
          setSemanticLexFreqData({});
          setSemanticEfficiencyData({});
          setSemanticIdeaDensityData({});
        }
    }, [selectedGame]);
    
    useEffect(() => {
        if (selectedGame === "processQuest" || selectedGame === "sceneDetective") {
          setLexicalIndex(0);
        }
    }, [selectedGame]);
    
    useEffect(() => {
        if (selectedGame === "processQuest" || selectedGame === "sceneDetective") {
          setMetricsIndex(0);
        }
    }, [selectedGame]);
    
    useEffect(() => {
        if (selectedGame === "processQuest" || selectedGame === "sceneDetective") {
          setStructuralIndex(0);
        }
    }, [selectedGame]);
    
    useEffect(() => {
        if (selectedGame === "processQuest" || selectedGame === "sceneDetective") {
          setFluencyIndex(0);
        }
    }, [selectedGame]);
    
    useEffect(() => {
        if (selectedGame === "processQuest" || selectedGame === "sceneDetective") {
          setSemanticIndex(0);
        }
    }, [selectedGame]);
    

    // Fetch patient data
    useEffect(() => {
        if (!effectivePatientId) return;
        
        const fetchPatientData = async () => {
            try {
                const patientDoc = await getDoc(doc(db, "users", effectivePatientId));
                if (patientDoc.exists()) setPatientData(patientDoc.data());
            } catch (error) {
                console.error("Error fetching patient data:", error);
            }
        };
        const fetchAvailableDates = async () => {
            try {
                const snapshot = await getDocs(
                    collection(db, `users/${effectivePatientId}/dailyReportsSeeMore`)
                );
                const fetchedDates = snapshot.docs.map((doc) => doc.id);

                // Convert to Date objects & sort
                const sortedDates = fetchedDates.map(dateStr => {
                    const dateParts = dateStr.split("-");
                    if (dateParts.length !== 3 || dateParts.some(part => isNaN(part))) {
                        throw new Error(`Invalid date format: ${dateStr}`);
                    }
                    const [month, day, year] = dateParts;
                    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
                }).sort((a, b) => a - b);

                // Group into weekly ranges
                let weekGroups = [];
                let currentGroup = [];
                sortedDates.forEach(date => {
                    if (currentGroup.length === 0) {
                        currentGroup.push(date);
                    } else {
                        const diffInDays = (date - currentGroup[0]) / (1000 * 60 * 60 * 24);
                        const diffInWeeks = Math.floor(diffInDays / 7);
                        if (diffInWeeks === 0) {
                            currentGroup.push(date);
                        } else {
                            if (currentGroup.length >= 2) {
                                weekGroups.push([...currentGroup]);
                            }
                            currentGroup = [date];
                        }
                    }
                });

                if (currentGroup.length >= 2) {
                    weekGroups.push(currentGroup);
                }

                const uniqueWeeks = weekGroups.map(week => {
                    const start = week[0];
                    const end = week[week.length - 1];
                    return {
                        label: `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${start.getFullYear()} - ` +
                               `${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${end.getFullYear()}`,
                        dates: week
                    };
                });

                // Update selected dates
                setSelectedDates(uniqueWeeks.map(week => week.label));
            } catch (error) {
                console.error("Error fetching available dates:", error);
            }
        };  
        
        fetchPatientData();
        fetchAvailableDates();
    }, [effectivePatientId]);
    
    // Filter the selected dates
    useEffect(() => {
        if (selectedWeek) {
            // Filter the selected week based on the selected week label
            const selectedWeekDates = selectedDates.filter(week => week === selectedWeek);
            setFilteredDates(selectedWeekDates);
        }
    }, [selectedWeek, selectedDates]);

    //Fetching Rpeorting Data
    // naturesGaze Reaction Time fetching
    useEffect(() => {
        if (!effectivePatientId || selectedGame !== "naturesGaze" || !filteredDates.length) return;
        (async () => {
            try {
                const dataPoints = {
                    antiGap: {},
                    proGap: {},
                    proOverlap: {},
                    antiOverlap: {},
                };
                const reports = await getReports(effectivePatientId, filteredDates);
                for (const { dateKey } of reports) {
                    const reactionDocRef = doc(
                        db,
                        `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/naturesGaze/reactionTime`
                    );
                    const reactionDoc = await getDoc(reactionDocRef);
                    if (reactionDoc.exists()) {
                        const data = reactionDoc.data();
    
                        // Convert dateKey (MM-DD-YYYY) into a Date object
                        const [month, day, year] = dateKey.split('-').map(Number);
                        const formattedDate = new Date(year, month - 1, day);
    
                        // Format the date into "Jan 1, 2025"
                        const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                            month: "short", // Abbreviated month name (e.g., Jan, Feb)
                            day: "numeric", // Numeric day
                            year: "numeric", // Full year (e.g., 2025)
                        });
    
                        // Store data by fullDateKey (formatted as "Jan 1, 2025")
                        Object.entries(data).forEach(([series, value]) => {
                            if (value != null && dataPoints.hasOwnProperty(series)) {
                                if (!dataPoints[series][fullDateKey]) {
                                    dataPoints[series][fullDateKey] = [];
                                }
                                dataPoints[series][fullDateKey].push(value);
                            }
                        });
                    }
                }
                setNaturesGazeReactionTimeData(dataPoints);
            } catch (error) {
                console.error("Error fetching reaction time data:", error);
            }
        })();
    }, [selectedGame, effectivePatientId, filteredDates]);
    
    
    // naturesGaze Saccade Omission Percentages fetching
    useEffect(() => {
        if (!effectivePatientId || selectedGame !== "naturesGaze" || !filteredDates.length) return;
        (async () => {
          try {
            const dataPoints = {
              antiGap: {},
              proGap: {},
              proOverlap: {},
              antiOverlap: {},
            };
            const reports = await getReports(effectivePatientId, filteredDates);
            for (const { dateKey } of reports) {
              const saccadeDocRef = doc(
                db,
                `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/naturesGaze/saccadeOmissionPercentages`
              );
              const saccadeDoc = await getDoc(saccadeDocRef);
              if (saccadeDoc.exists()) {
                const data = saccadeDoc.data();
                // Convert dateKey (MM-DD-YYYY) into a Date object
                const [month, day, year] = dateKey.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day);

                // Format the date into "Jan 1, 2025"
                const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                    month: "short", // Abbreviated month name (e.g., Jan, Feb)
                    day: "numeric", // Numeric day
                    year: "numeric", // Full year (e.g., 2025)
                });

                Object.entries(data).forEach(([series, value]) => {
                  if (value != null && dataPoints.hasOwnProperty(series)) {
                    if (!dataPoints[series][fullDateKey])
                      dataPoints[series][fullDateKey] = [];
                    dataPoints[series][fullDateKey].push(value);
                  }
                });
              }
            }
            setNaturesGazeSopData(dataPoints);
          } catch (error) {
            console.error("Error fetching saccade omission data:", error);
          }
        })();
    }, [selectedGame, effectivePatientId, filteredDates]);
    
    // naturesGaze Saccade Duration fetching
    useEffect(() => {
        if (!effectivePatientId || selectedGame !== "naturesGaze" || !filteredDates.length) return;
        (async () => {
          try {
            const durationPoints = {
              antiGap: {},
              proGap: {},
              antiOverlap: {},
              proOverlap: {},
            };
            const reports = await getReports(effectivePatientId, filteredDates);
            for (const { dateKey } of reports) {
              const sdDocRef = doc(
                db,
                `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/naturesGaze/saccadeDuration`
              );
              const durationsCollection = collection(sdDocRef, "durations");
              const durationsSnapshots = await getDocs(durationsCollection);
              durationsSnapshots.docs.forEach((docSnap) => {
                const data = docSnap.data();
                const seriesKey = docSnap.id;
                // Convert dateKey (MM-DD-YYYY) into a Date object
                const [month, day, year] = dateKey.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day);

                // Format the date into "Jan 1, 2025"
                const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                    month: "short", // Abbreviated month name (e.g., Jan, Feb)
                    day: "numeric", // Numeric day
                    year: "numeric", // Full year (e.g., 2025)
                });

                if (
                  data.Duration != null &&
                  durationPoints[seriesKey] !== undefined
                ) {
                  if (!durationPoints[seriesKey][fullDateKey]) {
                    durationPoints[seriesKey][fullDateKey] = [];
                  }
                  durationPoints[seriesKey][fullDateKey].push(data.Duration);
                }
              });
            }
            setSaccadeDurationData(durationPoints);
          } catch (error) {
            console.error("Error fetching saccade duration data:", error);
          }
        })();
    }, [selectedGame, effectivePatientId, filteredDates]);
    // Saccade Direction Error fetching (4-series)
    useEffect(() => {
        if (!effectivePatientId || selectedGame !== "naturesGaze" || !filteredDates.length) return;
        (async () => {
          try {
            const errorPoints = {
              antiGap: {},
              proGap: {},
              antiOverlap: {},
              proOverlap: {},
            };
            const reports = await getReports(effectivePatientId, filteredDates);
            for (const { dateKey } of reports) {
              const errorDocRef = doc(
                db,
                `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/naturesGaze/saccadeDirectionError`
              );
              const errorsCollection = collection(errorDocRef, "errors");
              const errorsSnapshot = await getDocs(errorsCollection);
              errorsSnapshot.docs.forEach((docSnap) => {
                const data = docSnap.data();
                const seriesKey = docSnap.id; // expected: antiGap, proGap, antiOverlap, proOverlap
                // Convert dateKey (MM-DD-YYYY) into a Date object
                const [month, day, year] = dateKey.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day);

                // Format the date into "Jan 1, 2025"
                const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                    month: "short", // Abbreviated month name (e.g., Jan, Feb)
                    day: "numeric", // Numeric day
                    year: "numeric", // Full year (e.g., 2025)
                });

                if (
                  data.PercentError != null &&
                  errorPoints[seriesKey] !== undefined
                ) {
                  if (!errorPoints[seriesKey][fullDateKey]) {
                    errorPoints[seriesKey][fullDateKey] = [];
                  }
                  errorPoints[seriesKey][fullDateKey].push(data.PercentError);
                }
              });
            }
            setSaccadeDirectionErrorData(errorPoints);
          } catch (error) {
            console.error("Error fetching saccade direction error data:", error);
          }
        })();
    }, [selectedGame, effectivePatientId, filteredDates]);
    // Fixation Accuracy fetching (2-series: gap and overlap)
    useEffect(() => {
        if (!effectivePatientId || selectedGame !== "naturesGaze" || !filteredDates.length) return;
        (async () => {
          try {
            const accuracyPoints = {
              gap: {},
              overlap: {},
            };
            const reports = await getReports(effectivePatientId, filteredDates);
            for (const { dateKey } of reports) {
              const fixAccDocRef = doc(
                db,
                `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/naturesGaze/fixationAccuracy`
              );
              const accuracyCollection = collection(
                fixAccDocRef,
                "landingAccuracy"
              );
              const accuracySnapshots = await getDocs(accuracyCollection);
              accuracySnapshots.docs.forEach((docSnap) => {
                const data = docSnap.data();
                const seriesKey = docSnap.id; // expected: "gap" or "overlap"
                // Convert dateKey (MM-DD-YYYY) into a Date object
                const [month, day, year] = dateKey.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day);

                // Format the date into "Jan 1, 2025"
                const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                    month: "short", // Abbreviated month name (e.g., Jan, Feb)
                    day: "numeric", // Numeric day
                    year: "numeric", // Full year (e.g., 2025)
                });

                if (
                  data.LandingAccuracy != null &&
                  accuracyPoints[seriesKey] !== undefined
                ) {
                  if (!accuracyPoints[seriesKey][fullDateKey]) {
                    accuracyPoints[seriesKey][fullDateKey] = [];
                  }
                  accuracyPoints[seriesKey][fullDateKey].push(data.LandingAccuracy);
                }
              });
            }
            setFixationAccuracyData(accuracyPoints);
          } catch (error) {
            console.error("Error fetching fixation accuracy data:", error);
          }
        })();
    }, [selectedGame, effectivePatientId , filteredDates]);
    
    // Process Quest Speaking Time fetching
    const isTemporalGame =
        selectedGame === "processQuest" || selectedGame === "sceneDetective" || !filteredDates.length;
    
    // MemoryVault Recall Score fetching
    useEffect(() => {
        if (!effectivePatientId || selectedGame !== "memoryVault" || !filteredDates.length) return;
        (async () => {
            try {
                const dataPoints = {};
                console.log("Fetching MemoryVault Recall Scores...", effectivePatientId, filteredDates);
                const reports = await getReports(effectivePatientId, filteredDates);
                console.log("Fetched Reports:", reports); // Log reports
                for (const { dateKey } of reports) {
                    const mvCollection = collection(
                        db,
                        `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/memoryVault`
                    );
                    const mvSnapshots = await getDocs(mvCollection);
                    const [month, day, year] = dateKey.split('-').map(Number);
                    const formattedDate = new Date(year, month - 1, day);

                    // Format the date into "Jan 1, 2025"
                    const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                        month: "short", // Abbreviated month name (e.g., Jan, Feb)
                        day: "numeric", // Numeric day
                        year: "numeric", // Full year (e.g., 2025)
                    });
                    console.log(`Fetched memoryVault for ${fullDateKey}:`, mvSnapshots.docs.length); // Log snapshot count
                    for (const mvDoc of mvSnapshots.docs) {
                        const { Presented, Recalled } = mvDoc.data();
                        const presentedWords = Presented.split(",").map((w) => w.trim());
                        const recalledWords = Recalled.split(",").map((w) => w.trim());
                        
                        let sessionPoints = [];
                        for (let i = 0; i < presentedWords.length; i++) {
                            const response = await fetch(
                                "http://127.0.0.1:5000/compute-points",
                                {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        presented_word: presentedWords[i],
                                        recalled_word: recalledWords[i],
                                    }),
                                }
                            );
                            const { points } = await response.json();
                            sessionPoints.push(points);
                        }
                        if (!dataPoints[fullDateKey]) {
                            dataPoints[fullDateKey] = [];
                        }
                        dataPoints[fullDateKey].push(...sessionPoints);
                    }
                }
                console.log("Final dataPoints:", dataPoints); // Log final dataPoints
                setMemoryVaultRecallScoreData(dataPoints);
            } catch (error) {
                console.error("Error fetching or computing points:", error);
            }
        })();
    }, [effectivePatientId, selectedGame, filteredDates]);
    
    useEffect(() => {
        if (!effectivePatientId || !isTemporalGame || !filteredDates.length) return;
        (async () => {
          try {
            const dataPoints = {};
            const reports = await getReports(effectivePatientId, filteredDates);
            for (const { dateKey } of reports) {
              const tpDocRef = doc(
                db,
                `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/temporalCharacteristics`
              );
              const tpDoc = await getDoc(tpDocRef);
              console.log(
                "tpDoc for",
                dateKey,
                "exists:",
                tpDoc.exists(),
                "data:",
                tpDoc.data()
              );
              if (tpDoc.exists()) {
                const data = tpDoc.data();
                const speakingTime = data.SpeakingTime;
                const [month, day, year] = dateKey.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day);

                // Format the date into "Jan 1, 2025"
                const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                    month: "short", // Abbreviated month name (e.g., Jan, Feb)
                    day: "numeric", // Numeric day
                    year: "numeric", // Full year (e.g., 2025)
                });
                if (typeof speakingTime === "string") {
                  const [minStr, secStr] = speakingTime.split(":");
                  const minutes = parseInt(minStr, 10);
                  const seconds = parseInt(secStr, 10) || 0;
                  const totalSec = minutes * 60 + seconds;
                  console.log(
                    "Converted SpeakingTime:",
                    speakingTime,
                    "=>",
                    totalSec,
                    "seconds"
                  );
                  if (!dataPoints[fullDateKey]) dataPoints[fullDateKey] = [];
                  dataPoints[fullDateKey].push(totalSec);
                } else if (typeof speakingTime === "number") {
                  // new branch
                  if (!dataPoints[fullDateKey]) dataPoints[fullDateKey] = [];
                  dataPoints[fullDateKey].push(speakingTime);
                } else {
                  console.warn(
                    "SpeakingTime is not a string for",
                    dateKey,
                    ":",
                    speakingTime
                  );
                }
              }
            }
            console.log("Final Speaking Time dataPoints:", dataPoints);
            setSpeakingTimeData(dataPoints);
          } catch (error) {
            console.error("Error fetching Speaking Time data:", error);
          }
        })();
    }, [selectedGame, effectivePatientId, isTemporalGame, filteredDates]);
    
    // New effect: Fetch Process Quest Pause Count data
    useEffect(() => {
        if (!effectivePatientId || !isTemporalGame || !filteredDates.length) return;
        (async () => {
          try {
            const dataPoints = {};
            const reports = await getReports(effectivePatientId, filteredDates);
            
            for (const { dateKey } of reports) {
              const pausesCollection = collection(
                db,
                `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/temporalCharacteristics/Pauses`
              );
              const pausesSnapshots = await getDocs(pausesCollection);
              const count = pausesSnapshots.docs.length; // number of pause documents
              const [month, day, year] = dateKey.split('-').map(Number);
              const formattedDate = new Date(year, month - 1, day);

              // Format the date into "Jan 1, 2025"
              const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                  month: "short", // Abbreviated month name (e.g., Jan, Feb)
                  day: "numeric", // Numeric day
                  year: "numeric", // Full year (e.g., 2025)
              });
              if (!dataPoints[fullDateKey]) dataPoints[fullDateKey] = [];
              dataPoints[fullDateKey].push(count);
            }
            console.log("Final Pause Count dataPoints:", dataPoints);
            setPauseCountData(dataPoints);
          } catch (error) {
            console.error("Error fetching Pause Count data:", error);
          }
        })();
    }, [selectedGame, effectivePatientId, isTemporalGame, filteredDates]);
    
    // New effect: Fetch Process Quest Pause Duration data
    useEffect(() => {
        if (!effectivePatientId || !isTemporalGame || !filteredDates.length) return;
        (async () => {
          try {
            const dataPoints = {};
            const reports = await getReports(effectivePatientId, filteredDates);
            for (const { dateKey } of reports) {
              const pausesCollection = collection(
                db,
                `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/temporalCharacteristics/Pauses`
              );
              const pausesSnapshots = await getDocs(pausesCollection);
              pausesSnapshots.docs.forEach((pauseDoc) => {
                const data = pauseDoc.data();
                if (data.StartTime && data.EndTime) {
                    // Convert StartTime & EndTime ("MM:SS") to seconds
                    const [startMin, startSec] = data.StartTime.split(":").map((x) =>
                        parseInt(x, 10)
                    );
                    const [endMin, endSec] = data.EndTime.split(":").map((x) =>
                        parseInt(x, 10)
                    );
                    const startTotal = startMin * 60 + startSec;
                    const endTotal = endMin * 60 + endSec;
                    const duration = endTotal - startTotal;
                    const [month, day, year] = dateKey.split('-').map(Number);
                    const formattedDate = new Date(year, month - 1, day);

                    // Format the date into "Jan 1, 2025"
                    const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                        month: "short", // Abbreviated month name (e.g., Jan, Feb)
                        day: "numeric", // Numeric day
                        year: "numeric", // Full year (e.g., 2025)
                    });
                    if (!dataPoints[fullDateKey]) dataPoints[fullDateKey] = [];
                        dataPoints[fullDateKey].push(duration);
                }
              });
            }
            console.log("Final Pause Duration dataPoints:", dataPoints);
            setPauseDurationData(dataPoints);
          } catch (error) {
            console.error("Error fetching Pause Duration data:", error);
          }
        })();
    }, [selectedGame, effectivePatientId, isTemporalGame, filteredDates]);
    
    // New effect: Fetch Process Quest Lexical Features data
    useEffect(() => {
        if (!effectivePatientId || !isTemporalGame || !filteredDates.length) return;
        (async () => {
          try {
            const nounData = {};
            const closedClassData = {};
            const fillerData = {};
            const openClassData = {};
            const verbData = {};
            const reports = await getReports(effectivePatientId, filteredDates);
            for (const { dateKey } of reports) {
              const lexicalDocRef = doc(
                db,
                `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/lexicalFeatures`
              );
              const lexicalDoc = await getDoc(lexicalDocRef);
              if (lexicalDoc.exists()) {
                const data = lexicalDoc.data();
                const nounCount = Number(data.Noun);
                const closedClassCount = Number(data.ClosedClass);
                const fillerCount = Number(data.Filler);
                const openClassCount = Number(data.OpenClass);
                const verbCount = Number(data.Verb);
                const [month, day, year] = dateKey.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day);

                // Format the date into "Jan 1, 2025"
                const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                    month: "short", // Abbreviated month name (e.g., Jan, Feb)
                    day: "numeric", // Numeric day
                    year: "numeric", // Full year (e.g., 2025)
                });
                if (!nounData[fullDateKey]) nounData[fullDateKey] = [];
                if (!closedClassData[fullDateKey]) closedClassData[fullDateKey] = [];
                if (!fillerData[fullDateKey]) fillerData[fullDateKey] = [];
                if (!openClassData[fullDateKey]) openClassData[fullDateKey] = [];
                if (!verbData[fullDateKey]) verbData[fullDateKey] = [];
                nounData[fullDateKey].push(nounCount);
                closedClassData[fullDateKey].push(closedClassCount);
                fillerData[fullDateKey].push(fillerCount);
                openClassData[fullDateKey].push(openClassCount);
                verbData[fullDateKey].push(verbCount);
              }
            }
            console.log("Lexical Noun dataPoints:", nounData);
            console.log("Lexical ClosedClass dataPoints:", closedClassData);
            console.log("Lexical Filler dataPoints:", fillerData);
            console.log("Lexical OpenClass dataPoints:", openClassData);
            console.log("Lexical Verb dataPoints:", verbData);
            setLexNounData(nounData);
            setLexClosedClassData(closedClassData);
            setLexFillerData(fillerData);
            setLexOpenClassData(openClassData);
            setLexVerbData(verbData);
          } catch (error) {
            console.error("Error fetching lexical features data:", error);
          }
        })();
    }, [selectedGame, effectivePatientId, isTemporalGame, filteredDates]);
    
    // New effect: Fetch Process Quest Structural Features data
    useEffect(() => {
        if (!effectivePatientId || !isTemporalGame || !filteredDates.length) return;
        (async () => {
          try {
            const meanDataPoints = {};
            const sentenceDataPoints = {};
            const reports = await getReports(effectivePatientId, filteredDates);
            for (const { dateKey } of reports) {
              const structuralDocRef = doc(
                db,
                `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/structuralFeatures`
              );
              const structuralDoc = await getDoc(structuralDocRef);
              if (structuralDoc.exists()) {
                const data = structuralDoc.data();
                const meanValue = Number(data.MeanLengthOfOccurrence);
                const sentenceCount = Number(data.NumOfSentences);
                const [month, day, year] = dateKey.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day);

                // Format the date into "Jan 1, 2025"
                const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                    month: "short", // Abbreviated month name (e.g., Jan, Feb)
                    day: "numeric", // Numeric day
                    year: "numeric", // Full year (e.g., 2025)
                });
                if (!meanDataPoints[fullDateKey]) meanDataPoints[fullDateKey] = [];
                if (!sentenceDataPoints[fullDateKey])
                  sentenceDataPoints[fullDateKey] = [];
                meanDataPoints[fullDateKey].push(meanValue);
                sentenceDataPoints[fullDateKey].push(sentenceCount);
              }
            }
            console.log("Structural Mean dataPoints:", meanDataPoints);
            console.log("Structural Sentence dataPoints:", sentenceDataPoints);
            setStructuralMeanData(meanDataPoints);
            setStructuralSentenceData(sentenceDataPoints);
          } catch (error) {
            console.error("Error fetching structural features data:", error);
          }
        })();
    }, [selectedGame, effectivePatientId, isTemporalGame, filteredDates]);
    
    // New effect: Fetch Process Quest Fluency Metrics data
    useEffect(() => {
        if (!effectivePatientId || !isTemporalGame || !filteredDates.length) return;
        (async () => {
          try {
            const revisionData = {};
            const wordsData = {};
            const stutterData = {};
            const reports = await getReports(effectivePatientId, filteredDates);
            for (const { dateKey } of reports) {
              const fluencyDocRef = doc(
                db,
                `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/fluencyMetrics`
              );
              const fluencyDoc = await getDoc(fluencyDocRef);
              const [month, day, year] = dateKey.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day);

                // Format the date into "Jan 1, 2025"
                const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                    month: "short", // Abbreviated month name (e.g., Jan, Feb)
                    day: "numeric", // Numeric day
                    year: "numeric", // Full year (e.g., 2025)
                });
              if (fluencyDoc.exists()) {
                const data = fluencyDoc.data();
                const revision = Number(data.RevisionRatio);
                const wordsPerMin = Number(data.WordsPerMin);
                if (!revisionData[fullDateKey]) revisionData[fullDateKey] = [];
                if (!wordsData[fullDateKey]) wordsData[fullDateKey] = [];
                revisionData[fullDateKey].push(revision);
                wordsData[fullDateKey].push(wordsPerMin);
              }
              const stuttersCollection = collection(
                db,
                `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/fluencyMetrics/Stutters`
              );
              const stuttersSnapshots = await getDocs(stuttersCollection);
              if (!stutterData[fullDateKey]) stutterData[fullDateKey] = [];
              // Push count of stutter documents
              stutterData[fullDateKey].push(stuttersSnapshots.docs.length);
            }
            console.log("Fluency Revision Ratio:", revisionData);
            console.log("Fluency Words Per Min:", wordsData);
            console.log("Fluency Stutter Count:", stutterData);
            setFluencyRevisionRatioData(revisionData);
            setFluencyWordsPerMinData(wordsData);
            setFluencyStutterCountData(stutterData);
          } catch (error) {
            console.error("Error fetching fluency metrics data:", error);
          }
        })();
    }, [selectedGame, effectivePatientId, isTemporalGame, filteredDates]);
    
    // New effect: Fetch Process Quest Semantic Features data
    useEffect(() => {
        if (!effectivePatientId || !isTemporalGame || !filteredDates.length) return;
        (async () => {
          try {
            const lexFreqData = {};
            const efficiencyData = {};
            const ideaDensityData = {};
            const reports = await getReports(effectivePatientId, filteredDates);
            for (const { dateKey } of reports) {
              const semanticDocRef = doc(
                db,
                `users/${effectivePatientId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/semanticFeatures`
              );
              const semanticDoc = await getDoc(semanticDocRef);
              if (semanticDoc.exists()) {
                const data = semanticDoc.data();
                const lexFreq = Number(data.LexicalFrequencyOfNouns);
                const efficiency = Number(data.SemanticEfficiency);
                const ideaDensity = Number(data.SemanticIdeaDensity);
                const [month, day, year] = dateKey.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day);

                // Format the date into "Jan 1, 2025"
                const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                    month: "short", // Abbreviated month name (e.g., Jan, Feb)
                    day: "numeric", // Numeric day
                    year: "numeric", // Full year (e.g., 2025)
                });
                if (!lexFreqData[fullDateKey]) lexFreqData[fullDateKey] = [];
                if (!efficiencyData[fullDateKey]) efficiencyData[fullDateKey] = [];
                if (!ideaDensityData[fullDateKey]) ideaDensityData[fullDateKey] = [];
                lexFreqData[fullDateKey].push(lexFreq);
                efficiencyData[fullDateKey].push(efficiency);
                ideaDensityData[fullDateKey].push(ideaDensity);
              }
            }
            console.log("Semantic LexFreq dataPoints:", lexFreqData);
            console.log("Semantic Efficiency dataPoints:", efficiencyData);
            console.log("Semantic Idea Density dataPoints:", ideaDensityData);
            setSemanticLexFreqData(lexFreqData);
            setSemanticEfficiencyData(efficiencyData);
            setSemanticIdeaDensityData(ideaDensityData);
          } catch (error) {
            console.error("Error fetching semantic features data:", error);
          }
        })();
    }, [selectedGame, effectivePatientId, isTemporalGame, filteredDates]);

    return (
        <div className="weekly-report-content">
            <div className="header-container">
                <h1>Weekly Reports {selectedWeek && `for ${selectedWeek}`}</h1>
                <div className="date-filter">
                    <select onChange={(e) => setSelectedWeek(e.target.value)} value={selectedWeek}>
                        <option value="">Select a Week</option>
                        {selectedDates.map((week, index) => (
                            <option key={index} value={week}>
                                {week}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {patientData && (
                <div className="patient-info-box">
                    <h2>
                        {patientData.firstName} {patientData.lastName}{" "}
                        {patientData.dob && patientData.sex && (
                            <span>
                                ({calculateAge(patientData.dob)}, {patientData.sex})
                            </span>
                        )}
                    </h2>
                    <p>
                        <strong>User ID:</strong> {effectivePatientId}
                    </p>
                    <p>
                        <strong>Date of Birth:</strong> {patientData.dob}
                    </p>
                </div>
            )}
            {/* Show the game buttons only if a week is selected */}
            {selectedWeek && (
                <div className="buttons-container">
                    <button className={`report-button ${selectedGame === "naturesGaze" ? "active" : ""}`} onClick={() => setSelectedGame("naturesGaze")}>
                        Natures Gaze I/II
                    </button>
                    <button className={`report-button ${selectedGame === "memoryVault" ? "active" : ""}`} onClick={() => setSelectedGame("memoryVault")}>
                        Memory Vault
                    </button>
                    <button className={`report-button ${selectedGame === "processQuest" ? "active" : ""}`} onClick={() => setSelectedGame("processQuest")}>
                        Process Quest
                    </button>
                    <button className={`report-button ${selectedGame === "sceneDetective" ? "active" : ""}`} onClick={() => setSelectedGame("sceneDetective")}>
                        Scene Detective
                    </button>
                </div>
            )}
            
            {selectedGame === "memoryVault" && (
                <>
                    {console.log("Memory Vault Recall Score Data:", memoryVaultRecallScoreData)}
                    <BarChart 
                        rawData={memoryVaultRecallScoreData}
                        plotTitle="Recall Score"
                        displaySubtitle={false}
                        xAxisLabel="Date"
                        yAxisLabel="Points"
                        seriesLabels={{
                            text: "Text Word",
                            audio: "Audio Word",
                            picture: "Picture Word",
                        }}
                        memoryVault={true}
                        infoDescription={PlotDescriptions["Recall Score"]}
                    />
                </>
            )}
            {selectedGame === "naturesGaze" && (
                <>
                    {console.log("reacion Score Data:", naturesGazeReactionTimeData)}
                    <BarChart
                        rawData={naturesGazeReactionTimeData}
                        plotTitle="Reaction Time"
                        displaySubtitle={false}
                        xAxisLabel="Date"
                        yAxisLabel="Time (seconds)"
                        seriesLabels={{
                            antiGap: "Anti-Saccade, Gap Task",
                            proGap: "Pro-Saccade, Gap Task",
                            antiOverlap: "Anti-Saccade, Overlap Task",
                            proOverlap: "Pro-Saccade, Overlap Task",
                        }}
                        multiSeries={true}
                        infoDescription={PlotDescriptions["Reaction Time"]}
                    />
                    <BarChart
                        rawData={naturesGazeSopData}
                        plotTitle="Saccade Omission Percentages"
                        displaySubtitle={false}
                        xAxisLabel="Date"
                        yAxisLabel="Percentage (%)"
                        seriesLabels={{
                          antiGap: "Anti-Saccade, Gap Task",
                          proGap: "Pro-Saccade, Gap Task",
                          antiOverlap: "Anti-Saccade, Overlap Task",
                          proOverlap: "Pro-Saccade, Overlap Task",
                        }}
                        multiSeries={true}
                        infoDescription={PlotDescriptions["Saccade Omission Percentages"]}
                    />
                    <BarChart
                        rawData={saccadeDurationData}
                        plotTitle="Saccade Durations"
                        displaySubtitle={false}
                        xAxisLabel="Date"
                        yAxisLabel="Duration (seconds)"
                        seriesLabels={{
                          antiGap: "Anti-Saccade, Gap Task",
                          proGap: "Pro-Saccade, Gap Task",
                          antiOverlap: "Anti-Saccade, Overlap Task",
                          proOverlap: "Pro-Saccade, Overlap Task",
                        }}
                        multiSeries={true}
                        infoDescription={PlotDescriptions["Saccade Durations"]}
                    />
                    <BarChart
                        rawData={saccadeDirectionErrorData}
                        plotTitle="Saccade Direction Error"
                        displaySubtitle={false}
                        xAxisLabel="Date"
                        yAxisLabel="Percent Error (%)"
                        seriesLabels={{
                          antiGap: "Anti-Saccade, Gap Task",
                          proGap: "Pro-Saccade, Gap Task",
                          antiOverlap: "Anti-Saccade, Overlap Task",
                          proOverlap: "Pro-Saccade, Overlap Task",
                        }}
                        multiSeries={true}
                        infoDescription={PlotDescriptions["Saccade Direction Error"]}
                    />
                    <BarChart
                        rawData={fixationAccuracyData}
                        plotTitle="Fixation Accuracy"
                        displaySubtitle={false}
                        xAxisLabel="Date"
                        yAxisLabel="Landing Accuracy (degrees)"
                        seriesLabels={{ gap: "Gap Task", overlap: "Overlap Task" }}
                        multiSeries={true}
                        infoDescription={PlotDescriptions["Fixation Accuracy"]}
                    />
                </>
            )}
            {(selectedGame === "processQuest" ||
                selectedGame === "sceneDetective") && (
                <>
                    {(() => {
                        const metricsConfigs = [
                            { 
                                subtitle: "Speaking Time",
                                rawData: speakingTimeData,
                                yAxisLabel: "Time (seconds)",
                            },
                            {
                                subtitle: "Pause Count",
                                rawData: pauseCountData,
                                yAxisLabel: "Pause Count",
                            },
                            {
                                subtitle: "Average Pause Duration",
                                rawData: pauseDurationData,
                                yAxisLabel: "Pause Duration (seconds)",
                            },
                        ];
                        return (
                            <div className="carousel-wrapper">
                                <div className="metrics-carousel-container">
                                    <BarChart
                                        rawData={metricsConfigs[metricsIndex].rawData}
                                        plotTitle="Temporal Characteristics"
                                        displaySubtitle={true}
                                        subtitleText={metricsConfigs[metricsIndex].subtitle}
                                        xAxisLabel="Date"
                                        yAxisLabel={metricsConfigs[metricsIndex].yAxisLabel}
                                        infoDescription={
                                            PlotDescriptions[
                                                "Temporal Characteristics: " + selectedGame
                                            ]
                                        }
                                    />
                                    <button
                                        className="carousel-next-button"
                                        onClick={() =>
                                            setMetricsIndex(
                                                (prev) => (prev + 1) % metricsConfigs.length
                                            )
                                        }
                                    >
                                        <img src={carouselNextImg} alt="Next" />
                                    </button>
                                </div>
                                <div className="carousel-indicators">
                                    {metricsConfigs.map((_, idx) => (
                                        <span
                                            key={idx}
                                            className={
                                                idx === metricsIndex ? "indicator active" : "indicator"
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })()}
                    {(() => {
                        const structuralConfigs = [
                            {
                                subtitle: "Mean Length of Occurrence",
                                rawData: structuralMeanData,
                                yAxisLabel: "Mean Length",
                            },
                            {
                                subtitle: "Number of Sentences",
                                rawData: structuralSentenceData,
                                yAxisLabel: "Sentence Count",
                            },
                        ];
                        return (
                            <div className="carousel-wrapper">
                                <div className="structural-carousel">
                                    <BarChart
                                        rawData={structuralConfigs[structuralIndex].rawData}
                                        plotTitle="Structural Features"
                                        displaySubtitle={true}
                                        subtitleText={structuralConfigs[structuralIndex].subtitle}
                                        xAxisLabel="Date"
                                        yAxisLabel={structuralConfigs[structuralIndex].yAxisLabel}
                                        infoDescription={PlotDescriptions["Structural Features"]}
                                    />
                                    <button
                                        className="carousel-next-button"
                                        onClick={() =>
                                            setStructuralIndex(
                                                (prev) => (prev + 1) % structuralConfigs.length
                                            )
                                        }
                                    >
                                        <img src={carouselNextImg} alt="Next" />
                                    </button>
                                </div>
                                <div className="carousel-indicators">
                                {structuralConfigs.map((_, idx) => (
                                    <span
                                    key={idx}
                                    className={
                                        idx === structuralIndex
                                        ? "indicator active"
                                        : "indicator"
                                    }
                                    />
                                ))}
                                </div>
                            </div>
                        );
                    })()}
                    {(() => {
                        const fluencyConfigs = [
                        {
                            subtitle: "Word Count",
                            rawData: fluencyWordsPerMinData,
                            yAxisLabel: "Words per Minute",
                        },
                        {
                            subtitle: "Stutter Count",
                            rawData: fluencyStutterCountData,
                            yAxisLabel: "Stutter Count",
                        },
                        {
                            subtitle: "Revision Ratio",
                            rawData: fluencyRevisionRatioData,
                            yAxisLabel: "Revision Ratio",
                        },
                        ];
                        return (
                        <div className="carousel-wrapper">
                            <div className="fluency-carousel">
                            <BarChart
                                rawData={fluencyConfigs[fluencyIndex].rawData}
                                plotTitle="Fluency Metrics"
                                displaySubtitle={true}
                                subtitleText={fluencyConfigs[fluencyIndex].subtitle}
                                xAxisLabel="Date"
                                yAxisLabel={fluencyConfigs[fluencyIndex].yAxisLabel}
                                infoDescription={
                                PlotDescriptions["Fluency Metrics: " + selectedGame]
                                }
                            />
                            <button
                                className="carousel-next-button"
                                onClick={() =>
                                setFluencyIndex(
                                    (prev) => (prev + 1) % fluencyConfigs.length
                                )
                                }
                            >
                                <img src={carouselNextImg} alt="Next" />
                            </button>
                            </div>
                            <div className="carousel-indicators">
                            {fluencyConfigs.map((_, idx) => (
                                <span
                                key={idx}
                                className={
                                    idx === fluencyIndex ? "indicator active" : "indicator"
                                }
                                />
                            ))}
                            </div>
                        </div>
                        );
                    })()}
                    {(() => {
                        const lexicalConfigs = [
                        {
                            subtitle: "Noun",
                            rawData: lexNounData,
                            yAxisLabel: "Nouns Proportion (percent)",
                        },
                        {
                            subtitle: "Verb",
                            rawData: lexVerbData,
                            yAxisLabel: "Verbs Proportion (percent)",
                        },
                        {
                            subtitle: "Filler",
                            rawData: lexFillerData,
                            yAxisLabel: "Filler Proportion (percent)",
                        },
                        {
                            subtitle: "Open Class",
                            rawData: lexOpenClassData,
                            yAxisLabel: "Open Class Proportion (percent)",
                        },
                        {
                            subtitle: "Closed Class",
                            rawData: lexClosedClassData,
                            yAxisLabel: "Closed Class Proportion (percent)",
                        },
                        ];
                        return (
                        <div className="carousel-wrapper">
                            <div className="lexical-carousel">
                            <BarChart
                                rawData={lexicalConfigs[lexicalIndex].rawData}
                                plotTitle="Lexical Content"
                                displaySubtitle={true}
                                subtitleText={lexicalConfigs[lexicalIndex].subtitle}
                                xAxisLabel="Date"
                                yAxisLabel={lexicalConfigs[lexicalIndex].yAxisLabel}
                                infoDescription={
                                PlotDescriptions["Lexical Content: " + selectedGame]
                                }
                            />
                            <button
                                className="carousel-next-button"
                                onClick={() =>
                                setLexicalIndex(
                                    (prev) => (prev + 1) % lexicalConfigs.length
                                )
                                }
                            >
                                <img src={carouselNextImg} alt="Next" />
                            </button>
                            </div>
                            <div className="carousel-indicators">
                            {lexicalConfigs.map((_, idx) => (
                                <span
                                key={idx}
                                className={
                                    idx === lexicalIndex ? "indicator active" : "indicator"
                                }
                                />
                            ))}
                            </div>
                        </div>
                        );
                    })()}
                    {(() => {
                        const semanticConfigs = [
                        {
                            subtitle: "Semantic Idea Density",
                            rawData: semanticIdeaDensityData,
                            yAxisLabel: "Density",
                        },
                        {
                            subtitle: "Semantic Efficiency",
                            rawData: semanticEfficiencyData,
                            yAxisLabel: "Efficiency",
                        },
                        {
                            subtitle: "Lexical Frequency of Nouns",
                            rawData: semanticLexFreqData,
                            yAxisLabel: "Frequency",
                        },
                        ];
                        return (
                        <div className="carousel-wrapper">
                            <div className="semantic-carousel">
                            <BarChart
                                rawData={semanticConfigs[semanticIndex].rawData}
                                plotTitle="Semantic Features"
                                displaySubtitle={true}
                                subtitleText={semanticConfigs[semanticIndex].subtitle}
                                xAxisLabel="Date"
                                yAxisLabel={semanticConfigs[semanticIndex].yAxisLabel}
                                infoDescription={PlotDescriptions["Semantic Features"]}
                            />
                            <button
                                className="carousel-next-button"
                                onClick={() =>
                                setSemanticIndex(
                                    (prev) => (prev + 1) % semanticConfigs.length
                                )
                                }
                            >
                                <img src={carouselNextImg} alt="Next" />
                            </button>
                            </div>
                            <div className="carousel-indicators">
                            {semanticConfigs.map((_, idx) => (
                                <span
                                key={idx}
                                className={
                                    idx === semanticIndex ? "indicator active" : "indicator"
                                }
                                />
                            ))}
                            </div>
                        </div>
                        );
                    })()}
                </>
            )}
            <div style={{ height: "100px" }}></div>

        </div>


    );
};

export default WeeklyReportComponent;