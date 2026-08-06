import fs from 'fs';
import path from 'path';
import { isFileExpired } from '../config/janitorPolicy.config.js';

export class StorageJanitorService {
  static purgeStaleFiles(directoryPath, maxAgeMinutes = 60, dryRun = false) {
    if (!fs.existsSync(directoryPath)) return { purged: 0, freedBytes: 0, scanned: 0 };

    const files = fs.readdirSync(directoryPath);
    const maxAgeMs = maxAgeMinutes * 60 * 1000;

    let purged = 0;
    let freedBytes = 0;
    let scanned = files.length;

    for (const file of files) {
      const fullPath = path.join(directoryPath, file);
      try {
        const stats = fs.statSync(fullPath);
        const isStale = isFileExpired(stats.mtimeMs) || (Date.now() - stats.mtimeMs > maxAgeMs);
        if (stats.isFile() && isStale) {
          freedBytes += stats.size;
          if (!dryRun) {
            fs.unlinkSync(fullPath);
          }
          purged++;
        }
      } catch {
        // Ignore locked files
      }
    }

    return { purged, freedBytes, scanned, dryRun };
  }

  static async purgeExpiredShareLinks() {
    try {
      const ShareLink = (await import('../models/shareLink.model.js')).default;
      const now = new Date();
      const result = await ShareLink.deleteMany({
        $or: [
          { expiresAt: { $lt: now } },
          { isRevoked: true },
          { $and: [{ isOneTime: true }, { viewCount: { $gte: 1 } }] },
        ],
      });
      return { purged: result.deletedCount || 0 };
    } catch (err) {
      return { purged: 0, error: err.message };
    }
  }
}

