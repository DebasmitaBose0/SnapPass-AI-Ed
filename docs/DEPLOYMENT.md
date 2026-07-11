# Deployment Guide

## Docker Compose (Recommended for Production)

The simplest way to deploy SnapPass AI is with Docker Compose:

```bash
# Clone the repository
git clone https://github.com/souma9830/SnapPass-AI.git
cd SnapPass-AI

# Start all services
docker compose up --build -d

# Verify all services are running
docker compose ps
```

This starts:
- `snappass-mongo` on port 27017
- `snappass-backend` on port 5000 (internal 3000)
- `snappass-frontend` on port 5173
- `snappass-python-ai` on port 8000

### Production Docker Compose

For production, create a `docker-compose.prod.yml`:

```yaml
version: "3.9"
services:
  # ... same as docker-compose.yml but with:
  backend:
    environment:
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}  # Set in .env
      MONGO_URI: mongodb://${MONGO_USER}:${MONGO_PASS}@mongo:27017/snappass

  frontend:
    environment:
      VITE_API_URL: https://api.yourdomain.com/api
```

## Manual Deployment

### Backend (Node.js/Express)

1. Install dependencies:
   ```bash
   cd backend
   npm install --production
   ```

2. Set environment variables:
   ```bash
   export NODE_ENV=production
   export PORT=3000
   export JWT_SECRET=<random-64-char-string>
   export MONGO_URI=mongodb://user:pass@host:27017/snappass
   export AI_SERVICE_URL=http://ai-service:8000
   export CORS_ORIGIN=https://yourdomain.com
   ```

3. Start with process manager:
   ```bash
   npm install -g pm2
   pm2 start server.js --name snappass-backend
   ```

### Frontend (React/Vite)

1. Build the static files:
   ```bash
   cd frontend
   npm install
   VITE_API_URL=https://api.yourdomain.com/api npm run build
   ```

2. Serve with Nginx (example config):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       root /var/www/snappass-frontend/dist;

       location / {
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Python AI Service

1. Install dependencies:
   ```bash
   cd python-ai-service
   pip install -r requirements.txt
   ```

2. Start with Gunicorn:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:8000 main:app
   ```

## Vercel Deployment

### Frontend
```bash
cd frontend
vercel --prod
```

### Backend (Serverless)
The backend can be deployed to Vercel as serverless functions. Update `vercel.json`:
```json
{
  "builds": [{ "src": "server.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/api/(.*)", "dest": "server.js" }]
}
```

## Environment Variables Checklist

| Service | Variable | Required | Production Value |
|---------|----------|----------|-----------------|
| Backend | `JWT_SECRET` | Yes | 64-char random string |
| Backend | `MONGO_URI` | Yes | MongoDB Atlas URI |
| Backend | `AI_SERVICE_URL` | Yes | Python AI service URL |
| Backend | `CORS_ORIGIN` | Yes | Frontend domain |
| Frontend | `VITE_API_URL` | Yes | Backend API URL |
| Python | `PORT` | No | 8000 |

## Monitoring

- Backend health: `GET /health`
- SSE health: `GET /api/events/health`
- Memory usage: Accessible via admin dashboard
- Audit logs: Stored in MongoDB `auditLogs` collection

## Troubleshooting

### Backend won't start
- Check `JWT_SECRET` is set
- Verify MongoDB is accessible
- Check Python AI service is running

### Frontend shows blank page
- Verify `VITE_API_URL` is correct
- Check browser console for CORS errors
- Ensure backend CORS_ORIGIN matches frontend URL

### AI processing fails
- Check Python service logs
- Verify `AI_SERVICE_URL` is correct
- Ensure `rembg` model downloaded (first run downloads automatically)
