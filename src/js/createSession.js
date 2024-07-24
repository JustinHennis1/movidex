const fetch = require('node-fetch');
const dotenv = require('dotenv');
const { error } = require('console');
dotenv.config();

async function createWithToken(reqtoken) {
    const rdtoken = process.env.TMDB_RD_TOKEN;
    const url = 'https://api.themoviedb.org/3/authentication/session/new';

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer ' + rdtoken
      },
      body: JSON.stringify({request_token: reqtoken})
    };

      try {
          const response = await fetch(url, options);
          if(!response.ok){
            throw new Error(`Error response: ${response.text}, status: ${response.status}`);
          }
          const json = response.json();
          return json;
      } catch (e) {
          console.error('Error creating session with token', e);
          throw error;
      }
    }

  // after request token created
  // send user here or choose to redirect
  // https://www.themoviedb.org/authenticate/{REQUEST_TOKEN}

  // redirect to "authentication complete page"
  // https://www.themoviedb.org/authenticate/{REQUEST_TOKEN}?redirect_to=http://www.yourapp.com/approved

  // after call create session using validated req token

  module.exports = {createWithToken};