const fetch = require('node-fetch');
const { addRating } = require('../js/addrating');
const assert = require('assert');

// Mock the global fetch function
global.fetch = (url, options) => {
  return new Promise((resolve, reject) => {
    resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve(''),
    });
  });
};

// Test case
async function testErrorResponse() {
  const rating = 6.2;
  const movie_id = '653346';
  const session_id = '5e57f94e3f46afc149621ce042204de1';
  const isguest = true;

  // Assuming you are using an environment variable for the token
  const rd_tok = process.env.TMDB_RD_TOKEN;

  try {
    await addRating(rating, movie_id, session_id, isguest);
    console.error('Test case failed: Expected error was not thrown');
  } catch (error) {
    assert.strictEqual(error.message, 'Error response is not okay', 'error message should be correct');
    console.log('Test case passed');
  }
}

// Run the test
testErrorResponse();
