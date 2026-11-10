import { useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api/weather'
const QUICK_CITIES = ['London', 'Tokyo', 'New York', 'Reykjavik']

function getWeatherInfo(code) {
  if (code === 0) return { label: 'Clear sky', icon: 'sun', theme: 'sunny' }
  if (code === 1) return { label: 'Mainly clear', icon: 'sun', theme: 'sunny' }
  if (code === 2) return { label: 'Partly cloudy', icon: 'partly-cloudy', theme: 'cloudy' }
  if (code === 3) return { label: 'Overcast', icon: 'cloud', theme: 'cloudy' }
  if (code === 45 || code === 48) return { label: 'Fog', icon: 'fog', theme: 'fog' }
  if (code >= 51 && code <= 57) return { label: 'Drizzle', icon: 'rain', theme: 'rain' }
  if (code >= 61 && code <= 67) return { label: 'Rain', icon: 'rain', theme: 'rain' }
  if (code >= 71 && code <= 77) return { label: 'Snow', icon: 'snow', theme: 'snow' }
  if (code >= 80 && code <= 82) return { label: 'Rain showers', icon: 'rain', theme: 'rain' }
  if (code === 85 || code === 86) return { label: 'Snow showers', icon: 'snow', theme: 'snow' }
  if (code >= 95) return { label: 'Thunderstorm', icon: 'storm', theme: 'storm' }
  return { label: 'Conditions unavailable', icon: 'cloud', theme: 'default' }
}

function WeatherIcon({ type, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 160 160"
    >
      {type === 'sun' && (
        <g className="weather-icon__sun">
          <circle cx="80" cy="80" r="28" />
          <path d="M80 12v18m0 100v18M12 80h18m100 0h18M32 32l13 13m70 70 13 13m0-96-13 13m-70 70-13 13" />
        </g>
      )}
      {type === 'partly-cloudy' && (
        <>
          <g className="weather-icon__sun weather-icon__sun--small">
            <circle cx="103" cy="53" r="23" />
            <path d="M103 10v12m0 62v12M60 53h12m62 0h12m-73-30 9 9m44 44 9 9m0-62-9 9m-44 44-9 9" />
          </g>
          <path className="weather-icon__cloud" d="M39 119h75a22 22 0 0 0 1-44 36 36 0 0 0-68-5A25 25 0 0 0 39 119Z" />
        </>
      )}
      {['cloud', 'fog', 'rain', 'snow', 'storm'].includes(type) && (
        <path className="weather-icon__cloud" d="M39 103h75a22 22 0 0 0 1-44 36 36 0 0 0-68-5A25 25 0 0 0 39 103Z" />
      )}
      {type === 'fog' && (
        <g className="weather-icon__precipitation">
          <path d="M34 120h92M44 136h72" />
        </g>
      )}
      {type === 'rain' && (
        <g className="weather-icon__precipitation">
          <path d="m54 118-8 15m34-15-8 15m34-15-8 15" />
        </g>
      )}
      {type === 'snow' && (
        <g className="weather-icon__precipitation weather-icon__snow">
          <path d="M53 119v19m-8-14 16 9m0-9-16 9m35-14v19m-8-14 16 9m0-9-16 9m35-14v19m-8-14 16 9m0-9-16 9" />
        </g>
      )}
      {type === 'storm' && (
        <>
          <path className="weather-icon__bolt" d="m83 108-17 28h17l-7 19 25-32H83l8-15Z" />
          <path className="weather-icon__precipitation" d="m48 117-6 12m70-12-6 12" />
        </>
      )}
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4 4" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h12m-5-5 5 5-5 5" />
    </svg>
  )
}

function WindIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 28 28" fill="none">
      <path d="M4 9h15a3 3 0 1 0-3-3M3 14h20a3 3 0 1 1-3 3M5 19h10a3 3 0 1 1-3 3" />
    </svg>
  )
}

