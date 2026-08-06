import { HealthCheckService } from '../services/healthCheck.service.js';
import { formatHealthResponse } from '../utils/healthResponse.formatter.js';
import { validateHealthQuery } from '../validation/healthQuery.validation.js';

describe('Health Check Diagnostics & Response Formatter', () => {
  test('HealthCheckService returns system metrics', () => {
    const metrics = HealthCheckService.getSystemMetrics();
    expect(metrics.uptimeSeconds).toBeGreaterThanOrEqual(0);
    expect(metrics.memory.heapUsedBytes).toBeGreaterThan(0);
  });

  test('formatHealthResponse constructs valid envelope', () => {
    const formatted = formatHealthResponse('UP', { database: 'CONNECTED' });
    expect(formatted.status).toBe('UP');
    expect(formatted.details.database).toBe('CONNECTED');
  });

  test('validateHealthQuery handles query flag check', () => {
    expect(validateHealthQuery({ verbose: 'true' }).isValid).toBe(true);
    expect(validateHealthQuery({ verbose: 'invalid' }).isValid).toBe(false);
  });
});
