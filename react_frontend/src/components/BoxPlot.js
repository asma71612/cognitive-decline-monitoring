import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  BarElement,
  SubTitle,
} from "chart.js";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";
import "./BoxPlot.css";
import infoIcon from "../assets/information-hover.svg";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
  infoDescription  // new prop for info popup text
}) => {
  const [showInfo, setShowInfo] = useState(false);
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
        points[0],
        getQuartile(points, 0.25),
        getQuartile(points, 0.5),
        getQuartile(points, 0.75),
        points[points.length - 1],
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
      const seriesKeys = Object.keys(rawData);
      labels = seriesKeys.length ? Object.keys(rawData[seriesKeys[0]]) : [];
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
    } else if (rawData && typeof rawData === "object") {
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
          title: { display: false },
          subtitle: { display: false },
        },
      },
    };

    chartInstanceRef.current = new ChartJS(ctx, config);
    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
    };
  }, [rawData, xAxisLabel, yAxisLabel, seriesLabels, multiSeries]);

  return (
    <div className="chart-container">
      <div className="boxplot-header">
        <div className="boxplot-title-container">
          <span className="boxplot-title">{plotTitle}</span>
          {displaySubtitle && (
            <span className="boxplot-subtitle">{subtitleText}</span>
          )}
        </div>
        <img
          src={infoIcon}
          alt="Info"
          className="boxplot-info-icon"
          onClick={() => setShowInfo(!showInfo)}
        />
        {showInfo && (
          <div className="boxplot-info-popover">
            {infoDescription}
          </div>
        )}
      </div>
      <div className="chart-box">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default BoxPlot;
