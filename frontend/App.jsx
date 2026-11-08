import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/weather";

// Open-Meteo returns a numeric WMO code; map it to text, emoji and a theme
function getWeatherInfo(code) {
  if (code === 0) return { label: "Clear sky", icon: "☀️", theme: "sunny" };
  if (code <= 2) return { label: "Partly cloudy", icon: "⛅", theme: "cloudy" };
  if (code === 3) return { label: "Overcast", icon: "☁️", theme: "cloudy" };
  if (code === 45 || code === 48) return { label: "Fog", icon: "🌫️", theme: "fog" };
  if (code >= 51 && code <= 57) return { label: "Drizzle", icon: "🌦️", theme: "rain" };
  if (code >= 61 && code <= 67) return { label: "Rain", icon: "🌧️", theme: "rain" };
  if (code >= 71 && code <= 77) return { label: "Snow", icon: "❄️", theme: "snow" };
  if (code >= 80 && code <= 82) return { label: "Rain showers", icon: "🌧️", theme: "rain" };
  if (code === 85 || code === 86) return { label: "Snow showers", icon: "🌨️", theme: "snow" };
  if (code >= 95) return { label: "Thunderstorm", icon: "⛈️", theme: "storm" };
  return { label: "Unknown", icon: "🌡️", theme: "default" };
}

function WeatherCard({ weather }) {
  const info = getWeatherInfo(weather.weathercode);

  return (
    <div className="card">
      <p className="location">
        {weather.city}
        {weather.country && `, ${weather.country}`}
      </p>
      <div className="icon">{info.icon}</div>
      <p className="temp">{Math.round(weather.temp)}°</p>
      <p className="label">{info.label}</p>

      <div className="stats">
        <div className="stat">
          <span className="stat-value">{weather.windspeed} km/h</span>
          <span className="stat-name">Wind</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(`${API_URL}?city=${encodeURIComponent(city.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  const theme = weather ? getWeatherInfo(weather.weathercode).theme : "default";

  return (
    <div className={`app ${theme}`}>
      <div className="container">
        <h1>Weather</h1>
        <p className="subtitle">Search any city in the world</p>

        <form onSubmit={handleSubmit}>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search for a city..."
          />
          <button type="submit" disabled={loading}>
            {loading ? "..." : "Search"}
          </button>
        </form>

        {loading && <div className="spinner" />}
        {error && <p className="error">{error}</p>}
        {weather && <WeatherCard weather={weather} />}
      </div>
    </div>
  );
}

export default App;