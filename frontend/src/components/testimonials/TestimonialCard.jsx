import React from 'react';
import StarRating from './StarRating';
import './TestimonialCard.css';

const TestimonialCard = ({ testimonial, darkMode }) => {
  const { name, rating, comment, date } = testimonial;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`testimonial-card ${darkMode ? 'testimonial-card-dark' : 'testimonial-card-light'}`}>
      <div className="testimonial-card-header">
        <h3 className={`testimonial-name ${darkMode ? 'testimonial-name-dark' : 'testimonial-name-light'}`}>
          {name}
        </h3>
        <StarRating rating={rating} readonly={true} darkMode={darkMode} />
      </div>
      <p className={`testimonial-comment ${darkMode ? 'testimonial-comment-dark' : 'testimonial-comment-light'}`}>
        {comment}
      </p>
      <span className={`testimonial-date ${darkMode ? 'testimonial-date-dark' : 'testimonial-date-light'}`}>
        {formatDate(date)}
      </span>
    </div>
  );
};

export default TestimonialCard;