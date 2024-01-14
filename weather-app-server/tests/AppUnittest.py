import unittest
from unittest.mock import patch, MagicMock
import sys
from datetime import datetime
import math
sys.path.insert(0, '../../weather-app-server')
from OpenWeatherProxyApp import app


class TestApp(unittest.TestCase):

    @patch('requests.get')
    def test_get_location_valid_city(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = [{'lat': 1.23, 'lon': 4.56, 'name': 'CityName', 'country': 'US', 'state': 'CA'}]

        with app.test_client() as client:
            response = client.get('/location?city=CityName&state=CA&country=US')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), {"latitude": 1.23, "longitude": 4.56, "name": "CityName", "country": "US", "state": "CA"})

    @patch('requests.get')
    def test_get_location_invalid_city(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = []

        with app.test_client() as client:
            response = client.get('/location?city=NonExistentCity')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"Error": "City was not found!!"})

    @patch('requests.get')
    def test_get_location_missing_city(self, mock_get):
        with app.test_client() as client:
            response = client.get('/location?state=Kentucky')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"Error": "Missing a required argument i.e., City!!"})

    @patch('requests.get')
    def test_get_location_missing_parameters(self, mock_get):
        with app.test_client() as client:
            response = client.get('/location')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"Error": "Missing parameters, at least city is a must required argument (state and country are optional, FYI: correct order is city, state, country)!!"})

    @patch('requests.get')    
    def test_get_current_weather_success(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {
            "coord": {
                "lon": 115,
                "lat": -8.5
            },
            "weather": [
                {
                    "id": 804,
                    "main": "Clouds",
                    "description": "overcast clouds",
                    "icon": "04n"
                }
            ],
            "base": "stations",
            "main": {
                "temp": 28.46,
                "feels_like": 33.84,
                "temp_min": 28.46,
                "temp_max": 28.54,
                "pressure": 1009,
                "humidity": 83,
                "sea_level": 1009,
                "grnd_level": 1001
            },
            "visibility": 10000,
            "wind": {
                "speed": 2.15,
                "deg": 248,
                "gust": 2.91
            },
            "clouds": {
                "all": 100
            },
            "dt": 1705235870,
            "sys": {
                "type": 2,
                "id": 2020640,
                "country": "ID",
                "sunrise": 1705183883,
                "sunset": 1705229133
            },
            "timezone": 28800,
            "id": 1650535,
            "name": "Bali",
            "cod": 200
        }

        with app.test_client() as client:
            response = client.get('/location/weather?lat=1.23&lng=4.56')

        self.assertEqual(response.status_code, 200)
        expected_response = {
            "clouds": {
                "all": 100
            },
            "main": {
                "fellsLike": 33.84,
                "humidity": 83,
                "maxTemp": 28.54,
                "minTemp": 28.46,
                "pressure": 1009,
                "temp": 28.46
            },
            "rain": {},
            "snow": {},
            "visibility": 10000,
            "weather": {
                "icon": "04n",
                "main": "Clouds"
            },
            "wind": {
                "degree": 248,
                "speed": 2.15
            }
        }
        self.assertEqual(response.get_json(), expected_response)

    @patch('requests.get')
    def test_get_current_weather_city_not_found(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {"cod": 404}

        with app.test_client() as client:
            response = client.get('/location/weather?lat=1.23&lng=4.56')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.get_json(), {"Error": "City Could not be found !!"})

    @patch('requests.get')
    def test_get_current_weather_server_error(self, mock_get):
        mock_get.return_value.status_code = 502

        with app.test_client() as client:
            response = client.get('/location/weather?lat=1.23&lng=4.56')

        self.assertEqual(response.status_code, 502)
        self.assertEqual(response.get_json(), {"Error": "Open Weather Server Error, Bad Gateway !!"})

    @patch('requests.get')    
    def test_get_current_weather_missing_parameters(self, mock_get):
        with app.test_client() as client:
            response = client.get('/location/weather')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"Error": "Parameters are missing !!"})

    @patch('requests.get')
    def test_air_pollution_data_valid_parameters(self, mock_get):
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {
            "coord": {
                "lon": -84.0833,
                "lat": 37.129
            },
            "list": [{
                "main": {"aqi": 2},
                "components": {"co": 0.5, "no": 2.5, "no2": 1.5, "o3": 10, "so2": 1, "pm2_5": 5, "pm10": 10, "nh3": 2},
                "dt": 1705154408
            }]
        }

        with app.test_client() as client:
            response = client.get('/location/aqi?lat=1.23&lng=4.56')

        expected_response = {
            "main": {"aqi": 2},
            "components": {"co": 0.5, "no": 2.5, "no2": 1.5, "o3": 10, "so2": 1, "pm2_5": 5, "pm10": 10, "nh3": 2}
        }

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json(), expected_response)

    @patch('requests.get')
    def test_air_pollution_data_missing_parameters(self, mock_get):
        with app.test_client() as client:
            response = client.get('/location/aqi')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"Error": "Parameters are missing !!"})

    @patch('requests.get')
    def test_air_pollution_data_open_weather_error(self, mock_get):
        mock_get.return_value.status_code = 500

        with app.test_client() as client:
            response = client.get('/location/aqi?lat=1.23&lng=4.56')

        self.assertEqual(response.status_code, 502)
        self.assertEqual(response.get_json(), {"Error": "Open Weather Server Error, Bad Gateway !!"})

    @patch('requests.get')
    def test_air_pollution_forecast_data_valid_coordinates(self, mock_get):
        mock_get.return_value.status_code = 200
        unix_timestamp = math.floor((datetime.now() - datetime(1970, 1, 1)).total_seconds())
        mock_get.return_value.json.return_value = {
            "list": [
                {
                    "dt": unix_timestamp+7200,
                    "components": {
                        "co": 267.03,
                        "nh3": 0.88,
                        "no": 1.06,
                        "no2": 7.97,
                        "o3": 77.25,
                        "pm10": 5.96,
                        "pm2_5": 5.35,
                        "so2": 6.62
                    }
                },{
                    "dt": unix_timestamp+10800,
                    "components": {
                        "co": 267.03,
                        "nh3": 1.01,
                        "no": 1.66,
                        "no2": 7.37,
                        "o3": 77.25,
                        "pm10": 6.48,
                        "pm2_5": 5.72,
                        "so2": 6.91
                    }
                }
            ]
        }

        with app.test_client() as client:
            response = client.get('/location/aqi/forecast?lat=10&lng=20')

        self.assertEqual(response.status_code, 200)
        expected_result = {
            "co": [267.03, 267.03],
            "no": [1.06, 1.66],
            "no2": [7.97, 7.37],
            "o3": [77.25, 77.25],
            "so2": [6.62, 6.91],
            "pm2_5": [5.35, 5.72],
            "pm10": [5.96, 6.48],
            "nh3": [0.88, 1.01],
        }
        self.assertEqual(response.get_json(), expected_result)

    @patch('requests.get')
    def test_air_pollution_forecast_data_missing_coordinates(self, mock_get):
        with app.test_client() as client:
            response = client.get('/location/aqi/forecast')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.get_json(), {"Error": "Parameters are missing !!"})

    @patch('requests.get')
    def test_air_pollution_forecast_data_openweather_error(self, mock_get):
        mock_get.return_value.status_code = 502

        with app.test_client() as client:
            response = client.get('/location/aqi/forecast?lat=10&lng=20')

        self.assertEqual(response.status_code, 502)
        self.assertEqual(response.get_json(), {"Error": "Open Weather Server Error, Bad Gateway !!"})


if __name__ == '__main__':
    unittest.main()