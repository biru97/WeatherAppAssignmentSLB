# Get user input for the environment variable
$env_value = Read-Host "Enter the value for ENV_VARIABLE"

# Set the environment variable
$env:OPEN_WEATHER_API_KEY = $env_value

# Navigate to the Flask project directory
Set-Location -Path ..\weather-app-server

# Install python dependencies
pip install -r requirements.txt

# Start the Flask application
python ..\weather-app-server\OpenWeatherProxyApp.py