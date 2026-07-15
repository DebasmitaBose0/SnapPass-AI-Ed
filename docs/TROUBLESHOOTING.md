# SnapPass-AI Troubleshooting Handbook

This guide outlines common issues encountered during the installation, configuration, and execution of the SnapPass-AI microservice ecosystem (Frontend, Express Backend, and Python AI Service) and provides tested steps for resolution.

---

## 1. Database Connection and Mongoose Failures

### Symptom: `MONGO_URI is not defined in environment variables`
* **Reason**: The backend server was started without a properly loaded `.env` file containing the MongoDB connection URI string.
* **Resolution**:
  1. Copy `backend/.env.example` to `backend/.env`.
  2. Populate `MONGO_URI` with your connection string (e.g., `mongodb://localhost:27017/snappass` or a MongoDB Atlas URI).
  3. Ensure no trailing spaces or quotes surround the URI.

### Symptom: Mongoose Connection Timeout / Connection Retry Exceeded
* **Reason**: Local MongoDB service is either not running or blocked by firewalls.
* **Resolution**:
  - **Windows**: Run `net start MongoDB` or check Services manager to ensure the service is running.
  - **Linux/macOS**: Run `sudo systemctl status mongod` or `brew services list`.
  - Check that the host IP address is whitelisted in your Atlas Network Access tab if using MongoDB Atlas.

---

## 2. Python AI Service & OpenCV Library Issues

### Symptom: `ImportError: libGL.so.1: cannot open shared object file: No such file or directory`
* **Reason**: The Python AI service uses OpenCV, which depends on OpenGL and other system graphics libraries that are missing in minimal server or Docker base images.
* **Resolution**:
  - **Ubuntu/Debian / Docker host**: Install `libgl1-mesa-glx` and `libglib2.0-0`:
    ```bash
    sudo apt-get update && sudo apt-get install -y libgl1-mesa-glx libglib2.0-0
    ```
  - **Alpine Linux / Minimal Docker**: Replace `opencv-python` with `opencv-python-headless` in your `requirements.txt` to avoid binding to X-server windowing libraries.

### Symptom: `ModuleNotFoundError: No module named 'flask'`
* **Reason**: Virtual environment is inactive or dependencies are not installed.
* **Resolution**:
  1. Create and activate a virtual environment:
     ```bash
     python -m venv venv
     # Windows:
     .\venv\Scripts\activate
     # macOS/Linux:
     source venv/bin/activate
     ```
  2. Install all requirements:
     ```bash
     pip install -r requirements.txt
     ```

---

## 3. Docker & Docker Compose Failures

### Symptom: `port is already allocated` or `bind: address already in use`
* **Reason**: Another service is running on backend port `3000` or Python service port `8000` on your host.
* **Resolution**:
  1. Identify the blocking process:
     - **Windows**: `netstat -ano | findstr :3000`
     - **Unix**: `lsof -i :3000`
  2. Terminate the process or update target ports in `docker-compose.yml` to map to alternative host ports.

### Symptom: `connection refused` between backend container and Python service
* **Reason**: The backend container is attempting to reach `http://localhost:8000`, which refers to the inside of its own container rather than the Python service container.
* **Resolution**:
  - Update `AI_SERVICE_URL` in the backend configuration or `.env` to point to the docker container service name (e.g., `http://python-ai-service:8000`).

---

## 4. Frontend Compilation & API Integration

### Symptom: API Calls Fail with `Blocked by CORS policy`
* **Reason**: Frontend origin is not whitelisted by the backend server.
* **Resolution**:
  - Inspect backend's `.env` config file and ensure `CORS_ORIGIN` matches the protocol and port of the frontend client (e.g., `http://localhost:5173`). Avoid trailing slashes.

### Symptom: `Could not reach the server. Please check your connection or try again later.`
* **Reason**: The frontend is trying to reach the backend API on an incorrect port. The backend runs on port `3000` by default, but the frontend's `VITE_API_URL` may point to port `5000` or `5005`.
* **Resolution**:
  1. Check `frontend/.env` — ensure `VITE_API_URL=http://localhost:3000/api`.
  2. Verify the backend is running: `curl http://localhost:3000/health`.
  3. If the backend is on a different port, update `VITE_API_URL` to match.
  4. Restart the frontend dev server after changing `.env`.

---

## 5. Analytics & Audit Log Queries

### Symptom: Analytics page shows zero data despite having uploads
* **Reason**: The `analytics.controller.js` queries MongoDB aggregations that may time out on large collections without proper indexes.
* **Resolution**:
  - Run `npm run indexes` in the backend directory to ensure all MongoDB indexes are created.
  - Check that `MONGO_URI` points to the correct database.

### Symptom: Audit logs are not being recorded
* **Reason**: The audit middleware (`auditMiddleware`) requires a MongoDB connection. If the database is unreachable, audit entries are silently skipped.
* **Resolution**:
  - Verify MongoDB is connected: check backend logs for `MongoDB connected`.
  - Ensure the `auditLog` model's collection exists (it is created automatically on first write).
