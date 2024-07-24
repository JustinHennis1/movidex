const fetch = require('node-fetch');
const dotenv = require("dotenv");
dotenv.config();


async function fetchYoutube(id) {
    const rd_token = 'Bearer ' + process.env.TMDB_RD_TOKEN;

    const options = {
    method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: rd_token,
        },
    };

    const url = 'https://api.themoviedb.org/3/movie/'+id+'/videos?language=en-US';
    // console.log(url);
    try {

        const res = await fetch(url, options)
        
        if(!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to get response: ${res.statusText} - ${errorText}`);
        }
        const json = await res.json();
        return json;
    } catch (e) {
        console.log(e)
    }

}

module.exports = {fetchYoutube};