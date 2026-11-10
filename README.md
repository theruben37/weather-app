# Weatherly

Weatherly is a city weather app that displays current temperature, wind speed, and weather conditions in a responsive interface. Search for a city or choose a popular destination. Weather and geocoding data are provided by [Open-Meteo](https://open-meteo.com/).

## Requirements

- Python 3
- Node.js and npm

## Run locally

Start the Flask API in one terminal:

```bash
cd backend
python -m pip install flask flask-cors requests
python backend.py
```

Start the Vite frontend in another terminal:

```bash
cd frontend/frontend
npm install
npm run dev
```

Open the local URL printed by Vite. The frontend expects the API at `http://localhost:5000/api/weather`.

## Frontend commands

Run these from `frontend/frontend`:

```bash
npm run lint
npm run build
npm run preview
```
