async function addRating(req, res) {
    const { rating, movieid, sessionid, isguest } = req.body;
    //console.log('Request body:', req.body);
  
    let addon = '';
    if (isguest) {
      addon = 'guest_';
    }
  
    const rd_tok = process.env.TMDB_RD_TOKEN;
    const url = `https://api.themoviedb.org/3/movie/${movieid}/rating?${addon}session_id=${sessionid}`;
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: 'Bearer ' + rd_tok
      },
      body: JSON.stringify({ value: Number(rating) }) // Convert rating to a number
    };
  
    try {
      // console.log('Request URL:', url);
      // console.log('Request options:', options);
      const response = await fetch(url, options);
      if (!response.ok) {
        console.error('Error response:', response.status, response.statusText);
        const errorDetails = await response.json();
        console.error('Error details:', errorDetails);
        throw new Error('Error response is not okay');
      }
      const json = await response.json();
      // console.log('Response:', json);
      res.json(json);
    } catch (e) {
      console.error('Error:', e);
      res.status(500).json({ error: 'Failed to add rating' });
    }
  }
  
  module.exports = { addRating };