// function to render item if its a movie
function renderMovie(detailsContainer, specificItem, isLeftSide, statsClassName) {
    detailsContainer.innerHTML = `
        <div class="row mb-5">
            <div class="col-5">
                <img src="${specificItem.Poster === 'N/A' ? '' : specificItem.Poster}" alt="item poster" class="item-detail-poster">
            </div>
            <div class="col-7 px-0">
                <h5 class="card-title mb-0">${specificItem.Title}</h5>
                <h6 class="text-muted"> (${specificItem.Year})</h6>
                <p class="mb-2">${specificItem.Plot}</p>
                <small class="text-muted">${specificItem.Production}</small><br>
                <small class="text-muted">${specificItem.Genre}</small>
            </div>
        </div>
        <div class="row ${statsClassName}">
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                Box Office: ${specificItem.BoxOffice}  
            </div>
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                IMDB Rating: ${specificItem.imdbRating}
            </div>
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                Meta Score: ${specificItem.Metascore}
            </div>
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12 mb-0">
                Awards: ${specificItem.Awards}
            </div>
        </div>
    `;
}


// function to render item if its a series
function renderSeries(detailsContainer, specificItem, isLeftSide, statsClassName) {
    detailsContainer.innerHTML = `
        <div class="row mb-5">
            <div class="col-5">
                <img src="${specificItem.Poster === 'N/A' ? '' : specificItem.Poster}" alt="item poster" class="item-detail-poster">
            </div>
            <div class="col-7 px-0">
                <h5 class="card-title mb-0">${specificItem.Title}</h5>
                <h6 class="text-muted"> (${specificItem.Year})</h6>
                <p class="mb-2">${specificItem.Plot}</p>
                <small class="text-muted">Written by ${specificItem.Writer}</small><br>
                <small class="text-muted">${specificItem.Genre}</small>
            </div>
        </div>
        <div class="row ${statsClassName}">
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                Seasons: ${specificItem.totalSeasons}  
            </div>
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                IMDB Rating: ${specificItem.imdbRating}
            </div>
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                IMDB Votes: ${specificItem.imdbVotes}
            </div>
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12 mb-0">
                Awards: ${specificItem.Awards}
            </div>
        </div>
    `;
}

function renderGame(detailsContainer, specificItem, isLeftSide, statsClassName) {
    detailsContainer.innerHTML = `
        <div class="row mb-5">
            <div class="col-5">
                <img src="${specificItem.Poster === 'N/A' ? '' : specificItem.Poster}" alt="item poster" class="item-detail-poster">
            </div>
            <div class="col-7 px-0">
                <h5 class="card-title mb-0">${specificItem.Title}</h5>
                <h6 class="text-muted"> (${specificItem.Year})</h6>
                <p class="mb-2">${specificItem.Plot}</p>
                <small class="text-muted">Directed by ${specificItem.Director}</small><br>
                <small class="text-muted">${specificItem.Genre}</small>
            </div>
        </div>
        <div class="row ${statsClassName}">
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                IMDB Rating: ${specificItem.imdbRating}
            </div>
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12">
                IMDB Votes: ${specificItem.imdbVotes}
            </div>
            <div class="${isLeftSide ? 'left-stat' : 'right-stat'} alert col-12 mb-0">
                Awards: ${specificItem.Awards}
            </div>
        </div>
    `;
}


// Function to make dropdown items
function makeDropdownItem(item, dropdown) {
    const dropdownItem = document.createElement('a');
    const appendLocation = dropdown;
    appendLocation.classList.add('visible');
    dropdownItem.classList = 'dropdown-item d-flex';
    dropdownItem.innerHTML = `
        <img src="${item.Poster === 'N/A' ? '' : item.Poster}" class="img-fluid mr-3" alt="item poster" style="height: 7rem; width: 5rem;">
        <div class="d-flex flex-column justify-content-center">
            <h5 class="title">${item.Title}</h5>
            <h6 class="year">${item.Year}</h6>
        </div> 
    `;
    appendLocation.append(dropdownItem);
    return dropdownItem;
}


// Funtion to render the clicked on item from the dropdown
async function renderItemDetails(item, dropdown, input) {
    // To append that specific items summary to the appropriate side of the page
    const specificItem = await getSpecificItem(item.imdbID);

    // This is the correct side where the input event was triggered
    const side = dropdown.parentElement;

    // If left side: true, if right side: false
    const isLeftSide = side.classList.contains('left-section');

    // Classname for the stats container based on 'isLeftSide'
    // Also forwarded to 'renderMovie' and 'renderSeries' functions to set the class name on the stats containers
    const statsClassName = isLeftSide ? 'left-stats' : 'right-stats';

    dropdown.classList.add('item-present');
    // 36px is the inputs height, making the dropdown appear under the input
    dropdown.style.transform = 'translate(-50%, 36px)';
    input.classList.add('item-present');


    // clear any pre-existing item details if there was a item before a new search
    if (side.children[2]) {
        side.children[2].classList.add('remove-item-details');
        setTimeout(() => {
            side.children[2].remove();
        }, 500);
    }

    // Make and append details
    const detailsContainer = document.createElement('div');
    detailsContainer.classList = `container ${isLeftSide ? 'left-details' : 'right-details'}`;
    // check if is series or a movie, then item different stats
    if (item.Type === 'movie') {
        renderMovie(detailsContainer, specificItem, isLeftSide, statsClassName);
    } else if (item.Type === 'series') {
        renderSeries(detailsContainer, specificItem, isLeftSide, statsClassName);
    } else {
        renderGame(detailsContainer, specificItem, isLeftSide, statsClassName);
    }
    // Set container height to previous space takes for smoother mobile experience
    side.style.height = 'fit-content';
    side.append(detailsContainer);
    requestAnimationFrame(() => {
        detailsContainer.classList.add('section-visible');
    })

    // Return item type, side bool, and classname to easily select the elements where the comparison function runs
    return { type: item.Type, isLeftSide: isLeftSide, statsClassName: statsClassName };
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