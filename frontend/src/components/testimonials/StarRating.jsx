import React from 'react';
import './StarRating.css';

const StarRating = ({ rating, onRatingChange, readonly = false, darkMode = false }) => {
  const handleClick = (index) => {
    if (!readonly && onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div className={`star-rating ${readonly ? 'star-rating-readonly' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? `filled-${darkMode ? 'dark' : 'light'}` : darkMode ? 'star-dark' : 'star-light'}`}
          onClick={() => handleClick(star)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;