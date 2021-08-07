import { useState } from 'react'
import { kelvinToCelsius } from './Utilities'

require('dotenv').config()

const App = () => {
    const [input, setInput] = useState()
    const [weatherData, setWeatherData] = useState()
    const [countryName, setCountryName] = useState()

    const handleSubmit = (e) => {
        e.preventDefault()
        fetchWeaterData(input)
    }

    const fetchWeaterData = (i) => {
        const query = `http://api.openweathermap.org/data/2.5/weather?q=${i}&appid=${process.env.REACT_APP_API_KEY}`
        fetch(query)
            .then((res) => res.json())
            .then((data) => {
                console.table(data)
                setWeatherData(data)
                fetch(
                    `https://restcountries.eu/rest/v2/alpha/${data.sys.country}`
                )
                    .then((res) => res.json())
                    .then((data) => {
                        setCountryName(data.name)
                    })
                    .catch((e) => console.log(e))
            })
            .catch((e) => console.log(e))
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
                                {Math.round(
                                    kelvinToCelsius(weatherData.main.temp)
                                )}
                                °c
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
                    return 'oops'
                default:
                    return 'empty'
            }
        } else return ''
    }

    return (
        <main>
            <h1>Tenki</h1>
            <section className='input-section'>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input
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
            </section>
            <section className='result'>
                <Result />
            </section>
        </main>
    )
}

export default App
