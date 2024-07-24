// intheaters.js
const fetch = require('node-fetch');
const dotenv = require("dotenv");
dotenv.config();


async function getPopular(page) {
  let pg = '';
  if(page){pg = `?page=${page}`}
  const rd_token = 'Bearer ' + process.env.TMDB_RD_TOKEN;
  const url = `https://api.themoviedb.org/3/movie/popular${pg}`;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: rd_token,
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get response: ${response.statusText} - ${errorText}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    throw error;
  }
}

module.exports = {getPopular};
