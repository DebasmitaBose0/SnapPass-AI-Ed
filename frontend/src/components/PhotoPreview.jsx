import React, { useState } from 'react';

const PhotoPreview = ({ processedUrl }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div>
      {hasError ? (
        <p role="alert">Failed to load processed image. Please try processing again.</p>
      ) : (
        <img
          src={processedUrl}
          alt="Preview"
          onError={() => setHasError(true)}
          onLoad={() => setHasError(false)}
        />
      )}
    </div>
  );
};

export default PhotoPreview;