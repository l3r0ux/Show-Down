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

// Variables to keep track of when sides are present
let leftItem;
let rightItem;
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
            let sideAndType = await renderItemDetails(item, dropdown, input);
            if (sideAndType.isLeftSide) {
                leftItem = sideAndType;
            } else {
                rightItem = sideAndType;
            }
            console.log(sideAndType);

            // Scroll to added in item if in mobile mode
            if (window.innerWidth < 768) {
                input.scrollIntoView({ block: "start" });
            }

            // console.log(leftItem);
            // console.log(rightItem);

            // Run comparison logic if the movies are of the same type
            if (leftItem && rightItem) {
                if ((leftItem.type === rightItem.type)) {
                    // Play another 'vs' text animation
                    const vsContainer = document.querySelector('.vs');
                    // vsContainer.style.transform = 'scale(1.5)';
                    const keyframes = [
                        { transform: 'scale(1)' },
                        { transform: 'scale(1.5) rotateZ(-10deg)', filter: 'drop-shadow(0 0 25px red)' },
                        { transform: 'scale(1)' }
                    ]
                    const options = {
                        duration: 500,
                        easing: 'cubic-bezier(.88,.32,.68,1.45)',
                        fill: 'forwards',
                        delay: 400
                    }
                    vsContainer.animate(keyframes, options);
                    // Change the background here to either the gaming one, or the movies/series one depending on .type
                    // Run the compare functions after 500ms
                    if (leftItem.type === 'movie') return console.log('Run movie comparison function.');
                    if (leftItem.type === 'series') return console.log('Run series comparison function.');
                    // If it wasnt a movie or series, then it's a game
                    return console.log('Run game comparison function.');
                } else {
                    // Make some popup appear to say cant compare different types?
                    console.log("Items are not the same type. Can't run comparison.");
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
