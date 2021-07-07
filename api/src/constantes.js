require('dotenv').config();
const {API_KEY} = process.env;

const BASE_URL = `https://api.rawg.io/api/games?key=${API_KEY}`
const GENRE_URL = `https://api.rawg.io/api/genres?key=${API_KEY}`
const SEARCH_URL = 'https://api.rawg.io/api/games/'

module.exports={
    BASE_URL,
    GENRE_URL,
    SEARCH_URL
}