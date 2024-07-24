import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import CustomDropdown from './Dropdown';
import MovieCarousel from './MovieCarousel';
import '../css/search.css';
import SingleView from './SingleView';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [language, setLanguage] = useState('');
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [changedcolor, changeColor] = useState('');
  const [submitted, isSubmitted] = useState(false);
  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  const handleClose = () => {
    setSelectedMovie(null);
  };

  let years =  [];
  for (let i = 1950; i < 2024; i++) {
    years.push(`${i}`);
  }

  

  const languages = [
    { name: 'English', code: 'en' },
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'Italian', code: 'it' },
    { name: 'Russian', code: 'ru' },
    { name: 'Chinese', code: 'zh' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Portuguese', code: 'pt' },
    { name: 'Arabic', code: 'ar' },
    { name: 'Korean', code: 'ko' },
    { name: 'Vietnamese', code: 'vi' },
    { name: 'German', code: 'de' },
    { name: 'Hindi', code: 'hi' },
    { name: 'Bengali', code: 'bn' },
    { name: 'Urdu', code: 'ur' },
    { name: 'Indonesian', code: 'id' },
    { name: 'Swahili', code: 'sw' }
  ];

  const handleSearch = async () => {
    if (!query) {
      alert('Please enter a search query');
      return;
    }

    const page = '1'; // Default page number
    console.log(query);
    const requestBody = {
      query,
      lang: language,
      page,
      year: releaseYear
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
      setQuery('');
      setLanguage('');
      setReleaseYear('');
      isSubmitted(true);
      const movies = await response.json();
      setMovies(movies.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => isSubmitted(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [submitted]);

  return (
    <div className="search-component">
      <h1>Movie Lookup:</h1>
      <div className="search-controls">
        <CustomDropdown
          title='Release Year'
          options={years}
          onSelect={setReleaseYear}
          onSubmit={submitted}
        />
        <CustomDropdown
          title='Language'
          options={languages.map(lang => ({ label: lang.name, value: lang.code }))}
          onSelect={(selectedLanguage) => setLanguage(selectedLanguage)}
          onSubmit={submitted}
        />

        <div className="searchbar">
          <label htmlFor="searchinput" className="search-label">
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
          </label>
          <input
            type='text'
            value={query}
            className='searchinput'
            placeholder='Search'
            id='searchinput'
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className='sbut' onClick={handleSearch}>
            <FontAwesomeIcon icon={faCircleChevronRight} size="2x" color={changedcolor} onMouseLeave={() => changeColor('')} onMouseEnter={() => changeColor('red')} />
          </div>
        </div>
      </div>

      <MovieCarousel movies={movies} onMovieSelect={handleMovieSelect} />
      {selectedMovie && (
        <SingleView movie={selectedMovie} onClose={handleClose} />
      )}
      
    </div>
  );
};

export default SearchComponent;
