import React, { useState, useEffect } from 'react';
import MovieCarousel from './MovieCarousel';
import CustomDropdown from './Dropdown';
import SingleView from './SingleView';

const TMDB_Recommended = ({movie, onClose}) => {
    const [movies, setmovies] = useState([]);
    const [language, setLanguage] = useState('en-US');
    const [recPage, setRecPage] = useState(1);
    const [recMax, setRecMax] = useState(1);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [submitted, isSubmitted] = useState(false);


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

      const handleClose = () => {
        setSelectedMovie(null);
      };

    const handleMovieSelect = (movie) => {
        setSelectedMovie(movie);
      };

    async function queryRecommendations() {
        let page = recPage ? `${recPage}`: '1';
        const requestBody = {
          id: movie.id,
          lang: language,
          pg: page,
        };
        //console.log(requestBody);
        try {
          const response = await fetch('http://localhost:5000/api/recommendations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
          }
          const recs = await response.json();
          setmovies(recs.results || []);
          setRecMax(recs.total_pages || 1);
          isSubmitted(true);
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        }
      }

    useEffect(() => {
        queryRecommendations();
      }, [movie.id]);

    const nextPageRec = () => setRecPage(prevPage => (prevPage + 1 <= recMax ? prevPage + 1 : prevPage));
    const prevPageRec= () => setRecPage(prevPage => (prevPage > 1 ? prevPage - 1 : 1));


    return(
    <div>
        <div className='col' style={{width:'60vw'}}>
            <button onClick={prevPageRec} disabled={recPage === 1}>Previous Page </button>
            <button onClick={nextPageRec} disabled={recPage === recMax}>Next Page </button>
            <CustomDropdown
                    title='Language'
                    options={languages.map(lang => ({ label: lang.name, value: lang.code }))}
                    onSelect={(selectedLanguage) => setLanguage(selectedLanguage)}
                    onSubmit={submitted}
            />
            <button onClick={() => queryRecommendations()}>Refresh</button>
        <MovieCarousel movies={movies} onMovieSelect={handleMovieSelect}/>
        </div>
        {selectedMovie && (
            <SingleView movie={selectedMovie} onClose={handleClose} onMovieSelect={handleMovieSelect}/>
          )}
                <div className="review-close" onClick={onClose}>
        X
      </div>
    </div>
    );
}

export default TMDB_Recommended;