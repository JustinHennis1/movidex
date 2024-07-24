const fetch = require('node-fetch');
const dotenv = require("dotenv");
dotenv.config();


async function searchMov(querystring, lang, pg, year) {
 
    let language = 'language=en-US';
    let page = '1';
    let finalyear = ''

 
    const query = 'query='+ encodeURIComponent(querystring) + '&';
   
    
    if(lang){
        language = 'language='+lang;
    }
    if(pg){
        page= pg;
    }
    if(year){
        finalyear = '&year=' + year;
    }

    const apiKey = process.env.TMDB_RD_TOKEN;
  
    const url = 'https://api.themoviedb.org/3/search/movie?'+query+'include_adult=false&' + language + '&page='+page+finalyear;
    const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer ' + apiKey
    }
    };

    try {
        
        const response = await fetch(url, options);
        if(!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get response: ${response.statusText} - ${errorText}`);
        }
        const json =  response.json();
        return json;
    } catch (error){
        console.error('Failed to search the movie');
        throw error;
    }
}

module.exports = {searchMov};