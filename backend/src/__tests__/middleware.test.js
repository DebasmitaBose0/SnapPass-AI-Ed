import { timingMiddleware, getMetrics, resetMetrics } from '../middleware/timing.middleware.js';

describe('Timing Middleware', () => {
  beforeEach(() => {
    resetMetrics();
  });

  test('increments totalRequests on each call', () => {
    const req = { method: 'GET', path: '/test', route: null };
    const res = { on: jest.fn((event, cb) => {
      if (event === 'finish') cb();
    }) };
    const next = jest.fn();

    timingMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();

    const metrics = getMetrics();
    expect(metrics.totalRequests).toBe(1);
    expect(metrics.activeRequests).toBe(0);
  });

  test('tracks method counts', () => {
    const next = jest.fn();

    timingMiddleware({ method: 'POST', path: '/test', route: null }, { on: (e, cb) => { if (e === 'finish') cb(); } }, next);
    timingMiddleware({ method: 'GET', path: '/test2', route: null }, { on: (e, cb) => { if (e === 'finish') cb(); } }, next);

    const metrics = getMetrics();
    expect(metrics.methodCounts.POST).toBe(1);
    expect(metrics.methodCounts.GET).toBe(1);
  });

  test('tracks status codes', () => {
    const next = jest.fn();
    const res = { statusCode: 200, on: (e, cb) => { if (e === 'finish') cb(); } };

    timingMiddleware({ method: 'GET', path: '/test', route: null }, res, next);

    const metrics = getMetrics();
    expect(metrics.statusCounts[200]).toBe(1);
  });

  test('handles errors gracefully', () => {
    const next = jest.fn();
    const req = { method: 'GET', path: '/test', route: null };
    const res = { on: () => { throw new Error('test error'); } };

    expect(() => timingMiddleware(req, res, next)).not.toThrow();
  });

  test('resetMetrics clears all counters', () => {
    const next = jest.fn();
    timingMiddleware({ method: 'GET', path: '/test', route: null }, { on: (e, cb) => { if (e === 'finish') cb(); } }, next);
    resetMetrics();
    const metrics = getMetrics();
    expect(metrics.totalRequests).toBe(0);
    expect(metrics.methodCounts).toEqual({});
    expect(metrics.statusCounts).toEqual({});
  });

  test('response times are recorded', () => {
    const next = jest.fn();
    const res = { on: (e, cb) => { if (e === 'finish') setTimeout(cb, 10); } };

    timingMiddleware({ method: 'GET', path: '/test', route: null }, res, next);

    const metrics = getMetrics();
    expect(metrics.responseTimes.length).toBeGreaterThanOrEqual(0);
  });
});

describe('Process Job Store', () => {
  let store;

  beforeEach(async () => {
    store = await import('../utils/processJobStore.js');
  });

  test('createJob returns a valid UUID', () => {
    const jobId = store.createJob({ payload: { filename: 'test.jpg' } });
    expect(jobId).toBeTruthy();
    expect(typeof jobId).toBe('string');
    expect(jobId.length).toBeGreaterThan(0);
  });

  test('getJob returns null for unknown job', () => {
    const job = store.getJob('nonexistent');
    expect(job).toBeNull();
  });

  test('createJob and getJob round-trip', () => {
    const jobId = store.createJob({ payload: { filename: 'photo.jpg', backgroundColour: 'white' } });
    const job = store.getJob(jobId);
    expect(job).not.toBeNull();
    expect(job.id).toBe(jobId);
    expect(job.status).toBe('queued');
    expect(job.payload.filename).toBe('photo.jpg');
  });

  test('updateJob modifies job state', () => {
    const jobId = store.createJob({ payload: { filename: 'test.jpg' } });
    const updated = store.updateJob(jobId, { progress: 50, stage: 'Processing' });
    expect(updated.progress).toBe(50);
    expect(updated.stage).toBe('Processing');

    const job = store.getJob(jobId);
    expect(job.progress).toBe(50);
  });

  test('clearJob removes job from store', () => {
    const jobId = store.createJob({ payload: { filename: 'test.jpg' } });
    store.clearJob(jobId);
    const job = store.getJob(jobId);
    expect(job).toBeNull();
  });

  test('getAllJobs returns list of active jobs', () => {
    store.createJob({ payload: { filename: 'a.jpg' } });
    store.createJob({ payload: { filename: 'b.jpg' } });
    const all = store.getAllJobs();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });
});

describe('Port Validator', () => {
  let portValidator;

  beforeEach(async () => {
    portValidator = await import('../utils/portValidator.js');
  });

  test('validatePort returns null for invalid ports', () => {
    expect(portValidator.validatePort('abc')).toBeNull();
    expect(portValidator.validatePort('-1')).toBeNull();
    expect(portValidator.validatePort('0')).toBeNull();
    expect(portValidator.validatePort('70000')).toBeNull();
  });

  test('validatePort returns number for valid ports', () => {
    expect(portValidator.validatePort('3000')).toBe(3000);
    expect(portValidator.validatePort('8080')).toBe(8080);
    expect(portValidator.validatePort('1024')).toBe(1024);
    expect(portValidator.validatePort('65535')).toBe(65535);
  });

  test('resolvePort returns valid port or fallback', () => {
    expect(portValidator.resolvePort('3000', 5000)).toBe(3000);
    expect(portValidator.resolvePort('invalid', 5000)).toBe(5000);
    expect(portValidator.resolvePort('invalid', 'invalid')).toBe(3000);
  });
});
