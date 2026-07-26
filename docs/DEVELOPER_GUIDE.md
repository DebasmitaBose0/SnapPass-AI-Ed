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

---

## 🧪 Testing Suites
- **Frontend Unit Tests**: `cd frontend && npm test`
- **Backend Tests**: `cd backend && npm test`
- **Python AI Tests**: `cd python-ai-service && pytest`
