import Upload from '../models/upload.model.js';
import User from '../models/user.model.js';
import PrintSheet from '../models/printSheet.model.js';
import ProcessedImage from '../models/processedImage.model.js';
import AuditLog from '../models/auditLog.model.js';
import Session from '../models/session.model.js';
import { getMetrics } from '../middleware/timing.middleware.js';

export async function getSystemInfo(req, res, next) {
  try {
    const metrics = getMetrics();
    res.json({
      success: true,
      data: {
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage(),
        uptime: process.uptime(),
        metrics,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getRecentActivity(req, res, next) {
  try {
    const { limit = 20 } = req.query;
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();

    res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
}

export async function getStorageSummary(req, res, next) {
  try {
    const uploadCount = await Upload.countDocuments();
    const processedCount = await ProcessedImage.countDocuments();
    const sheetCount = await PrintSheet.countDocuments();

    res.json({
      success: true,
      data: {
        uploadCount,
        processedCount,
        sheetCount,
        totalRecords: uploadCount + processedCount + sheetCount,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserAnalytics(req, res, next) {
  try {
    const totalUsers = await User.countDocuments();
    const activeSessions = await Session.countDocuments({ active: true });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newToday = await User.countDocuments({ createdAt: { $gte: today } });

    const roleDistribution = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeSessions,
        newToday,
        roleDistribution,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getUploadAnalytics(req, res, next) {
  try {
    const { days = 30 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const trend = await Upload.aggregate([
      { $match: { createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatDistribution = await Upload.aggregate([
      { $group: { _id: '$mimeType', count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: {
        trend,
        formatDistribution,
        totalDays: Number(days),
      },
    });
  } catch (err) {
    next(err);
  }
}
