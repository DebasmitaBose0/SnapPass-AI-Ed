import express from 'express';
import { logger } from '../utils/logger.js';

const router = express.Router();
export const clients = new Set();

router.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.add(res);
  logger.info('SSE Client connected');

  req.on('close', () => {
    clients.delete(res);
    logger.info('SSE Client disconnected');
  });
});

export function broadcastJobUpdate(jobId, job) {
  const data = JSON.stringify({ jobId, ...job });
  for (const client of clients) {
    client.write(`data: ${data}\n\n`);
  }
}

export default router;
