import React from 'react';
import { addMovieToWatchlist } from './WatchlistService';

const AddToWatchlistButton = ({ movie }) => {
  const handleAddToWatchlist = async () => {
    await addMovieToWatchlist(movie);
    alert('Movie added to watchlist');
  };

  return (
    <button onClick={handleAddToWatchlist}>Add to Watchlist</button>
  );
};

export default AddToWatchlistButton;
