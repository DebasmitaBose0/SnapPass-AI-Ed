/**
 * zipStreamer.test.js — Zip Streamer Tests
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { ArchiveZipStreamerService } from '../services/archiveZipStreamerService.js';

describe('ArchiveZipStreamerService Tests', () => {
  it('should instantiate zip streamer service', () => {
    expect(ArchiveZipStreamerService).toBeDefined();
  });
});
