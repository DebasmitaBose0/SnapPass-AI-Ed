import React, { useEffect, useState } from 'react';
import './ExifMetadataInspector.css';

function ExifMetadataInspector({ file, darkMode }) {
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    if (!file) return;

    const fileMeta = {
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || 'image/jpeg',
      lastModified: new Date(file.lastModified).toLocaleDateString(),
    };

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;

    img.onload = () => {
      setMetadata({
        ...fileMeta,
        dimensions: `${img.naturalWidth} × ${img.naturalHeight} px`,
        aspectRatio: (img.naturalWidth / img.naturalHeight).toFixed(2),
        megapixels: ((img.naturalWidth * img.naturalHeight) / 1000000).toFixed(1) + ' MP',
        colorSpace: 'sRGB (Standard)',
        recommendedForICAO: img.naturalWidth >= 600 && img.naturalHeight >= 600 ? 'YES' : 'NO (Low Res)',
      });
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      setMetadata(fileMeta);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!metadata) return null;

  return (
    <div className={`exif-metadata-inspector ${darkMode ? 'exif-metadata-inspector-dark' : ''}`}>
      <h4 className="exif-inspector-title">📷 Photo Technical Metadata (EXIF)</h4>
      <div className="exif-grid">
        <div className="exif-item">
          <span className="exif-key">File Name</span>
          <span className="exif-val">{metadata.name}</span>
        </div>
        <div className="exif-item">
          <span className="exif-key">Dimensions</span>
          <span className="exif-val">{metadata.dimensions || 'N/A'}</span>
        </div>
        <div className="exif-item">
          <span className="exif-key">File Size</span>
          <span className="exif-val">{metadata.size}</span>
        </div>
        <div className="exif-item">
          <span className="exif-key">Resolution</span>
          <span className="exif-val">{metadata.megapixels || 'N/A'}</span>
        </div>
        <div className="exif-item">
          <span className="exif-key">Aspect Ratio</span>
          <span className="exif-val">{metadata.aspectRatio || 'N/A'}</span>
        </div>
        <div className="exif-item">
          <span className="exif-key">ICAO Print Grade</span>
          <span className={`exif-val ${metadata.recommendedForICAO === 'YES' ? 'val-pass' : 'val-warn'}`}>
            {metadata.recommendedForICAO || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ExifMetadataInspector;
