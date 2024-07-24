import React, { useState, useEffect } from 'react';
import MovieCarousel from './MovieCarousel';
import SingleView from './SingleView';
import '../css/cardlist.css';
// import MovieMasonry from './Masonry';

function ChatRecom({ movieTitles }) {
  const [movies, setMovies] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  const handleClose = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      const uniqueMovieTitles = [...new Set(movieTitles)]; // Remove duplicates
      console.log(uniqueMovieTitles);

      const searchResults = await Promise.all(
        uniqueMovieTitles.map(async (title) => {
          const requestBody = {
            query: title,
            lang: '', // Set the desired language, or leave it empty
            page: '1', // Default page number
            year: '' // Set the desired release year, or leave it empty
          };

          try {
            const response = await fetch('http://localhost:5000/api/searchmov', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
              throw new Error('Failed to fetch movies');
            }

            const movies = await response.json();
            return { title, movies: movies.results };
          } catch (error) {
            console.error('Error fetching movies:', error);
            return null;
          }
        })
      );

      const flattenedResults = searchResults
        .filter(Boolean)
        .reduce((acc, result) => {
          const { title, movies } = result;
          acc[title] = movies;
          return acc;
        }, {});

      console.log('flat res:', flattenedResults);
      setMovies(flattenedResults);
    };

    fetchMovieDetails();
  }, [movieTitles]);

  return (
    <div className="popup movie-card-list">
      <div className="popholder">
        <h1 id='recheader'>Recommended Movies</h1>
        <div>
          {Object.keys(movies).length > 0 ? (
            Object.entries(movies).map(([title, movieResults]) => (
              <div key={title}>
                <h6>Based on the search for {title}</h6>
                <MovieCarousel
                  movies={movieResults}
                  onMovieSelect={handleMovieSelect}
                />{/*
                <MovieMasonry
                 movies={movieResults}
                 onMovieSelect={handleMovieSelect}
                />*/}
              </div>
            ))
          ) : (
            <p>Loading movies...</p>
          )}
          {selectedMovie && (
            <SingleView movie={selectedMovie} onClose={handleClose} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatRecom;