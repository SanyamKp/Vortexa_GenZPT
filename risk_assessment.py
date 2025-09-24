# risk_assessment.py
import requests

OWM_API_KEY = "YOUR_API_KEY_HERE"

def get_weather(lat: float, lon: float):
    if not OWM_API_KEY or OWM_API_KEY == "2055f0259fd3fc59d58361bf7afb93ce":
        return None

    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OWM_API_KEY}&units=metric"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return {
            "temp": data.get("main", {}).get("temp"),
            "humidity": data.get("main", {}).get("humidity"),
            "rain_1h": data.get("rain", {}).get("1h", 0)
        }
    except requests.exceptions.RequestException as e:
        print(f"Error fetching weather data: {e}")
        return None

def compute_risk_score(confidence: float, weather_data: dict):
    risk = confidence * 0.6
    if weather_data:
        if weather_data.get("humidity", 0) > 80: risk += 0.2
        temp = weather_data.get("temp", 0)
        if temp and 18 <= temp <= 28: risk += 0.1
        if weather_data.get("rain_1h", 0) > 0: risk += 0.1

    if risk > 0.75: return "High"
    elif risk > 0.45: return "Medium"
    else: return "Low"
