// To search for movies
async function getMovies(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: config.API_KEY,
            s: `${searchTerm}`
        }
    })
    console.log(response.data);
    return response.data.Search;
}

// To get more info about specific movie
async function getSpecificMovie(id) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: config.API_KEY,
            i: `${id}`
        }
    })
    console.log(response.data)
    return response.data.Search;
}

// Function to make dropdown menu
async function onInput(e) {
    // Getting the correct side inputs and dropdowns
    let input = e.srcElement;
    let dropdown = input.nextElementSibling;
    let searchTerm = input.value;
    let movies = await getMovies(searchTerm);

    // Make sure dropdown items are cleared before search again
    dropdown.innerHTML = '';

    // If no movies were found, return early and hide dropdown
    if (!(movies)) {
        return dropdown.classList.remove('visible');
    }
    for (let movie of movies) {
        const dropdownItem = document.createElement('a');
        const appendLocation = dropdown;
        appendLocation.classList.add('visible');
        dropdownItem.classList = 'dropdown-item d-flex';
        // Putting hidden imdbID so that can make request when click on it
        dropdownItem.innerHTML = `
            <img src=${movie.Poster ? movie.Poster : '#'} class="img-fluid mr-3" alt="movie poster" style="height: 7rem; width: 5rem;">
            <div class="d-flex flex-column justify-content-center">
                <h5 class="title">${movie.Title}</h5>
                <h6 class="year">${movie.Year}</h6>
            </div> 
        `;
        appendLocation.append(dropdownItem);

        // To append that specific movies summary to the appropriate side of the page
        dropdownItem.addEventListener('click', () => {
            dropdown.classList.add('movie-present');
            // 36px is the inputs height, making the dropdown appear under the input
            dropdown.style.transform = 'translate(-50%, 36px)';
            input.classList.add('movie-present');

            const specificMovie = getSpecificMovie(movie.imdbID);
            console.log(dropdown.parentElement)

            // Info to be present:
            // Poster, Title with production small next to it, Plot, then in small under plot, genre, release date, ages
            // Then stats in a big container with its id: left or right, and each stat in its own block:
            // box-office, imdb rating, metacritic score, awards
        })
    }
}

const leftInput = document.querySelector('.left-input');
const rightInput = document.querySelector('.right-input');
// The event gets automatically attatched to the function by the event listener
leftInput.addEventListener('input', debounce(onInput));
rightInput.addEventListener('input', debounce(onInput));

// To remove the dropdown menu when click away
document.addEventListener('click', (e) => {
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    const item = document.querySelector('.dropdown-item');
    // If user clicks anywhere and there is a dropdown item present, close dropdown menu
    if (document.contains(item)) {
        for (let dropdown of dropdowns) {
            dropdown.classList.remove('visible');
            dropdown.innerHTML = '';
        }
    }
})
