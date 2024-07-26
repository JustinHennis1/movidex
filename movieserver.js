const express = require('express');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const dotenv = require('dotenv');
const cors = require('cors');
const { getInTheater } = require('./src/js/intheaters');
const { getTopRated } = require('./src/js/topRated');
const { fetchYoutube } = require('./src/js/youtube');
const { getPopular } = require('./src/js/popular');
const { getUpcoming } = require('./src/js/upcoming');
const { searchMov } = require('./src/js/searchmov');
const { generateRToken } = require('./src/js/createReqTok');
const { guestSession } = require('./src/js/guestsession');
const { createWithToken } = require('./src/js/createSession');
const { deleteSession } = require('./src/js/deleteSession');
const { getReviews } = require('./src/js/reviews');
const { addRating } = require('./src/js/addrating');
const { deleteRating } = require('./src/js/deleterating');
const { getExternalID } = require('./src/js/externalids');
const { getTMDBrecommendations } = require('./src/js/tmdb_rec');


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiKey = process.env.GEMINI_API;

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(apiKey);

// Modify the conversation history
let conversationHistory = [
  {
    role: 'user',
    parts: [{ text: "You are a movie recommendation assistant. Provide family-friendly movie suggestions based on genres or themes. Always give movie titles in double quotes followed by a brief, appropriate description." }]
  },
  {
    role: 'model',
    parts: [{ text: "Understood. I'm here to provide family-friendly movie recommendations. I'll ensure all suggestions are appropriate and will format movie titles in double quotes with brief descriptions. How can I help you find a movie today?" }]
  }
];

app.post('/api/getAIResponse', async (req, res) => {
  const { userInput } = req.body;

  // Add the new user input to the conversation history
  conversationHistory.push({
    role: 'user',
    parts: [{ text: userInput }]
  });

  try {

    const safetySetting = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
      },
    ];
    // Initialize a chat model
    const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings: safetySetting });

    // Start a chat session
    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
      
    });

    // Generate a response
    const result = await chat.sendMessage(userInput);
    const aiResponse = result.response.text();

    // Add the AI response to the conversation history
    conversationHistory.push({
      role: 'model',
      parts: [{ text: aiResponse }]
    });

    res.json({ content: aiResponse });
  } catch (error) {
    console.error("Error in fetching AI response:", error);
    res.status(500).json({ error: 'Error in fetching AI response', details: error.message });
  }
});

/*    Session IDS     */
app.get('/api/createSession', async (req,res) => {
  try {
    generateRToken().then(fudge => {
      const url = `https://www.themoviedb.org/authenticate/${fudge.request_token}?redirect_to=/approve?request_token=${fudge.request_token}`
      res.redirect(url);
    }).catch(e => {
      console.error('Failed to generate request token:', e);
    });
  } catch (err) {

  }
});

app.get('/api/sessionCallback', async (req, res) => {
  const requestToken = req.query.request_token;
  try {
    const sessionData = await createWithToken(requestToken);
    res.json({ session_id: sessionData.session_id });
  } catch (e) {
    res.status(500).send('Failed to create session ID');
  }
});

app.get('/api/guest', async (req,res) => {
  try {
      const gsid = await guestSession();
      res.json(gsid);
  } catch (e) {
    res.status(500).send('Failed to create session ID');
  }
});

app.get('/api/deleteSession', async (req,res) => {
  const session_id = req.body;
  try {
      const response = await deleteSession(session_id);
      res.json(response);
  } catch (e) {
    res.status(500).send('Failed to delete session');
  }
});
// Session IDS END

/*        Movie Filters        */
app.get('/api/inTheaters', async (req, res) => {
  const page = req.query.page || 1;
  try {
    const movies = await getInTheater(page);
    //console.log('Checking Output of In Theaters: ', movies);
    res.json(movies);
  } catch (error) {
    console.error('Error fetching in-theater movies:', error);
    res.status(500).json({ error: 'Failed to fetch movies that are now playing' });
  }
});

app.get('/api/topRated', async (req, res) => {
  const page = req.query.page || 1; // Default to page 1 if no page query parameter is provided
  try {
    const movies = await getTopRated(page); // Pass the page number to getTopRated
    res.json(movies);
  } catch (error) {
    console.error('Error fetching top-rated movies:', error);
    res.status(500).json({ error: 'Failed to fetch top-rated movies' });
  }
});


app.get('/api/popular', async (req, res) => {
  const page = req.query.page || 1;
  try {
    const movies = await getPopular(page);
    res.json(movies);
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    res.status(500).json({ error: 'Failed to fetch popular movies' });
  }
});

app.get('/api/upcoming', async (req, res) => {
  const page = req.query.page || 1;
  try {
    const movies = await getUpcoming(page);
    res.json(movies);
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    res.status(500).json({ error: 'Failed to fetch upcoming movies' });
  }
});

app.post('/api/searchmov', async (req, res) => {
  const { query, lang, page, year } = req.body;
  try {
    const movies = await searchMov(query, lang, page, year);
    res.json(movies);
  } catch (error) {
    console.error('Error fetching searched movies', error);
    res.status(500).json({ error: 'Failed to fetch searched movies' });
  }
});
// MOVIE FILTERS END

app.post('/api/review', async (req, res) => {
  const { id, lang, pg } = req.body;
  try {
    const reviews = await getReviews(id, lang, pg);
    res.json(reviews);
  } catch (e) {
    console.error('Error retrieving reviews', e);
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
});

app.post('/api/recommendations', async (req, res) => {
  const { id, lang, pg } = req.body;
  try {
    const recs = await getTMDBrecommendations(id, lang, pg);
    res.json(recs);
  } catch (e) {
    console.error('Error retrieving reviews', e);
    res.status(500).json({ error: 'Failed to retrieve recommendations' });
  }
});

app.post('/api/addrating', async (req, res) => {
  try {
    await addRating(req, res);
  } catch (e) {
    console.error('Error sending rating:', e);
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/deleterating', async (req, res) => {
  const { movieid, sessionid, isguest } = req.body;
  try {
    const rating_res = await deleteRating(movieid, sessionid, isguest);
    res.json(rating_res);
  } catch (e) {
    console.error('Error deleting rating', e);
    res.status(500).json({ error: 'Failed to remove user rating' });
  }
});

app.get('/api/externalids/:movieid', async (req,res) => {
    try {
      const {movieid} = req.params;
      const ext_id_res = await getExternalID(movieid);
      res.json(ext_id_res);
    } catch (e) {
      console.error('Movie server api could not retrieve external ids');
      throw e;
    }
});


app.get('/api/youtube/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const videosResponse = await fetchYoutube(id);
    if (!videosResponse || videosResponse.error) {
      return res.status(500).json({ error: 'Failed to fetch videos' });
    }
    res.json(videosResponse);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

const PORT = process.env.PORT || 5020;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});