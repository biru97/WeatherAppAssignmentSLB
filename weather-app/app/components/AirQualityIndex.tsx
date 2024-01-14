import React from "react";
import { useState, useEffect } from "react";
import styles from "./AirQualityIndex.module.css";
import MyBarChart from "./BarChartAqi";
import ForecastLineChart from "./ForecastLineChart";

interface AQI {
  location: {
    lat: number;
    lng: number;
  };
}

interface IAQIForecastData {
  co: number[];
  nh3: number[];
  no: number[];
  no2: number[];
  o3: number[];
  pm10: number[];
  pm2_5: number[];
  so2: number[];
}

const AirQualityIndex = ({ location }: AQI) => {
  const aqi: { [index: number]: string } = {
    1: "Good",
    2: "Fair",
    3: "Moderate",
    4: "Poor",
    5: "Very Poor",
  };
  const [airQualityData, SetAirQualityData] = useState({
    main: { aqi: 0 },
    components: {
      co: 0,
      no: 0,
      no2: 0,
      o3: 0,
      so2: 0,
      pm2_5: 0,
      pm10: 0,
      nh3: 0,
    },
  });
  const [forecastAqi, setForecastAqi] = useState<IAQIForecastData>({
    co: [],
    nh3: [],
    no: [],
    no2: [],
    o3: [],
    pm10: [],
    pm2_5: [],
    so2: [],
  });
  const pollutantConcentrationIndex: { [index: string]: number[] } = {
    co: [4400, 9400, 12400, 15400],
    nh3: [200, 400, 800, 1200],
    no: [40, 80, 180, 280],
    no2: [40, 70, 150, 200],
    o3: [60, 100, 140, 180],
    pm10: [20, 50, 100, 200],
    pm2_5: [10, 25, 50, 75],
    so2: [20, 80, 250, 350],
  };
  const handleColor = (p: number) => {
    switch (p) {
      case 1:
        return styles.textSuccess;
      case 2:
        return styles.textInfo;
      case 3:
        return styles.textSecondary;
      case 4:
        return styles.textWarning;
      case 5:
        return styles.textError;
      default:
        return styles.textPrimary;
    }
  };
  const [forecastChart, setForecastChart] = useState(false);
  useEffect(() => {
    // handleColor();
    fetch(
      `http://localhost:4000/location/aqi?lat=${
        location.lat === undefined ? 28.6517178 : location.lat
      }&lng=${location.lng === undefined ? 77.2219388 : location.lng}`
    )
      .then((res) => {
        return res.json();
      })
      .then((resData) => SetAirQualityData(resData))
      .catch((err) => console.log(err));
  }, [location.lat, location.lng]);

  const getAqiForecasts = () => {
    fetch(
      `http://localhost:4000/location/aqi/forecast?lat=${
        location.lat === undefined ? 28.6517178 : location.lat
      }&lng=${location.lng === undefined ? 77.2219388 : location.lng}`
    )
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setForecastChart(!forecastChart);
        setForecastAqi(resData);
      })
      .catch((err) => console.log(err));
  };

  const checkLevel = (key: any, level_val: any) => {
    let qlity;
    for (let i = 0; i < pollutantConcentrationIndex[key]?.length; i++) {
      if (level_val < pollutantConcentrationIndex[key][i]) {
        qlity = <span className={handleColor(i + 1)}>{aqi[i + 1]}</span>;
        break;
      }
      continue;
    }
    if (qlity == undefined) {
      qlity = <span className={handleColor(5)}>{aqi[5]}</span>;
    }
    return qlity;
  };

  const handleTable = () => {
    return (
      <tbody>
        {Object.entries(airQualityData.components).map(
          ([key, value], index) => {
            return (
              <tr key={index}>
                <th>{index + 1}</th>
                <td>{key.toUpperCase()}</td>
                <td>{checkLevel(key, value)}</td>
              </tr>
            );
          }
        )}
      </tbody>
    );
  };

  return (
    <>
      {forecastChart ? (
        <dialog id="my_modal_1" className="modal modal-open">
          <div
            className="modal-middle rounded-box bg-slate-100"
            style={{ width: "80%" }}
          >
            <button
              className="btn btn-lg btn-circle absolute right-2 top-2"
              onClick={() => setForecastChart(!forecastChart)}
            >
              ✕
            </button>
            <ForecastLineChart forecastData={forecastAqi}></ForecastLineChart>
          </div>
        </dialog>
      ) : (
        <></>
      )}
      <div className="overflow-x-auto flex justify-center">
        <table className="table table-md w-3/4 table-zebra">
          <thead>
            <tr>
              <th></th>
              <th>Pollutant&nbsp;Name</th>
              <th>Level&nbsp;(μg/m3)</th>
            </tr>
          </thead>
          {handleTable()}
        </table>
      </div>
      <div className="flex justify-center py-10">
        <div className="stats shadow place-content-center">
          <div className="stat">
            <div className="stat-figure text-primary"></div>
            <div className="stat-title">
              Air Quality Index&nbsp;
              <span className={handleColor(airQualityData.main?.aqi)}>
                {airQualityData.main?.aqi}
              </span>
            </div>
            <div
              className={`stat-value ${handleColor(airQualityData.main?.aqi)}`}
            >
              {aqi[airQualityData.main?.aqi]}
            </div>
          </div>
        </div>

        <div className="stats shadow place-content-center mx-5">
          <div className="stat">
            <button className="btn btn-ghost" onClick={() => getAqiForecasts()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-clock-history"
                viewBox="0 0 16 16"
              >
                <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
                <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
                <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
              </svg>
            </button>
            <div className="stat-title">
              See Forecasts Records for AQI of Your City
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-4/5">
          <MyBarChart currentValue={airQualityData.components}></MyBarChart>
        </div>
      </div>
    </>
  );
};

export default AirQualityIndex;
