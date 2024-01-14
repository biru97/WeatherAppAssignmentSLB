import React, { useEffect, useState } from "react";

interface WeatherStatLoc {
  location: {
    lat: number;
    lng: number;
  };
}

const WeatherStat = ({ location }: WeatherStatLoc) => {
  const [weatherData, SetWeatherData] = useState({
    clouds: { all: 0 },
    main: {
      temp: 0,
      fellsLike: 0,
      pressure: 0,
      humidity: 0,
      minTemp: 0,
      maxTemp: 0,
    },
    weather: { main: "", icon: "01d" },
    wind: { speed: 0, degree: 0 },
    rain: { duration: 0, volume: 0 },
    snow: { duration: 0, volume: 0 },
    visibility: 0,
  });
  useEffect(() => {
    fetch(
      `http://localhost:4000/location/weather?lat=${location.lat}&lng=${location.lng}`
    )
      .then((res) => {
        return res.json();
      })
      .then((resData) => SetWeatherData(resData))
      .catch((err) => console.log(err));
  }, [location.lat, location.lng]);

  return (
    <div
      className="flex justify-center "
      style={{
        backgroundImage: "url(/weatherBg.jpg)",
      }}
    >
      <div className="max-w-max p-3">
        <div className="stats stats-vertical shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <div className="avatar">
                <div className="w-16 rounded-full">
                  <img
                    src={`https://openweathermap.org/img/wn/${
                      weatherData?.weather?.icon || "01d"
                    }@2x.png`}
                  />
                </div>
              </div>
            </div>
            <div className="stat-title">
              {weatherData.weather?.main}&nbsp;{weatherData.main?.maxTemp}/
              {weatherData.main?.minTemp}&nbsp;°C
            </div>
            <div className="stat-value text-primary">
              {weatherData.main?.temp}&nbsp;°C
            </div>
            <div className="stat-desc">
              Fells Like {weatherData.main?.fellsLike}&nbsp;°C
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-droplet w-10 h-10"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21.8C7.69.295 8 0 8 0q.164.544.371 1.038c.812 1.946 2.073 3.35 3.197 4.6C12.878 7.096 14 8.345 14 10a6 6 0 0 1-12 0C2 6.668 5.58 2.517 7.21.8m.413 1.021A31 31 0 0 0 5.794 3.99c-.726.95-1.436 2.008-1.96 3.07C3.304 8.133 3 9.138 3 10a5 5 0 0 0 10 0c0-1.201-.796-2.157-2.181-3.7l-.03-.032C9.75 5.11 8.5 3.72 7.623 1.82z"
                />
              </svg>
            </div>
            <div className="stat-title">Humidity</div>
            <div className="stat-value text-secondary">
              {weatherData.main?.humidity}%
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-umbrella w-10 h-10"
                viewBox="0 0 24 24"
              >
                <path d="M8 0a.5.5 0 0 1 .5.5v.514C12.625 1.238 16 4.22 16 8c0 0 0 .5-.5.5-.149 0-.352-.145-.352-.145l-.004-.004-.025-.023a3.5 3.5 0 0 0-.555-.394A3.17 3.17 0 0 0 13 7.5c-.638 0-1.178.213-1.564.434a3.5 3.5 0 0 0-.555.394l-.025.023-.003.003s-.204.146-.353.146-.352-.145-.352-.145l-.004-.004-.025-.023a3.5 3.5 0 0 0-.555-.394 3.3 3.3 0 0 0-1.064-.39V13.5H8h.5v.039l-.005.083a3 3 0 0 1-.298 1.102 2.26 2.26 0 0 1-.763.88C7.06 15.851 6.587 16 6 16s-1.061-.148-1.434-.396a2.26 2.26 0 0 1-.763-.88 3 3 0 0 1-.302-1.185v-.025l-.001-.009v-.003s0-.002.5-.002h-.5V13a.5.5 0 0 1 1 0v.506l.003.044a2 2 0 0 0 .195.726c.095.191.23.367.423.495.19.127.466.229.879.229s.689-.102.879-.229c.193-.128.328-.304.424-.495a2 2 0 0 0 .197-.77V7.544a3.3 3.3 0 0 0-1.064.39 3.5 3.5 0 0 0-.58.417l-.004.004S5.65 8.5 5.5 8.5s-.352-.145-.352-.145l-.004-.004a3.5 3.5 0 0 0-.58-.417A3.17 3.17 0 0 0 3 7.5c-.638 0-1.177.213-1.564.434a3.5 3.5 0 0 0-.58.417l-.004.004S.65 8.5.5 8.5C0 8.5 0 8 0 8c0-3.78 3.375-6.762 7.5-6.986V.5A.5.5 0 0 1 8 0M6.577 2.123c-2.833.5-4.99 2.458-5.474 4.854A4.1 4.1 0 0 1 3 6.5c.806 0 1.48.25 1.962.511a9.7 9.7 0 0 1 .344-2.358c.242-.868.64-1.765 1.271-2.53m-.615 4.93A4.16 4.16 0 0 1 8 6.5a4.16 4.16 0 0 1 2.038.553 8.7 8.7 0 0 0-.307-2.13C9.434 3.858 8.898 2.83 8 2.117c-.898.712-1.434 1.74-1.731 2.804a8.7 8.7 0 0 0-.307 2.131zm3.46-4.93c.631.765 1.03 1.662 1.272 2.53.233.833.328 1.66.344 2.358A4.14 4.14 0 0 1 13 6.5c.77 0 1.42.23 1.897.477-.484-2.396-2.641-4.355-5.474-4.854z" />
              </svg>
            </div>
            <div className="stat-title">Rain</div>
            <div className="stat-value">
              {weatherData.rain?.duration === undefined
                ? "N/A"
                : weatherData.rain?.volume}
              &nbsp;mm
            </div>
            <div className="stat-desc text-secondary">
              Rain Measurement for last{" "}
              {weatherData.rain?.duration === undefined
                ? "N/A"
                : weatherData.rain?.duration}{" "}
              hrs
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-cloud-snow w-10 h-10"
                viewBox="0 0 24 24"
              >
                <path d="M13.405 4.277a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 10.25H13a3 3 0 0 0 .405-5.973M8.5 1.25a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1-.001 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4 4 0 0 1 8.5 1.25M2.625 11.5a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25m2.75 2a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25m5.5 0a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25m-2.75-2a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25m5.5 0a.25.25 0 0 1 .25.25v.57l.501-.287a.25.25 0 0 1 .248.434l-.495.283.495.283a.25.25 0 0 1-.248.434l-.501-.286v.569a.25.25 0 1 1-.5 0v-.57l-.501.287a.25.25 0 0 1-.248-.434l.495-.283-.495-.283a.25.25 0 0 1 .248-.434l.501.286v-.569a.25.25 0 0 1 .25-.25" />
              </svg>
            </div>
            <div className="stat-title">Snow</div>
            <div className="stat-value">
              {weatherData.snow?.duration === undefined
                ? "N/A"
                : weatherData.snow?.volume}
              &nbsp;mm
            </div>
            <div className="stat-desc text-secondary">
              Snow Measurement for last{" "}
              {weatherData.snow?.duration === undefined
                ? "N/A"
                : weatherData.snow?.duration}{" "}
              hrs
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-wind w-10 h-10"
                viewBox="0 0 24 24"
              >
                <path d="M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5m-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2M0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5" />
              </svg>
            </div>
            <div className="stat-value">{weatherData.wind?.speed}&nbsp;m/s</div>
            <div className="stat-title">Wind Speed</div>
            <div className="stat-desc text-secondary">
              Meteorological Wind Direction&nbsp;{weatherData.wind?.degree}
              &nbsp;°
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="bi bi-eye w-10 h-10"
                viewBox="0 0 24 24"
              >
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
              </svg>
            </div>
            <div className="stat-value">
              {weatherData.visibility}&nbsp;meter
            </div>
            <div className="stat-title">Visibility</div>
            <div className="stat-desc text-secondary">
              Distance Measuring Clear Sight of an Object
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherStat;
