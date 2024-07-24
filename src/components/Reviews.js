// Inside the Reviews component
import React, { useEffect, useState } from 'react';
import '../css/review.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function Reviews({ movie, onClose }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function queryReview() {
      const page = '1';
      const requestBody = {
        id: movie.id,
        lang: 'en-US',
        pg: page,
      };

      try {
        const response = await fetch('http://localhost:5000/api/review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const revs = await response.json();
        setReviews(revs.results || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }
    queryReview();
  }, [movie.id]);

  return (
    <div >
      <div className="review-content">
        <div style={{color:'black'}}>
          {reviews == [] && <p>No reviews yet</p>}
          {reviews.map(review => (
            <li key={review.id} className="review-item">
            <div className="review-header">
              <img 
                src={review.author_details.avatar_path 
                  ? `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`
                  : 'default-avatar.png'} 
                alt={`${review.author}'s avatar`}
                className="avatar"
              />
              <div className="author-info">
                <h4>{review.author}</h4>
                <p>Rating: {review.author_details.rating || 'N/A'}
                  <FontAwesomeIcon icon={faStar} color='#FFD43B'  />
                </p>
              </div>
            </div>
            <p>{review.content}</p>
            <a href={review.url} target="_blank" rel="noopener noreferrer">Read more</a>
          </li>
          ))}
         
        </div>
      </div>
      <div className="review-close" onClick={onClose}>
        X
      </div>
    </div>
  );
}

export default Reviews;