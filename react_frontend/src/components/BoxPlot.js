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

const BoxPlot = ({ rawData, plotTitle, xAxisLabel, yAxisLabel, seriesLabels }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const calculateBoxPlotData = (dataSeries) => {
    const processedData = {};
    for (const [monthYear, points] of Object.entries(dataSeries)) {
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

    let labels = [];
    let datasets = [];
    let globalPoints = [];

    // Check if multi-series
    if (rawData && rawData.gap) {
      labels = Object.keys(rawData.gap);
      const gapPlotData = calculateBoxPlotData(rawData.gap);
      const overlapPlotData = calculateBoxPlotData(rawData.overlap);

      // Collect all points for global min/max calculation
      Object.values(rawData.gap).forEach((arr) => globalPoints.push(...arr));
      Object.values(rawData.overlap).forEach((arr) =>
        globalPoints.push(...arr)
      );

      datasets = [
        {
          label: seriesLabels && seriesLabels.gap ? seriesLabels.gap : "Series 1",
          data: Object.values(gapPlotData),
          backgroundColor: "#516A80",
          borderColor: "black",
          borderWidth: 1,
        },
        {
          label: seriesLabels && seriesLabels.overlap ? seriesLabels.overlap : "Series 2",
          data: Object.values(overlapPlotData),
          backgroundColor: "#A0C4FF",
          borderColor: "black",
          borderWidth: 1,
        },
      ];
    } else {
      // Single dataset case
      const singlePlotData = calculateBoxPlotData(rawData);
      labels = Object.keys(singlePlotData);
      Object.values(rawData).forEach((arr) => globalPoints.push(...arr));
      datasets = [
        {
          label: undefined,
          data: Object.values(singlePlotData),
          backgroundColor: "#516A80",
          borderColor: "black",
          borderWidth: 1,
        },
      ];
    }

    const globalMin = globalPoints.length ? Math.min(...globalPoints) : 0;
    const globalMax = globalPoints.length ? Math.max(...globalPoints) : 0;

    const data = {
      labels,
      datasets,
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
              text: xAxisLabel,
              color: "black",
              font: { size: 16, family: "Inter", weight: "bold" },
            },
            ticks: {
              color: "black",
              font: { family: "Inter", size: 14 },
            },
            grid: { color: "rgba(0,0,0,0.1)" },
            border: { color: "black", width: 2 },
          },
          y: {
            beginAtZero: false,
            min: globalMin - 2,
            max: globalMax + 2,
            title: {
              display: true,
              text: yAxisLabel,
              color: "black",
              font: { size: 16, family: "Inter", weight: "bold" },
            },
            ticks: {
              color: "black",
              font: { family: "Inter", size: 14 },
            },
            grid: { color: "rgba(0,0,0,0.1)" },
            border: { color: "black", width: 2 },
          },
        },
        plugins: {
          legend: { display: datasets.length > 1 },
          title: {
            display: true,
            text: plotTitle,
            font: { size: 20, family: "Inter" },
            color: "black",
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
  }, [rawData, plotTitle, xAxisLabel, yAxisLabel, seriesLabels]);

  return (
    <div className="chart-container">
      <div className="chart-box">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default BoxPlot;
