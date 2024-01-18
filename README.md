# WeatherAppAssignmentSLB
Weather Application with AQI

## Setup Instructions

### Prerequisites

- Ensure that the Python executable (v3.11) is in the system's PATH.
- Ensure that the Node Run time (v20.11.0) is in the system's PATH.
- Ensure you have an OpenWeather API Key with the following access:
    1. Air Pollution API
    2. Current Weather Data
    3. Geocoding API

### Repository Setup

1. Clone the repository.
2. Move into the Run Folder.

### Running on Windows (Easy 1-stop start)

1. Run the PowerShell script in the Run folder: `.\run_main.ps1`.

`Note: (Important)` This will open 1 extra window to run flask app, where an user input is required for the `openweather api key`, please insert before moving to check functionality.

### Running on Linux/windows

#### Flask Server

1. Go to the `weather-app-server` folder.
2. Run `pip install -r requirements.txt` to install dependencies.
3. Add Environment Variable with name `OPEN_WEATHER_API_KEY`, the value will be the open weather api key.
4. Run `python ./OpenWeatherProxyApp.py` to start the server (will start on port 4000).

**Note:** For Unit Tests, navigate to `/weather-app-server/tests` and run `python ./AppUnittest.py`.

#### React App

1. Go to the `weather-app` folder.
2. Run `npm install` to install dependencies.
3. Run `npm run build` to build the application.
4. Run `npm start` to start the application (will start on the default port 3000).