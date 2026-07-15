import { successResponse, errorResponse } from '../utils/httpResponse.js';

export const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 'No image file received. Please attach a JPEG, PNG, or WebP photo.', 400);
    }

    const { filename, size, mimetype } = req.file;
    const meta = req.imageMeta || {};

    successResponse(res, {
      filename,
      fileSize: size,
      mimeType: mimetype,
      width: meta.width ?? null,
      height: meta.height ?? null,
      processUrl: '/api/process',
    }, 'Photo uploaded and validated successfully.');
  } catch (err) {
    next(err);
  }
};

export const batchUpload = async (req, res, next) => {
  try {
    const files = req.files || [];
    const results = files.map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      size: f.size,
      uploaded: true,
    }));

    successResponse(res, results, `${results.length} file(s) uploaded successfully`);
  } catch (err) {
    next(err);
  }
};
