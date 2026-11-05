import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/weather";

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

  return (
    <div className="app">
      <h1>Weather App</h1>

      <form onSubmit={handleSubmit}>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter a city"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="card">
          <h2>
            {weather.city}
            {weather.country && `, ${weather.country}`}
          </h2>
          <p className="temp">{Math.round(weather.temp)}°C</p>
          <p>Wind: {weather.windspeed} km/h</p>
        </div>
      )}
    </div>
  );
}

export default App;