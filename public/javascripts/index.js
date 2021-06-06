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

    // if no items found, stop execution early and hide dropdown
    if (items.data === false) {
        return dropdown.classList.remove('visible');
    }
    // If items were found, proceed
    for (let item of items) {
        const dropdownItem = makeDropdownItem(item, dropdown);

        // Add event listeners to each dropdownItem, which executes this function
        dropdownItem.addEventListener('click', async () => {
            let sideAndType = await renderItemDetails(item, dropdown, input);
            if (sideAndType.isLeftSide) {
                leftItem = sideAndType;
            } else {
                rightItem = sideAndType;
            }

            // console.log(leftItem);
            // console.log(rightItem);

            // Run comparison logic if the movies are of the same type
            if (leftItem && rightItem) {
                console.log('2 items present');
                console.log('==========');
                if ((leftItem.type === rightItem.type)) {
                    // Change the background here to either the gaming one, or the movies/series one depending on .type
                    console.log(`Item types are the same: '${leftItem.type}'`);
                    console.log(`Run '${leftItem.type}' comparison function.`);
                    console.log('==========');
                } else {
                    console.log("Items are not the same type. Can't run comparison.");
                    console.log('==========');
                }
            } else {
                console.log('==========');
                console.log(`One item present`);
                console.log('==========');
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
