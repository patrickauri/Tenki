import { useState } from 'react'
import { kelvinToCelsius } from './Utilities'

require('dotenv').config()

const App = () => {
    const [input, setInput] = useState()
    const [weatherData, setWeatherData] = useState()
    const [countryName, setCountryName] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()
        document.getElementById('inputField').blur()
        fetchWeaterData(input)
    }

    const fetchWeatherDataByCoords = (lat, lon) => {
        const query = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_API_KEY}`
        fetch(query)
            .then((res) => res.json())
            .then((data) => {
                setWeatherData(data)
                if (data.sys) {
                    fetch(
                        `https://restcountries.eu/rest/v2/alpha/${data.sys.country}`
                    )
                        .then((res) => res.json())
                        .then((data) => {
                            setCountryName(data.name)
                        })
                        .catch((e) => console.log(e))
                }
            })
            .catch()
    }

    const fetchWeaterData = (i) => {
        const query = `http://api.openweathermap.org/data/2.5/weather?q=${i}&appid=${process.env.REACT_APP_API_KEY}`
        fetch(query)
            .then((res) => res.json())
            .then((data) => {
                setWeatherData(data)
                if (data.sys) {
                    fetch(
                        `https://restcountries.eu/rest/v2/alpha/${data.sys.country}`
                    )
                        .then((res) => res.json())
                        .then((data) => {
                            setCountryName(data.name)
                        })
                        .catch((e) => console.log(e))
                }
            })
            .catch()
    }

    const RenderWeatherEmoji = () => {
        if (weatherData.weather[0].id > 800) {
            // Clouds
            return '☁️'
        }
        if (weatherData.weather[0].id === 800) {
            // Clear
            return '☀️'
        }
        if (weatherData.weather[0].id > 700) {
            // Atmosphere
            return '🌪'
        }
        if (weatherData.weather[0].id > 600) {
            // Snow
            return '🌨'
        }
        if (weatherData.weather[0].id > 500) {
            // Rain
            return '🌧'
        }
        if (weatherData.weather[0].id > 300) {
            // Drizzle
            return '🌦'
        }
        if (weatherData.weather[0].id > 200) {
            // Thunderstorm
            return '⛈'
        }
        return ''
    }

    const Result = () => {
        if (weatherData) {
            switch (weatherData.cod) {
                case 200:
                    return (
                        <section className='weather'>
                            <h2 className='w-city'>{weatherData.name}</h2>
                            <h3 className='w-country'>
                                {countryName
                                    ? countryName
                                    : weatherData.sys.name}
                            </h3>
                            <p className='w-deg'>
                                <RenderWeatherEmoji />
                                <span className='w-deg-number'>
                                    {Math.round(
                                        kelvinToCelsius(weatherData.main.temp)
                                    )}
                                    °c
                                </span>
                            </p>
                            <p className='w-wind'>
                                <span className='w-wind-number'>
                                    💨
                                    {Math.round(weatherData.wind.speed)}{' '}
                                </span>
                                m/s
                            </p>
                            <p className='w-rain'>
                                <span className='w-rain-number'>
                                    ☂️
                                    {weatherData.rain
                                        ? weatherData.rain['1h']
                                        : '0'}{' '}
                                </span>
                                mm
                            </p>
                        </section>
                    )
                case '400':
                    return `You weren't supposed to do that 👀`
                case '404':
                    return (
                        <p className='error'>
                            Couldn't find that location. Please try somewhere
                            else 🤔
                        </p>
                    )
                default:
                    return 'empty'
            }
        } else return ''
    }

    const searchCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((p) => {
                fetchWeatherDataByCoords(p.coords.latitude, p.coords.longitude)
            })
        }
    }

    return (
        <main className='wrapper'>
            <h1>Tenki</h1>
            <section className='input-section'>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input
                        id='inputField'
                        onChange={(e) => setInput(e.target.value)}
                        type='text'
                        placeholder='Enter a location'
                        autoFocus
                    ></input>
                    <button
                        className={input ? '' : 'disabled'}
                        disabled={!input}
                    >
                        Search
                    </button>
                </form>
                <button
                    className='current-loc'
                    onClick={() => searchCurrentLocation()}
                    onTouchStart={() => searchCurrentLocation()}
                >
                    Use current location
                </button>
            </section>
            <section className='result'>
                <Result />
            </section>
        </main>
    )
}

export default App
