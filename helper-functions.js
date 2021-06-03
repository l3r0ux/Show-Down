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