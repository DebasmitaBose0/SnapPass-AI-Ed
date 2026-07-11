import http from 'http';
import app from './src/app.js';
import { config } from './src/config/config.js';
import connectDatabase from './src/config/db.js';
import { verifyEnvironment } from './src/utils/envCheck.js';
import { registerSSERoutes } from './src/routes/sse.routes.js';

verifyEnvironment();
const PORT = config.port;

connectDatabase();

const server = http.createServer(app);

registerSSERoutes(server);

server.listen(PORT, () => {
  const address = server.address();
  const host = address?.address === '::' ? `http://localhost:${PORT}` : `http://${address?.address || 'localhost'}:${PORT}`;
  console.log(`SnapPass AI backend running on ${host}`);
  console.log(`Health check: ${host}/health`);
  console.log(`API base: ${host}/api`);
  console.log(`SSE stream: ${host}/api/events`);
});

export { server };
