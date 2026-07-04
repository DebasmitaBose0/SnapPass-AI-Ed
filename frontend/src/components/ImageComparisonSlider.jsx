import React, { useState, useRef, useCallback } from 'react';
import './ImageComparisonSlider.css';

const ImageComparisonSlider = ({ beforeSrc, afterSrc, alt = 'comparison' }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const handleMouseDown = () => { dragging.current = true; };
  const handleMouseUp = () => { dragging.current = false; };
  const handleMouseMove = (e) => {
    if (dragging.current) updatePosition(e.clientX);
  };
  const handleTouchMove = (e) => {
    updatePosition(e.touches[0].clientX);
  };

  return (
    <div
      className="image-comparison-slider"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      role="slider"
      aria-label="Image comparison slider"
      aria-valuenow={Math.round(sliderPos)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') setSliderPos(p => Math.min(100, p + 5));
        if (e.key === 'ArrowLeft') setSliderPos(p => Math.max(0, p - 5));
      }}
    >
      <div className="comparison-image comparison-image--after">
        <img src={afterSrc} alt={`${alt} (processed)`} draggable={false} />
      </div>
      <div
        className="comparison-image comparison-image--before"
        style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
      >
        <img src={beforeSrc} alt={`${alt} (original)`} draggable={false} />
      </div>
      <div className="comparison-handle" style={{ left: `${sliderPos}%` }}>
        <div className="comparison-handle-line" />
        <div className="comparison-handle-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ImageComparisonSlider;
