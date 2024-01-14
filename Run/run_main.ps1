Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File .\run_flask.ps1" -PassThru

# Navigate to the React project directory
Set-Location -Path ..\weather-app

# Install dependencies (if not already installed)
npm install

# Build the React project
npm run build

# Run the React application
npm start