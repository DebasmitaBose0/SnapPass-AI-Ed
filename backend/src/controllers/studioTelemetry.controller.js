import StudioActivityLog from '../models/studioActivityLog.model.js';
import { successResponse } from '../utils/httpResponse.js';

export async function getPeakHoursTelemetry(req, res, next) {
  try {
    const { studioId = 'default_studio' } = req.query;

    const hourlyDistribution = await StudioActivityLog.aggregate([
      { $match: { studioId } },
      {
        $group: {
          _id: { $hour: '$timestamp' },
          count: { $sum: '$photosCount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = Array.from({ length: 24 }, (_, hour) => {
      const found = hourlyDistribution.find((h) => h._id === hour);
      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        photosPrepared: found ? found.count : 0,
      };
    });

    return successResponse(res, formatted, 'Hourly peak walk-in telemetry aggregated successfully');
  } catch (err) {
    next(err);
  }
}
