const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

async function deleteSession(sid){
    const rdtoken = process.env.TMDB_RD_TOKEN;
    const url = 'https://api.themoviedb.org/3/authentication/session';
    const options = {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: 'Bearer '+rdtoken
      },
      body: JSON.stringify({session_id: sid}) //assuming sid is passed as string and not int
    };

    try {
      const response = await fetch(url, options);
      if(!response.ok){
        throw new Error(`Error response: ${response.text}, status: ${response.status}`);
      }
      const json = response.json();
      return json;
  } catch (e) {
      console.error('Error deleting session ', e);
      throw error;
  }
}

module.exports = {deleteSession};