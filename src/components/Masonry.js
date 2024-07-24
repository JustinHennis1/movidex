import React from 'react';
import Masonry from 'react-masonry-css';
import '../css/masonry.css';

const MovieMasonry = ({ movies, onMovieSelect }) => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <>
      {movies.length > 0 ? (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {movies.map((movie) => (
            <div key={movie.id} className="masonry-item" onClick={() => onMovieSelect(movie)}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="masonry-item-image"
              />
              <h3>{movie.title}</h3>
            </div>
          ))}
        </Masonry>
      ) : (
        <p>No movies available</p>
      )}
    </>
  );
};

export default MovieMasonry;
