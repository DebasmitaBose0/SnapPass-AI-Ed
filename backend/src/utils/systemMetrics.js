import os from 'os';

export function getSystemResourceMetrics() {
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const memoryUsagePercent = (((totalMem - freeMem) / totalMem) * 100).toFixed(2);
  const cpus = os.cpus();
  const loadAvg = os.loadavg();

  return {
    system: {
      platform: os.platform(),
      arch: os.arch(),
      cpuCount: cpus.length,
      loadAverage1m: loadAvg[0],
      totalMemoryBytes: totalMem,
      freeMemoryBytes: freeMem,
      memoryUsagePercent: parseFloat(memoryUsagePercent)
    },
    process: {
      pid: process.pid,
      uptimeSeconds: process.uptime(),
      memory: process.memoryUsage()
    }
  };
}
