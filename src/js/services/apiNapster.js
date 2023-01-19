// Endpoint
const url = "https://api.napster.com/v2.1/tracks/top?apikey="
const apiKey = "ZmFlZDg1MGMtZTk5Ni00ODUzLWI0N2EtM2Q1ZGFkYjZhYTNj"


const apiNapster = () => {
    return fetch(url + apiKey)
        .then(response => response.json())
        .then(data => data.tracks);
}

export default apiNapster