import React, { useState } from 'react';
import "../App.css";

const WeatherApp = () => {
    const [location, setLocation] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        setLocation(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (location.trim() !== "") {
            // Fetch weather data
            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=10716f74624b82ef50988045391acb59`);
            const weatherData = await weatherResponse.json();

            // Fetch geocoding data
            const geocodingResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=10716f74624b82ef50988045391acb59`);
            const geocodingData = await geocodingResponse.json();

            if (weatherData.cod && weatherData.cod !== 200) {
                setError("Please enter a valid city.");
                setWeather(null);
            } else {
                setWeather({ ...weatherData, coordinates: geocodingData[0]?.lat && geocodingData[0]?.lon ? { lat: geocodingData[0].lat, lon: geocodingData[0].lon } : null });
                setError("");
            }
        } else {
            setError("Please enter a city.");
            setWeather(null);
        }
    };

    return (
        <>
            <h1>Weather App</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter location (city, country)"
                    value={location}
                    onChange={handleInputChange}
                />
                <button type="submit">Get Weather</button>
            </form>
            {error && (
                <p>{error}</p>
            )}
            {weather && !error && (
                <div>
                    <h2>Weather Details</h2>
                    {weather.weather[0].icon && (
                        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="Weather Icon" />
                    )}
                    {weather.weather[0].description}
                    <p>Main Weather Forecast: {weather.weather[0].main}</p>
                    <p>Temperature: {Math.floor((weather.main.temp - 273.15) * 9 / 5 + 32)}°F</p>
                    <p>Feels Like: {Math.floor((weather.main.feels_like - 273.15) * 9 / 5 + 32)}°F</p>
                    <p>Low: {Math.floor((weather.main.temp_min - 273.15) * 9 / 5 + 32)}°F</p>
                    <p>High: {Math.floor((weather.main.temp_max - 273.15) * 9 / 5 + 32)}°F</p>
                    <p>Humidity: {weather.main.humidity} %</p>
                    <p>Wind Speed: {weather.wind.speed} mph</p>

                    {weather.coordinates && (
                        <div>
                            <h2>Location Coordinates</h2>
                            <p>Latitude: {weather.coordinates.lat}</p>
                            <p>Longitude: {weather.coordinates.lon}</p>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

export default WeatherApp;
