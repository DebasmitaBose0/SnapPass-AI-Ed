# 💻 SnapPass-AI Developer Onboarding & Local Setup Guide

## 🛠️ Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.10 or higher
- **Docker & Docker Compose** (Optional, for containerized local dev)

---

## 🏃 Local Development Quickstart

### 1. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### 3. Python AI Service Setup
```bash
cd python-ai-service
python -m venv venv
source venv/bin/activate  # Or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
```

## 🎨 Photo Editing Preset Filters
The Editor includes `PresetFilterManager.jsx` enabling one-click ICAO and country-specific compliance adjustments (US Passport Clean, UK/EU Neutral, Schengen High Contrast, Studio Portrait). Custom preset definitions and brightness/contrast defaults are exposed via `COMPLIANCE_PRESETS`.

## 📊 RGB Exposure & Luminance Histogram
The `HistogramAnalyzer.jsx` component renders a live HTML5 Canvas RGB frequency curve with real-time average luminance calculations, shadow clipping flags (<20), and highlight clipping warnings (>240).

---

## 🎨 Photo Editing Preset Filters
The Editor includes `PresetFilterManager.jsx` enabling one-click ICAO and country-specific compliance adjustments (US Passport Clean, UK/EU Neutral, Schengen High Contrast, Studio Portrait). Custom preset definitions and brightness/contrast defaults are exposed via `COMPLIANCE_PRESETS`.

## 📊 RGB Exposure & Luminance Histogram
The `HistogramAnalyzer.jsx` component renders a live HTML5 Canvas RGB frequency curve with real-time average luminance calculations, shadow clipping flags (<20), and highlight clipping warnings (>240).

## 🔒 Proof Watermark Protection & Canvas Security
The `WatermarkOverlayManager.jsx` component provides draft proof protection by burning configurable translucent text watermarks (Center Diagonal, Bottom Right, Tiled) onto client preview canvases via `applyWatermarkToCanvas`.

---

## 🧪 Testing Suites
- **Frontend Unit Tests**: `cd frontend && npm test`
- **Backend Tests**: `cd backend && npm test`
- **Python AI Tests**: `cd python-ai-service && pytest`

---

## 🎨 Photo Editing Preset Filters
The Editor includes `PresetFilterManager.jsx` enabling one-click ICAO and country-specific compliance adjustments (US Passport Clean, UK/EU Neutral, Schengen High Contrast, Studio Portrait). Custom preset definitions and brightness/contrast defaults are exposed via `COMPLIANCE_PRESETS`.

