import { getSystemResourceMetrics } from '../systemMetrics.js';

describe('SystemMetrics Utility', () => {
  test('returns system and process memory metrics structure', () => {
    const metrics = getSystemResourceMetrics();
    expect(metrics).toHaveProperty('system');
    expect(metrics).toHaveProperty('process');
    expect(typeof metrics.system.memoryUsagePercent).toBe('number');
    expect(metrics.process.pid).toBeGreaterThan(0);
  });
});
