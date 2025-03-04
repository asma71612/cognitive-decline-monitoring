import React, { useState, useEffect, useRef } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import "./BarChart.css";
import infoIcon from "../assets/information-hover.svg";


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = ({
  rawData,
  plotTitle,
  displaySubtitle,
  subtitleText,
  xAxisLabel,
  yAxisLabel,
  seriesLabels,
  memoryVault = false,
  multiSeries = false,
  infoDescription,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    let labels = [];
    let datasets = [];

    if (multiSeries) {
      const seriesKeys = Object.keys(rawData);
      labels = seriesKeys.length ? Object.keys(rawData[seriesKeys[0]]) : [];

      datasets = seriesKeys.map((key, index) => ({
        label: seriesLabels?.[key] || key,
        data: Object.values(rawData[key]).map((values) =>
          values.reduce((sum, val) => sum + val, 0) / values.length
        ), // Convert arrays into mean values
        backgroundColor: ["#516A80", "#A0C4FF", "#F6BD60", "#F28482"][
          index % 4
        ], // Cycle colors
      }));
    } else if (memoryVault) {
        const seriesKeys = Object.keys(seriesLabels); // ["text", "audio", "picture"]
        const dateKeys = Object.keys(rawData); // ["Jan 1, 2025", "Jan 2, 2025", ...]
    
        labels = dateKeys; // X-axis labels (dates)
    
        datasets = seriesKeys.map((seriesKey, index) => ({
            label: seriesLabels[seriesKey] || seriesKey, // Get label from seriesLabels
            data: dateKeys.map((date) => {
                const values = rawData[date]; // Example: [4, 3, 4]
                return Array.isArray(values) && values[index] !== undefined 
                    ? values[index] 
                    : null; // Use null if data is missing
            }),
            backgroundColor: ["#516A80", "#A0C4FF", "#F6BD60"][index % 3], // Cycle colors
        }));
    }    
    else {
      labels = Object.keys(rawData);
      datasets = [
        {
          label: "Data",
          data: Object.values(rawData).map((values) =>
            values.reduce((sum, val) => sum + val, 0) / values.length
          ),
          backgroundColor: "#516A80",
        },
      ];
    }

    const config = {
      type: "bar",
      data: { labels, datasets },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: xAxisLabel,
              font: { size: 16, weight: "bold" },
            },
            ticks: { font: { size: 14 } },
          },
          y: {
            title: {
              display: true,
              text: yAxisLabel,
              font: { size: 16, weight: "bold" },
            },
            ticks: { font: { size: 14 } },
          },
        },
        plugins: {
          legend: { display: datasets.length > 1 },
        },
      },
    };

    chartInstanceRef.current = new ChartJS(ctx, config);
    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, [rawData, xAxisLabel, yAxisLabel, seriesLabels, multiSeries, memoryVault]);

  return (
    <div className="chart-container">
      <div className="barchart-header">
        <div className="barchart-title-container">
          <span className="barchart-title">{plotTitle}</span>
          {displaySubtitle && (
            <span className="barchart-subtitle">{subtitleText}</span>
          )}
        </div>
        <img
          src={infoIcon}
          alt="Info"
          className="barchart-info-icon"
          onClick={() => setShowInfo(!showInfo)}
        />
        {showInfo && <div className="barchart-info-popover">{infoDescription}</div>}
      </div>
      <div className="chart-box">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default BarChart;
