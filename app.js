// To search for movies
async function getMovies(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: process.env.API_KEY,
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
            apikey: process.env.API_KEY,
            i: `${id}`
        }
    })
    console.log(response.data)
    return response.data;
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
            <img src="${movie.Poster === 'N/A' ? '' : movie.Poster}" class="img-fluid mr-3" alt="movie poster" style="height: 7rem; width: 5rem;">
            <div class="d-flex flex-column justify-content-center">
                <h5 class="title">${movie.Title}</h5>
                <h6 class="year">${movie.Year}</h6>
            </div> 
        `;
        appendLocation.append(dropdownItem);

        // To append that specific movies summary to the appropriate side of the page
        dropdownItem.addEventListener('click', async () => {
            dropdown.classList.add('movie-present');
            // 36px is the inputs height, making the dropdown appear under the input
            dropdown.style.transform = 'translate(-50%, 36px)';
            input.classList.add('movie-present');

            const specificMovie = await getSpecificMovie(movie.imdbID);
            // This is the correct side where the input event was triggered
            const side = dropdown.parentElement;
            // clear any pre-existing movie details
            console.log(side.children)
            if (side.children[2]) {
                side.children[2].classList.add('remove-movie-details');
                setTimeout(() => {
                    side.children[2].remove();
                }, 500);
            }
            // console.log(side)
            // If left side: true, if right side: false
            const isLeftSside = side.classList.contains('left-section');

            // Info to be present:
            // Then stats in a big container with its id: left or right, and each stat in its own block:
            // box-office, imdb rating, metacritic score, awards
            const detailsContainer = document.createElement('div');
            detailsContainer.classList = `container ${isLeftSside ? 'left-details' : 'right-details'}`;
            detailsContainer.innerHTML = `
                <div class="row mb-5">
                    <div class="col-5">
                        <img src="${specificMovie.Poster === 'N/A' ? '' : specificMovie.Poster}" alt="movie poster" class="movie-detail-poster">
                    </div>
                    <div class="col-7 px-0">
                        <h5 class="card-title mb-0">${specificMovie.Title}</h5>
                        <h6 class="text-muted"> (${specificMovie.Year})</h6>
                        <p class="mb-2">${specificMovie.Plot}</p>
                        <small class="text-muted">${specificMovie.Production}</small><br>
                        <small class="text-muted">${specificMovie.Genre}</small>
                    </div>
                </div>
                <div class="row ${isLeftSside ? 'left-stats' : 'right-stats'}">
                    <div class="${isLeftSside ? 'left-stat' : 'right-stat'} alert col-12">
                        ${specificMovie.BoxOffice}  
                    </div>
                    <div class="${isLeftSside ? 'left-stat' : 'right-stat'} alert col-12">
                        ${specificMovie.imdbRating}
                    </div>
                    <div class="${isLeftSside ? 'left-stat' : 'right-stat'} alert col-12">
                        ${specificMovie.Metascore}
                    </div>
                    <div class="${isLeftSside ? 'left-stat' : 'right-stat'} alert col-12">
                        ${specificMovie.Awards}
                    </div>
                </div>
            `;
            // Set container height to previous space takes for smoother mobile experience
            side.style.height = 'fit-content';
            side.append(detailsContainer);
            requestAnimationFrame(() => {
                detailsContainer.classList.add('section-visible');
            })
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
    // If user clicks anywhere except the input, and there is a dropdown item present, close dropdown menu with items in
    if (document.contains(item) && !(e.target.classList.contains('movie-search'))) {
        for (let dropdown of dropdowns) {
            dropdown.classList.remove('visible');
            setTimeout(() => {
                dropdown.innerHTML = '';
            }, 300);
        }
    }
})
