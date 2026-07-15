import fs from 'fs';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_DIMENSION = 10000;
const MIN_DIMENSION = 200;

export const validateMagicBytes = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const type = await fileTypeFromBuffer(buffer);
  if (!type || !ALLOWED_MIME.has(type.mime)) {
    return {
      valid: false,
      error: `Magic bytes mismatch. Detected: ${type?.mime ?? 'unknown'}`,
    };
  }
  return { valid: true, mime: type.mime };
};

export const validateImageDimensions = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
      return {
        valid: false,
        error: `Image dimensions (${metadata.width}x${metadata.height}) exceed maximum ${MAX_DIMENSION}px`,
      };
    }
    if (metadata.width < MIN_DIMENSION || metadata.height < MIN_DIMENSION) {
      return {
        valid: false,
        error: `Image dimensions (${metadata.width}x${metadata.height}) below minimum ${MIN_DIMENSION}px`,
      };
    }
    return { valid: true, width: metadata.width, height: metadata.height };
  } catch {
    return {
      valid: false,
      error: 'Could not read image metadata. File may be corrupted.',
    };
  }
};

export const validateCompressionRatio = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    const stat = fs.statSync(filePath);
    const pixelCount = (metadata.width || 1) * (metadata.height || 1);
    const bytesPerPixel = stat.size / pixelCount;
    if (bytesPerPixel < 0.01) {
      return {
        valid: false,
        error:
          'Suspiciously high compression ratio; file may be corrupt or contain embedded data.',
      };
    }
    return { valid: true };
  } catch {
    return { valid: true };
  }
};

export const runFullValidation = async (filePath) => {
  const mb = await validateMagicBytes(filePath);
  if (!mb.valid) return { valid: false, step: 'magicBytes', error: mb.error };

  const dim = await validateImageDimensions(filePath);
  if (!dim.valid) return { valid: false, step: 'dimensions', error: dim.error };

  const cr = await validateCompressionRatio(filePath);
  if (!cr.valid) return { valid: false, step: 'compressionRatio', error: cr.error };

  return { valid: true, meta: { width: dim.width, height: dim.height, mime: mb.mime } };
};
