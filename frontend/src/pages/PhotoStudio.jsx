import React, { useState, useRef } from "react";
import "./PhotoStudio.css";

function PhotoStudio() {
    const [imageSrc, setImageSrc] = useState(null);
    const [fileName, setFileName] = useState("edited-photo.png");

    // Adjustment states
    const [brightness, setBrightness] = useState(100);
    const [contrast, setContrast] = useState(100);
    const [saturation, setSaturation] = useState(100);

    const fileInputRef = useRef(null);

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setFileName(file.name);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageSrc(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Reset adjustments
    const handleReset = () => {
        setBrightness(100);
        setContrast(100);
        setSaturation(100);
    };

    // Export and download the edited image
    const handleDownload = () => {
        if (!imageSrc) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            // Apply the exact same filters used in the CSS preview
            ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Trigger download
            const link = document.createElement("a");
            link.download = `edited-${fileName}`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
        img.src = imageSrc;
    };

    // The CSS filter string for real-time preview
    const filterStyle = {
        filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
    };

    return (
        <div className="photo-studio-page">
            <div className="studio-header">
                <h1 className="section-title">Photo <span className="text-highlight">Studio</span></h1>
                <p className="section-subtitle">Quickly adjust lighting, contrast, and color for the perfect passport photo.</p>
            </div>

            <div className="studio-workspace">
                <div className="studio-preview-panel">
                    {!imageSrc ? (
                        <div className="upload-placeholder" onClick={() => fileInputRef.current.click()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="upload-icon">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            <p>Click to upload a photo</p>
                            <span className="upload-hint">JPG, PNG, WEBP</span>
                        </div>
                    ) : (
                        <div className="image-container">
                            <img src={imageSrc} alt="Preview" style={filterStyle} className="preview-image" />
                            <button className="btn-secondary change-photo-btn" onClick={() => fileInputRef.current.click()}>
                                Change Photo
                            </button>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={{ display: "none" }}
                    />
                </div>

                <div className="studio-controls-panel">
                    <div className="controls-card">
                        <h3 className="controls-title">Adjustments</h3>

                        <div className="slider-group">
                            <div className="slider-header">
                                <label>Brightness</label>
                                <span>{brightness}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="200"
                                value={brightness}
                                onChange={(e) => setBrightness(e.target.value)}
                                className="slider"
                                disabled={!imageSrc}
                            />
                        </div>

                        <div className="slider-group">
                            <div className="slider-header">
                                <label>Contrast</label>
                                <span>{contrast}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="200"
                                value={contrast}
                                onChange={(e) => setContrast(e.target.value)}
                                className="slider"
                                disabled={!imageSrc}
                            />
                        </div>

                        <div className="slider-group">
                            <div className="slider-header">
                                <label>Saturation</label>
                                <span>{saturation}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="200"
                                value={saturation}
                                onChange={(e) => setSaturation(e.target.value)}
                                className="slider"
                                disabled={!imageSrc}
                            />
                        </div>

                        <div className="controls-actions">
                            <button className="btn-outline" onClick={handleReset} disabled={!imageSrc}>
                                Reset
                            </button>
                            <button className="btn-primary" onClick={handleDownload} disabled={!imageSrc}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PhotoStudio;