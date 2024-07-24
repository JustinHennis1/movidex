const fetch = require('node-fetch');
const rd_token = 'Bearer '+process.env.TMDB_RD_TOKEN;
const url = 'https://api.themoviedb.org/3/movie/movie_id/images'; // replace movie_id
const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: rd_token
    }
  };

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error('error:' + err));