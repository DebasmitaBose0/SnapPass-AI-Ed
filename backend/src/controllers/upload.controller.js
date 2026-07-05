import path from 'path';
import fs from 'fs';

export const uploadPhoto = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Photo uploaded successfully',
      file: req.file ? req.file.filename : null
    });
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
    res.status(200).json({
      success: true,
      message: `${results.length} file(s) uploaded successfully`,
      files: results,
    });
  } catch (err) {
    next(err);
  }
};