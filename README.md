# Show-Down
https://show-vs-show.herokuapp.com/

## About this project
### The tech:
A combinations of bootstrap and vanilla CSS was used for this projects' styling. Bootstrap mainly made the responsive design and the dropdown menu for the searchbar easier.
Pure vanilla asynchronous JavaScript was also used to fetch data and append it to the page in real time with no page reloading.
I also made Node.js backend to make requests from in order to hide the API key from the client side. I made use of the axios library to send requests to my Node.js backend
which then also send requests with axios to fetch data from the OMDb API, and send that to the front end again.
There is also a debounce function on the input, that forces the request to be delayed by 1 second before it is sent.
Regular expressions are used to extract the data to get in a comparable format, then the comparison is run. The stats and items that wins is colored in differently than the one that lost.
All the animations were done with the Javascript Web Animations API, not with CSS.

### The design:
Every color, placement, animation and font that you see in this app was chosen and implemented with a purpose. I strived to capture the spirit of battle or a dual,
and the feeling that the two shows or games are battling it out in the ring.

With the idea of the app being that one thing battles another, I made use of animations to reflect that premise. At first, the input names are next to eachother 
with the VS in between. When a user searches and clicks on a movie from the dropdown, the input goes upwards to give way for the content, and the movie details 
animate in from the side: from the left for left side, and the opposite for the right side. This signifies that the contender is "entering the ring" so to say.
Then actual comparison animations that suggests the shows are battling it out and creating suspense.  

The "Street Fighter" font was used to identify with the gaming aspect of the app, and the cinema font for the secondary title to capture the essence of the cinema, and
the color pallet for the same purpose as the above. The fact that the posters are also in glowey, angled frames further creates the subconsious association with an
oldschool character select menu for example, with the character VS character, in this case shows or games.

## Setting up the project on your local machine:
* Make sure you have Node.js and git installed on your machine.
* Download the code from my github repo.
* Open the folder containing the code in your code editor of choice.
* Open a git bash terminal window in the project root folder.
* Type this command to install all the node packages which the project depends on:
```
npm install
```
* Make a '.env' file in the root directory with the following contents(enter your OMDb API key where specified):
```
API_KEY="Your API Key"
```
* Save the file, and in your terminal run this command to start the server:
```
node app.js 
```
* Go to your browser, and in the url bar type:
```
localhost:3000
```
