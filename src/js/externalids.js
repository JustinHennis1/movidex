const fetch = require('node-fetch');


async function getExternalID(movie_id){

const rd_token = process.env.TMDB_RD_TOKEN;
const url = `https://api.themoviedb.org/3/movie/${movie_id}/external_ids`;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer '+rd_token
  }
};

    try {
            const response  = await fetch(url, options);
            if(!response.ok) {
                throw new Error('Bad response fetching external ids');
            }
            const json = response.json();
            return json;
    } catch (e) {
        console.error('Unexpected Error fetching external ids');
        throw e;
    }

}

module.exports = {getExternalID};