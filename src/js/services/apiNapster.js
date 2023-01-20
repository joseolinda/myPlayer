// Endpoint
const url = "https://api.napster.com/v2.1/tracks/top?apikey="
const apiKey = "ZmFlZDg1MGMtZTk5Ni00ODUzLWI0N2EtM2Q1ZGFkYjZhYTNj"


const apiNapster = (limit = 10, offset = 0) => {
    return fetch(url + apiKey + `&limit=${limit}&offset=${offset}`)
        .then(response => response.json())
        .then(data => data.tracks);
}

export default apiNapster