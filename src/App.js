require('dotenv').config()

const App = () => {
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(process.env.REACT_APP_API_KEY)
    }

    return (
        <main>
            <h1>Tenki</h1>
            <section>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input type='text' placeholder='Enter a location'></input>
                    <button>Search</button>
                </form>
            </section>
        </main>
    )
}

export default App
