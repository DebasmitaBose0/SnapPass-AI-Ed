/**
 * healthCheck.service.js — Deep health check probe service.
 */
import os from 'os';
import mongoose from 'mongoose';

export class HealthCheckService {
  static getSystemMetrics() {
    return {
      uptimeSeconds: process.uptime(),
      memory: {
        totalBytes: os.totalmem(),
        freeBytes: os.freemem(),
        heapUsedBytes: process.memoryUsage().heapUsed,
      },
      loadAvg: os.loadavg(),
    };
  }

  static async performReadinessCheck() {
    const checks = {
      memory: 'HEALTHY',
      storage: 'WRITABLE',
    };
    let allHealthy = true;

    try {
      if (mongoose.connection.readyState !== 1) {
        checks.mongodb = 'DEGRADED';
        allHealthy = false;
      } else {
        checks.mongodb = 'HEALTHY';
      }
    } catch {
      checks.mongodb = 'UNAVAILABLE';
      allHealthy = false;
    }

    try {
      const { isRedisAvailable } = await import('../config/redis.js');
      if (!isRedisAvailable()) {
        checks.redis = 'DEGRADED';
        allHealthy = false;
      } else {
        checks.redis = 'HEALTHY';
      }
    } catch {
      checks.redis = 'UNAVAILABLE';
      allHealthy = false;
    }

    return {
      status: allHealthy ? 'UP' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}
