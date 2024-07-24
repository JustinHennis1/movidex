import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { SessionContext } from './SessionContext.js';
import '../css/cardlist.css';
import genresData from '../json/genres.json';
import MoviePoster from './Poster';
import MovieVideo from './Video';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faCheckDouble, faCircleNodes, faPlus, faStar, faX } from '@fortawesome/free-solid-svg-icons';
import { removeMovieFromWatchlist, addMovieToWatchlist, fetchUserWatchlist } from '../db_services/WatchlistService.js';
import { addMovieToRated,  fetchUserRatedMovies } from '../db_services/RatedMovies.js';
import Reviews from './Reviews.js';
import TMDB_Recommended from './tmdbRecom.js';


function MovieCardList({setOpen}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('inTheaters');
  const [moviesInTheaters, setTheaterMovies] = useState([]);
  const [moviesTopRated, setTopRatedMovies] = useState([]);
  const [moviesPopular, setPopularMovies] = useState([]);
  const [moviesUpcoming, setUpcomingMovies] = useState([]);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [theaterPage, setTheaterPage] = useState(1);
  const [popularPage, setPopularPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [theaterMax, setTheaterMax] = useState(1);
  const [popularMax, setPopularMax] = useState(1);
  const [topRatedMax, setTopRatedMax] = useState(1);
  const [upcomingMax, setUpcomingMax] = useState(1);
  const [reviewOpen, setReviewOpen] = useState({});
  const [somethingSimilar, setSomethingSimilar] = useState({});
  const [watchlist, setWatchlist] = useState([]);
  const [ratedlist, setRatedlist] = useState([]);
  const [showSlider, setShowSlider] = useState({});
  const [ratedMovie, setRatedMovie] = useState(null);
  const [ratings, setRatings] = useState({});
  
  
 
  const { currentUser } = useAuth();
  const sessionid  = useContext(SessionContext);

  useEffect(() => {
    const getWatchlist = async () => {
      /*console.log(currentUser);*/
      if (currentUser) {
        const fetchedWatchlist = await fetchUserWatchlist();
        setWatchlist(fetchedWatchlist);
      }
    };
    

    getWatchlist();
    
  }, [currentUser]);

  useEffect(() => {
    const getRated = async () => {
      // console.log(currentUser);
      if (currentUser) {
        const fetchedRatedlist = await fetchUserRatedMovies();
        setRatedlist(fetchedRatedlist);
      }
    };
    getRated();
  }, [currentUser]);

  const handleGetImdbId = async (movieId) => {
    try {
      const url = `http://localhost:5020/api/externalids/${movieId}`;
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


  
  const handleAddMovie = async (movie) => {
    await addMovieToWatchlist(movie);
    setWatchlist([...watchlist, movie]);
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

  const handleRatingSubmit = async (movieId) => {
    const rating = ratings[movieId];
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
  
    const url = 'http://localhost:5020/api/addrating';
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, details: ${errorDetails.message}`);
      }
      const data = await response.json();
      alert(`Rating for movie ${movieId}: ${data}`);
  
      setShowSlider((prevShowSlider) => ({
        ...prevShowSlider,
        [movieId]: false,
      }));
  
      // Add the rated movie to the user's ratedmovies collection
      if (response.ok) {
        const ratedMovieObj = getMoviesToDisplay().find((movie) => movie.id === movieId);
        if (ratedMovieObj && currentUser) {
          await addMovieToRated(ratedMovieObj);
          setRatedlist((prevRatedMovies) => [...prevRatedMovies, ratedMovieObj]);
          setRatedMovie(ratedMovieObj); // Set the ratedMovie state
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Failed to submit rating: ' + error.message);
    }
  };
  
  

  const handleRemoveMovie = async (movieId) => {
    await removeMovieFromWatchlist(movieId);
    setWatchlist(watchlist.filter(movie => movie.id !== movieId));
  };

  const isMovieInWatchlist = (movieId) => {
    return watchlist.some(movie => movie.id === movieId);
  };

  const isMovieInRatedMovies = (movieId) => {
    return ratedlist.some((movie) => movie.id === movieId);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleReviews = (movieId) => {
    setReviewOpen(prevState => ({
      ...prevState,
      [movieId]: !prevState[movieId]
    }));
  };

  const toggleSomethingSimilar = (movieId) => {
    setSomethingSimilar(prevState => ({
      ...prevState,
      [movieId]: !prevState[movieId]
    }));
  };
  

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    setDropdownOpen(false);
  };

  function findGenreById(id) {
    return genresData.genres.find(genre => genre.id === id);
  }

  useEffect(() => {
    async function fetchTheaterMovies(page) {
      try {
        const response = await fetch(`http://localhost:5020/api/inTheaters?page=${page}`);
        const data = await response.json();
        setTheaterMovies(data.results || []);
        setTheaterMax(data.total_pages || 1);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    }
    fetchTheaterMovies(theaterPage);
  }, [theaterPage]);

  useEffect(() => {
    async function fetchTopRatedMovies(page) {
      try {
        const response = await fetch(`http://localhost:5020/api/topRated?page=${page}`);
        //console.log(response);
        const data = await response.json();
        setTopRatedMovies(data.results || []);
        setTopRatedMax(data.total_pages || 1);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    }
    fetchTopRatedMovies(topRatedPage);
  }, [topRatedPage]);

  useEffect(() => {
    async function fetchPopularMovies(page) {
      try {
        const response = await fetch(`http://localhost:5020/api/popular?page=${page}`);
        const data = await response.json();
        setPopularMovies(data.results || []);
        setPopularMax(data.total_pages || 1);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    }
    fetchPopularMovies(popularPage);
  }, [popularPage]);

  useEffect(() => {
    async function fetchUpcomingMovies(page) {
      try {
        const response = await fetch(`http://localhost:5020/api/upcoming?page=${page}`);
        const data = await response.json();
        setUpcomingMovies(data.results || []);
        setUpcomingMax(data.total_pages || 1);
      } catch (error) {
        console.error('Failed to fetch movies:', error);
      }
    }
    fetchUpcomingMovies(upcomingPage);
  }, [upcomingPage]);

  const getMoviesToDisplay = () => {
    switch (currentFilter) {
      case 'topRated':
        return moviesTopRated;
      case 'popular':
        return moviesPopular;
      case 'upcoming':
        return moviesUpcoming;
      case 'inTheaters':
      default:
        return moviesInTheaters;
    }
  };
useEffect(() => {
      const cardholder = document.querySelector('.cardholder');

      function checkCards() {
        const cards = document.querySelectorAll('.card');
        const triggerBottom = window.innerHeight / 5 * 2;

        cards.forEach((card) => { 
            const cardTop = card.getBoundingClientRect().top;
            if(cardTop < triggerBottom) {
                card.classList.add('enlarge');
            } else {
                card.classList.remove('enlarge');
            }
        });
    }

    if(cardholder){
        cardholder.addEventListener('scroll', checkCards);
        checkCards();
      

      return () => {
        cardholder.removeEventListener('scroll', checkCards);
      };
    }
  
}, [moviesInTheaters, moviesTopRated, moviesPopular, moviesUpcoming]);


const nextPageTopRated = () => setTopRatedPage(prevPage => (prevPage + 1 <= topRatedMax ? prevPage + 1 : 1));
const prevPageTopRated = () => setTopRatedPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
const nextPagePopular = () => setPopularPage(prevPage => (prevPage + 1 <= popularMax ? prevPage + 1 : 1));
const prevPagePopular = () => setPopularPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
const nextPageUpcoming = () => setUpcomingPage(prevPage => (prevPage + 1 <= upcomingMax ? prevPage + 1 : 1));
const prevPageUpcoming = () => setUpcomingPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));
const nextPageInTheaters = () => setTheaterPage(prevPage => (prevPage + 1 <= theaterMax ? prevPage + 1 : 1));
const prevPageInTheaters = () => setTheaterPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));

const getButtonsToDisplay = () => {
  switch (currentFilter) {
    case 'topRated':
      return (
        <div>
          <button onClick={prevPageTopRated} disabled={topRatedPage === 1}>Previous</button>
          <button onClick={nextPageTopRated}>Next</button>
        </div>
      );
    case 'popular':
      return (
        <div>
          <button onClick={prevPagePopular} disabled={popularPage === 1}>Previous</button>
          <button onClick={nextPagePopular}>Next</button>
        </div>
      );
    case 'upcoming':
      return (
        <div style={{padding:'20px'}}>
          <button onClick={prevPageUpcoming} disabled={upcomingPage === 1}>Previous</button>
          <button onClick={nextPageUpcoming}>Next</button>
        </div>
      );
    case 'inTheaters':
    default:
      return (
        <div style={{padding:'20px'}}>
          <button onClick={prevPageInTheaters} disabled={theaterPage === 1}>Previous</button>
          <button onClick={nextPageInTheaters}>Next</button>
        </div>
      );
  }
};

  return (
    <div className="movie-card-list">
      
      <h2 >MOVIDEX</h2>
      <h1 style={{fontFamily:'Lora'}}>"I'm gonna make him an offer he can't refuse."</h1>
      <p style={{color:'white', textAlign:'right', paddingRight:'20%'}}>- The Godfather(1972)</p>
      <div className="cardholder">
        <div className="cardholder-header">
          <div className="dropdown" >
            <div className='row'>
              <button
                id='top'
                type="button"
                style={{maxHeight:'80px'}}
                onClick={() => toggleDropdown()}>
                Category
              </button>
            </div>
          </div>
          <div className={'dropdown-menub'} style={{ display: dropdownOpen ? 'block' : 'none' }} onMouseLeave={() =>toggleDropdown()}>
                <button className="dropdown-itemb" onClick={() => handleFilterChange('inTheaters')}>Now Playing</button>
                <button className="dropdown-itemb" onClick={() => handleFilterChange('topRated')}>Top Rated</button>
                <button className="dropdown-itemb" onClick={() => handleFilterChange('popular')}>Popular</button>
                <button className="dropdown-itemb" onClick={() => handleFilterChange('upcoming')}>Upcoming</button>
          </div>
        
        </div>
        <h1 style={{ color: 'white', fontFamily:'showtime', fontSize: '60px' }}>
          {currentFilter === 'inTheaters'
            ? 'In Theaters Now'
            : currentFilter === 'topRated'
            ? 'Top Rated Movies'
            : currentFilter === 'popular'
            ? 'Popular Movies'
            : 'Upcoming Movies'}
        </h1>
        <div className="cards-container">
        {getButtonsToDisplay}
        

        {getMoviesToDisplay().map((movie) => (
            <div className="card" key={movie.id} style={{backgroundImage:`url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`}}>
              <div className='row'>
              
              <MoviePoster movie={movie} />
              <div className="card-content">
                <div className="card-text">
                  <div className='row' style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                  <h3 style={{margin:'0'}}>
                    {movie.title}
                    
                  </h3>
                  {showSlider[movie.id] && (
                  <div className='col' style={{margin:'auto'}}>
                    <p style={{width:'100%', textAlign:'center'}}>{ratings[movie.id]}/10</p>
                  
                      <div className="rating-slider">
                        <input
                          type="range"
                          min="0.0"
                          max="10.0"
                          step={0.5}
                          value={ratings[movie.id] || 0}
                          onChange={(e) => handleRatingChange(movie.id, e.target.value)}
                        />
                        <button className='cardbtn' onClick={() => handleRatingSubmit(movie.id)}>Submit Rating</button>
                      </div>
                    
                    </div>
                  )}
                  <div style={{display:'flex',paddingInline:'10px', justifyContent:'space-between', width:'8vw'}}>
                    
                  {!currentUser ? (
                      <FontAwesomeIcon className='cardbtn' icon={faStar} size="2x" title="Rate" onClick={() => handleStarClick(movie.id)} />
                    ) : ratedMovie && ratedMovie.id === movie.id ? (
                      <FontAwesomeIcon  icon={faCheckDouble} size="2x" title="Rated" color="green" />
                    ) : isMovieInRatedMovies(movie.id) ? (
                      <FontAwesomeIcon  icon={faCheckDouble} size="2x" title="Rated" color="green" />
                    ) : (
                      <FontAwesomeIcon className='cardbtn' icon={faStar} size="2x" title="Rate" color="red" onClick={() => handleStarClick(movie.id)} />
                    )}

                    {/*Query GPT  */}
                    <FontAwesomeIcon icon={faCircleNodes} size='2x' className='spin cardbtn' title="Query GPT" onClick={setOpen}/>

                    {/*Adding to watchlist  */}
                    {currentUser && !isMovieInWatchlist(movie.id)? (<FontAwesomeIcon className='cardbtn' icon={faPlus} size='2x' title="Add to Watchlist" onClick={() => handleAddMovie(movie)}/>) : (<></>) }
                    {/*Removing from watchlist  */}
                    {currentUser && isMovieInWatchlist(movie.id)? (<FontAwesomeIcon className='cardbtn' icon={faX} size='2x' title="Remove From Watchlist" onClick={() => handleRemoveMovie(movie.id)}/>) : (<></>) }
                 
                  </div>
                  
                  
                  </div>
                  <p>{movie.overview}</p>
                  <div className='row'>
                    <div className='col' >
                             
                             Scored: 
                    </div>
                    <div className='cl1' style={{textAlign:'center'}} >
                     
                
                      <p>
                        {movie.vote_count > 0 ? movie.vote_average : '-'}
                      </p>
                     <div style={{backgroundColor: 'white', height: '2px'}}></div>
                      <p>
                        10
                      </p>
                     

                    </div>
                    <div className='cl0' style={{textAlign:'center'}}>
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
                        <div style={{padding:'5px'}}  key={genre_id}>
                          <p>{genre ? genre.name : 'Unknown Genre'}</p>
                          </div>);
                      })}

                       
                  </div>
                     {somethingSimilar[movie.id] && <TMDB_Recommended movie={movie} onClose={() => toggleSomethingSimilar(movie.id)} />}

                  
                  
                </div>
                
              </div>
         
              
              </div>
              <div className='row' ><MovieVideo movie={movie}/></div>
              <div className='row'>
                <button type="button" onClick={() => toggleReviews(movie.id)}>
                    Reviews
                </button>
                <button type="button" onClick={() => handleGetImdbId(movie.id)}>
                    IMDB
                </button>
                <button type="button" onClick={() => toggleSomethingSimilar(movie.id)}>
                    Find Something Similar
                </button>
              </div>
            </div>
          ))}

         
        
          <div className='row' style={{height:'400px', display:'flex', justifyContent:'flex-end'}}>
            <a href='#top' className='backtotop'><FontAwesomeIcon icon={faArrowUp} beat title='To The Top'/></a>
          </div>
        </div>
      </div> 
    
    
      
         
    </div>

  );
}

export default MovieCardList;

/*
Example Response From "In Theaters" otherwise known as TMD's /nowplaying route:

{
  "adult": false,
  "backdrop_path": "/fqv8v6AycXKsivp1T5yKtLbGXce.jpg",
  "genre_ids": [
    878,
    12,
    28
  ],
  "id": 653346,
  "original_language": "en",
  "original_title": "Kingdom of the Planet of the Apes",
  "overview": "Several generations in the future following Caesar's reign, apes are now the dominant species and live harmoniously while humans have been reduced to living in the shadows. As a new tyrannical ape leader builds his empire, one young ape undertakes a harrowing journey that will cause him to question all that he has known about the past and to make choices that will define a future for apes and humans alike.",
  "popularity": 5313.091,
  "poster_path": "/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
  "release_date": "2024-05-08",
  "title": "Kingdom of the Planet of the Apes",
  "video": false,
  "vote_average": 6.92,
  "vote_count": 804
}, */