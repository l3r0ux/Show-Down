// Function to compare movies - increment leftPoints or rightPoints depending on which stat won
function compareItems(leftItem, rightItem, searchInputs) {
    // Get individual stats to assign winner or loser classes for newly added items
    leftStats = document.querySelector(`.${leftItem.statsClassName}`).children;
    rightStats = document.querySelector(`.${rightItem.statsClassName}`).children;
    // Timings for animations
    // Only change 'statCompareDelay', and the other delays will be autimatically calculated depending on it
    const statCompareDelay = 500;
    const overallWinnerDelay = leftStats.length * statCompareDelay;

    // Loop through all stats and assign winning or losing classes
    for (let i = 0; i < leftStats.length; i++) {
        setTimeout(() => {
            if (parseFloat(leftStats[i].dataset.value) < parseFloat(rightStats[i].dataset.value)) {
                leftStats[i].classList.add('loser');
                rightStats[i].classList.add('winner');
                rightPoints++;
            } else if (parseFloat(leftStats[i].dataset.value) > parseFloat(rightStats[i].dataset.value)) {
                leftStats[i].classList.add('winner');
                rightStats[i].classList.add('loser');
                leftPoints++;
            } else {
                leftStats[i].classList.add('tie');
                rightStats[i].classList.add('tie');
            }
        }, i * statCompareDelay)
    }
    // Assign overall winner
    setTimeout(() => {
        console.log(leftPoints, rightPoints)
        // Assign winning class to overall container
        if (leftPoints > rightPoints) {
            leftItem.item.classList.add('winner');
            rightItem.item.classList.add('loser');
        } else if (leftPoints < rightPoints) {
            leftItem.item.classList.add('loser');
            rightItem.item.classList.add('winner');
        } else {
            // Prepending 'tied' text on desktop
            if (window.innerWidth > 768) {
                const appendLocation = document.querySelector('.middle');
                let tied = document.createElement('div');
                tied.classList.add('tied');
                tied.innerText = 'TIE!';
                appendLocation.prepend(tied);
                requestAnimationFrame(() => {
                    tied.classList.add('visible')
                })
            }
        }
        // Enable search inputs again at the end
        for (let input of searchInputs) {
            input.disabled = false;
        }
    }, overallWinnerDelay)
}