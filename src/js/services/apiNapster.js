// Endpoint
const BASE_URL = 'https://api.napster.com/v2.1/tracks/top';
const API_KEY = import.meta.env.VITE_NAPSTER_API_KEY;

const apiNapster = async (limit = 10, offset = 0) => {
    try {
        const response = await fetch(`${BASE_URL}?apikey = ${API_KEY}& limit=${limit}& offset=${offset} `);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} `);
        }
        const data = await response.json();
        return data.tracks;
    } catch (error) {
        console.error("Error fetching from Napster API:", error);
        return [];
    }
};

export default apiNapster;