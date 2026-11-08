import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

app = Flask(__name__)
CORS(app)


@app.route("/api/weather")
def weather_route():
    city = request.args.get("city")

    if not city:
        return jsonify({"error": "city is required"}), 400

    try:
        r1 = requests.get(
            GEOCODING_URL,
            params={"name": city, "count": 1},
            timeout=5,
        )
        r1.raise_for_status()
    except requests.exceptions.RequestException:
        return jsonify({"error": "geocoding service unavailable"}), 502

    results = r1.json().get("results")
    if not results:
        return jsonify({"error": "city not found"}), 404

    place = results[0]

    try:
        r2 = requests.get(
            FORECAST_URL,
            params={
                "latitude": place["latitude"],
                "longitude": place["longitude"],
                "current_weather": True,
            },
            timeout=5,
        )
        r2.raise_for_status()
    except requests.exceptions.RequestException:
        return jsonify({"error": "weather service unavailable"}), 502

    weather = r2.json()["current_weather"]

    return jsonify({
        "city": place["name"],
        "country": place.get("country"),
        "temp": weather["temperature"],
        "windspeed": weather["windspeed"],
        "weathercode": weather["weathercode"],   # new
    })


if __name__ == "__main__":
    app.run(port=5000, debug=True)