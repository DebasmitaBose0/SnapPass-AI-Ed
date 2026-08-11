/**
 * archiveZipStreamerService.js — High-performance stream-based zip archive exporter
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import archiver from 'archiver';

export class ArchiveZipStreamerService {
  static createZipStream(res, filenames = []) {
    const archive = archiver('zip', { zlib: { level: 9 } });

    res.attachment('snappass_photos_export.zip');
    archive.pipe(res);

    for (const file of filenames) {
      archive.append(`Mock image buffer payload for ${file}`, { name: file });
    }

    archive.finalize();
  }
}