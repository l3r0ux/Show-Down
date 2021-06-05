// function to render show if its a movie
function renderMovie(detailsContainer, specificShow, isLeftSide, statsClassName) {
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
        <div class="row ${statsClassName}">
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                Box Office: ${specificShow.BoxOffice}  
            </div>
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                IMDB Rating: ${specificShow.imdbRating}
            </div>
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                Meta Score: ${specificShow.Metascore}
            </div>
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                Awards: ${specificShow.Awards}
            </div>
        </div>
    `;
}


// function to render show if its a series
function renderSeries(detailsContainer, specificShow, isLeftSide, statsClassName) {
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
        <div class="row ${statsClassName}">
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                Seasons: ${specificShow.totalSeasons}  
            </div>
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                IMDB Rating: ${specificShow.imdbRating}
            </div>
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                IMDB Votes: ${specificShow.imdbVotes}
            </div>
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                Awards: ${specificShow.Awards}
            </div>
        </div>
    `;
}


// Function to make dropdown items
function makeDropdownItem(show, dropdown) {
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
    return dropdownItem;
}


// Funtion to render the clicked on show from the dropdown
async function renderShowDetails(show, dropdown, input) {
    // To append that specific shows summary to the appropriate side of the page
    const specificShow = await getSpecificShow(show.imdbID);

    // This is the correct side where the input event was triggered
    const side = dropdown.parentElement;

    // If left side: true, if right side: false
    const isLeftSide = side.classList.contains('left-section');

    // Classname for the stats container based on 'isLeftSide'
    // Also forwarded to 'renderMovie' and 'renderSeries' functions to set the class name on the stats containers
    const statsClassName = isLeftSide ? 'left-stats' : 'right-stats';

    dropdown.classList.add('show-present');
    // 36px is the inputs height, making the dropdown appear under the input
    dropdown.style.transform = 'translate(-50%, 36px)';
    input.classList.add('show-present');


    // clear any pre-existing show details if there was a show before a new search
    if (side.children[2]) {
        side.children[2].classList.add('remove-show-details');
        setTimeout(() => {
            side.children[2].remove();
        }, 500);
    }

    // Make and append details
    const detailsContainer = document.createElement('div');
    detailsContainer.classList = `container ${isLeftSide ? 'left-details' : 'right-details'}`;
    // check if is series or a movie, then show different stats
    if (show.Type === 'movie') {
        renderMovie(detailsContainer, specificShow, isLeftSide, statsClassName);

    } else {
        renderSeries(detailsContainer, specificShow, isLeftSide, statsClassName);
    }
    // Set container height to previous space takes for smoother mobile experience
    side.style.height = 'fit-content';
    side.append(detailsContainer);
    requestAnimationFrame(() => {
        detailsContainer.classList.add('section-visible');
    })

    // Return show type, side bool, and classname to easily select the elements where the comparison function runs
    return { type: show.Type, isLeftSide: isLeftSide,  statsClassName: statsClassName};
}


// Debounce function
// debounce is a factory function - it makes the returned function based on the arguments
// Since the returned function replaces "debounce(onInput)", the arguments(event obj in this case) needs to be collected for the returned function in the listener
// and pass it on to the function that is gonna get executed everytime the returned function(anonymous closure) is called
const debounce = (func, delay = 500) => {
    // Have access to timeoutId becuase of the closure scope
    let timeoutId;
    return (event) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            // Calling onInput (func) here which uses the args (which is the event obj) to put the dropdowns on the correct sides
            func(event);
        }, delay);
    }
}