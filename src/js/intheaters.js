// intheaters.js
const dotenv = require("dotenv");
dotenv.config();
const fetch = require('node-fetch');
let CHECK_API_FLAG = 0

async function getInTheater(page) {
  if(CHECK_API_FLAG == 0){
    console.log('getInTheater - TMDB_RD_TOKEN:', process.env.TMDB_RD_TOKEN ? 'Is set' : 'Is not set');
    CHECK_API_FLAG = 1;
  }
  let pg = '';
  if(page){pg = `?page=${page}`}
  const rdtok = 'Bearer '+process.env.TMDB_RD_TOKEN;  //TMDB_API_KEY; //
  //console.log(rd_token);
  const url = `https://api.themoviedb.org/3/movie/now_playing${pg}`;
  //console.log(url);
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: rdtok,
    },
  };
 

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get response: ${response.statusText} - ${errorText}`);
    }
    const json = await response.json();
    //console.log(json);
    return json;
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    throw error;
  }
}

//getInTheater();

module.exports = {getInTheater};