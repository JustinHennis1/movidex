import React, { useState, useEffect } from 'react';
import style from '../css/SingleView.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import genresData from '../json/genres.json';
import MoviePoster from './Poster';
import Reviews from './Reviews';
import MovieVideo from './Video';
import { faCircleNodes, faPlus, faStar, faX } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from './AuthContext';
import { addMovieToWatchlist, fetchUserWatchlist, removeMovieFromWatchlist } from '../db_services/WatchlistService';

const SingleView = ({ movie, onClose }) => {
  const [reviewOpen, setReviewOpen] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const [showSlider, setShowSlider] = useState({});
  const [ratings, setRatings] = useState({});
  const { currentUser } = useAuth();

  useEffect(() => {
    const getWatchlist = async () => {
      if (currentUser) {
        const fetchedWatchlist = await fetchUserWatchlist();
        setWatchlist(fetchedWatchlist);
      }
    };
    getWatchlist();
  }, [currentUser]);

  const isMovieInWatchlist = (movieId) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  const toggleReviews = (movieId) => {
   console.log(watchlist);
    setReviewOpen(prevState => ({
      ...prevState,
      [movieId]: !prevState[movieId]
    }));
  };

  function findGenreById(id) {
    return genresData.genres.find(genre => genre.id === id);
  }

  const handleAddMovie = async (movie) => {
    await addMovieToWatchlist(movie);
    setWatchlist([...watchlist, movie]);
  };

  const handleRemoveMovie = async (movieId) => {
    await removeMovieFromWatchlist(movieId);
    setWatchlist(watchlist.filter(movie => movie.id !== movieId));
  };

  const handleStarClick = (movieId) => {
    setShowSlider((prevShowSlider) => ({
      ...prevShowSlider,
      [movieId]: !prevShowSlider[movieId],
    }));
  };

  const handleRatingChange = (movieId, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [movieId]: value,
    }));
  };

  const handleRatingSubmit = (movieId) => {
    const rating = ratings[movieId];
    alert(`Rating for movie ${movieId}: ${rating}`);
    setShowSlider((prevShowSlider) => ({
      ...prevShowSlider,
      [movieId]: false,
    }));
  };

  const handleGetImdbId = async (movieId) => {
    try {
      const url = `http://localhost:5000/api/externalids/${movieId}`;
      const response = await fetch(url);
      const data = await response.json();
      const imdbId = data.imdb_id;
      if (imdbId) {
        window.open(`https://www.imdb.com/title/${imdbId}/`, '_blank');
      } else {
        console.error('Failed to fetch IMDB ID');
      }
    } catch (error) {
      console.error('Failed to fetch IMDB ID:', error);
    }
  };

  return (
    <div className={style.card} style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})` }}>
      <div className='row'>
        <div className='col' style={{width:'auto'}}>
        <MoviePoster movie={movie} />
        <div className='row'>
        <button type="button" className={style.coolbtn} onClick={() => toggleReviews(movie.id)}>
          Reviews
        </button>
        <button type="button" className={style.coolbtn} onClick={() => handleGetImdbId(movie.id)}>
          IMDB
        </button>

      </div>
        </div>
        <div className={style.cardcontent}>
          <div className={style.cardtext}>
            <div className='row' style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: '0' }}>
                {movie.title}
                ({movie.release_date.slice(0,4)})
              </h3>
              {showSlider[movie.id] && (
                  <div className='col' style={{margin:'auto'}}>
                    <p style={{width:'100%', textAlign:'center'}}>{ratings[movie.id]}/10</p>
                  
                      <div className="rating-slider">
                        <input
                          type="range"
                          min="0.0"
                          max="10.0"
                          step={0.1}
                          value={ratings[movie.id] || 0}
                          onChange={(e) => handleRatingChange(movie.id, e.target.value)}
                        />
                        <button onClick={() => handleRatingSubmit(movie.id)}>Submit Rating</button>
                      </div>
                    
                    </div>
                  )}
              <div style={{ display: 'flex', paddingInline: '10px', justifyContent: 'space-between', width: '8vw' }}>
              <FontAwesomeIcon icon={faStar} size='2x' title="Rate" onClick={() => handleStarClick(movie.id)}/>
              <FontAwesomeIcon icon={faCircleNodes} size='2x' className='spin' title="Query GPT" />
                {currentUser && !isMovieInWatchlist(movie.id) ? (
                  <FontAwesomeIcon icon={faPlus} size='2x' title="Add to Watchlist" onClick={() => handleAddMovie(movie)} />
                ) : (
                  <></>
                )}
                {currentUser && isMovieInWatchlist(movie.id) ? (
                  <FontAwesomeIcon icon={faX} size='2x' title="Remove From Watchlist" onClick={() => handleRemoveMovie(movie.id)} />
                ) : (
                  <></>
                )}
              </div>
            </div>
            <p>{movie.overview}</p>
            <div className='row'>
              <div className='col'>
                Scored:
              </div>
              <div className='cl1' style={{ textAlign: 'center' }}>
                <p>
                  {movie.vote_count > 0 ? movie.vote_average : '-'}
                </p>
                <div style={{ backgroundColor: 'white', height: '2px' }}></div>
                <p>
                  10
                </p>
              </div>
              <div className='cl0' style={{ textAlign: 'center' }}>
                <p>({movie.vote_count} votes)</p>
              </div>
              <div className='col'></div>
            </div>

            <div className='row'>
              <p>Release Date: {movie.release_date}</p>
              {reviewOpen[movie.id] && <Reviews movie={movie} onClose={() => toggleReviews(movie.id)} />}
            </div>

            <div className='row' key={movie.id}>
              {movie.genre_ids.map((genre_id) => {
                const genre = findGenreById(genre_id);
                return (
                  <div style={{ padding: '5px' }} key={genre_id}>
                    <p>{genre ? genre.name : 'Unknown Genre'}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className='row'>
        <MovieVideo movie={movie} />
      </div>
      <div className={style.cardclose} onClick={onClose}>
        X
      </div>
    </div>
  );
};

export default SingleView;
