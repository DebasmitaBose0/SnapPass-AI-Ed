# 🏗️ SnapPass-AI Architecture & System Design

## 📌 Overview
SnapPass-AI is a microservice-oriented web application designed to process user portraits into ICAO-compliant passport photos and downloadable print-ready grid sheets.

---

## 🏛️ System Topology

```
+-------------------+      HTTP / REST      +--------------------+
|  React Frontend   | --------------------> |  Node.js Backend   |
| (Vite + React 18) |                       | (Express + MongoDB)|
+-------------------+                       +--------------------+
                                                      |
                                               HTTP / internal REST
                                                      v
                                            +--------------------+
                                            | Python AI Service  |
                                            | (FastAPI + OpenCV) |
                                            +--------------------+
```

---

## 🚀 Key Microservices & Responsibilities

### 1. Frontend Web App (`/frontend`)
- **Tech Stack**: React 18, Vite, Framer Motion, Vitest, Lucide Icons.
- **Responsibilities**:
  - Interactive photo cropping, background color selection, and attire swap fitting.
  - Client-side Canvas filters (brightness, contrast, saturation, sharpness).
  - Offline-first caching using IndexedDB.
  - Multilingual internationalization (EN, HI, ES).

### 2. Node.js Backend Gateway (`/backend`)
- **Tech Stack**: Node.js, Express, Mongoose, JWT Cookie Auth, Helmet, Rate Limiter.
- **Responsibilities**:
  - Security audit logging and rate limiting.
  - File upload validations & magic bytes inspection.
  - Session history persistence in MongoDB.

### 3. Python AI Service (`/python-ai-service`)
- **Tech Stack**: Python 3.10+, FastAPI, OpenCV, Pillow, Rembg, PyTest.
- **Responsibilities**:
  - AI background removal using U-2-Net (`rembg`).
  - Automated face centering and crop box calculation.
  - ICAO passport compliance inspector and quality scoring.
  - High-DPI print grid sheet generator (A4, 4x6, 5x7).
