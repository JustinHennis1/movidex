const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();
const rdtoken = process.env.TMDB_RD_TOKEN;

async function guestSession() {
    const url = 'https://api.themoviedb.org/3/authentication/guest_session/new';
    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + rdtoken
    }
    };
    try {
    const response = await fetch(url, options);
    if(!response.ok){
        throw new Error('Bad response in guestSession(), responding: ', response.text, 'Status: ', response.status.text);
    }
    const json = response.json();
    return json;
    } catch (e) {
        console.log('Error found in guest session():', e);
    }
}
//console.log('Creating Guest Session... ');
//guestSession();

module.exports = {guestSession};