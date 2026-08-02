import { getMetrics, resetMetrics } from '../middleware/timing.middleware.js';
import { getSystemResourceMetrics } from '../utils/systemMetrics.js';

export function getServerMetrics(req, res) {
  const applicationMetrics = getMetrics();
  const systemMetrics = getSystemResourceMetrics();
  res.json({
    success: true,
    data: {
      application: applicationMetrics,
      system: systemMetrics
    }
  });
}

export function resetServerMetrics(req, res) {
  resetMetrics();
  res.json({ success: true, message: 'Metrics reset successfully.' });
}
