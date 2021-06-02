async function getMovie() {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: config.API_KEY,
            s: "The Avengers"
        }
    })
    console.log(response.data);
    for (let movie of response.data.Search) {
        console.log(movie.Title)
    }
}

getMovie();