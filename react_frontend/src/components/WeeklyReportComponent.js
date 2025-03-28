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
const getReports = async (effectiveUserId, filterDates) => {
    console.log("Effective Patient ID:", effectiveUserId);

    const reportsCollection = collection(
        db,
        `users/${effectiveUserId}/dailyReportsSeeMore`
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




const WeeklyReportComponent = ({ userId }) => {
    const effectiveUserId = userId || localStorage.getItem("userId");
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
    const [fluencyIndex, setFluencyIndex] = useState(0);
    const [semanticLexFreqData, setSemanticLexFreqData] = useState({});
    const [setSemanticEfficiencyData] = useState({});
    const [setSemanticIdeaDensityData] = useState({});
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
          setSemanticLexFreqData({});
          setSemanticEfficiencyData({});
          setSemanticIdeaDensityData({});
        }
    }, [selectedGame, setMemoryVaultRecallScoreData, setNaturesGazeReactionTimeData, setNaturesGazeSopData, setSaccadeDurationData, setFixationAccuracyData, setSaccadeDirectionErrorData, setSpeakingTimeData, setPauseCountData, setPauseDurationData, setLexNounData, setLexClosedClassData, setLexFillerData, setLexOpenClassData, setLexVerbData, setStructuralMeanData, setStructuralSentenceData, setFluencyRevisionRatioData, setFluencyWordsPerMinData, setFluencyStutterCountData, setSemanticLexFreqData, setSemanticEfficiencyData, setSemanticIdeaDensityData]);
    
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
        if (!effectiveUserId) return;
        
        const fetchPatientData = async () => {
            try {
                const patientDoc = await getDoc(doc(db, "users", effectiveUserId));
                if (patientDoc.exists()) setPatientData(patientDoc.data());
            } catch (error) {
                console.error("Error fetching patient data:", error);
            }
        };
        const fetchAvailableDates = async () => {
            try {
                const snapshot = await getDocs(
                    collection(db, `users/${effectiveUserId}/dailyReportsSeeMore`)
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
    }, [effectiveUserId]);
    
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
        if (!effectiveUserId || selectedGame !== "naturesGaze" || !filteredDates.length) return;
        (async () => {
            try {
                const dataPoints = {
                    antiGap: {},
                    proGap: {},
                    proOverlap: {},
                    antiOverlap: {},
                };
                const reports = await getReports(effectiveUserId, filteredDates);
                for (const { dateKey } of reports) {
                    const metricsDocRef = doc(
                        db,
                        `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/metrics`
                    );
                    const metricsDoc = await getDoc(metricsDocRef);
                    if (metricsDoc.exists()) {
                        const data = metricsDoc.data();

                        // Convert dateKey (MM-DD-YYYY) into a Date object
                        const [month, day, year] = dateKey.split('-').map(Number);
                        const formattedDate = new Date(year, month - 1, day);

                        // Format the date into "Jan 1, 2025"
                        const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                            month: "short", 
                            day: "numeric", 
                            year: "numeric", 
                        });

                        // Map the backend field names to the display names
                        if (data.antisaccadeGap && data.antisaccadeGap.averageReactionTime !== undefined) {
                            if (!dataPoints.antiGap[fullDateKey]) dataPoints.antiGap[fullDateKey] = [];
                            dataPoints.antiGap[fullDateKey].push(data.antisaccadeGap.averageReactionTime);
                        }
                        
                        if (data.prosaccadeGap && data.prosaccadeGap.averageReactionTime !== undefined) {
                            if (!dataPoints.proGap[fullDateKey]) dataPoints.proGap[fullDateKey] = [];
                            dataPoints.proGap[fullDateKey].push(data.prosaccadeGap.averageReactionTime);
                        }
                        
                        if (data.prosaccadeOverlap && data.prosaccadeOverlap.averageReactionTime !== undefined) {
                            if (!dataPoints.proOverlap[fullDateKey]) dataPoints.proOverlap[fullDateKey] = [];
                            dataPoints.proOverlap[fullDateKey].push(data.prosaccadeOverlap.averageReactionTime);
                        }
                        
                        if (data.antisaccadeOverlap && data.antisaccadeOverlap.averageReactionTime !== undefined) {
                            if (!dataPoints.antiOverlap[fullDateKey]) dataPoints.antiOverlap[fullDateKey] = [];
                            dataPoints.antiOverlap[fullDateKey].push(data.antisaccadeOverlap.averageReactionTime);
                        }
                    }
                }
                setNaturesGazeReactionTimeData(dataPoints);
            } catch (error) {
                console.error("Error fetching reaction time data:", error);
            }
        })();
    }, [selectedGame, effectiveUserId, filteredDates]);
    
    
    // naturesGaze Saccade Omission Percentages fetching
    useEffect(() => {
        if (!effectiveUserId || selectedGame !== "naturesGaze" || !filteredDates.length) return;
        (async () => {
          try {
            const dataPoints = {
              antiGap: {},
              proGap: {},
              proOverlap: {},
              antiOverlap: {},
            };
            const reports = await getReports(effectiveUserId, filteredDates);
            for (const { dateKey } of reports) {
              const metricsDocRef = doc(
                db,
                `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/metrics`
              );
              const metricsDoc = await getDoc(metricsDocRef);
              if (metricsDoc.exists()) {
                const data = metricsDoc.data();
                // Convert dateKey (MM-DD-YYYY) into a Date object
                const [month, day, year] = dateKey.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day);

                // Format the date into "Jan 1, 2025"
                const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                });

                // Map the backend field names to the display names
                if (data.antisaccadeGap && data.antisaccadeGap.saccadeOmissionPercentage !== undefined) {
                    if (!dataPoints.antiGap[fullDateKey]) dataPoints.antiGap[fullDateKey] = [];
                    dataPoints.antiGap[fullDateKey].push(data.antisaccadeGap.saccadeOmissionPercentage);
                }
                
                if (data.prosaccadeGap && data.prosaccadeGap.saccadeOmissionPercentage !== undefined) {
                    if (!dataPoints.proGap[fullDateKey]) dataPoints.proGap[fullDateKey] = [];
                    dataPoints.proGap[fullDateKey].push(data.prosaccadeGap.saccadeOmissionPercentage);
                }
                
                if (data.prosaccadeOverlap && data.prosaccadeOverlap.saccadeOmissionPercentage !== undefined) {
                    if (!dataPoints.proOverlap[fullDateKey]) dataPoints.proOverlap[fullDateKey] = [];
                    dataPoints.proOverlap[fullDateKey].push(data.prosaccadeOverlap.saccadeOmissionPercentage);
                }
                
                if (data.antisaccadeOverlap && data.antisaccadeOverlap.saccadeOmissionPercentage !== undefined) {
                    if (!dataPoints.antiOverlap[fullDateKey]) dataPoints.antiOverlap[fullDateKey] = [];
                    dataPoints.antiOverlap[fullDateKey].push(data.antisaccadeOverlap.saccadeOmissionPercentage);
                }
              }
            }
            setNaturesGazeSopData(dataPoints);
          } catch (error) {
            console.error("Error fetching saccade omission data:", error);
          }
        })();
    }, [selectedGame, effectiveUserId, filteredDates]);
    
    // naturesGaze Saccade Duration fetching
    useEffect(() => {
        if (!effectiveUserId || selectedGame !== "naturesGaze" || !filteredDates.length) return;
        (async () => {
          try {
            const durationPoints = {
              antiGap: {},
              proGap: {},
              antiOverlap: {},
              proOverlap: {},
            };
            const reports = await getReports(effectiveUserId, filteredDates);
            for (const { dateKey } of reports) {
              const metricsDocRef = doc(
                db,
                `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/metrics`
              );
              const metricsDoc = await getDoc(metricsDocRef);
              if (metricsDoc.exists()) {
                const data = metricsDoc.data();
                // Convert dateKey (MM-DD-YYYY) into a Date object
                const [month, day, year] = dateKey.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day);

                // Format the date into "Jan 1, 2025"
                const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                });

                // Map the backend field names to the display names
                if (data.antisaccadeGap && data.antisaccadeGap.averageSaccadeDuration !== undefined) {
                    if (!durationPoints.antiGap[fullDateKey]) durationPoints.antiGap[fullDateKey] = [];
                    durationPoints.antiGap[fullDateKey].push(data.antisaccadeGap.averageSaccadeDuration);
                }
                
                if (data.prosaccadeGap && data.prosaccadeGap.averageSaccadeDuration !== undefined) {
                    if (!durationPoints.proGap[fullDateKey]) durationPoints.proGap[fullDateKey] = [];
                    durationPoints.proGap[fullDateKey].push(data.prosaccadeGap.averageSaccadeDuration);
                }
                
                if (data.prosaccadeOverlap && data.prosaccadeOverlap.averageSaccadeDuration !== undefined) {
                    if (!durationPoints.proOverlap[fullDateKey]) durationPoints.proOverlap[fullDateKey] = [];
                    durationPoints.proOverlap[fullDateKey].push(data.prosaccadeOverlap.averageSaccadeDuration);
                }
                
                if (data.antisaccadeOverlap && data.antisaccadeOverlap.averageSaccadeDuration !== undefined) {
                    if (!durationPoints.antiOverlap[fullDateKey]) durationPoints.antiOverlap[fullDateKey] = [];
                    durationPoints.antiOverlap[fullDateKey].push(data.antisaccadeOverlap.averageSaccadeDuration);
                }
              }
            }
            setSaccadeDurationData(durationPoints);
          } catch (error) {
            console.error("Error fetching saccade duration data:", error);
          }
        })();
    }, [selectedGame, effectiveUserId, filteredDates]);
    // Saccade Direction Error fetching (4-series)
    useEffect(() => {
        if (!effectiveUserId || selectedGame !== "naturesGaze" || !filteredDates.length) return;
        (async () => {
          try {
            const errorPoints = {
              antiGap: {},
              proGap: {},
              antiOverlap: {},
              proOverlap: {},
            };
            const reports = await getReports(effectiveUserId, filteredDates);
            for (const { dateKey } of reports) {
              const metricsDocRef = doc(
                db,
                `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/metrics`
              );
              const metricsDoc = await getDoc(metricsDocRef);
              if (metricsDoc.exists()) {
                const data = metricsDoc.data();
                // Convert dateKey (MM-DD-YYYY) into a Date object
                const [month, day, year] = dateKey.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day);

                // Format the date into "Jan 1, 2025"
                const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                });

                // Map the backend field names to the display names
                if (data.antisaccadeGap && data.antisaccadeGap.saccadeErrorPercentage !== undefined) {
                    if (!errorPoints.antiGap[fullDateKey]) errorPoints.antiGap[fullDateKey] = [];
                    errorPoints.antiGap[fullDateKey].push(data.antisaccadeGap.saccadeErrorPercentage);
                }
                
                if (data.prosaccadeGap && data.prosaccadeGap.saccadeErrorPercentage !== undefined) {
                    if (!errorPoints.proGap[fullDateKey]) errorPoints.proGap[fullDateKey] = [];
                    errorPoints.proGap[fullDateKey].push(data.prosaccadeGap.saccadeErrorPercentage);
                }
                
                if (data.prosaccadeOverlap && data.prosaccadeOverlap.saccadeErrorPercentage !== undefined) {
                    if (!errorPoints.proOverlap[fullDateKey]) errorPoints.proOverlap[fullDateKey] = [];
                    errorPoints.proOverlap[fullDateKey].push(data.prosaccadeOverlap.saccadeErrorPercentage);
                }
                
                if (data.antisaccadeOverlap && data.antisaccadeOverlap.saccadeErrorPercentage !== undefined) {
                    if (!errorPoints.antiOverlap[fullDateKey]) errorPoints.antiOverlap[fullDateKey] = [];
                    errorPoints.antiOverlap[fullDateKey].push(data.antisaccadeOverlap.saccadeErrorPercentage);
                }
              }
            }
            setSaccadeDirectionErrorData(errorPoints);
          } catch (error) {
            console.error("Error fetching saccade direction error data:", error);
          }
        })();
    }, [selectedGame, effectiveUserId, filteredDates]);
    // Fixation Accuracy fetching (2-series: gap and overlap)
    useEffect(() => {
        if (!effectiveUserId || selectedGame !== "naturesGaze" || !filteredDates.length) return;
        (async () => {
          try {
            const accuracyPoints = {
              gap: {},
              overlap: {},
            };
            const reports = await getReports(effectiveUserId, filteredDates);
            for (const { dateKey } of reports) {
              const metricsDocRef = doc(
                db,
                `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/naturesGaze/metrics`
              );
              const metricsDoc = await getDoc(metricsDocRef);
              if (metricsDoc.exists()) {
                const data = metricsDoc.data();
                // Convert dateKey (MM-DD-YYYY) into a Date object
                const [month, day, year] = dateKey.split('-').map(Number);
                const formattedDate = new Date(year, month - 1, day);

                // Format the date into "Jan 1, 2025"
                const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                });

                // For gap accuracy, we take the average of pro and anti saccade gap fixation durations
                const proGapFixation = data.prosaccadeGap?.averageFixationDuration;
                const antiGapFixation = data.antisaccadeGap?.averageFixationDuration;
                
                if (proGapFixation !== undefined || antiGapFixation !== undefined) {
                    if (!accuracyPoints.gap[fullDateKey]) accuracyPoints.gap[fullDateKey] = [];
                    
                    if (proGapFixation !== undefined && antiGapFixation !== undefined) {
                        // If both values exist, use their average
                        accuracyPoints.gap[fullDateKey].push((proGapFixation + antiGapFixation) / 2);
                    } else if (proGapFixation !== undefined) {
                        // If only proGap exists
                        accuracyPoints.gap[fullDateKey].push(proGapFixation);
                    } else if (antiGapFixation !== undefined) {
                        // If only antiGap exists
                        accuracyPoints.gap[fullDateKey].push(antiGapFixation);
                    }
                }
                
                // For overlap accuracy, we take the average of pro and anti saccade overlap fixation durations
                const proOverlapFixation = data.prosaccadeOverlap?.averageFixationDuration;
                const antiOverlapFixation = data.antisaccadeOverlap?.averageFixationDuration;
                
                if (proOverlapFixation !== undefined || antiOverlapFixation !== undefined) {
                    if (!accuracyPoints.overlap[fullDateKey]) accuracyPoints.overlap[fullDateKey] = [];
                    
                    if (proOverlapFixation !== undefined && antiOverlapFixation !== undefined) {
                        // If both values exist, use their average
                        accuracyPoints.overlap[fullDateKey].push((proOverlapFixation + antiOverlapFixation) / 2);
                    } else if (proOverlapFixation !== undefined) {
                        // If only proOverlap exists
                        accuracyPoints.overlap[fullDateKey].push(proOverlapFixation);
                    } else if (antiOverlapFixation !== undefined) {
                        // If only antiOverlap exists
                        accuracyPoints.overlap[fullDateKey].push(antiOverlapFixation);
                    }
                }
              }
            }
            setFixationAccuracyData(accuracyPoints);
          } catch (error) {
            console.error("Error fetching fixation accuracy data:", error);
          }
        })();
    }, [selectedGame, effectiveUserId, filteredDates]);
    
    // Process Quest Speaking Time fetching
    const isTemporalGame =
        selectedGame === "processQuest" || selectedGame === "sceneDetective" || !filteredDates.length;
    
    // MemoryVault Recall Score fetching
    useEffect(() => {
        if (!effectiveUserId || selectedGame !== "memoryVault" || !filteredDates.length) return;
        (async () => {
            try {
                const dataPoints = {};
                console.log("Fetching MemoryVault Recall Scores...", effectiveUserId, filteredDates);
                const reports = await getReports(effectiveUserId, filteredDates);
                console.log("Fetched Reports:", reports); // Log reports
                
for (const { dateKey } of reports) {
  const [month, day, year] = dateKey.split('-').map(Number);
  const formattedDate = new Date(year, month - 1, day);

  // Format the date into "Jan 1, 2025"
  const fullDateKey = formattedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
  });

  const mvDocRef = doc(
      db,
      `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/memoryVault/recallSpeedAndAccuracy`
  );
  const mvDoc = await getDoc(mvDocRef);

  if (mvDoc.exists()) {
      const { wordPoints, audioPoints, picturePoints } = mvDoc.data();
      const sessionPoints = [];

      if (typeof wordPoints === "number") sessionPoints.push(wordPoints);
      if (typeof audioPoints === "number") sessionPoints.push(audioPoints);
      if (typeof picturePoints === "number") sessionPoints.push(picturePoints);

      if (sessionPoints.length) {
          dataPoints[fullDateKey] = sessionPoints; // Assign only the three numbers
      }
  }
}
              
              console.log("Final dataPoints:", dataPoints); // Log final dataPoints
              setMemoryVaultRecallScoreData(dataPoints);
           } catch (error) {
                console.error("Error fetching or computing points:", error);
            }
        })();
    }, [effectiveUserId, selectedGame, filteredDates]);
    
    useEffect(() => {
        if (!effectiveUserId || !isTemporalGame || !filteredDates.length) return;
        (async () => {
          try {
            const dataPoints = {};
            const reports = await getReports(effectiveUserId, filteredDates);
            for (const { dateKey } of reports) {
              const tpDocRef = doc(
                db,
                `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/temporalCharacteristics`
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
    }, [selectedGame, effectiveUserId, isTemporalGame, filteredDates]);
    
    // New effect: Fetch Process Quest Pause Count data
    useEffect(() => {
        if (!effectiveUserId || !isTemporalGame || !filteredDates.length) return;
        (async () => {
          try {
            const dataPoints = {};
            const reports = await getReports(effectiveUserId, filteredDates);
            
            for (const { dateKey } of reports) {
              const pausesCollection = collection(
                db,
                `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/temporalCharacteristics/Pauses`
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
    }, [selectedGame, effectiveUserId, isTemporalGame, filteredDates]);
    
    // New effect: Fetch Process Quest Pause Duration data
    useEffect(() => {
        if (!effectiveUserId || !isTemporalGame || !filteredDates.length) return;
        (async () => {
          try {
            const dataPoints = {};
            const reports = await getReports(effectiveUserId, filteredDates);
            for (const { dateKey } of reports) {
              const pausesCollection = collection(
                db,
                `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/temporalCharacteristics/Pauses`
              );
              const pausesSnapshots = await getDocs(pausesCollection);
              pausesSnapshots.docs.forEach((pauseDoc) => {
                const data = pauseDoc.data();
                if (data.StartTime && data.EndTime) {
                  const [month, day, year] = dateKey.split('-').map(Number);
                  const formattedDate = new Date(year, month - 1, day);

                  // Format the date into "Jan 1, 2025"
                  const fullDateKey = formattedDate.toLocaleDateString("en-US", {
                      month: "short", // Abbreviated month name (e.g., Jan, Feb)
                      day: "numeric", // Numeric day
                      year: "numeric", // Full year (e.g., 2025)
                  });
                  try {
                    // Check if times are already in numeric format
                    if (typeof data.StartTime === 'number' && typeof data.EndTime === 'number') {
                      const duration = data.EndTime - data.StartTime;
                      if (!dataPoints[fullDateKey]) dataPoints[fullDateKey] = [];
                      dataPoints[fullDateKey].push(duration);
                    } 
                    // Handle string formats like "MM:SS" or "SS.ms"
                    else if (typeof data.StartTime === 'string' && typeof data.EndTime === 'string') {
                      let startTotal, endTotal;
                      
                      // Handle "MM:SS" format
                      if (data.StartTime.includes(":")) {
                        const [startMin, startSec] = data.StartTime.split(":").map(x => parseFloat(x));
                        const [endMin, endSec] = data.EndTime.split(":").map(x => parseFloat(x));
                        startTotal = startMin * 60 + startSec;
                        endTotal = endMin * 60 + endSec;
                      } 
                      // Handle seconds or seconds.milliseconds format
                      else {
                        startTotal = parseFloat(data.StartTime);
                        endTotal = parseFloat(data.EndTime);
                      }
                      
                      if (!isNaN(startTotal) && !isNaN(endTotal)) {
                        const duration = endTotal - startTotal;
                        if (duration > 0) { // Only include positive durations
                          if (!dataPoints[fullDateKey]) dataPoints[fullDateKey] = [];
                          dataPoints[fullDateKey].push(duration);
                        } else {
                          console.warn("Invalid pause duration (negative or zero):", duration, "Start:", data.StartTime, "End:", data.EndTime);
                        }
                      } else {
                        console.warn("Invalid time format for pause:", data.StartTime, data.EndTime);
                      }
                    }
                  } catch (err) {
                    console.error("Error calculating pause duration:", err, data);
                  }
                }
              });
            }
            console.log("Final Pause Duration dataPoints:", dataPoints);
            setPauseDurationData(dataPoints);
          } catch (error) {
            console.error("Error fetching Pause Duration data:", error);
          }
        })();
    }, [selectedGame, effectiveUserId, isTemporalGame, filteredDates]);
    
    // New effect: Fetch Process Quest Lexical Features data
    useEffect(() => {
        if (!effectiveUserId || !isTemporalGame || !filteredDates.length) return;
        (async () => {
          try {
            const nounData = {};
            const closedClassData = {};
            const fillerData = {};
            const openClassData = {};
            const verbData = {};
            const reports = await getReports(effectiveUserId, filteredDates);
            for (const { dateKey } of reports) {
              const lexicalDocRef = doc(
                db,
                `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/lexicalFeatures`
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
    }, [selectedGame, effectiveUserId, isTemporalGame, filteredDates]);
    
    // New effect: Fetch Process Quest Structural Features data
    useEffect(() => {
        if (!effectiveUserId || !isTemporalGame || !filteredDates.length) return;
        (async () => {
          try {
            const meanDataPoints = {};
            const sentenceDataPoints = {};
            const reports = await getReports(effectiveUserId, filteredDates);
            for (const { dateKey } of reports) {
              const structuralDocRef = doc(
                db,
                `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/structuralFeatures`
              );
              const structuralDoc = await getDoc(structuralDocRef);
              if (structuralDoc.exists()) {
                const data = structuralDoc.data();
                // Check for either property name since it might be stored differently
                const meanValue = Number(data.MeanLengthOfUtterance || data.MeanLengthOfOccurrence || 
                                  data["Mean Length of Utterance (MLU) (Average number of words per sentence)"]);
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
    }, [selectedGame, effectiveUserId, isTemporalGame, filteredDates]);
    
    // New effect: Fetch Process Quest Fluency Metrics data
    useEffect(() => {
        if (!effectiveUserId || !isTemporalGame || !filteredDates.length) return;
        (async () => {
          try {
            const revisionData = {};
            const wordsData = {};
            const reports = await getReports(effectiveUserId, filteredDates);
            for (const { dateKey } of reports) {
              const fluencyDocRef = doc(
                db,
                `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/fluencyMetrics`
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
                // Look for either RevisionRatio or RepetitionRatio since the data might be stored with either name
                const repetition = Number(data.RepetitionRatio || data.RevisionRatio);
                const wordsPerMin = Number(data.WordsPerMin);
                if (!revisionData[fullDateKey]) revisionData[fullDateKey] = [];
                if (!wordsData[fullDateKey]) wordsData[fullDateKey] = [];
                revisionData[fullDateKey].push(repetition);
                wordsData[fullDateKey].push(wordsPerMin);
              }
            }
            console.log("Fluency Revision Ratio:", revisionData);
            console.log("Fluency Words Per Min:", wordsData);
            setFluencyRevisionRatioData(revisionData);
            setFluencyWordsPerMinData(wordsData);
          } catch (error) {
            console.error("Error fetching fluency metrics data:", error);
          }
        })();
    }, [selectedGame, effectiveUserId, isTemporalGame, filteredDates, setFluencyRevisionRatioData, setFluencyWordsPerMinData, setFluencyStutterCountData]);
    
    // New effect: Fetch Process Quest Semantic Features data
    useEffect(() => {
        if (!effectiveUserId || !isTemporalGame || !filteredDates.length) return;
        (async () => {
          try {
            const lexFreqData = {};
            const efficiencyData = {};
            const ideaDensityData = {};
            const reports = await getReports(effectiveUserId, filteredDates);
            for (const { dateKey } of reports) {
              const semanticDocRef = doc(
                db,
                `users/${effectiveUserId}/dailyReportsSeeMore/${dateKey}/${selectedGame}/semanticFeatures`
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
    }, [selectedGame, effectiveUserId, isTemporalGame, filteredDates, setSemanticLexFreqData, setSemanticEfficiencyData, setSemanticIdeaDensityData]);

    return (
        <div className="weekly-report-content">
            <div className="header-container">
                <h1>Weekly Reports {selectedWeek && `for ${selectedWeek}`}</h1>
                <div className="date-filter-weekly">
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
                        <strong>User ID:</strong> {effectiveUserId}
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
                            text: "Text",
                            audio: "Audio",
                            picture: "Picture",
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
                        yAxisLabel="Time (Milliseconds)"
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
                        yAxisLabel="Duration (Milliseconds)"
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
                        plotTitle="Fixation Duration"
                        displaySubtitle={false}
                        xAxisLabel="Date"
                        yAxisLabel="Duration (Milliseconds)"
                        seriesLabels={{ gap: "Gap Task", overlap: "Overlap Task" }}
                        multiSeries={true}
                        infoDescription={PlotDescriptions["Fixation Duration"]}
                    />
                </>
            )}
            {(selectedGame === "sceneDetective") && (
                <>
                    {(() => {
                        const metricsConfigs = [
                            { 
                                subtitle: "Speaking Time",
                                rawData: speakingTimeData,
                                yAxisLabel: "Time (Minutes)",
                            },
                            {
                                subtitle: "Pause Count",
                                rawData: pauseCountData,
                                yAxisLabel: "Pause Count",
                            },
                            {
                                subtitle: "Average Pause Duration",
                                rawData: pauseDurationData,
                                yAxisLabel: "Pause Duration (Seconds)",
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
                                subtitle: "Mean Length of Utterance",
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
                            subtitle: "Speech Rate",
                            rawData: fluencyWordsPerMinData,
                            yAxisLabel: "Words per Minute",
                        },
                        {
                            subtitle: "Repetition Ratio",
                            rawData: fluencyRevisionRatioData,
                            yAxisLabel: "Repetition Ratio",
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
                            yAxisLabel: "Nouns Proportion (%)",
                        },
                        {
                            subtitle: "Verb",
                            rawData: lexVerbData,
                            yAxisLabel: "Verbs Proportion (%)",
                        },
                        {
                            subtitle: "Filler",
                            rawData: lexFillerData,
                            yAxisLabel: "Filler Proportion (%)",
                        },
                        {
                            subtitle: "Open Class",
                            rawData: lexOpenClassData,
                            yAxisLabel: "Open Class Proportion (%)",
                        },
                        {
                            subtitle: "Closed Class",
                            rawData: lexClosedClassData,
                            yAxisLabel: "Closed Class Proportion (%)",
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
            {selectedGame === "processQuest" && (
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
                                subtitle: "Number of Sentences",
                                rawData: structuralSentenceData,
                                yAxisLabel: "Sentence Count",
                            },
                            {
                              subtitle: "Mean Length of Utterance",
                              rawData: structuralMeanData,
                              yAxisLabel: "Mean Length",
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
                            subtitle: "Speech Rate",
                            rawData: fluencyWordsPerMinData,
                            yAxisLabel: "Words per Minute",
                        },
                        {
                            subtitle: "Repetition Ratio",
                            rawData: fluencyRevisionRatioData,
                            yAxisLabel: "Repetition Ratio",
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
                            yAxisLabel: "Nouns Proportion (%)",
                        },
                        {
                            subtitle: "Verb",
                            rawData: lexVerbData,
                            yAxisLabel: "Verbs Proportion (%)",
                        },
                        {
                            subtitle: "Filler",
                            rawData: lexFillerData,
                            yAxisLabel: "Filler Proportion (%)",
                        },
                        {
                            subtitle: "Open Class",
                            rawData: lexOpenClassData,
                            yAxisLabel: "Open Class Proportion (%)",
                        },
                        {
                            subtitle: "Closed Class",
                            rawData: lexClosedClassData,
                            yAxisLabel: "Closed Class Proportion (%)",
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
                    <BarChart 
                        rawData={semanticLexFreqData}
                        plotTitle="Lexical Frequency of Nouns"
                        displaySubtitle={false}
                        xAxisLabel="Date"
                        yAxisLabel="Frequency"
                        infoDescription={PlotDescriptions["Lexical Frequency of Nouns"]}
                    />
                </>
            )}
            <div style={{ height: "100px" }}></div>

        </div>


    );
};

export default WeeklyReportComponent;
