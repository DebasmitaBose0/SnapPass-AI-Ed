import React, { useRef, useState, useEffect } from 'react';
import './CameraCapture.css';

function CameraCapture({ onCapture, darkMode }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Start webcam stream
  const startCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setCameraActive(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions and connection.');
    }
  };

  // Stop webcam stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  // Capture frame
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Make canvas dimensions match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame onto canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob file
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        onCapture(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.95);
  };

  // Clean up stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className={`camera-capture ${darkMode ? 'camera-capture--dark' : ''}`}>
      {!cameraActive ? (
        <div className="camera-start-screen">
          <svg className="camera-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <p className="camera-prompt">Snap a live portrait using your web camera</p>
          <button type="button" className="camera-action-btn camera-action-btn--start" onClick={startCamera}>
            Enable Camera
          </button>
          {error && <p className="camera-error-msg">{error}</p>}
        </div>
      ) : (
        <div className="camera-preview-container">
          <video ref={videoRef} autoPlay playsInline muted className="camera-video-feed" />
          
          {/* Biometric Alignment Silhouette Overlay */}
          <div className="camera-guideline-silhouette">
            <div className="camera-silhouette-oval" />
            <div className="camera-guideline-line eye-line" />
            <div className="camera-guideline-line chin-line" />
            <span className="camera-guide-label">Align Face inside guidelines</span>
          </div>

          <div className="camera-controls-bar">
            <button type="button" className="camera-action-btn camera-action-btn--capture" onClick={capturePhoto}>
              📸 Snap Photo
            </button>
            <button type="button" className="camera-action-btn camera-action-btn--cancel" onClick={stopCamera}>
              Cancel
            </button>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}
    </div>
  );
}

export default CameraCapture;
