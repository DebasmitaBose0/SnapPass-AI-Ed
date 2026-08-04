# SnapPass-AI Architecture & System Blueprint

## Overview

SnapPass-AI is an open-source, enterprise-grade AI passport photo generation and compliance validation platform. The system uses a microservices monorepo architecture comprising a React frontend client, an Express.js backend API gateway, and a Python FastAPI AI vision service.

```mermaid
graph TD
    Client[React 19 Frontend - Vite] -->|HTTPS REST| Gateway[Express.js Backend Gateway]
    Gateway -->|HTTP Microservice| AIService[Python AI Vision Service - FastAPI]
    Gateway -->|Mongoose ORM| MongoDB[(MongoDB Database)]
    Gateway -->|Cache & Rate Limit| Redis[(Redis Storage)]
```

## Monorepo Architecture

- **`frontend/`**: React 19 SPA built with Vite, TailwindCSS, and Framer Motion. Contains canvas processing engines, IndexedDB offline draft storage, and interactive photo editors.
- **`backend/`**: Node.js Express gateway providing JWT authentication, file uploads via Multer, rate limiting, and security sanitization middleware.
- **`python-ai-service/`**: Python 3.10+ FastAPI microservice using OpenCV, MediaPipe, and Rembg for background removal, face framing detection, and compliance scoring.

## Key Technical Systems

1. **Compliance Scoring Engine**: Evaluates photos against official ICAO Doc 9303 standards (head height 70-80%, background uniformity >= 85%, eye alignment >= 90%).
2. **High-DPI PDF Exporter**: Renders printable sheet grids (4x6", 5x7", A4) with precision cutting guides.
3. **Offline Sync Manager**: Stores active photo sessions in IndexedDB with network status detection.
