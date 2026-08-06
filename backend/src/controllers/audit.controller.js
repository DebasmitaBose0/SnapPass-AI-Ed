import AuditLog from '../models/auditLog.model.js';
import { formatAuditCSV, formatAuditNDJSON, formatAuditJSON } from '../utils/auditFormatter.utils.js';
import { validateAuditExportQuery } from '../validation/auditQuery.validation.js';

export const getAuditLogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 50,
      method,
      endpoint,
      statusCode,
      startDate,
      endDate,
    } = req.query;
    const filter = {};

    if (method) filter.method = method.toUpperCase();
    if (endpoint) filter.endpoint = { $regex: endpoint, $options: 'i' };
    if (statusCode) filter.statusCode = parseInt(statusCode, 10);
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditSummary = async (req, res, next) => {
  try {
    const [methodStats, statusStats, topEndpoints] = await Promise.all([
      AuditLog.aggregate([
        {
          $group: {
            _id: '$method',
            count: { $sum: 1 },
            avgDuration: { $avg: '$durationMs' },
          },
        },
        { $sort: { count: -1 } },
      ]),
      AuditLog.aggregate([
        { $group: { _id: '$statusCode', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      AuditLog.aggregate([
        {
          $group: {
            _id: '$endpoint',
            count: { $sum: 1 },
            avgDuration: { $avg: '$durationMs' },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
    ]);

    res.json({
      success: true,
      data: { methodStats, statusStats, topEndpoints },
    });
  } catch (error) {
    next(error);
  }
};

export const exportAuditLogs = async (req, res, next) => {
  try {
    const { format = 'csv', startDate, endDate } = req.query;
    const validation = validateAuditExportQuery(req.query);
    if (!validation.isValid) {
      return res.status(400).json({ success: false, errors: validation.errors });
    }

    const filter = {};
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(filter).sort({ createdAt: -1 }).limit(1000).lean();
    const fmt = format.toLowerCase();

    if (fmt === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="audit-logs.csv"');
      return res.send(formatAuditCSV(logs));
    } else if (fmt === 'ndjson') {
      res.setHeader('Content-Type', 'application/x-ndjson');
      res.setHeader('Content-Disposition', 'attachment; filename="audit-logs.ndjson"');
      return res.send(formatAuditNDJSON(logs));
    }

    res.setHeader('Content-Type', 'application/json');
    return res.send(formatAuditJSON(logs));
  } catch (error) {
    next(error);
  }
};


