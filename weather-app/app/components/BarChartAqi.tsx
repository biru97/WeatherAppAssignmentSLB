import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  BarElement
);

interface BarChart {
  currentValue: {
    co: number;
    no: number;
    no2: number;
    o3: number;
    so2: number;
    pm2_5: number;
    pm10: number;
    nh3: number;
  };
}

const MyBarChart = ({ currentValue }: BarChart) => {
  const options = {
    plugins: {
      title: {
        display: true,
        text: "Pollutant Cocentration Level Against Standard Values",
      },
    },
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  const standardPollutionData = {
    good: [4400, 200, 40, 40, 60, 20, 10, 20],
    fair: [9400, 400, 80, 70, 100, 80, 25, 80],
    moderate: [12400, 800, 180, 150, 140, 250, 50, 250],
    poor: [15400, 1200, 280, 200, 180, 350, 75, 350],
  };

  return (
    <Bar
      data={{
        labels: ["CO", "NH3", "NO", "NO2", "o3", "PM10", "PM2_5", "SO2"],
        datasets: [
          {
            label: "Good",
            data: standardPollutionData.good,
            backgroundColor: ["rgba(98, 196, 1, 0.2)"],
            stack: "Stack 0",
          },
          {
            label: "Fair",
            data: standardPollutionData.fair,
            backgroundColor: ["rgba(1, 97, 1, 0.3)"],
            stack: "Stack 0",
            hidden: true,
          },
          {
            label: "Moderate",
            data: standardPollutionData.moderate,
            backgroundColor: ["rgba(209, 209, 0, 0.4)"],
            stack: "Stack 0",
            hidden: true,
          },
          {
            label: "poor",
            data: standardPollutionData.poor,
            backgroundColor: ["rgba(255, 165, 0, 0.5)"],
            stack: "Stack 0",
            hidden: true,
          },
          {
            label: "Current Pollutant Levels",
            data: Object.values(currentValue),
            backgroundColor: ["rgba(53, 162, 235, 0.5)"],
            stack: "Stack 1",
          },
        ],
      }}
      options={options}
    />
  );
};
export default MyBarChart;
