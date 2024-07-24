import React from 'react';
import { removeMovieFromWatchlist } from './WatchlistService';

const RemoveFromWatchlistButton = ({ movieId }) => {
  const handleRemoveFromWatchlist = async () => {
    await removeMovieFromWatchlist(movieId);
    alert('Movie removed from watchlist');
  };

  return (
    <button onClick={handleRemoveFromWatchlist}>Remove from Watchlist</button>
  );
};

export default RemoveFromWatchlistButton;
