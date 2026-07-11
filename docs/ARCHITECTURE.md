# SnapPass AI Architecture

## Overview

SnapPass AI follows a microservices architecture with three main services:

```
┌─────────────┐     ┌──────────────┐     ┌──────────────────┐
│  Frontend   │────▶│   Backend    │────▶│ Python AI Service│
│  (React 19) │     │  (Express)   │     │    (Flask)       │
│  :5173      │     │  :3000       │     │    :8000         │
└─────────────┘     └──────┬───────┘     └──────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   MongoDB    │
                    │   :27017     │
                    └──────────────┘
```

## Data Flow

### Photo Processing Pipeline

```
Upload → File Validation → Face Quality Gate → BG Removal →
Face Centering → DPI Optimization → Compliance Check → Sheet Generation
```

### Steps

1. **Upload**: Frontend sends file to `POST /api/upload`
2. **Validation**: Backend validates MIME type, magic bytes, dimensions
3. **Processing**: Backend forwards to Python AI service at `POST /remove-bg`
4. **AI Pipeline**: Python service runs rembg → OpenCV face center → DPI optimize
5. **Compliance**: Optional check via `POST /api/compliance/check`
6. **Print Sheet**: `POST /api/print/generate-sheet` creates A4 layout
7. **Download**: Frontend receives processed image as blob/URL

### Real-time Updates (SSE)

```
Frontend                          Backend
   │                                │
   │── POST /api/process/job ──────▶│ (creates job, returns jobId)
   │                                │
   │── GET /api/events/job?jobId= ─▶│ (SSE connection opens)
   │                                │
   │◀──── SSE: job_update ──────────│ (progress: 10%, stage: "Processing")
   │◀──── SSE: job_update ──────────│ (progress: 50%, stage: "AI working")
   │◀──── SSE: complete ────────────│ (progress: 100%, processedUrl)
```

## Frontend Architecture

### Component Tree
```
App
├── ThemeProvider
│   └── AppContent
│       ├── OfflineBanner
│       ├── SecurityBanner
│       ├── Navbar
│       ├── Routes
│       │   ├── HomePage
│       │   ├── UploadPage (single/batch mode)
│       │   ├── EditorPage (size, bg, attire, compliance)
│       │   ├── PrintPreviewPage (quantity, layout, download)
│       │   ├── AdminDashboard (analytics, users, system)
│       │   ├── HistoryPage
│       │   ├── PhotoStudio
│       │   └── ...
│       ├── Footer
│       ├── SnapPassAssistant (chatbot)
│       └── ScrollToTopButton
```

### State Management
- **Context**: Theme, Language, Toast notifications
- **Hooks**: Custom hooks for upload, processing, batch operations, session
- **LocalStorage**: Session persistence, language preference, theme

## Backend Architecture

### Middleware Pipeline
```
Request → Request ID → Logger → Security Headers → CORS → Cookie Parser →
JSON Parser → Sanitize → Audit → Timing → Rate Limit → Auth → Route → Response
```

### API Endpoints (30+)
- `/api/auth/*` - Authentication (register, login, logout, password reset)
- `/api/upload` - Single and batch file upload
- `/api/process` - Image processing (sync + async jobs)
- `/api/print` - Print sheet generation and presets
- `/api/compliance` - Compliance checking and auto-correction
- `/api/admin` - Admin dashboard, system info, user management
- `/api/analytics` - Usage statistics and trends
- `/api/events` - SSE real-time event streams

### Security
- JWT authentication (cookie-based)
- Role-based access (user/admin)
- Helmet security headers with CSP
- Input sanitization (XSS prevention)
- Rate limiting per IP
- File upload validation (magic bytes, dimensions, MIME)
- Path traversal prevention
- Audit logging

## Python AI Service

### Processing Modules
| Module | Function | Technology |
|--------|----------|------------|
| `bg_remove.py` | Background removal | rembg + Pillow |
| `face_center.py` | Face detection & centering | OpenCV Haar Cascade |
| `dpi_optimizer.py` | Resolution & dimension optimization | Pillow LANCZOS |
| `sheet_generator.py` | A4/US Letter/4x6 print sheets | Pillow |
| `compliance_inspector.py` | Passport compliance (9 checks) | OpenCV + NumPy |
| `face_quality_gate.py` | Pre-processing validation | OpenCV + NumPy |
| `attire_swap.py` | Virtual clothing overlay | OpenCV + Pillow |

### Compliance Checks
1. Face detection & count validation
2. Blur detection (Laplacian variance)
3. Head tilt estimation (PCA/eye detection)
4. Face centering verification
5. Background uniformity analysis
6. Dimension/size ratio validation
7. Lighting balance assessment
8. Brightness score check
9. Eye visibility verification

## Deployment

### Docker Compose
```bash
docker compose up --build
```

This starts 4 containers:
- `snappass-mongo` - MongoDB 7.0
- `snappass-backend` - Express API (port 3000)
- `snappass-frontend` - React app (port 5173)
- `snappass-python-ai` - Flask service (port 8000)

### Vercel
- Frontend deployed to Vercel as SPA
- Backend deployed to Vercel as serverless functions
- Python AI service deployed separately (Render/Railway)

## Environment Variables

### Backend (`backend/.env`)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Environment |
| `MONGO_URI` | No | - | MongoDB connection |
| `JWT_SECRET` | Yes | - | JWT signing secret |
| `AI_SERVICE_URL` | No | http://localhost:8000 | Python AI URL |
| `CORS_ORIGIN` | No | http://localhost:5173 | Allowed CORS origin |
| `UPLOAD_DIR` | No | uploads | Upload directory |
| `MAX_FILE_SIZE` | No | 10485760 | Max upload (bytes) |

### Frontend (`frontend/.env`)
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | http://localhost:5000/api | Backend API URL |