function WeatherCard({ weather }) {
  const info = getWeatherInfo(weather.weathercode)

  return (
    <section className={`weather-card weather-card--${info.theme}`} aria-label="Current weather">
      <div className="weather-card__topline">
        <div>
          <p className="weather-card__eyebrow">CURRENT CONDITIONS</p>
          <h2 className="weather-card__location">
            {weather.city}
            {weather.country && <span>, {weather.country}</span>}
          </h2>
        </div>
        <span className="weather-card__live">
          <span aria-hidden="true" />
          Right now
        </span>
      </div>

      <div className="weather-card__main">
        <div className="weather-card__temperature">
          <p className="weather-card__condition">{info.label}</p>
          <p className="weather-card__degrees">
            {Math.round(weather.temp)}
            <span>°</span>
          </p>
          <p className="weather-card__unit">Celsius</p>
        </div>
        <div className="weather-card__art" aria-hidden="true">
          <span className="weather-card__glow" />
          <WeatherIcon type={info.icon} className="weather-icon" />
        </div>
      </div>

      <div className="weather-card__divider" />

      <div className="weather-card__details">
        <div className="weather-detail">
          <span className="weather-detail__icon"><WindIcon /></span>
          <span className="weather-detail__copy">
            <span className="weather-detail__label">Wind speed</span>
            <span className="weather-detail__value">{weather.windspeed} <small>km/h</small></span>
          </span>
        </div>
        <p className="weather-card__note">A snapshot of the weather in your city.</p>
      </div>
    </section>
  )
}

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function searchCity(value) {
    const query = value.trim()
    if (!query) {
      setError('Enter a city name to search.')
      return
    }

    setCity(query)
    setLoading(true)
    setError('')

    try {
      let response
      try {
        response = await fetch(`${API_URL}?city=${encodeURIComponent(query)}`)
      } catch {
        setError('Could not reach the weather server. Check that it is running and try again.')
        return
      }

      let data
      try {
        data = await response.json()
      } catch {
        setError('The weather server returned an unreadable response. Please try again.')
        return
      }

      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        setError('The weather server returned an unreadable response. Please try again.')
        return
      }

      if (!response.ok) {
        const messages = {
          'city not found': 'We couldn’t find that city. Check the spelling and try again.',
          'geocoding service unavailable': 'City search is temporarily unavailable. Please try again shortly.',
          'weather service unavailable': 'Weather data is temporarily unavailable. Please try again shortly.',
        }
        setError(messages[data.error] || data.error || 'Could not load weather for that city.')
        return
      }

      setWeather(data)
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    searchCity(city)
  }

  const theme = weather ? getWeatherInfo(weather.weathercode).theme : 'default'

  return (
    <div className="app-shell">
      <div className="page-decoration" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="/" aria-label="Weatherly home">
          <span className="brand__mark" aria-hidden="true">
            <span />
          </span>
          <span>weather<span className="brand__accent">ly</span></span>
        </a>
        <span className="topbar__caption">A clearer view of your day</span>
      </header>

      <main className="main-content">
        <section className="intro">
          <p className="eyebrow"><span /> WEATHER, MADE SIMPLE</p>
          <h1>Weather for<br /><span>wherever you are.</span></h1>
          <p className="intro__description">
            Current conditions for wherever life takes you.
          </p>
        </section>

        <section className="search-panel" aria-label="Search for a city">
          <form className="search-form" onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="city-search">City name</label>
            <span className="search-form__icon"><SearchIcon /></span>
            <input
              autoComplete="off"
              id="city-search"
              onChange={(event) => setCity(event.target.value)}
              placeholder="Search a city..."
              type="search"
              value={city}
            />
            <button disabled={loading} type="submit">
              <span>{loading ? 'Searching' : 'Search'}</span>
              {loading ? <span className="button-spinner" aria-hidden="true" /> : <ArrowIcon />}
            </button>
          </form>

          {error && <p className="search-error" role="alert">{error}</p>}

          <div className="quick-searches">
            <span className="quick-searches__label">Popular:</span>
            {QUICK_CITIES.map((name) => (
              <button
                className="city-chip"
                disabled={loading}
                key={name}
                onClick={() => searchCity(name)}
                type="button"
              >
                {name}
              </button>
            ))}
          </div>
        </section>

        <section className={`weather-area weather-area--${theme}`} aria-live="polite">
          {weather ? (
            <WeatherCard weather={weather} />
          ) : loading ? (
            <div className="empty-state empty-state--loading" role="status">
              <span className="loading-orbit"><span /></span>
              <p>Looking up the weather<span className="loading-dots">...</span></p>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__art" aria-hidden="true">
                <span className="empty-state__sun" />
                <span className="empty-state__cloud empty-state__cloud--back" />
                <span className="empty-state__cloud" />
              </div>
              <p className="empty-state__title">Your weather, at a glance</p>
              <p className="empty-state__description">
                Search for a city or pick a popular destination to get started.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="page-footer">
        <span>Made for wherever you are.</span>
        <span className="page-footer__dot" aria-hidden="true">·</span>
        <span>Weather data by Open-Meteo</span>
      </footer>
    </div>
  )
}

export default App
