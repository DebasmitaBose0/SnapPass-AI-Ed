import request from 'supertest';
import app from '../app.js';
import { config } from '../config/config.js';

describe('API Health Check', () => {
  test('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status');
  });
});

describe('API Routes', () => {
  test('GET /api/presets returns array', async () => {
    const res = await request(app).get('/api/presets');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success');
  });

  test('GET /api/docs returns documentation', async () => {
    const res = await request(app).get('/api/docs');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success');
  });

  test('GET /api/testimonials returns array', async () => {
    const res = await request(app).get('/api/testimonials');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body?.data || res.body)).toBe(true);
  });

  test('POST /api/upload without file returns 400', async () => {
    const res = await request(app)
      .post('/api/upload')
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/process without filename returns 400', async () => {
    const res = await request(app)
      .post('/api/process')
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test('POST /api/compliance/check without filename returns 400', async () => {
    const res = await request(app)
      .post('/api/compliance/check')
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test('GET /api/analytics/stats returns stats object', async () => {
    const res = await request(app).get('/api/analytics/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success');
  });

  test('GET /api/process/job/invalid-id returns 404', async () => {
    const res = await request(app).get('/api/process/job/nonexistent-job-id');
    expect(res.statusCode).toBe(404);
  });

  test('GET /api/upload-history returns array', async () => {
    const res = await request(app).get('/api/upload-history');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body?.data || res.body)).toBe(true);
  });

  test('CORS headers are set', async () => {
    const res = await request(app).get('/health');
    expect(res.headers).toHaveProperty('access-control-allow-origin');
  });

  test('Security headers from helmet are present', async () => {
    const res = await request(app).get('/health');
    expect(res.headers).toHaveProperty('x-content-type-options');
    expect(res.headers).toHaveProperty('x-frame-options');
    expect(res.headers).toHaveProperty('x-dns-prefetch-control');
  });

  test('POST /api/batch without files returns 400', async () => {
    const res = await request(app)
      .post('/api/batch')
      .send({});
    expect(res.statusCode).toBe(400);
  });

  test('Request ID middleware adds X-Request-ID header', async () => {
    const res = await request(app).get('/health');
    expect(res.headers).toHaveProperty('x-request-id');
  });
});

describe('Input Validation', () => {
  test('Sanitize middleware strips malicious input', async () => {
    const res = await request(app)
      .post('/api/process')
      .send({ filename: '<script>alert("xss")</script>' });
    expect(res.statusCode).toBe(400);
  });

  test('Invalid JSON body returns 400', async () => {
    const res = await request(app)
      .post('/api/upload')
      .set('Content-Type', 'application/json')
      .send('not-json-at-all');
    expect(res.statusCode).toBe(400);
  });
});

describe('Configuration', () => {
  test('config has required fields', () => {
    expect(config).toHaveProperty('port');
    expect(config).toHaveProperty('NODE_ENV');
    expect(config).toHaveProperty('CORS_ORIGIN');
    expect(config).toHaveProperty('MAX_FILE_SIZE');
    expect(config).toHaveProperty('UPLOAD_DIR');
  });

  test('port is a valid number', () => {
    expect(typeof config.port).toBe('number');
    expect(config.port).toBeGreaterThanOrEqual(1024);
  });

  test('MAX_FILE_SIZE is within bounds', () => {
    expect(config.MAX_FILE_SIZE).toBeGreaterThan(0);
    expect(config.MAX_FILE_SIZE).toBeLessThanOrEqual(100 * 1024 * 1024);
  });
});
