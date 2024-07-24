import React, { useEffect, useState } from 'react';
import '../css/cardlist.css';

const MovieVideo = ({ movie }) => {
  const [videoKey, setVideoKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchTrailer() {
      if (!movie?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/youtube/${movie.id}`);
        const data = await response.json();

        // Filter out the unwanted trailer
        const validTrailers = data.results.filter(video => video.name !== "Official Trailer with Soren Dubbing");

        // Find the final trailer first, if available
        const finalTrailer = validTrailers.find(video => video.name.toLowerCase().includes('final trailer'));
        if (finalTrailer) {
          setVideoKey(finalTrailer.key);
        } else {
          // If no final trailer, find the first available trailer
          const trailer = validTrailers.find(video => video.type === 'Trailer');
          if (trailer) {
            setVideoKey(trailer.key);
          } else {
            setError(true);
          }
        }
      } catch (error) {
        console.error('Failed to fetch movie trailer:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchTrailer();
  }, [movie?.id]);

  if (loading) {
    return <p>Loading trailer...</p>;
  }

  if (error || !videoKey) {
    return <p>Trailer not available</p>;
  }

  return (
    <div className="movie-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoKey}`}
        title={movie.title}
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default MovieVideo;
