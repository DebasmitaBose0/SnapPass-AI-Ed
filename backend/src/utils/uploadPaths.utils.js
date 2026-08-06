import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function resolveUploadPath(filename) {
  if (!filename || typeof filename !== 'string') {
    return null;
  }
  const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');
  const filePath = path.resolve(uploadsDir, filename);
  const relative = path.relative(uploadsDir, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }
  return filePath;
}