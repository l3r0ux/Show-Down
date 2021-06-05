// Async functions call to my server, which in turns gets data from OMDb API
// To search shows
async function getShows(searchTerm) {
    const response = await axios.get(`/api/shows?s=${searchTerm}`);
    return response.data;
}

// To get specific show
async function getSpecificShow(id) {
    const response = await axios.get(`/api/show?id=${id}`)
    // console.log(response.data)
    return response.data;
}