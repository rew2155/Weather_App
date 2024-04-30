import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Card, CardContent, CardMedia, Grid, Link } from "@mui/material";
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
            const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=10716f74624b82ef50988045391acb59`);
            const currentWeatherData = await currentWeatherResponse.json();

            const hourlyForecastResponse = await fetch(`https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${lat}&lon=${lon}&appid=10716f74624b82ef50988045391acb59`);
            const hourlyForecastData = await hourlyForecastResponse.json();

            const dailyForecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=7&appid=10716f74624b82ef50988045391acb59`);
            const dailyForecastData = await dailyForecastResponse.json();

            setWeather({
                currentWeather: currentWeatherData,
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
            <Typography variant="h1" gutterBottom>Weather App</Typography>
            <hr></hr>
            <form onSubmit={handleSubmit}>
                <TextField
                    variant="outlined"
                    placeholder="Enter location (city, country)"
                    value={location}
                    onChange={handleInputChange}
                />
                <Button className = "customButton" variant="contained" color="primary" type="submit">Get Weather</Button>
            </form>
            <br></br>
            {error && <Typography variant="body1" color="error">{error}</Typography>}
            {weather && !error && (
                <div>
                    <center><div className = "currentWeather">
                        {weather.currentWeather && (
                            <Card>
                                <CardContent>
                                    <Typography variant="h2">Current Weather</Typography>
                                    {weather.weather && weather.weather.length > 0 && weather.weather[0].icon && (
                                    <img
                                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                                alt="Weather Icon"
                                            />
                                        )}
                                    <Typography variant="body1">Description: {weather.currentWeather.weather[0].description}</Typography>
                                    <Typography variant="body1">Main Weather Forecast: {weather.currentWeather.weather[0].main}</Typography>
                                    <Typography variant="body1">Temperature: {Math.floor((weather.currentWeather.main.temp - 273.15) * 9 / 5 + 32)}°F</Typography>
                                    <Typography variant="body1">Feels Like: {Math.floor((weather.currentWeather.main.feels_like - 273.15) * 9 / 5 + 32)}°F</Typography>
                                    <Typography variant="body1">Low: {Math.floor((weather.currentWeather.main.temp_min - 273.15) * 9 / 5 + 32)}°F</Typography>
                                    <Typography variant="body1">High: {Math.floor((weather.currentWeather.main.temp_max - 273.15) * 9 / 5 + 32)}°F</Typography>
                                    <Typography variant="body1">Humidity: {weather.currentWeather.main.humidity} %</Typography>
                                    <Typography variant="body1">Wind Speed: {weather.currentWeather.wind.speed} mph</Typography>
                                </CardContent>
                            </Card>
                            )}
                        </div></center>
                        <br></br>

                        <center><div className="hourlyWeather">
                            {weather.hourlyForecast && (
                                <div>
                                    <Typography variant="h2">Tomorrow</Typography>
                                    <br />
                                    <Card>
                                        <CardContent>
                                            <Grid container direction="column" spacing={2}>
                                                {weather.hourlyForecast.list.map((forecast, index) => {
                                                    const date = new Date(forecast.dt * 1000);
                                                    const nextDay = new Date();
                                                    nextDay.setDate(nextDay.getDate() + 1);
                                                    if (date.getDate() === nextDay.getDate()) {
                                                        return (
                                                            <React.Fragment key={index}>
                                                                <Grid item>
                                                                    <Typography variant="body1">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Typography>
                                                                    {/* Display weather icon for each hour */}
                                                                    {forecast.weather[0] && forecast.weather[0].icon && (
                                                                        <CardMedia
                                                                            image={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                                                                            title="Weather Icon"
                                                                        />
                                                                    )}
                                                                    <Typography variant="body1">{Math.floor((forecast.main.temp - 273.15) * 9 / 5 + 32)}°F</Typography>
                                                                    <Typography variant="body1">{forecast.weather[0].description}</Typography>
                                                                    <hr></hr>
                                                                </Grid>
                                                                {index < weather.hourlyForecast.list.length - 1 && <hr />} {/* Add horizontal line between hours */}
                                                            </React.Fragment>
                                                        );
                                                    } else {
                                                        return null;
                                                    }
                                                })}
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div></center>

                        <br></br>

                        <div class = "dailyForcast">
                        {weather.dailyForecast && (
                            <div>
                                <Typography variant="h2">Next Week</Typography>
                                <Grid container spacing={2}>
                                    {weather.dailyForecast.list.map((forecast, index) => {
                                        const date = new Date(forecast.dt * 1000);
                                        const nextWeek = new Date();
                                        nextWeek.setDate(nextWeek.getDate() + 7);
                                        if (date <= nextWeek) {
                                            return (
                                                <Grid item key={index}>
                                                    <br></br>
                                                    <Card className= "weekCards">
                                                        <CardContent>
                                                            <Typography variant="body1">Date: {date.toLocaleDateString()}</Typography>
                                                            {/* Display weather icon for each day */}
                                                            {forecast.weather[0].icon && (
                                                                <CardMedia
                                                                    image={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                                                                    title="Weather Icon"
                                                                />
                                                            )}
                                                            <Typography variant="body1">Temperature (Day): {Math.floor((forecast.temp.day - 273.15) * 9 / 5 + 32)}°F</Typography>
                                                            <Typography variant="body1">Temperature (Night): {Math.floor((forecast.temp.night - 273.15) * 9 / 5 + 32)}°F</Typography>
                                                            <Typography variant="body1">{forecast.weather[0].description}</Typography>
                                                        </CardContent>

                                                        <br></br>

                                                    </Card>
                                                </Grid>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </Grid>
                            </div>
                        )}
                    </div>

                    <br></br>

                    <Typography variant="h2">Trending News:</Typography>

                    <br></br>

                    <center><div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
                        {news.slice(0, 4).map((article, index) => (
                            <div key={index} style={{ border: "1px solid #ccc", padding: "10px" }}>
                                {/* Display the first available multimedia image */}
                                {article.multimedia && article.multimedia.length > 0 && (
                                    <img src={article.multimedia[0].url} alt={article.title} style={{ width: "100%", marginBottom: "10px" }} />
                                )}
                                <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                                    <h3>{article.title}</h3>
                                </a>
                                <p style={{ marginBottom: "10px" }}>{article.abstract}</p>
                                {/* Render additional details */}
                                <p style={{ fontStyle: "italic" }}>{article.byline}</p>
                                <p>{article.published_date}</p>
                                {article.des_facet && article.des_facet.length > 0 && (
                                    <div>
                                        <span style={{ fontWeight: "bold" }}>Descriptors: </span>
                                        {article.des_facet.map((facet, index) => (
                                            <span key={index}>{facet}{index !== article.des_facet.length - 1 ? ', ' : ''}</span>
                                        ))}
                                    </div>
                                )}
                                {article.org_facet && article.org_facet.length > 0 && (
                                    <div>
                                        <span style={{ fontWeight: "bold" }}>Organizations: </span>
                                        {article.org_facet.map((facet, index) => (
                                            <span key={index}>{facet}{index !== article.org_facet.length - 1 ? ', ' : ''}</span>
                                        ))}
                                    </div>
                                )}
                                {article.per_facet && article.per_facet.length > 0 && (
                                    <div>
                                        <span style={{ fontWeight: "bold" }}>People: </span>
                                        {article.per_facet.map((facet, index) => (
                                            <span key={index}>{facet}{index !== article.per_facet.length - 1 ? ', ' : ''}</span>
                                        ))}
                                    </div>
                                )}
                                {article.geo_facet && article.geo_facet.length > 0 && (
                                    <div>
                                        <span style={{ fontWeight: "bold" }}>Locations: </span>
                                        {article.geo_facet.map((facet, index) => (
                                            <span key={index}>{facet}{index !== article.geo_facet.length - 1 ? ', ' : ''}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div></center>
    
                </div>
                )}
            </div>
        );
    }

export default WeatherApp;
