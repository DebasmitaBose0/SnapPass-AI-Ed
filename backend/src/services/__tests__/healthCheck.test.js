import { describe, it, expect, vi } from 'vitest';
import { HealthCheckService } from '../healthCheck.service.js';

vi.mock('mongoose', () => ({
  connection: { readyState: 1 },
}));

vi.mock('../config/redis.js', () => ({
  isRedisAvailable: () => true,
}));

describe('HealthCheckService', () => {
  it('returns UP when all dependencies are healthy', async () => {
    const result = await HealthCheckService.performReadinessCheck();
    expect(result.status).toBe('UP');
    expect(result.checks.mongodb).toBe('HEALTHY');
    expect(result.checks.redis).toBe('HEALTHY');
  });

  it('returns DEGRADED when MongoDB is unavailable', async () => {
    vi.doMock('mongoose', () => ({
      connection: { readyState: 0 },
    }));
    const result = await HealthCheckService.performReadinessCheck();
    expect(result.status).toBe('DEGRADED');
  });

  it('includes timestamp and checks in response', async () => {
    const result = await HealthCheckService.performReadinessCheck();
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('checks');
  });
});