// testGetReviews.js
const { getReviews } = require('../js/reviews.js'); // Adjust the path as needed
require('dotenv').config();

(async () => {
  try {
    const movie_id = '653346'; // Example movie ID
    const lang = 'en-US'; // Example language
    const page = 1; // Example page number , lang, page

    const reviews = await getReviews(movie_id);
    console.log('Reviews:', reviews);
  } catch (error) {
    console.error('Error testing getReviews:', error);
  }
})();
