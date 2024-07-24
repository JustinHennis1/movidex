// testGetReviews.js
// const { getExternalID } = require('../js/externalids.js'); // Adjust the path as needed
// require('dotenv').config();

// (async () => {
//   try {
//     const movie_id = '653346'; // Example movie ID

//     const ids = await getExternalID(movie_id);
//     console.log('Reviews:', ids);
//   } catch (error) {
//     console.error('Error testing getExternalId:', error);
//   }
// })();


(async () => {
  try {
    const movie_id = '653346';
    const url = `http://localhost:5000/api/externalids/${movie_id}`;
    const response = await fetch(url);
    const json = response.json();

    console.log('Ids:', json);
  } catch (error) {
    console.error('Error testing getExternalId:', error);
  }
})();