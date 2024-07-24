const fetch = require('node-fetch');
const dotenv = require("dotenv");
dotenv.config();

async function getReviews(movie_id, lang, page) {
  let pg = '';
  let lg = '';
  if(lang){lg = '?language=' + lang}
  if(lang && page){pg = '&page=' + + page}
  else if (page){pg = '?page=' + + page}
  
    const rd_token = 'Bearer '+process.env.TMDB_RD_TOKEN;
    const url = `https://api.themoviedb.org/3/movie/${movie_id}/reviews${lg}${pg}`;
    const options = {method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: rd_token
    }};

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error with response: ${response.text} Status: ${response.status}`);
      } 
      const json = response.json();
      //console.log(json);
      return json;
    } catch (e) {
      console.error("Error getting reviews", e);
      throw e;
    }

}

module.exports = {getReviews};