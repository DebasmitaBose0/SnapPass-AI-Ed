import { getJob, getJobEventEmitter } from '../utils/processJobStore.js';

const clients = new Map();

function sendSSE(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

export function broadcastJobUpdate(jobId, jobData) {
  const jobClients = clients.get(jobId);
  if (!jobClients) return;
  for (const res of jobClients) {
    try {
      sendSSE(res, { type: 'job_update', jobId, data: jobData });
    } catch {
      jobClients.delete(res);
    }
  }
}

export function registerSSERoutes(server) {
  const ee = getJobEventEmitter();

  ee.on('job-update', (jobId, jobData) => {
    broadcastJobUpdate(jobId, jobData);
  });

  server.on('request', (req, res) => {
    if (req.method !== 'GET') return;

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/events/job' && url.searchParams.has('jobId')) {
      const jobId = url.searchParams.get('jobId');
      const job = getJob(jobId);

      if (!job) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Job not found' }));
        return;
      }

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      });

      sendSSE(res, { type: 'connected', jobId, data: job });

      if (!clients.has(jobId)) {
        clients.set(jobId, new Set());
      }
      clients.get(jobId).add(res);

      const onUpdate = (updatedJob) => {
        try {
          sendSSE(res, { type: 'job_update', jobId, data: updatedJob });
          if (updatedJob.status === 'done' || updatedJob.status === 'failed') {
            sendSSE(res, { type: 'complete', jobId, data: updatedJob });
            cleanup();
          }
        } catch {
          cleanup();
        }
      };

      const cleanup = () => {
        const set = clients.get(jobId);
        if (set) {
          set.delete(res);
          if (set.size === 0) clients.delete(jobId);
        }
        ee.removeListener(`job:${jobId}:update`, onUpdate);
        if (!res.destroyed) {
          try { res.end(); } catch {}
        }
      };

      ee.on(`job:${jobId}:update`, onUpdate);

      req.on('close', cleanup);
      req.on('error', cleanup);

      const keepAlive = setInterval(() => {
        try {
          res.write(': keepalive\n\n');
        } catch {
          clearInterval(keepAlive);
          cleanup();
        }
      }, 15000);

      req.on('close', () => clearInterval(keepAlive));
      return;
    }

    if (url.pathname === '/api/events/health') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      sendSSE(res, { type: 'health', status: 'ok', timestamp: Date.now() });
      const interval = setInterval(() => {
        try {
          sendSSE(res, { type: 'ping', timestamp: Date.now() });
        } catch {
          clearInterval(interval);
          try { res.end(); } catch {}
        }
      }, 30000);
      req.on('close', () => clearInterval(interval));
      return;
    }
  });
}
