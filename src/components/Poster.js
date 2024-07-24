import React from 'react';
import '../css/cardlist.css';

const MoviePoster = ({ movie }) => {
  const placeholderImage = '../../public/logo192.png'; // Replace with the actual path to your placeholder image
  const posterUrl = movie?.poster_path 
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}` 
    : placeholderImage;

  return (
    <div className="movie-poster" id='poster'>
      <img src={posterUrl} alt={movie?.title || 'Movie poster'} />
    </div>
  );
};

export default MoviePoster;
