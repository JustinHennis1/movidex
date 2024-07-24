const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

async function generateRToken() {
  const rdtoken = process.env.TMDB_RD_TOKEN;
  const url = 'https://api.themoviedb.org/3/authentication/token/new';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + rdtoken
    }
  };
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Response is not okay in generateRToken");
    }
    const json = await response.json();
    return json;
  } catch (e) {
    console.error('Error generating request token:', e);
    throw e; // Fixing the error to throw the caught error 'e'
  }
}

// generateRToken().then(fudge => {
//   console.log(`I have it: ${fudge.request_token}  Let's get out of here`);
// }).catch(e => {
//   console.error('Failed to generate request token:', e);
// });

module.exports = { generateRToken };
