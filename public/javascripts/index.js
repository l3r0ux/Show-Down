// "VS" text animation on load
const VS = document.querySelectorAll('svg path');
let strokeAnims = [];
let fillAnims = [];
for (let i = 0; i < VS.length; i++) {
    // The stroke-dasharray and the stroke-offset must start with the full length of the path

    // Set each letters corresponding dasharray and offset values
    // Setting stroke-dasharray to full length of path, then ofsetting it by that length aswell to make it dissapear
    let letter = VS[i];
    letter.style.strokeWidth = '2px';
    letter.style.strokeDasharray = letter.getTotalLength();
    letter.style.strokeDashoffset = letter.getTotalLength();

    // #aa181f
    // fill 500ms ease 1.4s forwards

    // Make keyframes and options for each letter(path)
    const keyframes1 = [
        { strokeDashoffset: 0 }
    ];
    const keyframes2 = [
        { fill: 'transparent' },
        { fill: '#aa181f' }
    ]

    const options1 = {
        duration: 2000,
        easing: 'ease',
        fill: 'forwards',
    }
    const options2 = {
        duration: 400,
        easing: 'ease',
        fill: 'forwards',
        delay: 1400
    }

    // Animate SVG paths
    let strokeAnimObj = letter.animate(keyframes1, options1);
    strokeAnims.push({ strokeAnimObj });
    let fillAnimObj = letter.animate(keyframes2, options2);
    fillAnims.push({ fillAnimObj })
}

const cinemaBackground = document.querySelector('#cinema-background');
const gameBackground = document.querySelector('#game-background');
let backgroundInterval;
backgroundInterval = setInterval(() => {
    cinemaBackground.classList.toggle('background-image-visible');
    gameBackground.classList.toggle('background-image-visible');
}, 5000)

// Variables to keep track of when sides are present
let leftItem;
let rightItem;
// To keep track of which side scored the most points to assign overall winner or loser class
let leftPoints = 0;
let rightPoints = 0;
// Function to make dropdown menu and append item to page
async function onInput(e) {
    // Getting the correct side inputs and dropdowns
    let input = e.srcElement;
    let dropdown = input.nextElementSibling;
    let searchTerm = input.value;
    let items = await getItems(searchTerm);

    // Make sure dropdown items are cleared before search again
    dropdown.innerHTML = '';

    // Make dropdown visible
    dropdown.classList.add('visible');

    // if no items found, stop execution early and show 'no items found' text
    if (items.data === false) {
        // Show 'No items found' - 'hasData' arg is false
        return makeDropdownItem(dropdown, false);
    }

    // Scroll to the added dropdown after its transition was finished for mobile
    if (window.innerWidth < 768) {
        setTimeout(() => {
            document.querySelector('.visible').scrollIntoView({ block: "end" });
        }, 300)
    }

    // If items were found, proceed
    for (let item of items) {
        const dropdownItem = makeDropdownItem(dropdown, true, item);

        // Add event listeners to each dropdownItem, which executes this function
        dropdownItem.addEventListener('click', async () => {
            let itemInfo = await renderItemDetails(item, dropdown, input);
            if (itemInfo.isLeftSide) {
                leftItem = itemInfo;
            } else {
                rightItem = itemInfo;
            }

            // Remove 'tied' text if any
            let tied = document.querySelector('.tied');
            if (tied) {
                tied.classList.remove('visible');
                setTimeout(() => {
                    tied.remove();
                }, 500)
            }

            // Scroll to added in item if in mobile mode
            if (window.innerWidth < 768) {
                input.scrollIntoView({ block: "start" });
            }

            // Run comparison logic if the movies are of the same type
            if (leftItem && rightItem) {
                // Get stats that were on screen on click and clear their winning/losing classes
                let leftStats = document.querySelector(`.${leftItem.statsClassName}`).children;
                let rightStats = document.querySelector(`.${rightItem.statsClassName}`).children;
                // Clear all classes fast before next comparison starts
                leftItem.item.classList.remove('winner');
                leftItem.item.classList.remove('loser');
                leftItem.item.classList.remove('tie');
                rightItem.item.classList.remove('winner');
                rightItem.item.classList.remove('loser');
                rightItem.item.classList.remove('tie');
                for (let i = 0; i < leftStats.length; i++) {
                    if (leftStats[i] && rightStats[i]) {
                        leftStats[i].classList.remove('loser');
                        leftStats[i].classList.remove('winner');
                        leftStats[i].classList.remove('tie');
                        rightStats[i].classList.remove('loser');
                        rightStats[i].classList.remove('winner');
                        rightStats[i].classList.remove('tie');
                    }
                }

                if ((leftItem.type === rightItem.type)) {
                    // Reset points on next search if items are same type
                    rightPoints = 0;
                    leftPoints = 0;
                    // Remove not comparable text if present
                    let message = document.querySelector('.not-comparable');
                    if (message) {
                        message.classList.remove('visible');
                        setTimeout(() => {
                            message.remove();
                        }, 500)
                    }

                    // Play another 'vs' text animation
                    const vsContainer = document.querySelector('.vs');
                    const keyframes = [
                        { transform: 'scale(1)' },
                        { transform: 'scale(1.5)', filter: 'drop-shadow(0 0 25px red)' },
                        { transform: 'scale(1)' }
                    ]
                    const options = {
                        duration: 500,
                        easing: 'cubic-bezier(.88,.32,.68,1.45)',
                        fill: 'forwards',
                        delay: 400
                    }
                    vsContainer.animate(keyframes, options);

                    // Change the background here to either the gaming one, or the movies/series one depending on the common .type
                    if (leftItem.type === 'movie' || leftItem.type === 'series') {
                        clearInterval(backgroundInterval);
                        cinemaBackground.classList.add('background-image-visible')
                        gameBackground.classList.remove('background-image-visible')
                    }

                    // If item types are movies:
                    if (leftItem.type === 'movie') {
                        console.log('Run movie comparison function.');
                        // Disable search inputs at start of comparison process
                        let searchInputs = document.querySelectorAll('.item-search');
                        for (let input of searchInputs) {
                            input.disabled = true;
                        }
                        return setTimeout(() => {
                            compareMovies(leftItem, rightItem, searchInputs);
                        }, 1000)
                    }

                    if (leftItem.type === 'series') {
                        return console.log('Run series comparison function.');
                    }
                    // If it wasnt a movie or series, then it's a game
                    clearInterval(backgroundInterval);
                    cinemaBackground.classList.remove('background-image-visible')
                    gameBackground.classList.add('background-image-visible')
                    return console.log('Run game comparison function.');
                } else {
                    // If there was a not comparable message before, remove it before add new one
                    if (document.querySelector('.not-comparable')) {
                        // Remove not comparable text if present
                        let message = document.querySelector('.not-comparable');
                        message.classList.remove('visible');
                        setTimeout(() => {
                            message.remove();
                        }, 500)
                    }
                    // Popup appears to say can't compare different types
                    const appendLocation = document.querySelector('.middle');
                    let message = document.createElement('div');
                    message.classList.add('not-comparable');
                    message.innerText = `Can't compare a ${leftItem.type} with a ${rightItem.type}`;
                    appendLocation.prepend(message);
                    requestAnimationFrame(() => {
                        message.classList.add('visible')
                    })
                }
            }
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
    if (document.contains(item) && !(e.target.classList.contains('item-search'))) {
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
