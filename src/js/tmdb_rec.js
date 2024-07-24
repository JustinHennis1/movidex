const fetch = require('node-fetch');


async function getTMDBrecommendations(movieid, lang, page) {

    let pg = '';
    let lg = '';
    if(lang){lg = '?language=' + lang}
    if(lang && page){pg = '&page=' + + page}
    else if (page){pg = '?page=' + + page}

const url = `https://api.themoviedb.org/3/movie/${movieid}/recommendations${lg}${pg}`;
console.log(url);
const rd_tok = process.env.TMDB_RD_TOKEN;
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer '+ rd_tok
  }
};
    try {
        const response  = fetch(url, options);
        if(!(await response).ok) {
            throw new Error('Bad response fetching recommendations from TMDB');
        }
        const json = (await response).json();
        return json;
    } catch (e) {
        console.error('Error while making request for recommendations');
        throw e;
    }
}

module.exports = {getTMDBrecommendations}