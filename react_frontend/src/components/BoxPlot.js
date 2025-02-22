import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
  BarElement,
} from "chart.js";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import "./BoxPlot.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BoxPlotController,
  BoxAndWiskers
);

const BoxPlot = ({ rawData }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const calculateBoxPlotData = (rawData) => {
    const processedData = {};
    for (const [monthYear, points] of Object.entries(rawData)) {
      points.sort((a, b) => a - b);
      const getQuartile = (data, q) => {
        const pos = (data.length - 1) * q;
        const base = Math.floor(pos);
        const rest = pos - base;
        if (data[base + 1] !== undefined) {
          return data[base] + rest * (data[base + 1] - data[base]);
        } else {
          return data[base];
        }
      };

      processedData[monthYear] = [
        points[0], // Min
        getQuartile(points, 0.25), // Q1
        getQuartile(points, 0.5), // Median
        getQuartile(points, 0.75), // Q3
        points[points.length - 1], // Max
      ];
    }
    return processedData;
  };

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const plotData = calculateBoxPlotData(rawData);

    const data = {
      labels: Object.keys(plotData),
      datasets: [
        {
          data: Object.values(plotData),
          backgroundColor: "#516A80",
          borderColor: "black",
          borderWidth: 1,
        },
      ],
    };

    const config = {
      type: "boxplot",
      data,
      options: {
        responsive: true,
        scales: {
          x: {
            title: { 
              display: true, 
              text: "Date", 
              color: "black",
              font: { size: 16, family: "Inter", weight: "bold" },
            },
            ticks: { 
              color: "black",
              font: { family: "Inter", size: 14 }
            },
            grid: { color: "rgba(0,0,0,0.1)" },
            border: { color: "black", width: 2 },
          },
          y: {
            beginAtZero: false,
            min: -1,
            max: 5,
            title: { 
              display: true, 
              text: "Score", 
              color: "black",
              font: { size: 16, family: "Inter", weight: "bold" },
            },
            ticks: { 
              color: "black",
              font: { family: "Inter", size: 14 }
            },
            grid: { color: "rgba(0,0,0,0.1)" },
            border: { color: "black", width: 2 },
          },
        },
        plugins: {
          legend: false,
          title: { 
            display: true, 
            text: "Recall Score", 
            font: { size: 20, family: "Inter" },
            color: "black"
          },
        },
      },
    };

    chartInstanceRef.current = new ChartJS(ctx, config);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [rawData]);

  return (
    <div className="chart-container">
      <div className="chart-box">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default BoxPlot;
