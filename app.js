async function getMovie(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: config.API_KEY,
            s: `${searchTerm}`
        }
    })
    console.log(response.data);
    for (let movie of response.data.Search) {
        console.log(movie.Title)
    }
    return response.data.Search;
}

// function onInput() {

// }

const leftInput = document.querySelector('.left-input');
leftInput.addEventListener('input', async (e) => {
    let searchTerm = leftInput.value;

    let movies = await getMovie(searchTerm);
    console.log(movies)

    for (let movie of movies) {
        const dropdownItem = document.createElement('a');
        const appendLocation = document.querySelector('.dropdown-menu');
        appendLocation.classList.add('visible');
        dropdownItem.classList = 'dropdown-item d-flex';
        dropdownItem.innerHTML = `
            <img src=${movie.Poster} class="img-fluid mr-3" alt="movie poster" style="height: 8rem; width: 6rem;">
            <div class="d-flex flex-column justify-content-center">
                <h5 class="title">${movie.Title}</h5>
                <h6 class="year">${movie.Year}</h6>
            </div> 
        `;
        appendLocation.append(dropdownItem);
    }
})

// Avengers

// To remove the dropdown menu
document.addEventListener('click', (e) => {
    const dropdown = document.querySelector('.dropdown-menu');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    if (!(e.target.classList.contains('dropdown-menu') || e.target.classList.contains('dropdown-item'))) {
        dropdown.classList.remove('visible');
        setTimeout(() => {
            for (let item of dropdownItems) {
                item.remove();
            }
        }, 200)
    }
})
