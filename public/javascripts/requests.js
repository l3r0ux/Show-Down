// Async functions call to my server, which in turns gets data from OMDb API
// To search items
async function getItems(searchTerm) {
    const response = await axios.get(`/api/items?s=${searchTerm}`);
    return response.data;
}

// To get specific item
async function getSpecificItem(id) {
    const response = await axios.get(`/api/item?id=${id}`)
    console.log(response.data)
    return response.data;
}