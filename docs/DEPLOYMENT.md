# Production Deployment

## Prerequisites
- Docker & Docker Compose (for containerised deployment)
- Node.js 20+ (for manual deployment)
- MongoDB Atlas account or local MongoDB instance
- Python 3.10+ (for AI service, manual only)
- A Resend API key (for transactional emails, optional)

## Option 1: Docker Compose (Recommended)

The root `docker-compose.yml` runs all four services with a single command.

### Steps
1. Clone the repository:
   ```
   git clone https://github.com/souma9830/SnapPass-AI.git
   cd SnapPass-AI
   ```

2. Configure environment variables in each service's `.env` file (copy from `.env.example`):
   ```
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   cp python-ai-service/.env.example python-ai-service/.env
   ```

3. Review and fill in required values:
   | Variable | Service | Required | Default | Notes |
   |---|---|---|---|---|
   | `MONGO_URI` | Backend | Yes | — | MongoDB connection string |
   | `JWT_SECRET` | Backend | Yes | — | Use a strong random secret |
   | `RESEND_API_KEY` | Backend | No | — | For email notifications |
   | `CLOUDINARY_*` | Backend | No | — | For cloud image storage |
   | `VITE_API_URL` | Frontend | Yes | — | Backend URL (e.g. `https://api.example.com/api`) |
   | `AI_SERVICE_URL` | Backend | Yes | `http://python-ai-service:8000` | Python AI microservice |

4. Build and start:
   ```
   docker-compose up --build -d
   ```

5. Verify all services are healthy:
   ```
   curl http://localhost:3000/health
   curl http://localhost:8000/health
   ```

6. Access the app at `http://localhost:5173`.

### Production Hardening
- Use a reverse proxy (nginx, Caddy) with SSL termination in front of the frontend.
- Set strong secrets for `JWT_SECRET` and MongoDB credentials.
- Enable MongoDB authentication (not shown in default docker-compose for simplicity).
- Configure rate limiting via the existing `express-rate-limit` middleware.
- Set `NODE_ENV=production` in backend environment.

## Option 2: Manual Deployment

### Backend
```
cd backend
npm ci
npm run indexes  # ensure MongoDB indexes
NODE_ENV=production node server.js
```

### Frontend
```
cd frontend
npm ci
VITE_API_URL=https://api.example.com/api npm run build
npx serve dist -l 5173
```

### Python AI Service
```
cd python-ai-service
pip install -r requirements.txt
gunicorn main:app -w 4 -b 0.0.0.0:8000
```

## Health Check Endpoints
- Backend: `GET /health`
- Python AI: `GET /health`
- Frontend: N/A (SPA — verify via browser)

## Monitoring
- Backend request logging via Morgan / Winston
- Audit log collection at `GET /api/audit-logs` (admin only)
- Prometheus metrics can be wired via the existing `metrics.controller.js`
