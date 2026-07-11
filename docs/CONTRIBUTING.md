# Contributing to SnapPass AI

We love contributions! Here's how to get started.

## Code of Conduct

Please read and follow our [Code of Conduct](../CODE_OF_CONDUCT.md).

## Development Setup

### Prerequisites
- Node.js >= 18 (v20 recommended)
- Python >= 3.10
- MongoDB 7.0 (optional, for full functionality)
- Docker & Docker Compose (optional)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/souma9830/SnapPass-AI.git
   cd SnapPass-AI
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend && npm install

   # Backend
   cd ../backend && npm install

   # Python AI Service
   cd ../python-ai-service && pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. **Start the services**
   ```bash
   # Start backend
   cd backend && npm run dev

   # Start Python AI service (in a new terminal)
   cd python-ai-service && python main.py

   # Start frontend (in a new terminal)
   cd frontend && npm run dev
   ```

### Docker Setup
```bash
docker compose up --build
```

## Project Structure

### Frontend (`frontend/`)
- React 19 with Vite, Tailwind CSS 4, and Framer Motion
- Pages: Home, Upload, Editor, Print Preview, Admin, Studio, History
- 18+ custom hooks for state management and side effects
- i18n support with 6 languages
- PWA with service worker for offline capabilities

### Backend (`backend/`)
- Express.js REST API with JWT authentication
- 30+ API endpoints for upload, processing, compliance, printing
- MongoDB with Mongoose ODM (10 models)
- Redis caching layer (optional)
- Comprehensive security middleware (helmet, CORS, rate limiting, sanitization)
- SSE (Server-Sent Events) for real-time job progress

### Python AI Service (`python-ai-service/`)
- Flask microservice for AI image processing
- `rembg` for background removal
- OpenCV for face detection and centering
- Pillow for DPI optimization and sheet generation
- Compliance inspection with auto-correction
- Virtual attire swap (suits, blazers, bowties)

## Coding Guidelines

### Frontend
- Use functional components with hooks
- Follow existing component patterns
- Add i18n keys for all user-facing strings
- Use Tailwind utility classes where possible
- Maintain dark mode support

### Backend
- Use ES modules (`import`/`export`)
- Follow existing middleware pattern
- Validate all inputs with express-validator
- Use proper HTTP status codes
- Add audit logging for sensitive operations

### Python AI Service
- Follow PEP 8 (checked by flake8)
- Use type hints for all function signatures
- Add docstrings for public functions
- Handle edge cases gracefully

## Pull Request Process

1. Create a feature branch from `master`
2. Make your changes with clear commit messages
3. Update documentation if needed
4. Run tests:
   ```bash
   cd backend && npm test
   cd frontend && npx vitest run
   cd python-ai-service && python -m pytest
   ```
5. Submit a PR with a description of your changes

## Labels

| Label | Description |
|-------|-------------|
| `bug` | Something isn't working |
| `enhancement` | New feature or improvement |
| `documentation` | Docs-related changes |
| `good first issue` | Beginner-friendly |
| `help wanted` | Extra attention needed |
| `security` | Security-related |

## Need Help?

Open an issue or join the discussion on GitHub Discussions.
