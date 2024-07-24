import React from 'react';
import '../css/vertical-carousel.css';

const VerticalCarousel = ({ movies, onMovieSelect }) => {
  return (
    <>
      {movies.length > 0 ? (
        <div className="vertical-carousel">
          {movies.map((movie) => (
            <div key={movie.id} className="vertical-carousel-item" onClick={() => onMovieSelect(movie)}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        <p>No movies available</p>
      )}
    </>
  );
};

export default VerticalCarousel;
