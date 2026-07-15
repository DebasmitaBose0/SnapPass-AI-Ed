import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import {
  validateMagicBytes,
  validateImageDimensions,
  validateCompressionRatio,
} from '../utils/uploadValidator.js';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ALLOWED_EXT.has(ext) ? ext : '.jpg';
    cb(null, `${uuidv4()}${safeExt}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    return cb(
      new Error(`Invalid MIME type: ${file.mimetype}. Only JPEG, PNG, WebP allowed.`),
      false
    );
  }
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    return cb(
      new Error(`Invalid file extension: ${ext}. Only .jpg, .jpeg, .png, .webp allowed.`),
      false
    );
  }
  cb(null, true);
};

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 },
  fileFilter,
});

const unlinkIfExists = (filePath) => {
  try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch { /* best-effort cleanup */ }
};

export const validateImageChain = async (req, res, next) => {
  if (!req.file) return next();

  const { path: filePath } = req.file;

  const mbResult = await validateMagicBytes(filePath);
  if (!mbResult.valid) {
    unlinkIfExists(filePath);
    return res.status(400).json({ error: mbResult.error });
  }

  const dimResult = await validateImageDimensions(filePath);
  if (!dimResult.valid) {
    unlinkIfExists(filePath);
    return res.status(400).json({ error: dimResult.error });
  }

  const crResult = await validateCompressionRatio(filePath);
  if (!crResult.valid) {
    unlinkIfExists(filePath);
    return res.status(400).json({ error: crResult.error });
  }

  req.imageMeta = {
    width: dimResult.width,
    height: dimResult.height,
    mime: mbResult.mime,
  };
  next();
};

export const validateBatchFiles = async (req, res, next) => {
  const files = req.files;
  if (!files || files.length === 0) return next();

  const cleanupAll = () => {
    files.forEach((f) => unlinkIfExists(f.path));
  };

  for (const file of files) {
    const mbResult = await validateMagicBytes(file.path);
    if (!mbResult.valid) {
      cleanupAll();
      return res.status(400).json({ error: `Batch upload failed for ${file.originalname}: ${mbResult.error}` });
    }

    const dimResult = await validateImageDimensions(file.path);
    if (!dimResult.valid) {
      cleanupAll();
      return res.status(400).json({ error: `Batch upload failed for ${file.originalname}: ${dimResult.error}` });
    }

    const crResult = await validateCompressionRatio(file.path);
    if (!crResult.valid) {
      cleanupAll();
      return res.status(400).json({ error: `Batch upload failed for ${file.originalname}: ${crResult.error}` });
    }

    file.imageMeta = {
      width: dimResult.width,
      height: dimResult.height,
      mime: mbResult.mime,
    };
  }

  next();
};
