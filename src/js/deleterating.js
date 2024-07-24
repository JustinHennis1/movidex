
const fetch = require('node-fetch');


async function deleteRating(movie_id, session_id, isguest){
let addon = ''
if(isguest){
    addon = 'guest_'
}

const rd_tok = process.env.TMDB_RD_TOKEN;
const url = `https://api.themoviedb.org/3/movie/${movie_id}/rating?${addon}session_id=${session_id}`;
const options = {
  method: 'DELETE',
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json;charset=utf-8',
    Authorization: 'Bearer '+rd_tok
  },
};
    try {
        const response = await fetch(url, options);
        if(!response.ok) {
            throw new Error('Error response is not okay');
        }
        const json = response.json();
        return json;

    } catch (e) {
        console.error('Error issue deleting movie rating...');
        throw e;
    }
}

module.exports = {deleteRating};