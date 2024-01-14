from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import math
import requests
import os

app = Flask(__name__)
CORS(app)

OPEN_WEATHER_API_KEY = os.getenv("OPEN_WEATHER_API_KEY")

@app.route("/location", methods=['GET'])
def get_location():
    request_args_dict = request.args.to_dict()
    if len(request_args_dict.keys()) != 0:
        if 'city' in request_args_dict.keys():
            tuple_url_extras = f"http://api.openweathermap.org/geo/1.0/direct?q={request_args_dict['city']}",f",{request_args_dict['state']}" if 'state' in request_args_dict.keys() else "",f",{request_args_dict['country']}" if 'country' in request_args_dict.keys() else "","&limit=5&appid={OPEN_WEATHER_API_KEY}"
            url = "".join(tuple_url_extras)
            res = requests.get(url)
            if res.status_code == 200:
                if len(res.json()) > 0:
                    res_obj = res.json()[0]
                    return jsonify({"latitude": res_obj['lat'], "longitude": res_obj['lon'], "name": res_obj['name'], "country": res_obj['country'], "state": res_obj['state'] if 'state' in res_obj else ""}), 200
                return jsonify({"Error": "City was not found!!"}), 404
        return jsonify({"Error": "Missing a required argument i.e., City!!"}), 400
    return jsonify({"Error": "Missing parameters, at least city is a must required argument (state and country are optional, FYI: correct order is city, state, country)!!"}), 400

@app.route("/location/weather", methods=['GET'])
def get_current_weather():
    request_args_dict = request.args.to_dict()
    if 'lat' in request_args_dict.keys() and 'lng' in request_args_dict.keys():
        lat = request.args.get('lat')
        lng = request.args.get('lng')
        temp_rain = {}
        temp_snow = {}
        res = requests.get(f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={OPEN_WEATHER_API_KEY}&units=Metric")
        if res.status_code == 200:
            temp_res_obj = res.json()
            if temp_res_obj["cod"] == 200:
                if "rain" in temp_res_obj.keys():
                    if "1h" in temp_res_obj["rain"].keys():
                        temp_rain = { "duration": 1, "volume": temp_res_obj["rain"]['1h'] }
                    else:
                        temp_rain = { "duration": 3, "volume": temp_res_obj["rain"]['3h'] }
                if "snow" in temp_res_obj.keys():
                    if "1h" in temp_res_obj["snow"].keys():
                        temp_snow = { "duration": 1, "volume": temp_res_obj["snow"]['1h'] }
                    else:
                        temp_snow = { "duration": 3, "volume": temp_res_obj["snow"]['3h'] }
                res_obj = {
                        "clouds": { "all": temp_res_obj["clouds"]["all"] },
                        "main": {
                            "temp": temp_res_obj["main"]["temp"],
                            "fellsLike": temp_res_obj["main"]["feels_like"],
                            "pressure": temp_res_obj["main"]["pressure"],
                            "humidity": temp_res_obj["main"]["humidity"],
                            "minTemp": temp_res_obj["main"]["temp_min"],
                            "maxTemp": temp_res_obj["main"]["temp_max"],
                        },
                        "weather": { "main": temp_res_obj["weather"][0]["main"], "icon": temp_res_obj["weather"][0]["icon"] },
                        "wind": { "speed": temp_res_obj["wind"]["speed"], "degree": temp_res_obj["wind"]["deg"] },
                        "rain": temp_rain ,
                        "snow": temp_snow ,
                        "visibility": temp_res_obj["visibility"],
                    }
                return res_obj, 200
            if temp_res_obj["cod"] == 401:
                return jsonify({"Error": "City Could not be found !!"}), 404
            if temp_res_obj["cod"] == 404:    
                return jsonify({"Error": "City Could not be found !!"}), 404
        return jsonify({"Error": "Open Weather Server Error, Bad Gateway !!"}), 502
    return jsonify({"Error": "Parameters are missing !!"}), 400

@app.route("/location/aqi", methods=['GET'])
def air_pollution_data():
    request_args_dict = request.args.to_dict()
    if 'lat' in request_args_dict.keys() and 'lng' in request_args_dict.keys():
        lat = request.args.get('lat')
        lng = request.args.get('lng')
        res = requests.get(f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lng}&appid={OPEN_WEATHER_API_KEY}")
        if res.status_code == 200:
            temp_res_obj = res.json()
            temp_aqi_obj = {
                "main": { "aqi": temp_res_obj["list"][0]["main"]["aqi"] },
                "components": {
                    "co": temp_res_obj["list"][0]["components"]["co"],
                    "no": temp_res_obj["list"][0]["components"]["no"],
                    "no2": temp_res_obj["list"][0]["components"]["no2"],
                    "o3": temp_res_obj["list"][0]["components"]["o3"],
                    "so2": temp_res_obj["list"][0]["components"]["so2"],
                    "pm2_5": temp_res_obj["list"][0]["components"]["pm2_5"],
                    "pm10": temp_res_obj["list"][0]["components"]["pm10"],
                    "nh3": temp_res_obj["list"][0]["components"]["nh3"],
                },
            }
            return temp_aqi_obj, 200
        return jsonify({"Error": "Open Weather Server Error, Bad Gateway !!"}), 502
    return jsonify({"Error": "Parameters are missing !!"}), 400

@app.route("/location/aqi/forecast", methods=['GET'])
def air_pollution_forecast_data():
    request_args_dict = request.args.to_dict()
    if 'lat' in request_args_dict.keys() and 'lng' in request_args_dict.keys():
        lat = request.args.get('lat')
        lng = request.args.get('lng')
        res = requests.get(f"http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat={lat}&lon={lng}&appid={OPEN_WEATHER_API_KEY}")
        if res.status_code == 200:
            temp_res_obj = res.json()
            unix_timestamp = math.floor((datetime.now() - datetime(1970, 1, 1)).total_seconds())
            aqi_obj = {
                "co": [],
                "nh3": [],
                "no": [],
                "no2": [],
                "o3": [],
                "pm10": [],
                "pm2_5": [],
                "so2": [],
            }
            for each in temp_res_obj["list"]:
                if each["dt"]>unix_timestamp and each["dt"]<unix_timestamp+43200:
                    for i in each["components"].keys():
                        aqi_obj[i].append(each["components"][i])
            return aqi_obj, 200
        return jsonify({"Error": "Open Weather Server Error, Bad Gateway !!"}), 502
    return jsonify({"Error": "Parameters are missing !!"}), 400
        
if __name__ == "__main__":
    app.run("0.0.0.0", 4000, debug=True)