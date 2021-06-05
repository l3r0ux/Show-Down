// "VS" text animation on load
const VS = document.querySelectorAll('svg path');
for (let i = 0; i < VS.length; i++) {
    // The stroke-dasharray and the stroke-offset must start with the full length of the path

    // Set each letters corresponding dasharray and offset values
    // Setting stroke-dasharray to full length of path, then ofsetting it by that length aswell to make it dissapear
    let letter = VS[i];
    letter.style.strokeWidth = '2px';
    letter.style.strokeDasharray = letter.getTotalLength();
    letter.style.strokeDashoffset = letter.getTotalLength();

    // Make keyframes and options for each letter(path)
    const keyframes = [
        { strokeDashoffset: 0 },
    ];

    const options = {
        duration: 2000,
        easing: 'ease',
        fill: 'forwards',
        delay: 300
    }

    // Animate SVG paths
    const animationObj = letter.animate(keyframes, options);
}

// Async functions call to my server, which in turns gets data from OMDb API
// To search shows
async function getShows(searchTerm) {
    const response = await axios.get(`/api/shows?s=${searchTerm}`);
    return response.data;
}

// To get specific show
async function getSpecificShow(id) {
    const response = await axios.get(`/api/show?id=${id}`)
    console.log(response.data)
    return response.data;
}

// Function to make dropdown menu
async function onInput(e) {
    // Getting the correct side inputs and dropdowns
    let input = e.srcElement;
    let dropdown = input.nextElementSibling;
    let searchTerm = input.value;
    let shows = await getShows(searchTerm);

    // Make sure dropdown items are cleared before search again
    dropdown.innerHTML = '';

    // if no shows found, stop execution early and hide dropdown
    if (shows.data === false) {
        return dropdown.classList.remove('visible');
    }
    for (let show of shows) {
        const dropdownItem = document.createElement('a');
        const appendLocation = dropdown;
        appendLocation.classList.add('visible');
        dropdownItem.classList = 'dropdown-item d-flex';
        // Putting hidden imdbID so that can make request when click on it
        dropdownItem.innerHTML = `
            <img src="${show.Poster === 'N/A' ? '' : show.Poster}" class="img-fluid mr-3" alt="show poster" style="height: 7rem; width: 5rem;">
            <div class="d-flex flex-column justify-content-center">
                <h5 class="title">${show.Title}</h5>
                <h6 class="year">${show.Year}</h6>
            </div> 
        `;
        appendLocation.append(dropdownItem);

        // To append that specific shows summary to the appropriate side of the page
        dropdownItem.addEventListener('click', async () => {
            dropdown.classList.add('show-present');
            // 36px is the inputs height, making the dropdown appear under the input
            dropdown.style.transform = 'translate(-50%, 36px)';
            input.classList.add('show-present');

            const specificShow = await getSpecificShow(show.imdbID);
            // This is the correct side where the input event was triggered
            const side = dropdown.parentElement;
            // clear any pre-existing show details
            if (side.children[2]) {
                side.children[2].classList.add('remove-show-details');
                setTimeout(() => {
                    side.children[2].remove();
                }, 500);
            }
            // If left side: true, if right side: false
            const isLeftSside = side.classList.contains('left-section');

            // Info to be present:
            // Then stats in a big container with its id: left or right, and each stat in its own block:
            // box-office, imdb rating, metacritic score, awards
            const detailsContainer = document.createElement('div');
            detailsContainer.classList = `container ${isLeftSside ? 'left-details' : 'right-details'}`;
            // check if is series or a movie, then show different stats
            if (show.Type === 'movie') {
                detailsContainer.innerHTML = `
                    <div class="row mb-5">
                        <div class="col-5">
                            <img src="${specificShow.Poster === 'N/A' ? '' : specificShow.Poster}" alt="show poster" class="show-detail-poster">
                        </div>
                        <div class="col-7 px-0">
                            <h5 class="card-title mb-0">${specificShow.Title}</h5>
                            <h6 class="text-muted"> (${specificShow.Year})</h6>
                            <p class="mb-2">${specificShow.Plot}</p>
                            <small class="text-muted">${specificShow.Production}</small><br>
                            <small class="text-muted">${specificShow.Genre}</small>
                        </div>
                    </div>
                    <div class="row ${isLeftSside ? 'left-stats' : 'right-stats'}">
                        <div class="${isLeftSside ? 'left-stat' : 'right-stat'} alert col-12">
                            Box Office: ${specificShow.BoxOffice}  
                        </div>
                        <div class="${isLeftSside ? 'left-stat' : 'right-stat'} alert col-12">
                            IMDB Rating: ${specificShow.imdbRating}
                        </div>
                        <div class="${isLeftSside ? 'left-stat' : 'right-stat'} alert col-12">
                            Meta Score: ${specificShow.Metascore}
                        </div>
                        <div class="${isLeftSside ? 'left-stat' : 'right-stat'} alert col-12">
                            Awards: ${specificShow.Awards}
                        </div>
                    </div>
                `;
            } else {
                detailsContainer.innerHTML = `
                    <div class="row mb-5">
                        <div class="col-5">
                            <img src="${specificShow.Poster === 'N/A' ? '' : specificShow.Poster}" alt="show poster" class="show-detail-poster">
                        </div>
                        <div class="col-7 px-0">
                            <h5 class="card-title mb-0">${specificShow.Title}</h5>
                            <h6 class="text-muted"> (${specificShow.Year})</h6>
                            <p class="mb-2">${specificShow.Plot}</p>
                            <small class="text-muted">Written by ${specificShow.Writer}</small><br>
                            <small class="text-muted">${specificShow.Genre}</small>
                        </div>
                    </div>
                    <div class="row ${isLeftSside ? 'left-stats' : 'right-stats'}">
                        <div class="${isLeftSside ? 'left-stat' : 'right-stat'} alert col-12">
                            Seasons: ${specificShow.totalSeasons}  
                        </div>
                        <div class="${isLeftSside ? 'left-stat' : 'right-stat'} alert col-12">
                            IMDB Rating: ${specificShow.imdbRating}
                        </div>
                        <div class="${isLeftSside ? 'left-stat' : 'right-stat'} alert col-12">
                            IMDB Votes: ${specificShow.imdbVotes}
                        </div>
                        <div class="${isLeftSside ? 'left-stat' : 'right-stat'} alert col-12">
                            Awards: ${specificShow.Awards}
                        </div>
                    </div>
                `;
            }
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
    if (document.contains(item) && !(e.target.classList.contains('show-search'))) {
        for (let dropdown of dropdowns) {
            dropdown.classList.remove('visible');
            setTimeout(() => {
                dropdown.innerHTML = '';
            }, 300);
        }
    }
})

// To set background image initial height
document.querySelector(':root').style.setProperty('--page-height', `${window.innerHeight}px`);
