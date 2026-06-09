import React, { useState, useEffect, useCallback } from 'react';
import TestimonialCard from './TestimonialCard';
import AddTestimonialForm from './AddTestimonialForm';
import './TestimonialsSection.css';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations/translations';
import {
  fetchTestimonials,
  submitTestimonial,
  updateTestimonial,
} from '../../services/testimonialService';

const TestimonialsSection = ({ darkMode }) => {
  const { language } = useLanguage();
  const t = translations[language];
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, count: 0 });
  const [userReview, setUserReview] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  const loadTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTestimonials();
      setTestimonials(data.testimonials || []);
      setStats(data.stats || { averageRating: 0, count: 0 });
      setUserReview(data.userReview || null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const handleSubmitReview = async (formData) => {
    setStatusMessage('');
    const payload = {
      name: formData.name,
      rating: formData.rating,
      comment: formData.comment,
      commentHi: formData.commentHi || '',
      website: formData.website || '',
    };

    try {
      if (userReview) {
        await updateTestimonial(payload);
        setStatusMessage(t.reviewUpdated);
      } else {
        await submitTestimonial(payload);
        setStatusMessage(t.reviewSubmitted);
      }

      setShowForm(false);
      await loadTestimonials();
    } catch (error) {
      setStatusMessage(error.message || t.reviewSubmitError);
    }
  };

  const openReviewForm = () => {
    setStatusMessage('');
    setShowForm(true);
  };

  return (
    <section className={`testimonials-section ${darkMode ? 'testimonials-section-dark' : 'testimonials-section-light'}`}>
      <div className="testimonials-container">
        <div className="testimonials-header">
          <h2 className={`section-title ${darkMode ? 'section-title-dark' : 'section-title-light'}`}>
            {t.testimonialsTitle}
          </h2>
          <p className={`testimonials-subtitle ${darkMode ? 'testimonials-subtitle-dark' : 'testimonials-subtitle-light'}`}>
            {t.testimonialsSubtitle}
          </p>
        </div>

        {!loading && stats.count > 0 && (
          <div style={{ textAlign: 'center' }}>
            <div className={`rating-summary ${darkMode ? 'rating-summary-dark' : 'rating-summary-light'}`}>
              <span className={`average-rating ${darkMode ? 'average-rating-dark' : 'average-rating-light'}`}>
                ⭐ {stats.averageRating}
              </span>
              <span className={`review-count ${darkMode ? 'review-count-dark' : 'review-count-light'}`}>
                ({stats.count} {stats.count === 1 ? t.review : t.reviews})
              </span>
            </div>
          </div>
        )}

        {statusMessage && (
          <p className={`testimonials-status ${darkMode ? 'testimonials-status-dark' : 'testimonials-status-light'}`}>
            {statusMessage}
          </p>
        )}

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              darkMode={darkMode}
            />
          ))}
        </div>

        {!showForm ? (
          <button
            className={`write-review-btn ${darkMode ? 'write-review-btn-dark' : 'write-review-btn-light'}`}
            onClick={openReviewForm}
          >
            {userReview ? t.editReview : t.writeReview}
          </button>
        ) : (
          <AddTestimonialForm
            onSubmit={handleSubmitReview}
            onCancel={() => setShowForm(false)}
            darkMode={darkMode}
            initialData={userReview}
            isEditing={Boolean(userReview)}
          />
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
