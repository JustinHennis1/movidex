import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from './AuthContext';
import { SessionContext } from './SessionContext.js';
import '../css/watchlist.css'; // Import the CSS file for styling
import { removeMovieFromWatchlist, fetchUserWatchlist } from '../db_services/WatchlistService.js';
import { addMovieToRated, fetchUserRatedMovies } from '../db_services/RatedMovies.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faX, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import SingleView from './SingleView.js';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  const [ratedlist, setRatedlist] = useState([]);
  const [showRating, setShowRating] = useState({});
  const [ratings, setRatings] = useState({});
  const [hoverRating, setHoverRating] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { currentUser } = useAuth();
  const sessionid  = useContext(SessionContext);

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  const handleClose = () => {
    setSelectedMovie(null);
  };

  useEffect(() => {
    const getRated = async () => {
      if (currentUser) {
        const fetchedRatedlist = await fetchUserRatedMovies();
        setRatedlist(fetchedRatedlist);
      }
    };
    getRated();
  }, [currentUser]);

  const handleRatingSubmit = async (movieId, rating) => {
    //console.log(rating);
    const reqbody = {
      rating: rating,
      movieid: movieId,
      sessionid: sessionid,
      isguest: true
    };

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(reqbody)
    };

    const url = '/api/addrating';

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails.message}`);
      }
      //const data = await response.json();
      //alert(`Rating for movie ${movieId}: ${data}`);

      setShowRating((prevShowRating) => ({
        ...prevShowRating,
        [movieId]: false,
      }));

      if (response.ok) {
        const ratedMovieObj = watchlist.find((movie) => movie.id === movieId);
        if (ratedMovieObj && currentUser) {
          await addMovieToRated(ratedMovieObj);
          setRatedlist((prevRatedMovies) => [...prevRatedMovies, ratedMovieObj]);
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating: ' + error.message);
    }
  };

  useEffect(() => {
    const loadWatchlist = async () => {
      const userWatchlist = await fetchUserWatchlist();
      setWatchlist(userWatchlist);
    };
    loadWatchlist();
  }, []);

  const handleRatingChange = (movieId, value) => {
    /*console.log(`Hover rating for movie ${movieId}: ${value}`);*/
    setHoverRating((prevHoverRating) => ({
      ...prevHoverRating,
      [movieId]: value,
    }));
  };

  const handleStarClick = (movieId, event) => {
    event.stopPropagation();
    setShowRating((prevShowRating) => ({
      ...prevShowRating,
      [movieId]: !prevShowRating[movieId],
    }));
  };

  const handleStarMouseLeave = (movieId) => {
    setHoverRating((prevHoverRating) => ({
      ...prevHoverRating,
      [movieId]: undefined,
    }));
  };

  const isMovieInRatedMovies = (movieId) => {
    return ratedlist.some((movie) => movie.id === movieId);
  };

  const handleRemoveMovie = async (movieId, event) => {
    event.stopPropagation();
    await removeMovieFromWatchlist(movieId);
    setWatchlist(watchlist.filter(movie => movie.id !== movieId));
  };

  const renderStars = (movieId) => {
    const currentRating = ratings[movieId] || 0;
    const hoverValue = hoverRating[movieId];
    const displayRating = hoverValue !== undefined ? hoverValue : currentRating;
    /*console.log('movieId:', movieId, 'currentRating:', currentRating, 'hoverValue:', hoverValue, 'displayRating:', displayRating);*/
  
    const stars = [];
    const row1Stars = [];
    const row2Stars = [];
  
    for (let i = 1; i <= 20; i++) {
      const ratingValue = i * 0.5;
      const star = (
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          size="2xs"
          color={ratingValue <= displayRating ? "gold" : "gray"}
          onMouseEnter={() => handleRatingChange(movieId, ratingValue)}
          onMouseLeave={() => handleStarMouseLeave(movieId)}
          onClick={() => {
            setRatings((prevRatings) => ({
              ...prevRatings,
              [movieId]: ratingValue,
            }));
            handleRatingSubmit(movieId, hoverRating[movieId]);
          }}
        />
      );

      const star2 = (
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          size="xs"
          color={ratingValue <= displayRating ? "gold" : "gray"}
          onMouseEnter={() => handleRatingChange(movieId, ratingValue)}
          onMouseLeave={() => handleStarMouseLeave(movieId)}
          onClick={() => {
            setRatings((prevRatings) => ({
              ...prevRatings,
              [movieId]: ratingValue,
            }));
            handleRatingSubmit(movieId, hoverRating[movieId]);
          }}
        />
      );
  
      if (i <= 10) {
        row1Stars.push(star);
      } else {
        row2Stars.push(star2);
      }
    }
  
    stars.push(
      <div key="star-rows" className="star-rows">
        <div className="star-row">{row1Stars}</div>
        <div className="star-row" >{row2Stars}</div>
      </div>
    );
  
    return stars;
  };


  

  return (
    <div className="watchlist-container">
      <h1 style={{fontFamily:'Lora'}}>My Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="movies-grid">
          {watchlist.map(movie => (
            <div
              className="movie-item"
              key={movie.id}
              style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w342${movie.poster_path})` }}
              onMouseEnter={() => setHoveredMovieId(movie.id)}
              onMouseLeave={() => setHoveredMovieId(null)}
              onClick={() => handleMovieSelect(movie)}
            >
              <div className="icon">
                {hoveredMovieId === movie.id && (
                  <>
                    {!currentUser ? (
                      <FontAwesomeIcon icon={faStar} title="Rate" onClick={() => handleStarClick(movie.id)} />
                    ) : isMovieInRatedMovies(movie.id) ? (
                      <FontAwesomeIcon icon={faCheckDouble} title="Rated" color="green" />
                    ) : (
                      <FontAwesomeIcon icon={faStar} title="Rate" color="red" onClick={(event) => handleStarClick(movie.id, event)} />
                    )}
               
                    <div style={{background:'black', borderRadius:'360px', paddingLeft:'11px', paddingRight:'11px'}}>
                      <FontAwesomeIcon icon={faX} size='2xs' color='red' onClick={(event) => handleRemoveMovie(movie.id, event)} />
                    </div>
                  </>
                )}
              </div>
              {showRating[movie.id] && (
                <div className="star-rating">
                  {renderStars(movie.id)}
                </div>
              )}
              <div className="movie-content">
                <h3>{movie.title}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          { !currentUser &&
            <div style={{height:'34.2vh', color:'white'}}>
              <h3 style={{fontSize:'20px'}}>Whoops...</h3>
              <a href="/sign-in" className='link' style={{color:'#c00', paddingRight:'5px'}}>Sign In</a>
              To View Your Watchlist
              </div>
          }
          {currentUser && 
              <div style={{height:'34.2vh', color:'white'}}>
                  <h3 style={{fontSize:'20px'}}>No movies in watchlist</h3>   
              </div>
          }
        </>
      )}

      {selectedMovie && <SingleView movie={selectedMovie} onClose={handleClose}/>}
    </div>
  );
};

export default Watchlist;
