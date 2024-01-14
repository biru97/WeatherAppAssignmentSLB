import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

interface ForecastData {
  forecastData: {
    co: number[];
    nh3: number[];
    no: number[];
    no2: number[];
    o3: number[];
    pm10: number[];
    pm2_5: number[];
    so2: number[];
  };
}

const ForecastLineChart = ({ forecastData }: ForecastData) => {
  return (
    <div>
      <Line
        data={{
          labels: [
            "1st Hr",
            "2nd Hr",
            "3rd Hr",
            "4th Hr",
            "5th Hr",
            "6th Hr",
            "7th Hr",
            "8th Hr",
            "9th Hr",
            "10th Hr",
            "11th Hr",
            "12th Hr",
          ],
          datasets: [
            {
              label: "CO",
              data: forecastData.co,
              backgroundColor: "purple",
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 10,
            },
            {
              label: "NH3",
              data: forecastData.nh3,
              backgroundColor: "blue",
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 10,
            },
            {
              label: "NO",
              data: forecastData.no,
              backgroundColor: "orange",
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 10,
            },
            {
              label: "NO2",
              data: forecastData.no2,
              backgroundColor: "red",
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 10,
            },
            {
              label: "O3",
              data: forecastData.o3,
              backgroundColor: "yellow",
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 10,
            },
            {
              label: "PM10",
              data: forecastData.pm10,
              backgroundColor: "pink",
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 10,
            },
            {
              label: "PM2_5",
              data: forecastData.pm2_5,
              backgroundColor: "violet",
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 10,
            },
            {
              label: "SO2",
              data: forecastData.so2,
              backgroundColor: "black",
              pointStyle: "circle",
              pointRadius: 5,
              pointHoverRadius: 10,
            },
          ],
        }}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Next 12 hours AQI Forecast",
            },
          },
        }}
      />
    </div>
  );
};

export default ForecastLineChart;
