import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/carousel.css';

const MovieCarousel = ({ movies, onMovieSelect }) => {

  const settings = {
    dots: true,
    infinite: movies.length > 1,
    speed: 500,
    slidesToShow: Math.min(5, movies.length),  // Ensures slidesToShow does not exceed the number of movies
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, movies.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 684,
        settings: {
          slidesToShow: Math.min(2, movies.length),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {movies.length > 0 ? (
        <div className="carousel-container">
          <Slider {...settings}>
            {movies.map((movie) => (
              <div key={movie.id} className="carousel-item">
                <div className="image-wrapper">
                  <div className="boxed">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      onClick={() => onMovieSelect(movie)}
                    />
                    <h3>{movie.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default MovieCarousel;
