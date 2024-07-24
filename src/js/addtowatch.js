// Watchlist stored on TMDB
// guest sessions do not include watchlist capabilities


const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

function addToWatchlist(sessionid, body) {
    const acc_id = process.env.TMDB_ACC_ID;
    console.log("acc id: ", acc_id);
    const url = 'https://api.themoviedb.org/3/account/'+acc_id+'/watchlist?session_id='+sessionid;
    console.log("url: ", url);
    const apikey = process.env.TMDB_RD_TOKEN
    const options = {
    method: 'POST',
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer ' + apikey
    },
    body: JSON.stringify(body)
    };

    fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err));

}

//const temp = {media_type: 'movie', media_id: 653346, watchlist: true}

//addToWatchlist('e7b1ca1b27cdd520847eb9822c563e01882df77b', temp)

module.exports = {addToWatchlist};