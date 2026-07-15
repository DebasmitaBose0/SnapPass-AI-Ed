/**
 * Repository cleanup utility.
 * Run: node scripts/cleanup-repo.js
 *
 * Scans for common artifacts that should not be committed:
 *   - JSON dump files from API exports
 *   - OS garbage files
 *   - Editor backup files
 *   - Test artifacts outside temp directories
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const BLOCKLIST_PATTERNS = [
  /^all_data\.json$/,
  /^issues\d*\.json$/,
  /^upstream_prs\d*\.json$/,
  /^my_prs\.json$/,
  /^prs\.json$/,
  /^nul$/,
  /^Thumbs\.db$/,
  /^\.DS_Store$/,
];

const IGNORE_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage', '.vscode', '.idea',
  'uploads', 'test_uploads', 'tmp', 'temp', 'security-scan',
]);

function walk(dir) {
  const results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORE_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
          results.push(...walk(fullPath));
        }
      } else if (BLOCKLIST_PATTERNS.some((p) => p.test(entry.name))) {
        results.push(fullPath);
      }
    }
  } catch {
    // permission denied or missing
  }
  return results;
}

const matches = walk(root);

if (matches.length === 0) {
  console.log('No cleanup artifacts found. Repository is clean.');
} else {
  console.log(`Found ${matches.length} artifact(s):\n`);
  for (const file of matches) {
    const relative = path.relative(root, file);
    console.log(`  ${relative}`);
  }
  console.log('\nTo remove, run:');
  console.log(matches.map((f) => `  rm "${path.relative(root, f)}"`).join('\n'));
}
