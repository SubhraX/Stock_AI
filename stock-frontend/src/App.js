import React, { useState, useEffect } from "react";
import { Line, Bar, Scatter, Chart } from "react-chartjs-2";
import "chart.js/auto";
import { Chart as ChartJS, registerables, TimeScale } from "chart.js";
import { CandlestickController, CandlestickElement, OhlcController, OhlcElement } from "chartjs-chart-financial";
import zoomPlugin from "chartjs-plugin-zoom"; // ✅ Added Zoom Plugin
import "chartjs-adapter-date-fns"; // ✅ Fix date adapter issue
import axios from "axios";
import { FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import "./StockChart.css";

// ✅ Register necessary Chart.js components
ChartJS.register(
  ...registerables,
  TimeScale,
  CandlestickController,
  CandlestickElement,
  OhlcController,
  OhlcElement,
  zoomPlugin // ✅ Enable Zooming
);

const StockChart = () => {
  const [stockData, setStockData] = useState(null);
  const [candlestickData, setCandlestickData] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [ticker, setTicker] = useState("AAPL");
  const [chartType, setChartType] = useState("candlestick");

  useEffect(() => {
    fetchStockData();
    fetchCandlestickData();
    fetchPredictions();
  }, [ticker]);

  const fetchStockData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/stock/${ticker}`);
      setStockData(response.data.Close);
    } catch (error) {
      console.error("Error fetching stock data", error);
    }
  };

  const fetchCandlestickData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/candlestick/${ticker}`);

      if (!response.data || !response.data.candlestick) {
        console.error("Invalid candlestick data:", response.data);
        return;
      }

      const formattedData = response.data.candlestick.map((entry) => ({
        x: new Date(entry.Datetime),
        o: entry.Open,
        h: entry.High,
        l: entry.Low,
        c: entry.Close,
      }));

      setCandlestickData(formattedData);
    } catch (error) {
      console.error("Error fetching candlestick data", error);
    }
  };

  const fetchPredictions = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/predict/${ticker}`);
      setPredictions(response.data.predictions);
    } catch (error) {
      console.error("Error fetching predictions", error);
    }
  };

  if (!stockData || !candlestickData) return <p>Loading stock data...</p>;

  const labels = Object.keys(stockData);
  const values = Object.values(stockData);
  const predictionValues = predictions || [];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: values,
        borderColor: "blue",
        backgroundColor: "blue",
        fill: false,
      },
      {
        label: "Predictions",
        data: new Array(values.length - predictionValues.length).fill(null).concat(predictionValues),
        borderColor: "red",
        borderDash: [5, 5],
        fill: false,
      },
    ],
  };

  const candlestickChartData = {
    datasets: [
      {
        label: "Candlestick",
        data: candlestickData,
        borderColor: "gray",
        borderWidth: 1,
        color: {
          up: "#00b894",
          down: "#d63031",
          unchanged: "#0984e3",
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
    },
  };

  return (
    <div className="container">
      <h1>Stock Prediction Dashboard</h1>

      <div className="dropdown-container">
        {/* Stock Selector */}
        <FormControl variant="outlined" className="dropdown">
          <InputLabel>Select Stock</InputLabel>
          <Select value={ticker} onChange={(e) => setTicker(e.target.value)} label="Select Stock">
            <MenuItem value="AAPL">Apple (AAPL)</MenuItem>
            <MenuItem value="GOOGL">Google (GOOGL)</MenuItem>
            <MenuItem value="MSFT">Microsoft (MSFT)</MenuItem>
            <MenuItem value="AMZN">Amazon (AMZN)</MenuItem>
            <MenuItem value="TSLA">Tesla (TSLA)</MenuItem>
          </Select>
        </FormControl>

        {/* Chart Type Selector */}
        <FormControl variant="outlined" className="dropdown">
          <InputLabel>Select Chart Type</InputLabel>
          <Select value={chartType} onChange={(e) => setChartType(e.target.value)} label="Select Chart Type">
            <MenuItem value="candlestick">Candlestick</MenuItem>
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="bar">Bar</MenuItem>
            <MenuItem value="scatter">Scatter</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="chart-container">
        {chartType === "candlestick" && candlestickData.length > 0 && (
          <Chart type="candlestick" data={candlestickChartData} options={options} />
        )}
        {chartType === "line" && <Line data={chartData} options={options} />}
        {chartType === "bar" && <Bar data={chartData} options={options} />}
        {chartType === "scatter" && <Scatter data={chartData} options={options} />}
      </div>
    </div>
  );
};

export default StockChart;
