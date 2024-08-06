import React, { useState, useEffect } from "react";
import "../App.css";

const WeatherApp = () => {
    const [location, setLocation] = useState("");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");
    const [news, setNews] = useState([]);

    const handleInputChange = (e) => {
        setLocation(e.target.value);
    };

    const fetchWeatherData = async (lat, lon) => {
        try {
            const hourlyForecastResponse = await fetch(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=10716f74624b82ef50988045391acb59`);
            const hourlyForecastData = await hourlyForecastResponse.json();

            const dailyForecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=10716f74624b82ef50988045391acb59`);
            const dailyForecastData = await dailyForecastResponse.json();

            setWeather({
                hourlyForecast: hourlyForecastData,
                dailyForecast: dailyForecastData
            });
            setError("");
        } catch (error) {
            setError("Error fetching weather data. Please try again.");
            setWeather(null);
        }
    };

    const fetchNewsData = async () => {
        try {
            const response = await fetch('https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=EmLWi6p12hlNmxchgfnzifaR0eAICNPL');
            const data = await response.json();
            setNews(data.results);
        } catch (error) {
            console.error('Error fetching news data:', error);
            setNews([]);
        }
    };

    useEffect(() => {
        fetchNewsData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (location.trim() !== "") {
            // Fetch geocoding data
            const geocodingResponse = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=10716f74624b82ef50988045391acb59`);
            const geocodingData = await geocodingResponse.json();

            if (geocodingData.length === 0) {
                setError("Please enter a valid city.");
                setWeather(null);
            } else {
                const { lat, lon } = geocodingData[0];
                await fetchWeatherData(lat, lon);
            }
        } else {
            setError("Please enter a city.");
            setWeather(null);
        }
    };

    return (
        <div>
            <div>
                <h1>Weather App</h1>
                <hr />
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter a location"
                        value={location}
                        onChange={handleInputChange}
                    />
                    <button className = "customButton" type="submit">Get Weather</button>
                </form>
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}

            </div>


            {weather && !error && (
                <div>
                    <div className="hourlyWeather">
                        {weather.hourlyForecast && (
                            <div>
                                <h2>Today's Hourly Forecast</h2>
                                <br />
                                <div className = "hourlyForecastContainer">
                                    {weather.hourlyForecast.list.map((forecast, index) => {
                                        const date = new Date(forecast.dt * 1000);
                                        const today = new Date();
                                        if (date.getDate() === today.getDate()) {
                                            return (
                                                <div className="TodayHourly" key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                    <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <br />
                                                    {forecast.weather[0] && forecast.weather[0].icon && (
                                                        <img src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                                                            alt="Weather Icon" />
                                                    )}
                                                    <span>{forecast.weather[0].description}</span>
                                                    <br />
                                                    <br />
                                                    <span>{Math.floor((forecast.main.temp - 273.15) * 9 / 5 + 32)}°F</span>
                                                </div>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}

                                    
                                </div>
                            </div>
                        )}
                    </div>
    

                    <div className="hourlyWeather">
                        {weather.hourlyForecast && (
                            <div>
                                <h2>Tomorrow's Hourly Forcast</h2>
                                <br />
                                <div className = "hourlyForecastContainer">
                                    {weather.hourlyForecast.list.map((forecast, index) => {
                                        const date = new Date(forecast.dt * 1000);
                                        const nextDay = new Date();
                                        nextDay.setDate(nextDay.getDate() + 1);
                                        if (date.getDate() === nextDay.getDate()) {
                                            return (
                                                <div className = "TomorrowHourly" key={index}>
                                                    <p>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    {forecast.weather[0] && forecast.weather[0].icon && (
                                                        <img src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                                                            alt="Weather Icon" />
                                                    )}
                                                    <p>{Math.floor((forecast.main.temp - 273.15) * 9 / 5 + 32)}°F</p>
                                                    <p>{forecast.weather[0].description}</p>
                                                </div>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="dailyForecast">
                        {weather.dailyForecast && (
                            <div>
                                <h2>Next Week's Daily Forcast</h2>
                                <div className = "dailyForecastContainer">
                                    {weather.dailyForecast.list.map((forecast, index) => {
                                        const date = new Date(forecast.dt * 1000);
                                        const nextWeek = new Date();
                                        nextWeek.setDate(nextWeek.getDate() + 7);
                                        if (date <= nextWeek) {
                                            return (
                                                <div className = "Daily" key={index}>
                                                    <br />
                                                    <div>
                                                        <p>Date: {date.toLocaleDateString()}</p>
                                                        {forecast.weather[0].icon && (
                                                            <img src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                                                                alt="Weather Icon" />
                                                        )}
                                                        <p>{forecast.weather[0].description}</p>
                                                        <p>Temp (Day): {Math.floor((forecast.temp.day - 273.15) * 9 / 5 + 32)}°F</p>
                                                        <p>Temp (Night): {Math.floor((forecast.temp.night - 273.15) * 9 / 5 + 32)}°F</p>
                                                    </div>
                                                    <br />
                                                </div>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </div>
                            </div>
                        )}
                    </div>


                    <div>
                        <h2>Trending News:</h2>
                        <div className= "News">
                            {news.slice(0, 5).map((article, index) => (
                                <div key={index} className = "NewsCard">
                                    {article.media && article.media.length > 0 && (
                                        <img src={article.media[0]['media-metadata'][2].url} alt={article.title} style={{ width: '100%', marginBottom: '10px' }} />
                                    )}
                                    <a className = "aLink" href={article.url} target="_blank" rel="noopener noreferrer">
                                        <h3>{article.title}</h3>
                                    </a>
                                    <p style={{ marginBottom: '10px' }}>{article.abstract}</p>
                                    <p style={{ fontStyle: 'italic' }}>{article.byline}</p>
                                    <p>{article.published_date}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default WeatherApp;
