import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Title,
  Legend,
  BarElement,
  SubTitle,
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
  SubTitle,
  Tooltip,
  Legend,
  BoxPlotController,
  BoxAndWiskers
);

const BoxPlot = ({
  rawData,
  plotTitle,
  displaySubtitle,
  subtitleText,
  xAxisLabel,
  yAxisLabel,
  seriesLabels,
  multiSeries = false,
}) => {
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
        return data[base + 1] !== undefined
          ? data[base] + rest * (data[base + 1] - data[base])
          : data[base];
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
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    let labels = [];
    let datasets = [];
    let globalPoints = [];

    if (multiSeries) {
      // In multi-series mode, rawData is an object with series keys
      const seriesKeys = Object.keys(rawData);
      if (seriesKeys.length === 0) {
        labels = [];
      } else {
        labels = Object.keys(rawData[seriesKeys[0]]);
      }
      seriesKeys.forEach((key) => {
        const seriesPlotData = calculateBoxPlotData(rawData[key]);
        Object.values(rawData[key]).forEach((arr) => globalPoints.push(...arr));
        let bgColor =
          key === "antiGap" || key === "gap"
            ? "#516A80"
            : key === "proGap" || key === "overlap"
            ? "#A0C4FF"
            : key === "antiOverlap"
            ? "#F6BD60"
            : key === "proOverlap"
            ? "#F28482"
            : "#516A80";
        datasets.push({
          label: (seriesLabels && seriesLabels[key]) || key,
          data: Object.values(seriesPlotData),
          backgroundColor: bgColor,
          borderColor: "black",
          borderWidth: 1,
          outlierBackgroundColor: "black",
        });
      });
    } else if (rawData && typeof rawData === "object" && rawData !== null) {
      // Single dataset mode: rawData is an object mapping label -> array
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
          outlierBackgroundColor: "black",
        },
      ];
    }

    const globalMin = globalPoints.length ? Math.min(...globalPoints) : 0;
    const globalMax = globalPoints.length ? Math.max(...globalPoints) : 0;
    const data = { labels, datasets };

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
            border: { color: "rgba(0,0,0,0.1)", width: 2 },
          },
          y: {
            beginAtZero: false,
            min: Math.min(globalMin, 0),
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
            border: { color: "rgba(0,0,0,0.1)", width: 2 },
          },
        },
        plugins: {
          legend: { display: datasets.length > 1 },
          title: {
            display: true,
            text: plotTitle,
            font: { size: 20, family: "Inter" },
            color: "#2F3B66",
          },
          subtitle: {
            display: displaySubtitle,
            text: subtitleText,
            font: { size: 16, family: "Inter", weight: "bold" },
            color: "#516A80",
            padding: { bottom: 10 },
          },
        },
      },
    };

    chartInstanceRef.current = new ChartJS(ctx, config);
    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, [rawData, plotTitle, xAxisLabel, yAxisLabel, seriesLabels, multiSeries, displaySubtitle, subtitleText]);

  return (
    <div className="chart-container">
      <div className="chart-box">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default BoxPlot;
