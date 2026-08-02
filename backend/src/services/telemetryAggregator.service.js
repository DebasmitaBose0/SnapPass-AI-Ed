/**
 * telemetryAggregator.service.js — In-memory request telemetry sliding window.
 */

const latencies = [];
let totalRequests = 0;
let totalErrors = 0;

export class TelemetryAggregatorService {
  static record(durationMs, statusCode) {
    totalRequests++;
    if (statusCode >= 400) totalErrors++;
    latencies.push(durationMs);
    if (latencies.length > 1000) latencies.shift();
  }

  static getSummary() {
    if (latencies.length === 0) return { totalRequests, totalErrors, avgMs: 0, p95Ms: 0 };
    const sorted = [...latencies].sort((a, b) => a - b);
    const sum = sorted.reduce((acc, val) => acc + val, 0);
    const p95Idx = Math.floor(sorted.length * 0.95);

    return {
      totalRequests,
      totalErrors,
      avgMs: Math.round(sum / sorted.length),
      p95Ms: sorted[p95Idx] || 0,
    };
  }

  static reset() {
    latencies.length = 0;
    totalRequests = 0;
    totalErrors = 0;
  }
}
